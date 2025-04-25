#include "socket_binance.h"
#include "common_type.h"
#include "axios.h"
#include <tbb/task_group.h>

static tbb::task_group task;

void SocketBinance::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    cout << "📥 Received: " << message << endl;
    json j = json::parse(message);
    //{"e":"trade","E":1745605051063,"s":"BTCUSDT","t":4851805410,"p":"94777.83000000","q":"0.01580000","T":1745605051062,"m":false,"M":true}
    string event = j["e"];
    if (event != "trade")
        return;

    string symbol = j["s"].get<string>();
    double price = stod(j["p"].get<string>());
    double volume = stod(j["q"].get<string>());
    long long timestamp = j["T"].get<long long>();

    cout << symbol << " " << price << " " << timestamp << endl;
}

shared_ptr<boost::asio::ssl::context> SocketBinance::on_tls_init(connection_hdl)
{
    auto ctx = make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::tlsv12_client);
    ctx->set_default_verify_paths();
    return ctx;
}

SocketBinance::SocketBinance()
{
    broker = "binance";
    timeframes = {"1m", "5m", "15m", "30m", "1h", "4h", "1d"};
    symbolList = getSymbolList();

    connectSocket();
}

void SocketBinance::connectSocket()
{
    cout << "socket " << broker << " init" << endl;

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.set_message_handler(std::bind(&SocketBinance::on_message, this,
                                     std::placeholders::_1,
                                     std::placeholders::_2));
    ws.set_tls_init_handler(std::bind(&SocketBinance::on_tls_init, this, std::placeholders::_1));

    string uri = "wss://stream.binance.com:9443/ws/btcusdt@trade";

    websocketpp::lib::error_code ec;
    WebSocket::connection_ptr con = ws.get_connection(uri, ec);
    if (ec)
    {
        cerr << "❌ Connection error: " << ec.message() << endl;
        return;
    }

    ws.connect(con);
    cout << "socket " << broker << " connected" << endl;
    ws.run();
}

vector<string> SocketBinance::getSymbolList()
{
    string url = "https://api.binance.com/api/v3/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    for (const auto &symbol : j["symbols"])
    {
        symbols.push_back(symbol["symbol"]);
    }
    return symbols;
}

RateData SocketBinance::getOHLCV(string &symbol, string &timeframe, int limit, long long since)
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
        rateData.timestamp.push_back(item[0].get<long long>());
        rateData.open.push_back(item[1].get<double>());
        rateData.high.push_back(item[2].get<double>());
        rateData.low.push_back(item[3].get<double>());
        rateData.close.push_back(item[4].get<double>());
        rateData.volume.push_back(item[5].get<double>());
    }

    return rateData;
}
