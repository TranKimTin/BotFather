#include "common_type.h"

// string
string toLowerCase(string str);
string trim(const string& s);
bool endsWith(const string &str, const string &suffix);
bool checkFinal(const string &tf, long long startTime, string &currentTF);
long long getStartTime(const string &tf, long long currentTime);
int timeframeToNumberMinutes(const string &tf);
long long timeframeToNumberMiliseconds(const string &tf);
long long timeframeToNumberSeconds(const string &tf);
long long nextTime(long long timestamp, const string &timeframe);
string toTimeString(long long timestampMs);
long long getCurrentTime();
unordered_map<string, string> readEnvFile();
vector<string> split(const string &s, char delimiter);
vector<string> convertJsonStringArrayToVector(string s);
string doubleToString(double value, int precision);

// template must define in header file
template <typename... Args>
string StringFormat(const string &format, Args &&...args)
{
    return fmt::format(format, forward<Args>(args)...);
}


RateData getOHLCVFromRateServer(const string &broker, const string &symbol, const string &timeframe, int limit, int since = 0);
RateData getBinanceOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0);
RateData getBinanceFuturetOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0);
RateData getBybitFutureOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0);
RateData getBybitOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0);
RateData getOkxOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0);

vector<string> getBinanceSymbolList();
vector<string> getBinanceFutureSymbolList();
vector<string> getBybitFutureSymbolList();
vector<string> getBybitSymbolList();
vector<string> getOkxSymbolList();

unordered_map<long long, Digit> getBinanceDigits();
unordered_map<long long, Digit> getBinanceFutureDigits();
unordered_map<long long, Digit> getBybitDigits();
unordered_map<long long, Digit> getBybitFutureDigits();
unordered_map<long long, Digit> getOkxDigits();

string base64Encode(const unsigned char *data, int len);
vector<unsigned char> base64Decode(const string &input);
string encryptAES(const string &plaintext, const string &key, const string &iv);
string decryptAES(const string &ciphertext, const string &key, const string &iv);
string generateRandomIV();

int compareStringNumber(const string &a, const string &b);

long long hashString(const string s);