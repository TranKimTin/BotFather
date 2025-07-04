#include "axios.h"
#include "httplib.h"

string Axios::get(string url)
{
    // Parse URL
    const std::string https_prefix = "https://";
    if (url.find(https_prefix) != 0)
    {
        throw std::invalid_argument("Only HTTPS URLs are supported.");
    }

    std::string host_and_path = url.substr(https_prefix.size());
    size_t slash_pos = host_and_path.find('/');
    if (slash_pos == std::string::npos)
    {
        throw std::invalid_argument("Invalid URL format.");
    }

    std::string host = host_and_path.substr(0, slash_pos);
    std::string path = "/" + host_and_path.substr(slash_pos + 1);

    // Create HTTPS client
    httplib::SSLClient cli(host, 443);
    cli.set_follow_location(true); // Follow redirects if needed

    auto res = cli.Get(path.c_str());
    if (res && res->status == 200)
    {
        return res->body;
    }
    else
    {
        LOGE("GET request failed: %s. url=%s", res ? res->reason.c_str() : "No response", url.c_str());
        throw std::runtime_error("GET request failed.");
    }
}
