set -e

rm -rf antlr4_repo
rm -rf antlr4
git clone https://github.com/antlr/antlr4.git antlr4_repo

cmake -S antlr4_repo/runtime/Cpp -B antlr4_repo/runtime/Cpp/build \
  -DCMAKE_INSTALL_PREFIX="$(pwd)/antlr4" \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_FLAGS_RELEASE="-Ofast -march=native -flto -funroll-loops -DNDEBUG" \
  -DCMAKE_EXE_LINKER_FLAGS_RELEASE="-flto"

cmake --build antlr4_repo/runtime/Cpp/build --parallel $(nproc)
cmake --install antlr4_repo/runtime/Cpp/build

rm -rf antlr4_repo
