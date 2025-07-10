#include "telegram.h"
#include "axios.h"
#include "util.h"

static string urlEncode(const string &value)
{
    ostringstream escaped;
    escaped.fill('0');
    escaped << hex;

    for (char c : value)
    {
        if (isalnum(static_cast<unsigned char>(c)) || c == '-' || c == '_' || c == '.' || c == '~')
        {
            escaped << c;
        }
        else
        {
            escaped << '%' << setw(2) << uppercase << int((unsigned char)c);
        }
    }
    return escaped.str();
}

Telegram::Telegram()
{
    unordered_map<string, string> env = readEnvFile();
    if (env.find("TELEGRAM_TOKEN") != env.end())
    {
        botToken = env["TELEGRAM_TOKEN"];
    }
    else
    {
        LOGE("TELEGRAM_TOKEN not found in environment variables");
        throw runtime_error("TELEGRAM_TOKEN not found in environment variables");
    }
}

Telegram &Telegram::getInstance()
{
    static Telegram instance;
    return instance;
}

bool Telegram::sendMessageInternal(const string &message, const string &chatId)
{
    string url = StringFormat("https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s&parse_mode=HTML&disable_web_page_preview=true",
                              botToken.c_str(), urlEncode(chatId).c_str(), urlEncode(message).c_str());

    try
    {
        string response = Axios::get(url);
        return true;
    }
    catch (const exception &e)
    {
        LOGE("Failed to send Telegram message: %s. message=%s", e.what(), message.c_str());
        return false;
    }
}

void Telegram::debounceWorker(const string &chatId, shared_ptr<ChatBuffer> buffer)
{
    unique_lock<mutex> lock(buffer->bufMtx);
    while (buffer->active)
    {
        if (buffer->cv.wait_for(lock, chrono::seconds(1)) == cv_status::timeout)
        {
            if (!buffer->content.empty())
            {
                string msg = buffer->content;
                buffer->content.clear();
                lock.unlock();

                const size_t MAX_LEN = 4096;

                // Split theo message ngăn cách bằng "----------"
                std::vector<string> messages;
                size_t pos = 0, next;
                const string delimiter = "\n----------\n";

                while ((next = msg.find(delimiter, pos)) != string::npos)
                {
                    messages.push_back(msg.substr(pos, next - pos));
                    pos = next + delimiter.size();
                }
                if (pos < msg.size())
                {
                    messages.push_back(msg.substr(pos));
                }

                // Gộp các message lại sao cho <= MAX_LEN
                string chunk;
                for (const auto &m : messages)
                {
                    string toAdd = chunk.empty() ? m : delimiter + m;
                    if (chunk.size() + toAdd.size() > MAX_LEN)
                    {
                        sendMessageInternal(chunk, chatId);
                        chunk = m;
                    }
                    else
                    {
                        chunk += toAdd;
                    }
                }
                if (!chunk.empty())
                {
                    sendMessageInternal(chunk, chatId);
                }

                lock.lock();
            }
        }
    }
}

void Telegram::sendMessage(const string &message, const string &chatId)
{
    LOGI("Sending Telegram message to chat %s: %s", chatId.c_str(), message.c_str());
    shared_ptr<ChatBuffer> buffer;

    {
        lock_guard<mutex> lock(mtx);
        if (buffers.find(chatId) == buffers.end())
        {
            buffer = make_shared<ChatBuffer>();
            buffer->worker = thread(&Telegram::debounceWorker, this, chatId, buffer);
            buffers[chatId] = buffer;
        }
        else
        {
            buffer = buffers[chatId];
        }
    }

    {
        lock_guard<mutex> lock(buffer->bufMtx);
        if (!buffer->content.empty())
            buffer->content += "\n----------\n";
        buffer->content += message;
        buffer->cv.notify_one();
    }
}
