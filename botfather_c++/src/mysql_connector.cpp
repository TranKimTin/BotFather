#include "mysql_connector.h"
#include "util.h"

MySQLConnector::MySQLConnector()
{
    try
    {
        auto env = readEnvFile();
        driver = sql::mysql::get_mysql_driver_instance();
        host = "tcp://" + env["MYSQL_HOST"] + ":3306";
        username = env["MYSQL_USER"];
        password = env["MYSQL_PASSWORD"];
        database = env["MYSQL_DATABASE"];

        initializePool(poolSize);

        LOGI("MySQL connection pool initialized with {} connections", poolSize);
    }
    catch (sql::SQLException &e)
    {
        LOGE("MySQL pool init failed: {} (SQLState: {}, ErrorCode: {})",
             e.what(), e.getSQLStateCStr(), e.getErrorCode());
    }
}

MySQLConnector::~MySQLConnector()
{
    // Connections sẽ tự huỷ nhờ shared_ptr
}

MySQLConnector &MySQLConnector::getInstance()
{
    static MySQLConnector instance;
    return instance;
}

void MySQLConnector::initializePool(int size)
{
    for (int i = 0; i < size; ++i)
    {
        sql::Connection *rawConn = driver->connect(host, username, password);

        // ⚠️ Enable automatic reconnect
        rawConn->setClientOption("OPT_CONNECT_TIMEOUT", "10");
        rawConn->setClientOption("OPT_READ_TIMEOUT", "20");
        rawConn->setClientOption("OPT_WRITE_TIMEOUT", "20");
        rawConn->setClientOption("OPT_RECONNECT", "true");

        rawConn->setSchema(database);
        pool.push(shared_ptr<sql::Connection>(rawConn));
    }
}

shared_ptr<sql::Connection> MySQLConnector::acquireConnection()
{
    unique_lock<mutex> lock(poolMutex);
    poolCond.wait(lock, [this]
                  { return !pool.empty(); });

    auto conn = pool.front();
    pool.pop();

    if (!conn || !conn->isValid())
    {
        LOGE("MySQL connection is invalid. Reconnecting...");
        conn = shared_ptr<sql::Connection>(driver->connect(host, username, password));

        conn->setClientOption("OPT_CONNECT_TIMEOUT", "10");
        conn->setClientOption("OPT_READ_TIMEOUT", "20");
        conn->setClientOption("OPT_WRITE_TIMEOUT", "20");
        conn->setClientOption("OPT_RECONNECT", "true");
        conn->setSchema(database);
    }

    return conn;
}

void MySQLConnector::releaseConnection(shared_ptr<sql::Connection> conn)
{
    {
        lock_guard<mutex> lock(poolMutex);
        pool.push(conn);
    }
    poolCond.notify_one();
}

void MySQLConnector::bindParams(sql::PreparedStatement *stmt, const vector<any> &params)
{
    for (size_t i = 0; i < params.size(); ++i)
    {
        int idx = static_cast<int>(i + 1);
        const any &val = params[i];

        if (val.type() == typeid(int))
            stmt->setInt(idx, any_cast<int>(val));
        else if (val.type() == typeid(int64_t))
            stmt->setInt64(idx, any_cast<int64_t>(val));
        else if (val.type() == typeid(long long))
            stmt->setInt64(idx, any_cast<long long>(val));
        else if (val.type() == typeid(float))
            stmt->setDouble(idx, static_cast<double>(any_cast<float>(val)));
        else if (val.type() == typeid(double))
            stmt->setDouble(idx, any_cast<double>(val));
        else if (val.type() == typeid(bool))
            stmt->setBoolean(idx, any_cast<bool>(val));
        else if (val.type() == typeid(string))
            stmt->setString(idx, any_cast<string>(val));
        else if (val.type() == typeid(const char *))
            stmt->setString(idx, any_cast<const char *>(val));
        else if (val.type() == typeid(nullptr_t))
            stmt->setNull(idx, sql::DataType::UNKNOWN);
        else
            throw runtime_error("Unsupported parameter type at index " + to_string(i) + " (type: " + val.type().name() + ")");
    }
}

vector<map<string, any>> MySQLConnector::executeQuery(
    const string &query,
    const vector<any> &params)
{
    auto conn = acquireConnection();
    try
    {
        vector<map<string, any>> rows;

        {
            std::unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(query));
            bindParams(pstmt.get(), params);

            std::unique_ptr<sql::ResultSet> result(pstmt->executeQuery());

            sql::ResultSetMetaData *meta = result->getMetaData();
            int colCount = meta->getColumnCount();

            while (result->next())
            {
                map<string, any> row;
                for (int i = 1; i <= colCount; ++i)
                {
                    string colName = meta->getColumnLabel(i);
                    string colType = meta->getColumnTypeName(i);

                    if (result->isNull(i))
                    {
                        row[colName] = string("");
                    }
                    else if (colType == "BIGINT" || colType == "LONG")
                    {
                        row[colName] = static_cast<long long>(result->getInt64(i));
                    }
                    else if (colType == "INT")
                    {
                        row[colName] = static_cast<int>(result->getInt(i));
                    }
                    else if (colType == "DOUBLE" || colType == "FLOAT" || colType == "DECIMAL")
                    {
                        row[colName] = static_cast<double>(result->getDouble(i));
                    }
                    else if (colType == "BOOLEAN")
                    {
                        row[colName] = result->getBoolean(i);
                    }
                    else
                    {
                        row[colName] = static_cast<string>(result->getString(i));
                    }
                }
                rows.push_back(std::move(row));
            }
        }

        releaseConnection(conn);
        return rows;
    }
    catch (sql::SQLException &e)
    {
        LOGE("MySQL error: {} (SQLState: {}, ErrorCode: {})",
             e.what(), e.getSQLStateCStr(), e.getErrorCode());
        releaseConnection(conn);
        return {};
    }
}

int MySQLConnector::executeUpdate(const string &query, const vector<any> &params)
{
    auto conn = acquireConnection();
    try
    {
        sql::PreparedStatement *pstmt = conn->prepareStatement(query);
        bindParams(pstmt, params);
        int affected = pstmt->executeUpdate();
        delete pstmt;
        releaseConnection(conn);

        if (affected <= 0)
        {
            LOGE("MySQL executeUpdate affected rows: {}", affected);
            LOGE("Query: {}", query);
        }

        return affected;
    }
    catch (sql::SQLException &e)
    {
        LOGE("MySQL error: {} (SQLState: {}, ErrorCode: {})",
             e.what(), e.getSQLStateCStr(), e.getErrorCode());
        releaseConnection(conn);
        return -1;
    }
}