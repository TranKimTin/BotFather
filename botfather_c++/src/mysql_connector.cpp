#include "mysql_connector.h"
#include "util.h"

MySQLConnector::MySQLConnector()
{
    try
    {
        unordered_map<string, string> env = readEnvFile();

        driver = sql::mysql::get_mysql_driver_instance();
        string host = "tcp://" + env["MYSQL_HOST"] + ":3306";
        string username = env["MYSQL_USER"];
        string password = env["MYSQL_PASSWORD"];
        string database = env["MYSQL_DATABASE"];

        conn = unique_ptr<sql::Connection>(
            driver->connect(host, username, password));
        conn->setSchema(database);
        LOGI("MySQL connection established to %s as %s", host.c_str(), username.c_str());
    }
    catch (sql::SQLException &e)
    {
        LOGE("MySQL connection failed: %s", e.what());
    }
}

MySQLConnector::~MySQLConnector()
{
    if (conn)
        conn->close();
}

MySQLConnector &MySQLConnector::getInstance()
{
    static MySQLConnector instance;
    return instance;
}

sql::Connection *MySQLConnector::getConnection()
{
    lock_guard<mutex> lock(connMutex);
    return conn.get();
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
        {
            throw runtime_error(
                "Unsupported parameter type at index " + to_string(i) +
                " (type: " + val.type().name() + ")");
        }
    }
}

unique_ptr<sql::ResultSet> MySQLConnector::executeQuery(const string &query, const vector<any> &params)
{
    lock_guard<mutex> lock(connMutex);
    unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(query));

    bindParams(pstmt.get(), params);

    return unique_ptr<sql::ResultSet>(pstmt->executeQuery());
}

int MySQLConnector::executeUpdate(const string &query, const vector<any> &params)
{
    lock_guard<mutex> lock(connMutex);
    try
    {
        unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(query));

        bindParams(pstmt.get(), params);

        return pstmt->executeUpdate();
    }
    catch (sql::SQLException &e)
    {
        LOGE("MySQL update failed: %s", e.what());
        return -1; // Indicate failure
    }
}