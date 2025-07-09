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

unique_ptr<sql::ResultSet> MySQLConnector::executeQuery(const string &query, const vector<string> &params)
{
    lock_guard<mutex> lock(connMutex);
    unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(query));

    for (size_t i = 0; i < params.size(); ++i)
    {
        pstmt->setString(static_cast<int>(i + 1), params[i]);
    }

    return unique_ptr<sql::ResultSet>(pstmt->executeQuery());
}

int MySQLConnector::executeUpdate(const string &query, const vector<string> &params)
{
    lock_guard<mutex> lock(connMutex);
    try
    {
        unique_ptr<sql::PreparedStatement> pstmt(conn->prepareStatement(query));

        for (size_t i = 0; i < params.size(); ++i)
        {
            pstmt->setString(static_cast<int>(i + 1), params[i]);
        }

        return pstmt->executeUpdate();
    }
    catch (sql::SQLException &e)
    {
        LOGE("MySQL update failed: %s", e.what());
        LOGE("Query: %s", query.c_str());
        for (int i = 0; i < params.size(); ++i)
        {
            string param = params[i];
            LOGE("Param %d: %s", i, param.c_str());
        }
        return -1; // Indicate failure
    }
}