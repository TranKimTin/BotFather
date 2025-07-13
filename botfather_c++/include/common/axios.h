#pragma once
#include "common_type.h"

class Axios
{
public:
    static string get(string url);
    static string post(string url, const string &body, const string &content_type = "application/json");
    static string put(string url, const string &body, const string &content_type = "application/json");
    static string del(string url);

private:
    static string request(const string &method, const string &url, const string &body, const string &content_type = "");
};