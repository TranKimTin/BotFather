#include "axios.h"
#include "httplib.h"

using namespace std;

string Axios::get(string url)
{
    return request("GET", url, "");
}

string Axios::post(string url, const string &body, const string &content_type)
{
    return request("POST", url, body, content_type);
}

string Axios::put(string url, const string &body, const string &content_type)
{
    return request("PUT", url, body, content_type);
}

string Axios::del(string url)
{
    return request("DELETE", url, "");
}

string Axios::request(const string &method, const string &url, const string &body, const string &content_type)
{
    const string https_prefix = "https://";
    if (url.find(https_prefix) != 0)
    {
        throw invalid_argument("Only HTTPS URLs are supported.");
    }

    string host_and_path = url.substr(https_prefix.size());
    size_t slash_pos = host_and_path.find('/');
    if (slash_pos == string::npos)
    {
        throw invalid_argument("Invalid URL format.");
    }

    string host = host_and_path.substr(0, slash_pos);
    string path = "/" + host_and_path.substr(slash_pos + 1);

    httplib::SSLClient cli(host, 443);
    cli.set_follow_location(true);

    httplib::Result res;

    if (method == "GET")
    {
        res = cli.Get(path.c_str());
    }
    else if (method == "POST")
    {
        res = cli.Post(path.c_str(), body, content_type);
    }
    else if (method == "PUT")
    {
        res = cli.Put(path.c_str(), body, content_type);
    }
    else if (method == "DELETE")
    {
        res = cli.Delete(path.c_str());
    }
    else
    {
        throw invalid_argument("Unsupported HTTP method: " + method);
    }

    if (res && res->status >= 200 && res->status < 300)
    {
        return res->body;
    }
    else
    {
        LOGE("%s request failed: %s. url=%s", method.c_str(),
             res ? res->reason.c_str() : "No response",
             url.c_str());
        throw runtime_error(method + " request failed.");
    }
}
