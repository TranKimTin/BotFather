#include "util.h"

string toLowerCase(string str)
{
    for (auto &c : str)
    {
        c = tolower(c);
    }
    return str;
}

bool endsWith(const std::string &str, const std::string &suffix)
{
    if (suffix.size() > str.size())
        return false;
    return std::equal(suffix.rbegin(), suffix.rend(), str.rbegin());
}

bool checkFinal(const string &tf, long long startTime, string &currentTF)
{
    long long nextTime = startTime / timeframeToNumberMiliseconds(currentTF) + 60;
    if (tf == "1m")
        return nextTime % 60 == 0;
    if (tf == "3m")
        return nextTime % 180 == 0;
    if (tf == "5m")
        return nextTime % 300 == 0;
    if (tf == "15m")
        return nextTime % 900 == 0;
    if (tf == "30m")
        return nextTime % 1800 == 0;
    if (tf == "1h")
        return nextTime % 3600 == 0;
    if (tf == "2h")
        return nextTime % 7200 == 0;
    if (tf == "4h")
        return nextTime % 14400 == 0;
    if (tf == "6h")
        return nextTime % 21600 == 0;
    if (tf == "8h")
        return nextTime % 28800 == 0;
    if (tf == "12h")
        return nextTime % 43200 == 0;
    if (tf == "1d")
        return nextTime % 86400 == 0;
    return false;
}

long long getStartTime(const string &tf, long long currentTime)
{
    if (tf == "1m")
        return currentTime - currentTime % 60000;
    if (tf == "3m")
        return currentTime - currentTime % 180000;
    if (tf == "5m")
        return currentTime - currentTime % 300000;
    if (tf == "15m")
        return currentTime - currentTime % 900000;
    if (tf == "30m")
        return currentTime - currentTime % 1800000;
    if (tf == "1h")
        return currentTime - currentTime % 3600000;
    if (tf == "2h")
        return currentTime - currentTime % 7200000;
    if (tf == "4h")
        return currentTime - currentTime % 14400000;
    if (tf == "6h")
        return currentTime - currentTime % 21600000;
    if (tf == "8h")
        return currentTime - currentTime % 28800000;
    if (tf == "12h")
        return currentTime - currentTime % 43200000;
    if (tf == "1d")
        return currentTime - currentTime % 86400000;
    return currentTime;
}

int timeframeToNumberMinutes(const string &tf)
{
    if (tf == "1m")
        return 1;
    if (tf == "3m")
        return 3;
    if (tf == "5m")
        return 5;
    if (tf == "15m")
        return 15;
    if (tf == "30m")
        return 30;
    if (tf == "1h")
        return 60;
    if (tf == "2h")
        return 120;
    if (tf == "4h")
        return 240;
    if (tf == "6h")
        return 360;
    if (tf == "8h")
        return 480;
    if (tf == "12h")
        return 720;
    if (tf == "1d")
        return 1440;
    return 1;
}

long long timeframeToNumberMiliseconds(const string &tf)
{
    return (long long)timeframeToNumberMinutes(tf) * 60000;
}

long long nextTime(long long timestamp, const string &timeframe)
{
    long long startTime = getStartTime(timeframe, timestamp);
    long long offsetTime = timeframeToNumberMiliseconds(timeframe);
    return startTime + offsetTime;
}