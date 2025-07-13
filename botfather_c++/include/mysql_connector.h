#pragma once
#include "common_type.h"
#include <memory>
#include <mutex>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>

using namespace std;

class MySQLConnector
{
public:
    static MySQLConnector &getInstance();

    std::shared_ptr<sql::Connection> acquireConnection();
    void releaseConnection(std::shared_ptr<sql::Connection> conn);

    unique_ptr<sql::ResultSet> executeQuery(const string &query, const vector<any> &params);
    int executeUpdate(const string &query, const vector<any> &params);
    void bindParams(sql::PreparedStatement *stmt, const vector<any> &params);

private:
    MySQLConnector();
    ~MySQLConnector();

    void initializePool(int size);

    sql::Driver *driver;
    string host, username, password, database;

    queue<std::shared_ptr<sql::Connection>> pool;
    mutex poolMutex;
    condition_variable poolCond;
    int poolSize = 10;
};