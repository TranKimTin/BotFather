#include "util.h"
#include "fstream"
#include "axios.h"
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/bio.h>
#include <openssl/buffer.h>

string toLowerCase(string str)
{
    for (auto &c : str)
    {
        c = tolower(c);
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

unordered_map<string, string> readEnvFile()
{
    char exePath[PATH_MAX];
    ssize_t len = readlink("/proc/self/exe", exePath, sizeof(exePath) - 1);
    if (len == -1)
    {
        LOGE("readlink failed");
        throw "readlink failed";
    }
    exePath[len] = '\0';

    filesystem::path exeDir = filesystem::path(exePath).parent_path();
    filesystem::path envPath = exeDir / ".." / ".." / ".env";
    envPath = envPath.lexically_normal();

    ifstream file(envPath);
    if (!file)
    {
        cerr << ".env not found: " << envPath << endl;
        throw runtime_error(".env not found");
    }

    unordered_map<string, string> envMap;
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
            LOGE("Invalid item in JSON array: %s", item.dump().c_str());
        }
    }
    return result;
}

string StringFormat(const char *format, ...)
{
    va_list args;
    va_start(args, format);

    // tạo buffer tạm lớn
    vector<char> buffer(1024);
    int needed = vsnprintf(buffer.data(), buffer.size(), format, args);
    va_end(args);

    if (needed < 0)
        return "";

    if (static_cast<size_t>(needed) < buffer.size())
    {
        return string(buffer.data());
    }
    else
    {
        // nếu buffer chưa đủ lớn, cấp lại
        buffer.resize(needed + 1);
        va_start(args, format);
        vsnprintf(buffer.data(), buffer.size(), format, args);
        va_end(args);
        return string(buffer.data());
    }
}

string doubleToString(double value, int precision)
{
    ostringstream oss;
    oss << fixed << setprecision(precision) << value;
    return oss.str();
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

    string url = StringFormat("https://api.bybit.com/v5/market/kline?category=linear&symbol=%s&interval=%s&limit=%d", symbol.c_str(), tf.c_str(), limit);
    if (since)
        url += StringFormat("&start=%lld", since);

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

    string url = StringFormat("https://api.bybit.com/v5/market/kline?category=spot&symbol=%s&interval=%s&limit=%d", symbol.c_str(), tf.c_str(), limit);
    if (since)
        url += StringFormat("&start=%lld", since);

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
        url = StringFormat("https://www.okx.com/api/v5/market/history-candles?instId=%s&bar=%s&limit=%d&after=%lld", symbol.c_str(), tf.c_str(), limit, since + limit * timeframeToNumberMiliseconds(timeframe));
    }
    else
    {
        url = StringFormat("https://www.okx.com/api/v5/market/candles?instId=%s&bar=%s&limit=%d", symbol.c_str(), tf.c_str(), limit);
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
        symbols.push_back(symbol);
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

unordered_map<string, Digit> getBinanceDigits()
{
    unordered_map<string, Digit> result;

    string url = "https://api.binance.com/api/v1/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);

    json symbols = j["symbols"];
    for (auto &s : symbols)
    {
        if (s["quoteAsset"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        result[symbol].prices = s["baseAssetPrecision"].get<int>();
        result[symbol].volume = s["quotePrecision"].get<int>();
    }
    return result;
}

unordered_map<string, Digit> getBinanceFutureDigits()
{
    unordered_map<string, Digit> result;

    string url = "https://fapi.binance.com/fapi/v1/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);

    json symbols = j["symbols"];
    for (auto &s : symbols)
    {
        if (s["quoteAsset"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        result[symbol].prices = s["pricePrecision"].get<int>();
        result[symbol].volume = s["quantityPrecision"].get<int>();
    }
    return result;
}

unordered_map<string, Digit> getBybitDigits()
{
    unordered_map<string, Digit> result;

    string url = "https://api.bybit.com/v5/market/instruments-info?category=spot";
    string response = Axios::get(url);
    json j = json::parse(response);
    auto list = j["result"]["list"];
    for (const auto &s : list)
    {
        if (s["quoteCoin"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        result[symbol].prices = (int)(-log10(stod(s["priceFilter"]["tickSize"].get<string>())));
        result[symbol].volume = (int)(-log10(stod(s["lotSizeFilter"]["basePrecision"].get<string>())));
    }

    return result;
}
unordered_map<string, Digit> getBybitFutureDigits()
{
    unordered_map<string, Digit> result;

    string url = "https://api.bybit.com/v5/market/instruments-info?category=linear&limit=1000";
    string response = Axios::get(url);
    json j = json::parse(response);
    auto list = j["result"]["list"];
    for (const auto &s : list)
    {
        if (s["quoteCoin"].get<string>() != "USDT")
            continue;

        string symbol = s["symbol"].get<string>();
        result[symbol].prices = (int)(-log10(stod(s["priceFilter"]["tickSize"].get<string>())));
        result[symbol].volume = (int)(-log10(stod(s["lotSizeFilter"]["qtyStep"].get<string>())));
    }

    return result;
}
unordered_map<string, Digit> getOkxDigits()
{
    unordered_map<string, Digit> result;
    string url = "https://www.okx.com/api/v5/public/instruments?instType=SPOT";
    string response = Axios::get(url);
    json j = json::parse(response);
    auto list = j["data"];
    for (const auto &s : list)
    {
        if (s["quoteCcy"].get<string>() != "USDT")
            continue;

        string symbol = s["instId"].get<string>();
        result[symbol].prices = (int)(-log10(stod(s["tickSz"].get<string>())));
        result[symbol].volume = (int)(-log10(stod(s["lotSz"].get<string>())));
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

// Encrypt AES-256-CBC → base64
string encryptAES(const string &plaintext, const string &key, const string &iv)
{
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (!ctx)
        throw runtime_error("Failed to create context");

    if (EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), nullptr,
                           (const unsigned char *)key.data(),
                           (const unsigned char *)iv.data()) != 1)
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

// Decrypt AES-256-CBC ← base64
string decryptAES(const string &ciphertextBase64, const string &key, const string &iv)
{
    vector<unsigned char> ciphertext = base64Decode(ciphertextBase64);
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    if (!ctx)
        throw runtime_error("Failed to create context");

    if (EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), nullptr,
                           (const unsigned char *)key.data(),
                           (const unsigned char *)iv.data()) != 1)
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