#pragma once
#include <common_type.h>

class Telegram
{
private:
    string botToken;
    mutex mtx;

    struct ChatBuffer
    {
        string content;
        mutex bufMtx;
        condition_variable cv;
        bool active = true;
        thread worker;
    };

    boost::unordered_flat_map<string, shared_ptr<ChatBuffer>> buffers;

    Telegram();
    void debounceWorker(const string &chatId, shared_ptr<ChatBuffer> buffer);
    bool sendMessageInternal(const string &message, const string &chatId);

public:
    static Telegram &getInstance();

    void sendMessage(const string &message, const string &chatId);
};
