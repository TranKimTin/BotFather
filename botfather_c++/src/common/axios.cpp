#include "axios.h"
#include "httplib.h"

using namespace std;

static void parseUrl(const string &url, string &host, string &path)
{
    const string https_prefix = "https://";
    if (url.find(https_prefix) != 0)
        throw invalid_argument("Only HTTPS URLs are supported.");

    string host_and_path = url.substr(https_prefix.size());
    size_t slash_pos = host_and_path.find('/');
    if (slash_pos == string::npos)
        throw invalid_argument("Invalid URL format.");

    host = host_and_path.substr(0, slash_pos);
    path = "/" + host_and_path.substr(slash_pos + 1);
}

void parseUrlHTTP(const std::string &url, std::string &host, int &port, std::string &path)
{
    std::string working = url;

    const std::string prefix = "http://";
    if (working.compare(0, prefix.size(), prefix) == 0)
        working = working.substr(prefix.size());

    size_t path_pos = working.find('/');
    if (path_pos == std::string::npos)
    {
        path = "/";
    }
    else
    {
        path = working.substr(path_pos);
        working = working.substr(0, path_pos);
    }

    size_t colon_pos = working.find(':');
    if (colon_pos != std::string::npos)
    {
        host = working.substr(0, colon_pos);
        port = std::stoi(working.substr(colon_pos + 1));
    }
    else
    {
        host = working;
        port = 80;
    }
}

static httplib::Headers convertHeaders(const vector<string> &headerStrings)
{
    httplib::Headers headers;
    for (const auto &line : headerStrings)
    {
        auto pos = line.find(':');
        if (pos != string::npos)
        {
            string key = line.substr(0, pos);
            string value = line.substr(pos + 1);
            while (!value.empty() && value[0] == ' ')
                value.erase(0, 1);
            headers.emplace(key, value);
        }
    }
    return headers;
}

string Axios::get(const string &url, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient cli(host, 443);
    cli.set_follow_location(true);

    httplib::Headers header = convertHeaders(headers);

    auto res = cli.Get(path.c_str(), header);
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] GET request failed: {}. body={}, url={}", res ? res->reason : "No response", res ? res->body : "", url);
    throw runtime_error("GET request failed.");
}

string Axios::getHTTP(const string &url, const vector<string> &headers)
{
    string host, path;
    int port = 80;

    parseUrlHTTP(url, host, port, path);

    httplib::Client cli(host, port);
    cli.set_follow_location(true);

    httplib::Headers header = convertHeaders(headers);

    auto res = cli.Get(path.c_str(), header);
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] GET request failed: {}. body={}, url={}", res ? res->reason : "No response", res ? res->body : "", url);
    throw runtime_error("GET request failed.");
}

string Axios::post(const string &url, const string &body,
                   const string &contentType, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient cli(host, 443);
    cli.set_follow_location(true);

    auto res = cli.Post(path.c_str(), convertHeaders(headers), body, contentType.c_str());
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] POST request failed: reason: {}. body: {}. url={}", res ? res->reason : "No response", res ? res->body : "", url);
    throw runtime_error("POST request failed.");
}

string Axios::put(const string &url, const string &body,
                  const string &contentType, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient cli(host, 443);
    cli.set_follow_location(true);

    auto res = cli.Put(path.c_str(), convertHeaders(headers), body, contentType.c_str());
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] PUT request failed: {}. url={}", res ? res->reason : "No response", url);
    throw runtime_error("PUT request failed.");
}

string Axios::del(const string &url, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient cli(host, 443);
    cli.set_follow_location(true);

    auto res = cli.Delete(path.c_str(), convertHeaders(headers));
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] DELETE request failed: {}. body={}, url={}", res ? res->reason : "No response", res ? res->body : "", url);
    throw runtime_error("DELETE request failed.");
}