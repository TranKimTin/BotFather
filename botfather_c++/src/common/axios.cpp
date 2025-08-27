#include "axios.h"
#include "httplib.h"

using namespace std;

static thread_local boost::unordered_flat_map<string, unique_ptr<httplib::SSLClient>> clients;

static void parseUrl(const string &url, string &host, string &path)
{
    const string https_prefix = "https://";
    if (url.find(https_prefix) != 0)
        throw RequestException(1001, "Only HTTPS URLs are supported.");

    string host_and_path = url.substr(https_prefix.size());
    size_t slash_pos = host_and_path.find('/');
    if (slash_pos == string::npos)
        throw RequestException(1002, "Invalid URL format.");

    host = host_and_path.substr(0, slash_pos);
    path = "/" + host_and_path.substr(slash_pos + 1);
}

void parseUrlHTTP(const string &url, string &host, int &port, string &path)
{
    string working = url;

    const string prefix = "http://";
    if (working.compare(0, prefix.size(), prefix) == 0)
        working = working.substr(prefix.size());

    size_t path_pos = working.find('/');
    if (path_pos == string::npos)
    {
        path = "/";
    }
    else
    {
        path = working.substr(path_pos);
        working = working.substr(0, path_pos);
    }

    size_t colon_pos = working.find(':');
    if (colon_pos != string::npos)
    {
        host = working.substr(0, colon_pos);
        port = stoi(working.substr(colon_pos + 1));
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

static httplib::SSLClient *getClient(const string &host)
{
    auto &cli = clients[host];
    if (!cli)
    {
        cli = make_unique<httplib::SSLClient>(host, 443);
        cli->set_follow_location(true);
        cli->set_keep_alive(true);
    }
    return cli.get();
}

static int getErrorCode(httplib::Result *res)
{
    if (!res)
        return 1000;
    json j = json::parse(res->body);
    if (j.contains("code"))
    {
        return j["code"].get<int>();
    }
    return 1000;
}

string Axios::get(const string &url, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient *cli = getClient(host);

    httplib::Headers header = convertHeaders(headers);

    auto res = cli->Get(path.c_str(), header);
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] GET request failed: {}. body={}, url={}", res ? res->reason : "No response", res ? res->body : "", url);

    throw RequestException(getErrorCode(res), "GET request failed.");
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
    throw RequestException(getErrorCode(res), "GET request failed.");
}

string Axios::post(const string &url, const string &body,
                   const string &contentType, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient *cli = getClient(host);

    auto res = cli->Post(path.c_str(), convertHeaders(headers), body, contentType.c_str());
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] POST request failed: reason: {}. body: {}. url={}", res ? res->reason : "No response", res ? res->body : "", url);
    throw RequestException(getErrorCode(res), "POST request failed.");
}

string Axios::put(const string &url, const string &body,
                  const string &contentType, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient *cli = getClient(host);

    auto res = cli->Put(path.c_str(), convertHeaders(headers), body, contentType.c_str());
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] PUT request failed: {}. url={}", res ? res->reason : "No response", url);
    throw RequestException(getErrorCode(res), "PUT request failed.");
}

string Axios::del(const string &url, const vector<string> &headers)
{
    string host, path;
    parseUrl(url, host, path);

    httplib::SSLClient *cli = getClient(host);

    auto res = cli->Delete(path.c_str(), convertHeaders(headers));
    if (res && res->status == 200)
        return res->body;

    LOGE("[request] DELETE request failed: {}. body={}, url={}", res ? res->reason : "No response", res ? res->body : "", url);
    throw RequestException(getErrorCode(res), "DELETE request failed.");
}