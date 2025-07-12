set -e

echo "========== Cloning and building ANTLR4 =========="
if [ ! -d "antlr4" ]; then
  echo "Cloning ANTLR4..."
  git clone https://github.com/antlr/antlr4.git antlr4
else
  echo "ANTLR4 already exists, skipping clone."
fi

echo "Building ANTLR4..."
cmake -S antlr4/runtime/Cpp -B antlr4/runtime/Cpp/build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_FLAGS_RELEASE="-Ofast -march=native -flto -funroll-loops -DNDEBUG" \
  -DCMAKE_EXE_LINKER_FLAGS_RELEASE="-flto"

cmake --build antlr4/runtime/Cpp/build -- -j $(nproc)
cmake --install antlr4/runtime/Cpp/build
echo "✅ ANTLR4 build and installation complete."

echo ""
echo "========== Cloning and building socket.io-client-cpp =========="
if [ ! -d "socket.io-client-cpp" ]; then
  echo "Cloning socket.io-client-cpp..."
  git clone https://github.com/socketio/socket.io-client-cpp.git socket.io-client-cpp
else
  echo "socket.io-client-cpp already exists, skipping clone."
fi

echo "Building socket.io-client-cpp..."
cmake -S socket.io-client-cpp -B socket.io-client-cpp/build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_STANDARD=17 \
  -DCMAKE_CXX_FLAGS_RELEASE="-O3 -march=native -flto -funroll-loops -DNDEBUG" \
  -DCMAKE_EXE_LINKER_FLAGS_RELEASE="-flto"

echo "✅ socket.io-client-cpp build and installation complete."
cmake --build socket.io-client-cpp/build -- -j $(nproc)
cmake --install socket.io-client-cpp/build

echo ""
echo "🎉 All tasks completed successfully."