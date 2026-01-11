#include "util.h"
#include "fstream"
#include "axios.h"
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/bio.h>
#include <openssl/buffer.h>
#include "expr.h"

string toLowerCase(string str)
{
    for (auto &c : str)
    {
        if (c >= 'A' && c <= 'Z')
            c = c - 'A' + 'a';
    }
    return str;
}

string trim(const string &s)
{
    auto start = find_if_not(s.begin(), s.end(), ::isspace);
    auto end = find_if_not(s.rbegin(), s.rend(), ::isspace).base();

    return (start < end) ? string(start, end) : "";
}

bool endsWith(const string &str, const string &suffix)
{
    if (suffix.size() > str.size())
        return false;
    return equal(suffix.rbegin(), suffix.rend(), str.rbegin());
}

bool checkFinal(const string &tf, long long startTime, string &currentTF)
{
    long long nextTime = startTime / 1000 + timeframeToNumberSeconds(currentTF);
    switch (tf[0])
    {
    case '1':
    {
        switch (tf[1])
        {
        case 'm':
            return nextTime % 60 == 0; // 1m
        case 'h':
            return nextTime % 3600 == 0; // 1h
        case 'd':
            return nextTime % 86400 == 0; // 1d
        case '5':
            return nextTime % 900 == 0; // 15m
        case '2':
            return nextTime % 43200 == 0; // 12h
        }
        break;
    }
    case '2':
        return nextTime % 7200 == 0; // 2h
    case '3':
    {
        switch (tf[1])
        {
        case 'm':
            return nextTime % 180 == 0; // 3m
        case '0':
            return nextTime % 1800 == 0; // 30m
        }
        break;
    }
    case '4':
        return nextTime % 14400 == 0; // 4h
    case '5':
        return nextTime % 300 == 0; // 5m
    case '6':
        return nextTime % 21600 == 0; // 6h
    case '8':
        return nextTime % 28800 == 0; // 8h
    default:
        break;
    }
    return false;
}

long long getStartTime(const string &tf, long long currentTime)
{
    switch (tf[0])
    {
    case '1':
    {
        switch (tf[1])
        {
        case 'm':
            return currentTime - currentTime % 60000; // 1m
        case 'h':
            return currentTime - currentTime % 3600000; // 1h
        case 'd':
            return currentTime - currentTime % 86400000; // 1d
        case '5':
            return currentTime - currentTime % 900000; // 15m
        case '2':
            return currentTime - currentTime % 43200000; // 12h
        }
        break;
    }
    case '2':
        return currentTime - currentTime % 7200000; // 2h
    case '3':
    {
        switch (tf[1])
        {
        case 'm':
            return currentTime - currentTime % 180000; // 3m
        case '0':
            return currentTime - currentTime % 1800000; // 30m
        }
        break;
    }
    case '4':
        return currentTime - currentTime % 14400000; // 4h
    case '5':
        return currentTime - currentTime % 300000; // 5m
    case '6':
        return currentTime - currentTime % 21600000; // 6h
    case '8':
        return currentTime - currentTime % 28800000; // 8h
    default:
        break;
    }
    return currentTime;
}

int timeframeToNumberMinutes(const string &tf)
{
    switch (tf[0])
    {
    case '1':
    {
        switch (tf[1])
        {
        case 'm':
            return 1; // 1m
        case 'h':
            return 60; // 1h
        case 'd':
            return 1440; // 1d
        case '5':
            return 15; // 15m
        case '2':
            return 720; // 12h
        }
        break;
    }
    case '2':
        return 120; // 2h
    case '3':
    {
        switch (tf[1])
        {
        case 'm':
            return 3; // 3m
        case '0':
            return 30; // 30m
        }
        break;
    }
    case '4':
        return 240; // 4h
    case '5':
        return 5; // 5m
    case '6':
        return 360; // 6h
    case '8':
        return 480; // 8h
    default:
        break;
    }

    return 1;
}

long long timeframeToNumberMiliseconds(const string &tf)
{
    return (long long)timeframeToNumberSeconds(tf) * 1000;
}

long long timeframeToNumberSeconds(const string &tf)
{
    return (long long)timeframeToNumberMinutes(tf) * 60;
}

long long nextTime(long long timestamp, const string &timeframe)
{
    long long startTime = getStartTime(timeframe, timestamp);
    long long offsetTime = timeframeToNumberMiliseconds(timeframe);
    return startTime + offsetTime;
}

string toTimeString(long long timestampMs)
{
    time_t timestampSec = timestampMs / 1000;
    tm tm;
    localtime_r(&timestampSec, &tm);

    ostringstream oss;
    oss << setfill('0')
        << setw(4) << (tm.tm_year + 1900) << "-"
        << setw(2) << (tm.tm_mon + 1) << "-"
        << setw(2) << tm.tm_mday << " "
        << setw(2) << tm.tm_hour << ":"
        << setw(2) << tm.tm_min;

    return oss.str();
}

long long getCurrentTime()
{
    auto now = chrono::system_clock::now();
    auto duration = now.time_since_epoch();
    return chrono::duration_cast<chrono::milliseconds>(duration).count();
}

filesystem::path exeDir()
{
    char path[PATH_MAX];
    ssize_t len = readlink("/proc/self/exe", path, sizeof(path) - 1);
    if (len == -1)
    {
        LOGE("readlink failed");
        throw "readlink failed";
    }
    path[len] = '\0';

    return filesystem::path(path).parent_path();
}

boost::unordered_flat_map<string, string> readEnvFile()
{
    filesystem::path envPath = exeDir() / ".." / ".." / ".env";
    envPath = envPath.lexically_normal();

    ifstream file(envPath);
    if (!file)
    {
        cerr << ".env not found: " << envPath << endl;
        throw runtime_error(".env not found");
    }

    boost::unordered_flat_map<string, string> envMap;
    string line;

    while (getline(file, line))
    {
        if (line.empty() || line[0] == '#')
            continue;

        size_t eqPos = line.find('=');
        if (eqPos == string::npos)
            continue;

        string key = line.substr(0, eqPos);
        string value = line.substr(eqPos + 1);

        key.erase(0, key.find_first_not_of(" \t\r\n"));
        key.erase(key.find_last_not_of(" \t\r\n") + 1);
        value.erase(0, value.find_first_not_of(" \t\r\n"));
        value.erase(value.find_last_not_of(" \t\r\n") + 1);

        envMap[key] = value;
    }

    return envMap;
}

vector<string> split(const string &s, char delimiter)
{
    vector<string> tokens;
    string token;
    istringstream tokenStream(s);

    while (getline(tokenStream, token, delimiter))
    {
        if (!token.empty())
        {
            tokens.push_back(token);
        }
    }

    return tokens;
}

vector<string> convertJsonStringArrayToVector(string s)
{
    vector<string> result;

    json j = json::parse(s);
    for (const auto &item : j)
    {
        if (item.is_string())
        {
            result.push_back(item.get<string>());
        }
        else
        {
            LOGE("Invalid item in JSON array: {}", item.dump());
        }
    }
    return result;
}

string doubleToString(double value, int precision)
{
    ostringstream oss;
    oss << fixed << setprecision(precision) << value;
    string result = oss.str();

    if (result.find('.') != string::npos)
    {
        result.erase(result.find_last_not_of('0') + 1);
        if (result.back() == '.')
            result.pop_back();
    }

    return result;
}

RateData getOHLCVFromRateServer(const string &broker, const string &symbol, const string &timeframe, int limit, long long since)
{
    try
    {
        auto env = readEnvFile();
        string serverURL = env["RATE_SERVER"];
        string url = StringFormat("http://{}:8081/api/getOHLCV?broker={}&symbol={}&timeframe={}&limit={}&since={}", serverURL, broker, symbol, timeframe, limit, since);
        string response = Axios::getHTTP(url);
        if (response == "")
            return {};

        json j = json::parse(response);
        RateData rateData;
        rateData.symbol = symbol;
        rateData.interval = timeframe;
        for (const auto &item : j)
        {
            vector<string> rate = split(item.get<string>(), '_');

            if (rate.size() != 6)
            {
                LOGE("Invalid rate data format: {}", item.get<string>());
                return {};
            }

            rateData.startTime.push_back(stoll(rate[0]));
            rateData.open.push_back(stod(rate[1]));
            rateData.high.push_back(stod(rate[2]));
            rateData.low.push_back(stod(rate[3]));
            rateData.close.push_back(stod(rate[4]));
            rateData.volume.push_back(stod(rate[5]));
        }
        return rateData;
    }
    catch (exception &e)
    {
        return {};
    }
}

RateData getBinanceOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    string url = "https://api.binance.com/api/v3/klines?symbol=" + symbol + "&interval=" + timeframe + "&limit=" + to_string(limit);
    if (since > 0)
    {
        url += "&startTime=" + to_string(since);
    }
    string response = Axios::get(url);
    json j = json::parse(response);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    for (const auto &item : j)
    {
        rateData.startTime.push_front(item[0].get<long long>());
        rateData.open.push_front(stod(item[1].get<string>()));
        rateData.high.push_front(stod(item[2].get<string>()));
        rateData.low.push_front(stod(item[3].get<string>()));
        rateData.close.push_front(stod(item[4].get<string>()));
        rateData.volume.push_front(stod(item[5].get<string>()));
    }

    return rateData;
}

RateData getBinanceFuturetOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    string url = "https://fapi.binance.com/fapi/v1/klines?symbol=" + symbol + "&interval=" + timeframe + "&limit=" + to_string(limit);
    if (since > 0)
    {
        url += "&startTime=" + to_string(since);
    }
    string response = Axios::get(url);
    json j = json::parse(response);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    for (const auto &item : j)
    {
        rateData.startTime.push_front(item[0].get<long long>());
        rateData.open.push_front(stod(item[1].get<string>()));
        rateData.high.push_front(stod(item[2].get<string>()));
        rateData.low.push_front(stod(item[3].get<string>()));
        rateData.close.push_front(stod(item[4].get<string>()));
        rateData.volume.push_front(stod(item[5].get<string>()));
    }

    return rateData;
}

RateData getBybitFutureOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    string tf = timeframe;
    if (timeframe == "1m" || timeframe == "3m" || timeframe == "5m" || timeframe == "15m" || timeframe == "30m")
    {
        tf.pop_back();
    }
    else if (timeframe == "1h" || timeframe == "2h" || timeframe == "4h" || timeframe == "6h" || timeframe == "8h" || timeframe == "12h")
    {
        tf.pop_back();
        tf = to_string(stoi(tf) * 60);
    }
    else if (timeframe == "1d")
    {
        tf = "D";
    }

    string url = StringFormat("https://api.bybit.com/v5/market/kline?category=linear&symbol={}&interval={}&limit={}", symbol, tf, limit);
    if (since)
        url += StringFormat("&start={}", since);

    string response = Axios::get(url);
    json j = json::parse(response);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    auto list = j["result"]["list"];
    for (const auto &item : list)
    {
        rateData.startTime.push_back(stoll(item[0].get<string>()));
        rateData.open.push_back(stod(item[1].get<string>()));
        rateData.high.push_back(stod(item[2].get<string>()));
        rateData.low.push_back(stod(item[3].get<string>()));
        rateData.close.push_back(stod(item[4].get<string>()));
        rateData.volume.push_back(stod(item[5].get<string>()));
    }

    return rateData;
}

RateData getBybitOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    string tf = timeframe;
    if (timeframe == "1m" || timeframe == "3m" || timeframe == "5m" || timeframe == "15m" || timeframe == "30m")
    {
        tf.pop_back();
    }
    else if (timeframe == "1h" || timeframe == "2h" || timeframe == "4h" || timeframe == "6h" || timeframe == "8h" || timeframe == "12h")
    {
        tf.pop_back();
        tf = to_string(stoi(tf) * 60);
    }
    else if (timeframe == "1d")
    {
        tf = "D";
    }

    string url = StringFormat("https://api.bybit.com/v5/market/kline?category=spot&symbol={}&interval={}&limit={}", symbol, tf, limit);
    if (since)
        url += StringFormat("&start={}", since);

    string response = Axios::get(url);
    json j = json::parse(response);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    auto list = j["result"]["list"];
    for (const auto &item : list)
    {
        rateData.startTime.push_back(stoll(item[0].get<string>()));
        rateData.open.push_back(stod(item[1].get<string>()));
        rateData.high.push_back(stod(item[2].get<string>()));
        rateData.low.push_back(stod(item[3].get<string>()));
        rateData.close.push_back(stod(item[4].get<string>()));
        rateData.volume.push_back(stod(item[5].get<string>()));
    }

    return rateData;
}

RateData getOkxOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    // max limit: 300
    string tf = timeframe;
    if (timeframe == "1h" || timeframe == "2h" || timeframe == "4h")
    {
        tf.back() = 'H';
    }
    else if (timeframe == "6h" || timeframe == "8h" || timeframe == "12h")
    {
        tf.pop_back();
        tf += "Hutc";
    }
    else if (timeframe == "1d")
    {
        tf.pop_back();
        tf += "Dutc";
    }
    string url = "";
    if (since)
    {
        url = StringFormat("https://www.okx.com/api/v5/market/history-candles?instId={}&bar={}&limit={}&after={}", symbol, tf, limit, since + limit * timeframeToNumberMiliseconds(timeframe));
    }
    else
    {
        url = StringFormat("https://www.okx.com/api/v5/market/candles?instId={}&bar={}&limit=%d", symbol, tf, limit);
    }

    string response = Axios::get(url);
    json j = json::parse(response);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    auto list = j["data"];
    for (const auto &item : list)
    {
        rateData.startTime.push_back(stoll(item[0].get<string>()));
        rateData.open.push_back(stod(item[1].get<string>()));
        rateData.high.push_back(stod(item[2].get<string>()));
        rateData.low.push_back(stod(item[3].get<string>()));
        rateData.close.push_back(stod(item[4].get<string>()));
        rateData.volume.push_back(stod(item[5].get<string>()));
    }

    if (since)
    {
        while (!rateData.startTime.empty() > 0 && rateData.startTime.back() < since)
        {
            rateData.startTime.pop_back();
            rateData.open.pop_back();
            rateData.high.pop_back();
            rateData.low.pop_back();
            rateData.close.pop_back();
            rateData.volume.pop_back();
        }
    }

    return rateData;
}

vector<string> getBinanceSymbolList()
{
    string url = "https://api.binance.com/api/v1/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    for (const auto &s : j["symbols"])
    {
        string symbol = s["symbol"].get<string>();
        string status = s["status"].get<string>();

        if (status != "TRADING" || !endsWith(symbol, "USDT") || symbol == "USDCUSDT" || symbol == "TUSDUSDT" || symbol == "DAIUSDT")
            continue;
        if (symbol == "币安人生USDT")
            continue;
        symbols.push_back(symbol);
    }
    return symbols;
}

vector<string> getBinanceFutureSymbolList()
{
    string url = "https://fapi.binance.com/fapi/v1/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    for (const auto &s : j["symbols"])
    {
        string symbol = s["symbol"].get<string>();
        string status = s["status"].get<string>();

        if (status != "TRADING" || !endsWith(symbol, "USDT") || symbol == "USDCUSDT" || symbol == "TUSDUSDT" || symbol == "DAIUSDT")
            continue;
        if (symbol == "ATUSDT")
            continue;
        if (symbol == "币安人生USDT")
            continue;
        symbols.push_back(symbol);
        // if (symbols.size() >= 500)
        // break;
    }
    return symbols;
}

vector<string> getBybitFutureSymbolList()
{
    string url = "https://api.bybit.com/v5/market/tickers?category=linear";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    auto list = j["result"]["list"];
    for (const auto &s : list)
    {
        double volume24h = stod(s["volume24h"].get<string>());
        string symbol = s["symbol"].get<string>();
        string curPreListingPhase = s["curPreListingPhase"].get<string>();

        if (volume24h <= 0 || !endsWith(symbol, "USDT") || symbol == "USDCUSDT" || symbol == "TUSDUSDT" || symbol == "DAIUSDT" || curPreListingPhase == "ContinuousTrading")
            continue;

        symbols.push_back(symbol);
    }
    return symbols;
}

vector<string> getBybitSymbolList()
{
    string url = "https://api.bybit.com/v5/market/tickers?category=spot";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    auto list = j["result"]["list"];
    for (const auto &s : list)
    {
        double volume24h = stod(s["volume24h"].get<string>());
        string symbol = s["symbol"].get<string>();

        if (volume24h <= 0 || !endsWith(symbol, "USDT") || symbol == "USDCUSDT" || symbol == "TUSDUSDT" || symbol == "DAIUSDT")
            continue;

        symbols.push_back(symbol);
    }
    return symbols;
}

vector<string> getOkxSymbolList()
{
    string url = "https://www.okx.com/api/v5/public/instruments?instType=SPOT";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    auto list = j["data"];
    auto now = getCurrentTime();

    for (const auto &s : list)
    {
        string quoteCcy = s["quoteCcy"].get<string>();
        string baseCcy = s["baseCcy"].get<string>();
        string symbol = s["instId"].get<string>();
        long long listTime = stoll(s["listTime"].get<string>());

        if (quoteCcy != "USDT" || baseCcy == "USDC" || baseCcy == "TUSD" || baseCcy == "BUSD" || baseCcy == "DAI" || listTime > now)
            continue;

        symbols.push_back(symbol);
    }
    return symbols;
}

boost::unordered_flat_map<long long, ExchangeInfo> getBinanceInfo()
{
    boost::unordered_flat_map<long long, ExchangeInfo> result;

    string url = "https://api.binance.com/api/v1/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);

    json symbols = j["symbols"];
    for (auto &s : symbols)
    {
        if (s["quoteAsset"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        long long key = hashString(symbol);
        for (auto &f : s["filters"])
        {
            if (f["filterType"].get<string>() == "PRICE_FILTER")
            {
                result[key].digitPrices = (int)(-log10(stod(f["tickSize"].get<string>())));
                result[key].minPrice = stod(f["minPrice"].get<string>());
                result[key].maxPrice = stod(f["maxPrice"].get<string>());
            }
            else if (f["filterType"].get<string>() == "LOT_SIZE")
            {
                result[key].digitVolume = (int)(-log10(stod(f["stepSize"].get<string>())));
            }
        }
    }
    return result;
}

boost::unordered_flat_map<long long, ExchangeInfo> getBinanceFutureInfo()
{
    boost::unordered_flat_map<long long, ExchangeInfo> result;

    string url = "https://fapi.binance.com/fapi/v1/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);

    json symbols = j["symbols"];
    for (auto &s : symbols)
    {
        if (s["quoteAsset"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        long long key = hashString(symbol);
        for (auto &f : s["filters"])
        {
            if (f["filterType"].get<string>() == "PRICE_FILTER")
            {
                result[key].digitPrices = (int)(-log10(stod(f["tickSize"].get<string>())));
                result[key].minPrice = stod(f["minPrice"].get<string>());
                result[key].maxPrice = stod(f["maxPrice"].get<string>());
            }
            else if (f["filterType"].get<string>() == "LOT_SIZE")
            {
                result[key].digitVolume = (int)(-log10(stod(f["stepSize"].get<string>())));
            }
        }
    }
    return result;
}

boost::unordered_flat_map<long long, ExchangeInfo> getBybitInfo()
{
    boost::unordered_flat_map<long long, ExchangeInfo> result;

    string url = "https://api.bybit.com/v5/market/instruments-info?category=spot";
    string response = Axios::get(url);
    json j = json::parse(response);
    auto list = j["result"]["list"];
    for (const auto &s : list)
    {
        if (s["quoteCoin"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        long long key = hashString(symbol);
        result[key].digitPrices = (int)(-log10(stod(s["priceFilter"]["tickSize"].get<string>())));
        result[key].digitVolume = (int)(-log10(stod(s["lotSizeFilter"]["basePrecision"].get<string>())));
        result[key].minPrice = 0.0;
        result[key].maxPrice = INF;
    }

    return result;
}
boost::unordered_flat_map<long long, ExchangeInfo> getBybitFutureInfo()
{
    boost::unordered_flat_map<long long, ExchangeInfo> result;

    string url = "https://api.bybit.com/v5/market/instruments-info?category=linear&limit=1000";
    string response = Axios::get(url);
    json j = json::parse(response);
    auto list = j["result"]["list"];
    for (const auto &s : list)
    {
        if (s["quoteCoin"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        long long key = hashString(symbol);
        result[key].digitPrices = (int)(-log10(stod(s["priceFilter"]["tickSize"].get<string>())));
        result[key].digitVolume = (int)(-log10(stod(s["lotSizeFilter"]["qtyStep"].get<string>())));
        result[key].minPrice = stod(s["priceFilter"]["minPrice"].get<string>());
        result[key].maxPrice = stod(s["priceFilter"]["maxPrice"].get<string>());
    }

    return result;
}
boost::unordered_flat_map<long long, ExchangeInfo> getOkxInfo()
{
    boost::unordered_flat_map<long long, ExchangeInfo> result;
    string url = "https://www.okx.com/api/v5/public/instruments?instType=SPOT";
    string response = Axios::get(url);
    json j = json::parse(response);
    auto list = j["data"];
    for (const auto &s : list)
    {
        if (s["quoteCcy"].get<string>() != "USDT")
            continue;

        string symbol = s["instId"].get<string>();
        long long key = hashString(symbol);
        result[key].digitPrices = (int)(-log10(stod(s["tickSz"].get<string>())));
        result[key].digitVolume = (int)(-log10(stod(s["lotSz"].get<string>())));
        result[key].minPrice = 0.0;
        result[key].maxPrice = INF;
    }
    return result;
}

string base64Encode(const unsigned char *data, int len)
{
    BIO *bio, *b64;
    BUF_MEM *bufferPtr;

    b64 = BIO_new(BIO_f_base64());
    bio = BIO_new(BIO_s_mem());
    b64 = BIO_push(b64, bio);

    BIO_set_flags(b64, BIO_FLAGS_BASE64_NO_NL); // No newline
    BIO_write(b64, data, len);
    BIO_flush(b64);
    BIO_get_mem_ptr(b64, &bufferPtr);

    string result(bufferPtr->data, bufferPtr->length);
    BIO_free_all(b64);
    return result;
}

vector<unsigned char> base64Decode(const string &input)
{
    BIO *bio, *b64;
    int len = input.size();
    vector<unsigned char> buffer(len);

    b64 = BIO_new(BIO_f_base64());
    bio = BIO_new_mem_buf(input.data(), len);
    bio = BIO_push(b64, bio);

    BIO_set_flags(bio, BIO_FLAGS_BASE64_NO_NL); // No newline
    int decodedLen = BIO_read(bio, buffer.data(), len);
    buffer.resize(decodedLen);
    BIO_free_all(bio);

    return buffer;
}

static vector<unsigned char> hexToBytes(const string &hexStr)
{
    vector<unsigned char> bytes;
    for (size_t i = 0; i < hexStr.length(); i += 2)
    {
        bytes.push_back(static_cast<unsigned char>(
            std::stoul(hexStr.substr(i, 2), nullptr, 16)));
    }
    return bytes;
}

// Encrypt AES-256-CBC → base64
string encryptAES(const string &plaintext, const string &key, const string &ivHex)
{
    vector<unsigned char> ivBytes = hexToBytes(ivHex);

    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (!ctx)
        throw runtime_error("Failed to create context");

    if (EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), nullptr,
                           (const unsigned char *)key.data(), ivBytes.data()) != 1)
    {
        EVP_CIPHER_CTX_free(ctx);
        throw runtime_error("EncryptInit failed");
    }

    vector<unsigned char> ciphertext(plaintext.size() + EVP_MAX_BLOCK_LENGTH);
    int len = 0, totalLen = 0;

    if (EVP_EncryptUpdate(ctx, ciphertext.data(), &len,
                          (const unsigned char *)plaintext.data(), plaintext.size()) != 1)
    {
        EVP_CIPHER_CTX_free(ctx);
        throw runtime_error("EncryptUpdate failed");
    }
    totalLen += len;

    if (EVP_EncryptFinal_ex(ctx, ciphertext.data() + totalLen, &len) != 1)
    {
        EVP_CIPHER_CTX_free(ctx);
        throw runtime_error("EncryptFinal failed");
    }
    totalLen += len;
    ciphertext.resize(totalLen);

    EVP_CIPHER_CTX_free(ctx);
    return base64Encode(ciphertext.data(), ciphertext.size());
}

string decryptAES(const string &ciphertextBase64, const string &key, const string &ivHex)
{
    vector<unsigned char> ciphertext = base64Decode(ciphertextBase64);
    vector<unsigned char> ivBytes = hexToBytes(ivHex);

    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (!ctx)
        throw runtime_error("Failed to create context");

    if (EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), nullptr,
                           (const unsigned char *)key.data(), ivBytes.data()) != 1)
    {
        EVP_CIPHER_CTX_free(ctx);
        throw runtime_error("DecryptInit failed");
    }

    vector<unsigned char> plaintext(ciphertext.size());
    int len = 0, totalLen = 0;

    if (EVP_DecryptUpdate(ctx, plaintext.data(), &len,
                          ciphertext.data(), ciphertext.size()) != 1)
    {
        EVP_CIPHER_CTX_free(ctx);
        throw runtime_error("DecryptUpdate failed");
    }
    totalLen += len;

    if (EVP_DecryptFinal_ex(ctx, plaintext.data() + totalLen, &len) != 1)
    {
        EVP_CIPHER_CTX_free(ctx);
        throw runtime_error("DecryptFinal failed (invalid padding or key/iv)");
    }
    totalLen += len;
    plaintext.resize(totalLen);

    EVP_CIPHER_CTX_free(ctx);
    return string((char *)plaintext.data(), plaintext.size());
}

string generateRandomIV()
{
    const size_t size = 16; // AES block size is 16 bytes
    unsigned char iv[32];
    RAND_bytes(iv, size);
    ostringstream oss;
    for (size_t i = 0; i < size; ++i)
        oss << hex << setw(2) << setfill('0') << (int)iv[i];
    return oss.str();
}

int compareStringNumber(const string &a, const string &b)
{
    double A = stod(a);
    double B = stod(b);
    if (A == B)
        return 0;
    return A < B ? -1 : 1;
}

long long hashString(const string &s)
{
    long long hash = 5381;
    for (char c : s)
    {
        hash = ((hash << 5) + hash) + c; // hash * 33 + c
    }
    return hash;
}

int fast_stoi(const char *s)
{
    int x = 0;
    bool neg = false;

    if (*s == '-')
    {
        neg = true;
        ++s;
    }
    else if (*s == '+')
    {
        ++s;
    }

    while (*s)
    {
        x = x * 10 + (*s - '0');
        ++s;
    }

    return neg ? -x : x;
}

bool isValidPrice(double price, const ExchangeInfo &exchangeInfo)
{
    return price >= exchangeInfo.minPrice && price <= exchangeInfo.maxPrice;
}

Route getRoute(const json &j)
{
    // j: {"data":{"id":"1744877970451","value":"Start","type":"start"},"id":"1744877970451","next":[{"data":{"id":"1744877970452","value":"max_rsi(14, 70, 48) >= 80","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970452","next":[{"data":{"id":"1744877982563","value":"macd_n_dinh(12, 26, 9, 6, 8, 0, 2, 0, 5) >= 3","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877982563","next":[{"data":{"id":"1744877970453","value":"ampl(1) >= avg_ampl(25, 0) * 1.8","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970453","next":[{"data":{"id":"1744877970454","value":"change(1) > 0","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970454","next":[{"data":{"id":"1744877970455","value":"change(0) < 0","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970455","next":[{"data":{"id":"1744877970456","value":"close(1) > max_high(100, 2)","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970456","next":[{"data":{"id":"1744877970457","value":"high(0) > max_high(100, 0)","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970457","next":[{"data":{"id":"1744877970458","value":"close(0) >= (open(1) + close(1))/2","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970458","next":[{"data":{"id":"1744877970459","value":"","type":"openSellLimit","unitVolume":"usd","unitEntry":"price","unitTP":"rr","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"1","volume":"5000","entry":"(close(0) + open(0))/2","sl":"high(0)","tp":"3.3","display":"Open SELL Limit. Volume=5000 (USD), Entry=(close(0) + open(0))/2 (USD), TP=3.3 (R), SL=high(0) (USD)"},"id":"1744877970459","next":[]}]}]}]}]}]}]}]}]}]}
    Route route;

    if (j.contains("id"))
        route.id = j["id"].get<string>();

    if (j.contains("data"))
    {
        auto jData = j["data"];
        if (jData.contains("id"))
            route.data.id = jData["id"].get<string>();
        if (jData.contains("type"))
            route.data.type = jData["type"].get<string>();
        if (jData.contains("unitEntry"))
            route.data.unitEntry = jData["unitEntry"].get<string>();
        if (jData.contains("unitExpiredTime"))
            route.data.unitExpiredTime = jData["unitExpiredTime"].get<string>();
        if (jData.contains("unitSL"))
            route.data.unitSL = jData["unitSL"].get<string>();
        if (jData.contains("unitTP"))
            route.data.unitTP = jData["unitTP"].get<string>();
        if (jData.contains("unitStop"))
            route.data.unitStop = jData["unitStop"].get<string>();
        if (jData.contains("unitVolume"))
            route.data.unitVolume = jData["unitVolume"].get<string>();
        if (jData.contains("expiredTime"))
            route.data.expiredTime = jData["expiredTime"].get<string>();
        if (jData.contains("value"))
            route.data.value = jData["value"].get<string>();
        if (jData.contains("stop"))
            route.data.stop = jData["stop"].get<string>();
        if (jData.contains("entry"))
            route.data.entry = jData["entry"].get<string>();
        if (jData.contains("tp"))
            route.data.tp = jData["tp"].get<string>();
        if (jData.contains("sl"))
            route.data.sl = jData["sl"].get<string>();
        if (jData.contains("volume"))
            route.data.volume = jData["volume"].get<string>();
        if (jData.contains("botName"))
            route.data.botName = jData["botName"].get<string>();
        if (jData.contains("symbol"))
            route.data.symbol = jData["symbol"].get<string>();
        if (jData.contains("timeframe"))
            route.data.timeframe = jData["timeframe"].get<string>();
    }

    if (route.data.type != NODE_TYPE::TELEGRAM)
    {
        route.data.value = toLowerCase(route.data.value);
    }
    route.data.stop = toLowerCase(route.data.stop);
    route.data.entry = toLowerCase(route.data.entry);
    route.data.tp = toLowerCase(route.data.tp);
    route.data.sl = toLowerCase(route.data.sl);
    route.data.volume = toLowerCase(route.data.volume);
    route.data.expiredTime = toLowerCase(route.data.expiredTime);

    if (j.contains("next"))
    {
        for (const auto &nextNode : j["next"])
        {
            route.next.push_back(getRoute(nextNode));
        }
    }

    if (route.data.type != NODE_TYPE::START && route.data.type != NODE_TYPE::TELEGRAM && route.data.type != NODE_TYPE::CLOSE_ALL_ORDER && route.data.type != NODE_TYPE::CLOSE_ALL_POSITION)
    {
        string expr = toLowerCase(route.data.value);
        if (!expr.empty())
        {
            cacheInstr(expr);
        }
    }
    return route;
}

shared_ptr<Bot> initBot(map<string, any> &row)
{
    shared_ptr<Bot> bot = make_shared<Bot>();
    bot->symbolExist.max_load_factor(0.5);

    bot->id = any_cast<int>(row.at("id"));
    bot->botName = any_cast<string>(row.at("botName"));
    // bot->treeData = res->getString("treeData");
    bot->userID = any_cast<int>(row.at("userID"));
    bot->timeframes = convertJsonStringArrayToVector(any_cast<string>(row.at("timeframes")));
    bot->idTelegram = split(any_cast<string>(row.at("idTelegram")), ',');
    bot->apiKey = any_cast<string>(row.at("apiKey"));
    bot->secretKey = any_cast<string>(row.at("secretKey"));
    bot->iv = any_cast<string>(row.at("iv"));
    bot->enableRealOrder = any_cast<int>(row.at("enableRealOrder")) == 0 ? false : true;
    bot->maxOpenOrderPerSymbolBot = any_cast<int>(row.at("maxOpenOrderPerSymbolBot"));
    bot->maxOpenOrderAllSymbolBot = any_cast<int>(row.at("maxOpenOrderAllSymbolBot"));
    bot->maxOpenOrderPerSymbolAccount = any_cast<int>(row.at("maxOpenOrderPerSymbolAccount"));
    bot->maxOpenOrderAllSymbolAccount = any_cast<int>(row.at("maxOpenOrderAllSymbolAccount"));

    for (string &id : bot->idTelegram)
    {
        id = trim(id);
    }

    bot->symbolList.clear();
    bot->symbolExist.clear();
    vector<string> symbolList = convertJsonStringArrayToVector(any_cast<string>(row.at("symbolList")));
    for (const string &symbol : symbolList)
    {
        Symbol s;
        vector<string> parts = split(symbol, ':');

        s.broker = parts[0];
        s.symbol = parts[1];
        s.symbolName = symbol;

        bot->symbolList.push_back(s);
        bot->symbolExist.insert(hashString(symbol));
    }

    string routeString = any_cast<string>(row.at("route"));
    json j = json::parse(routeString);
    bot->route = getRoute(j);
    return bot;
}