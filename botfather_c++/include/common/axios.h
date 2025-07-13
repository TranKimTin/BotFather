#pragma once
#include "common_type.h"

class Axios {
public:
    static std::string get(const std::string &url);
    static std::string post(const std::string &url,
                            const std::string &body,
                            const std::string &contentType,
                            const std::vector<std::string> &headers = {});
    static std::string put(const std::string &url,
                           const std::string &body,
                           const std::string &contentType,
                           const std::vector<std::string> &headers = {});
    static std::string del(const std::string &url,
                           const std::vector<std::string> &headers = {});
};
