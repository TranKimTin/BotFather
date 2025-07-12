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