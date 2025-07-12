set -e

if [ ! -d "antlr4" ]; then
  git clone https://github.com/antlr/antlr4.git antlr4
fi

cmake -S antlr4/runtime/Cpp -B antlr4/runtime/Cpp/build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_FLAGS_RELEASE="-Ofast -march=native -flto -funroll-loops -DNDEBUG" \
  -DCMAKE_EXE_LINKER_FLAGS_RELEASE="-flto"

cmake --build antlr4/runtime/Cpp/build --parallel $(nproc)
cmake --install antlr4/runtime/Cpp/build



if [ ! -d "socket.io-client-cpp" ]; then
  git clone https://github.com/socketio/socket.io-client-cpp.git socket.io-client-cpp
fi

cmake -S socket.io-client-cpp -B socket.io-client-cpp/build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_FLAGS_RELEASE="-O3 -march=native -flto -funroll-loops -DNDEBUG" \
  -DCMAKE_EXE_LINKER_FLAGS_RELEASE="-flto"

cmake --build socket.io-client-cpp/build --parallel $(nproc)
cmake --install socket.io-client-cpp/build