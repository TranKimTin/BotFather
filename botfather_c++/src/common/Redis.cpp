#include "Redis.h"
#include "common_type.h"

using namespace std;

Redis::Redis() : context(nullptr) {}

Redis::~Redis()
{
    disconnect();
}

Redis &Redis::getInstance()
{
    static Redis instance;
    return instance;
}

bool Redis::connect(const string &host, int port, const string &password)
{
    lock_guard<mutex> lock(mMutex);
    if (context)
        return true;

    // Kết nối tới Redis
    context = redisConnect(host.c_str(), port);
    if (!context || context->err)
    {
        if (context)
        {
            LOGE("Redis error: %s", context->errstr);
            redisFree(context);
            context = nullptr;
        }
        else
        {
            LOGE("Redis error: cannot allocate context");
        }
        return false;
    }

    // Nếu có mật khẩu, thực hiện xác thực
    if (!password.empty())
    {
        redisReply *reply = (redisReply *)redisCommand(context, "AUTH %s", password.c_str());
        if (reply->type == REDIS_REPLY_ERROR)
        {
            LOGE("Redis authentication failed: %s", reply->str);
            freeReplyObject(reply);
            redisFree(context);
            context = nullptr;
            return false;
        }
        freeReplyObject(reply);
    }

    LOGI("Redis connected to %s:%d", host.c_str(), port);
    return true;
}

void Redis::disconnect()
{
    lock_guard<mutex> lock(mMutex);
    if (context)
    {
        redisFree(context);
        context = nullptr;
    }
}

bool Redis::pushFront(const string &key, const string &value)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return false;

    redisReply *reply = (redisReply *)redisCommand(context, "LPUSH %s %s", key.c_str(), value.c_str());
    if (!reply)
        return false;
    freeReplyObject(reply);
    return true;
}

bool Redis::pushBack(const string &key, const string &value)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return false;

    redisReply *reply = (redisReply *)redisCommand(context, "RPUSH %s %s", key.c_str(), value.c_str());
    if (!reply)
        return false;
    freeReplyObject(reply);
    return true;
}

bool Redis::pushBack(const string &key, const vector<string> &values)
{
    lock_guard<mutex> lock(mMutex);
    if (!context || values.empty())
        return false;

    stringstream ss;
    ss << "RPUSH " << key;
    for (const auto &val : values)
        ss << " " << val;

    redisReply *reply = (redisReply *)redisCommand(context, ss.str().c_str());
    if (!reply)
        return false;

    freeReplyObject(reply);
    return true;
}

bool Redis::pushFront(const string &key, const vector<string> &values)
{
    lock_guard<mutex> lock(mMutex);
    if (!context || values.empty())
        return false;

    stringstream ss;
    ss << "LPUSH " << key;
    for (const auto &val : values)
        ss << " " << val;

    redisReply *reply = (redisReply *)redisCommand(context, ss.str().c_str());
    if (!reply)
        return false;

    freeReplyObject(reply);
    return true;
}

string Redis::popFront(const string &key)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return "";

    redisReply *reply = (redisReply *)redisCommand(context, "LPOP %s", key.c_str());
    string result = (reply && reply->type == REDIS_REPLY_STRING) ? reply->str : "";
    if (reply)
        freeReplyObject(reply);
    return result;
}

string Redis::popBack(const string &key)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return "";

    redisReply *reply = (redisReply *)redisCommand(context, "RPOP %s", key.c_str());
    string result = (reply && reply->type == REDIS_REPLY_STRING) ? reply->str : "";
    if (reply)
        freeReplyObject(reply);
    return result;
}

vector<string> Redis::getList(const string &key)
{
    lock_guard<mutex> lock(mMutex);
    vector<string> result;

    if (!context)
        return result;
    redisReply *reply = (redisReply *)redisCommand(context, "LRANGE %s 0 -1", key.c_str());

    if (reply && reply->type == REDIS_REPLY_ARRAY)
    {
        for (size_t i = 0; i < reply->elements; ++i)
        {
            if (reply->element[i]->type == REDIS_REPLY_STRING)
            {
                result.push_back(reply->element[i]->str);
            }
        }
    }
    if (reply)
        freeReplyObject(reply);
    return result;
}

bool Redis::clearList(const string &key)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return false;

    redisReply *reply = (redisReply *)redisCommand(context, "DEL %s", key.c_str());
    bool success = reply && reply->integer > 0;
    if (reply)
        freeReplyObject(reply);
    return success;
}

string Redis::front(const string &key)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return "";

    redisReply *reply = (redisReply *)redisCommand(context, "LINDEX %s 0", key.c_str());
    string result = (reply && reply->type == REDIS_REPLY_STRING) ? reply->str : "";
    if (reply)
        freeReplyObject(reply);
    return result;
}

string Redis::back(const string &key)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return "";

    redisReply *reply = (redisReply *)redisCommand(context, "LINDEX %s -1", key.c_str());
    string result = (reply && reply->type == REDIS_REPLY_STRING) ? reply->str : "";
    if (reply)
        freeReplyObject(reply);
    return result;
}

int Redis::size(const string &key)
{
    lock_guard<mutex> lock(mMutex);
    if (!context)
        return 0;

    redisReply *reply = (redisReply *)redisCommand(context, "LLEN %s", key.c_str());
    int size = (reply && reply->type == REDIS_REPLY_INTEGER) ? reply->integer : 0;
    if (reply)
        freeReplyObject(reply);
    return size;
}