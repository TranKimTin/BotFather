#pragma once
#include <memory>
#include <mutex>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>

class MySQLConnector {
public:
    static MySQLConnector& getInstance();

    sql::Connection* getConnection();
    std::unique_ptr<sql::ResultSet> executeQuery(const std::string& query);
    int executeUpdate(const std::string& query);

private:
    MySQLConnector();  // constructor private
    ~MySQLConnector();
    MySQLConnector(const MySQLConnector&) = delete;
    MySQLConnector& operator=(const MySQLConnector&) = delete;

    sql::mysql::MySQL_Driver* driver;
    std::unique_ptr<sql::Connection> conn;
    std::mutex connMutex;
};
