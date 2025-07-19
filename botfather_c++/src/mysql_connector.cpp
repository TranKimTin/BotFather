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

unique_ptr<sql::ResultSet> MySQLConnector::executeQuery(const string &query, const vector<any> &params)
{
    auto conn = acquireConnection();
    if (!conn->isValid())
    {
        conn.reset(driver->connect(host, username, password));
        conn->setClientOption("OPT_CONNECT_TIMEOUT", "10");
        conn->setClientOption("OPT_READ_TIMEOUT", "20");
        conn->setClientOption("OPT_WRITE_TIMEOUT", "20");
        conn->setClientOption("OPT_RECONNECT", "true");
        conn->setSchema(database);
    }

    unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(query));
    bindParams(pstmt.get(), params);
    auto result = unique_ptr<sql::ResultSet>(pstmt->executeQuery());
    releaseConnection(conn);
    return result;
}

int MySQLConnector::executeUpdate(const string &query, const vector<any> &params)
{
    try
    {
        auto conn = acquireConnection();
        if (!conn->isValid())
        {
            conn.reset(driver->connect(host, username, password));
            conn->setClientOption("OPT_CONNECT_TIMEOUT", "10");
            conn->setClientOption("OPT_READ_TIMEOUT", "20");
            conn->setClientOption("OPT_WRITE_TIMEOUT", "20");
            conn->setClientOption("OPT_RECONNECT", "true");
            conn->setSchema(database);
        }

        unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(query));
        bindParams(pstmt.get(), params);
        int affected = pstmt->executeUpdate();
        releaseConnection(conn);
        return affected;
    }
    catch (sql::SQLException &e)
    {
        LOGE("MySQL error: {} (SQLState: {}, ErrorCode: {})",
             e.what(), e.getSQLStateCStr(), e.getErrorCode());
        return -1;
    }
}