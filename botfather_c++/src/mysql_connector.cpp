#include "mysql_connector.h"
#include "util.h"

MySQLConnector::MySQLConnector()
{
    try
    {
        map<string, string> env = readEnvFile();

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
            stmt->setInt(idx, std::any_cast<int>(val));
        else if (val.type() == typeid(int64_t))
            stmt->setInt64(idx, std::any_cast<int64_t>(val));
        else if (val.type() == typeid(long long))
            stmt->setInt64(idx, std::any_cast<long long>(val));
        else if (val.type() == typeid(float))
            stmt->setDouble(idx, static_cast<double>(std::any_cast<float>(val)));
        else if (val.type() == typeid(double))
            stmt->setDouble(idx, std::any_cast<double>(val));
        else if (val.type() == typeid(bool))
            stmt->setBoolean(idx, std::any_cast<bool>(val));
        else if (val.type() == typeid(std::string))
            stmt->setString(idx, std::any_cast<std::string>(val));
        else if (val.type() == typeid(const char *))
            stmt->setString(idx, std::any_cast<const char *>(val));
        else if (val.type() == typeid(nullptr_t))
            stmt->setNull(idx, sql::DataType::UNKNOWN);
        else
        {
            throw std::runtime_error(
                "Unsupported parameter type at index " + std::to_string(i) +
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