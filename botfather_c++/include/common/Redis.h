#pragma once

#include <hiredis/hiredis.h>
#include <string>
#include <vector>
#include <mutex>
using namespace std;

class Redis {
public:
    static Redis& getInstance();

    bool connect(const string &host, int port, const string &password = "");
    void disconnect();

    bool pushFront(const string& key, const string& value);
    bool pushBack(const string& key, const string& value);
    string popFront(const string& key);
    string popBack(const string& key);
    string front(const string& key);
    string back(const string& key);
    int size(const string& key);
    vector<string> getList(const string& key);
    bool clearList(const string& key);

private:
    Redis();
    ~Redis();
    Redis(const Redis&) = delete;
    Redis& operator=(const Redis&) = delete;

    redisContext* context;
    mutex mMutex;
};
