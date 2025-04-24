cmake_minimum_required(VERSION 3.10)

project(botfather)

set(CMAKE_CXX_STANDARD 17)
set(ANTLR4_RUNTIME_INCLUDE "${CMAKE_SOURCE_DIR}/src/antlr/include/antlr4-runtime")
set(ANTLR4_RUNTIME_LIB "${CMAKE_SOURCE_DIR}/src/antlr/lib")


if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
    # set(CMAKE_BUILD_TYPE Release)
endif()

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    message(STATUS "Build type: Debug")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g")
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    message(STATUS "Build type: Release")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3")
endif()

find_package(Boost REQUIRED COMPONENTS system)
find_package(OpenSSL REQUIRED)

file(GLOB_RECURSE SOURCES "src/*.cpp")
list(APPEND SOURCES "main.cpp")

add_executable(botfather ${SOURCES})

target_link_libraries(botfather
    Boost::system
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
    tbb
    ${ANTLR4_RUNTIME_LIB}/libantlr4-runtime.so
)

target_include_directories(botfather PRIVATE
    ${ANTLR4_RUNTIME_INCLUDE}
)

set_target_properties(botfather PROPERTIES
    BUILD_RPATH "${ANTLR4_RUNTIME_LIB}"
)