set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

rm -rf build
mkdir build

cmake -S ./ -B ./build -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build ./build -- -j $(nproc)
