#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>

#include <boost/asio/ssl/context.hpp>
#include <boost/asio/ssl.hpp>

#include <iostream>
#include <string>

typedef websocketpp::client<websocketpp::config::asio_tls_client> client;

using websocketpp::connection_hdl;
using message_ptr = websocketpp::config::asio_tls_client::message_type::ptr;

// Xử lý tin nhắn đến từ server
void on_message(connection_hdl, message_ptr msg)
{
    std::cout << "📥 Received: " << msg->get_payload() << std::endl;
}

// Xử lý TLS init (bắt buộc khi dùng wss)
std::shared_ptr<boost::asio::ssl::context> on_tls_init(connection_hdl)
{
    auto ctx = std::make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::tlsv12_client);
    ctx->set_default_verify_paths(); // Sử dụng CA mặc định của hệ thống
    return ctx;
}

int main()
{
    client c;

    try
    {
        c.set_access_channels(websocketpp::log::alevel::none);
        c.clear_access_channels(websocketpp::log::alevel::all);

        c.init_asio();
        c.set_message_handler(&on_message);
        c.set_tls_init_handler(&on_tls_init);

        std::string uri = "wss://stream.binance.com:9443/ws/btcusdt@trade";

        websocketpp::lib::error_code ec;
        client::connection_ptr con = c.get_connection(uri, ec);
        if (ec)
        {
            std::cerr << "❌ Connection error: " << ec.message() << std::endl;
            return 1;
        }

        c.connect(con);
        c.run();
    }
    catch (const std::exception &e)
    {
        std::cerr << "⚠️ Exception: " << e.what() << std::endl;
    }

    return 0;
}
