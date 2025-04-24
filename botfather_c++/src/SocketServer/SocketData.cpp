#include "commonType.h"
#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>
#include <boost/asio/ssl/context.hpp>
#include <boost/asio/ssl.hpp>
#include <nlohmann/json.hpp>

typedef websocketpp::client<websocketpp::config::asio_tls_client> WebSocket;
using websocketpp::connection_hdl;
using message_ptr = websocketpp::config::asio_tls_client::message_type::ptr;
using json = nlohmann::json;

void on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    cout << "📥 Received: " << message << endl;
    json j = json::parse(message);
    cout << j["s"] << " " << j["p"] << endl;
}

shared_ptr<boost::asio::ssl::context> on_tls_init(connection_hdl)
{
    auto ctx = make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::tlsv12_client);
    ctx->set_default_verify_paths();
    return ctx;
}

class SocketData
{
protected:
    string broker;
    unordered_map<string, unordered_map<string, vector<RateData>>> gData;
    unordered_map<string, long long> gLastUpdated;
    vector<string> timeframes;
    vector<string> symbolList;
    int symbolLoadConcurrent;
    WebSocket ws;

    virtual void onCloseCandle(string broker, string symbol, string timeframe, vector<RateData> data) = 0;
    virtual vector<RateData> getOHLCV(string symbol, string timeframe, long long since = 0) = 0;
    virtual void init() = 0;

public:
    SocketData()
    {
        ws.set_access_channels(websocketpp::log::alevel::none);
        ws.clear_access_channels(websocketpp::log::alevel::all);

        ws.init_asio();
        ws.set_message_handler(&on_message);
        ws.set_tls_init_handler(&on_tls_init);

        string uri = "wss://stream.binance.com:9443/ws/btcusdt@trade";

        websocketpp::lib::error_code ec;
        WebSocket::connection_ptr con = ws.get_connection(uri, ec);
        if (ec)
        {
            cerr << "❌ Connection error: " << ec.message() << endl;
            return;
        }

        ws.connect(con);
        ws.run();
    }
};