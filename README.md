# 🧠 Trade Bot Framework

A flexible, extensible C++ framework for building high-performance trading bots across multiple crypto exchanges (Binance, Bybit, OKX, etc.).

![License: MIT-NC](https://img.shields.io/badge/license-MIT--NC-blue.svg)

---

## 🚀 Features

- Connect to multiple exchanges: Binance Futures, Bybit, OKX Spot...
- Real-time market data via WebSocket
- Automated trading strategies
- Dynamic bot management by symbol
- Send notification via telegram

---

### Requirements

- Linux or WSL (Windows Subsystem for Linux)
- CMake ≥ 3.15
- g++ ≥ 9
- MySQL >= 8
- NodeJS >= 8
- Redis >= 5


## 📦 Installation

```bash
$ sudo apt-get update
$ sudo apt-get install -y \
    gdb \
    build-essential \
    libssl-dev \
    libboost-all-dev \
    libwebsocketpp-dev \
    libboost-system-dev \
    libboost-thread-dev \
    nlohmann-json3-dev \
    libtbb-dev \
    cmake \
    ninja-build \
    openjdk-11-jdk \
    ccache \
    libhiredis-dev \
    libmysqlcppconn-dev \
    redis-server

# Set timezone (optional)
$ sudo timedatectl set-timezone Asia/Ho_Chi_Minh
```

## 📂 Environment Variables

Create a `.env` file in the project root with the following keys:

```env
TELEGRAM_TOKEN=            # Telegram bot token for notifications
API_KEY=                   # Exchange API key
SECRET_KEY=                # Exchange secret key

MYSQL_HOST=                # MySQL server hostname (e.g., 127.0.0.1)
MYSQL_USER=                # MySQL username
MYSQL_PASSWORD=            # MySQL password
MYSQL_DATABASE=            # MySQL database name

HOST_WEB_SERVER=           # Internal web server

JWT_SECRET_KEY=            # Secret key for JWT auth
JWT_ALGORITHM=             # JWT algorithm, e.g., HS256

REDIS_USERNAME=            # Redis username (if enabled)
REDIS_PASSWORD=            # Redis password
REDIS_SERVER=              # Redis host (e.g., 127.0.0.1)
REDIS_PORT=                # Redis port (e.g: 6379)
```

## ⚙️ Build and Run

```bash
$ git clone https://github.com/TranKimTin/BotFather.git
$ cd BotFather
$ cd front-end
$ npm install
$ cd ..
$ npm install 
$ npm run build
```

## 📬 Contact

Author: **Tran Kim Tin**  
GitHub: [@TranKimTin](https://github.com/TranKimTin)  
Email: kimtin.tr@gmail.com  
Facebook: [https://www.facebook.com/kimtin.tr](https://www.facebook.com/kimtin.tr)
Telegram: [https://t.me/tk_tin](https//t.me/tk_tin)

Feel free to open an issue or pull request for any bug report or feature request.