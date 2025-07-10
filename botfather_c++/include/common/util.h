#include "common_type.h"

// string
string toLowerCase(string str);
string trim(const string& s);
bool endsWith(const std::string &str, const std::string &suffix);
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
string StringFormat(const char *format, ...);
string doubleToString(double value, int precision);

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

unordered_map<string, Digit> getBinanceDigits();
unordered_map<string, Digit> getBinanceFutureDigits();
unordered_map<string, Digit> getBybitDigits();
unordered_map<string, Digit> getBybitFutureDigits();
unordered_map<string, Digit> getOkxDigits();