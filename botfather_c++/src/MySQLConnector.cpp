#include "MySQLConnector.h"
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

unique_ptr<sql::ResultSet> MySQLConnector::executeQuery(const string &query)
{
    lock_guard<mutex> lock(connMutex);
    unique_ptr<sql::Statement> stmt(conn->createStatement());
    return unique_ptr<sql::ResultSet>(stmt->executeQuery(query));
}

int MySQLConnector::executeUpdate(const string &query)
{
    lock_guard<mutex> lock(connMutex);
    unique_ptr<sql::Statement> stmt(conn->createStatement());
    return stmt->executeUpdate(query);
}
