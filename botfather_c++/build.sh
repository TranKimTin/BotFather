set -e

rm -rf build
mkdir build

cmake -S ./ -B ./build -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build ./build -- -j $(nproc)
