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

## 🖥️ Requirements

- Ubuntu 24.04+ or WSL 2 (Ubuntu 24.04+)
- CMake ≥ 3.15
- g++ ≥ 9
- MySQL >= 8
- NodeJS >= 18
- TypeScript >=5
- Redis >= 5
- OpenJDK >= 11


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
    rapidjson-dev \
    libasio-dev

# Set timezone (optional)
$ sudo timedatectl set-timezone Asia/Ho_Chi_Minh
```

## 📦 Setup local database (optional)

```bash
# Install redis
$ sudo apt install redis-server -y

# Set redis password
$ sudo sed -i "s/^# *requirepass .*$/requirepass yourPasswordHere/" /etc/redis/redis.conf
$ sudo systemctl restart redis

# Install mysql
$ sudo apt install mysql-server -y
$ sudo mysql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_strong_password';
mysql> FLUSH PRIVILEGES;
mysql> exit;

# Allow remote access (optional)
$ sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
nano> replace "bind-address = 127.0.0.1" to "bind-address = 0.0.0.0"
$ mysql -u root -p
mysql> CREATE USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'your_strong_password';
mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'your_strong_password';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
mysql> exit;

# Restart mysql
$ sudo systemctl restart mysql
``

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
$ cd botfather_c++/lib
$ sudo sh install.sh
$ cd ..
$ sudo sh build.sh
```

## 📬 Contact

Author: **Tran Kim Tin**  
GitHub: [@TranKimTin](https://github.com/TranKimTin)  
Email: kimtin.tr@gmail.com  
Facebook: [https://www.facebook.com/kimtin.tr](https://www.facebook.com/kimtin.tr)  
Telegram: [@tk_tin](https://t.me/tk_tin)

Feel free to open an issue or pull request for any bug report or feature request.