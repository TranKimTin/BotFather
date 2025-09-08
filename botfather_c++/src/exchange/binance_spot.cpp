// #include "binance_spot.h"
// #include "axios.h"
// #include "util.h"
// #include "mysql_connector.h"
// #include <openssl/hmac.h>
// #include <openssl/evp.h>

// BinanceSpot::BinanceSpot(const string &encryptedApiKey, const string &encryptedSecretKey, const string &iv, const int botID)
//     : encryptedApiKey(encryptedApiKey), encryptedSecretKey(encryptedSecretKey), iv(iv), botID(botID)
// {
//     boost::unordered_flat_map<string, string> env = readEnvFile();
//     apiKey = decryptAES(encryptedApiKey, env["ENCRYP_KEY"], iv);
//     secretKey = decryptAES(encryptedSecretKey, env["ENCRYP_KEY"], iv);
// }

// string BinanceSpot::buildQuery(const map<string, string> &params)
// {
//     ostringstream oss;
//     bool first = true;
//     for (const auto &[k, v] : params)
//     {
//         if (!first)
//             oss << "&";
//         oss << k << "=" << v;
//         first = false;
//     }
//     return oss.str();
// }

// string BinanceSpot::sign(const string &query)
// {
//     unsigned char *digest;
//     digest = HMAC(EVP_sha256(),
//                   secretKey.c_str(), secretKey.length(),
//                   reinterpret_cast<const unsigned char *>(query.c_str()), query.length(),
//                   NULL, NULL);

//     ostringstream oss;
//     for (int i = 0; i < 32; ++i)
//         oss << hex << setw(2) << setfill('0') << (int)digest[i];
//     return oss.str();
// }

// bool BinanceSpot::changeLeverage(const string &symbol, int leverage)
// {
//     return false;
// }

// bool BinanceSpot::changeMarginType(const string &symbol, const string &marginType)
// {
//     return false;
// }

// string BinanceSpot::buyMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "")
// {
//     string clientOrderId = StringFormat("BFBM{}{}", symbol, getCurrentTime());

//     map<string, string> params = {
//         {"recvWindow", "30000"},
//         {"symbol", symbol},
//         {"side", BUY},
//         {"type", MARKET},
//         {"quantity", quantity},
//         {"newClientOrderId", clientOrderId},
//         {"timestamp", to_string(getCurrentTimestamp())},
//     };


// }