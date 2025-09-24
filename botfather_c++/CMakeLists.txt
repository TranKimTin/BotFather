cmake_minimum_required(VERSION 3.10)

# cache compiler
set(CMAKE_C_COMPILER_LAUNCHER ccache)
set(CMAKE_CXX_COMPILER_LAUNCHER ccache)

project(botfather)

set(CMAKE_CXX_STANDARD 17)


if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
    # set(CMAKE_BUILD_TYPE Release)
endif()

#set debug or release build type
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    message(STATUS "Build type: Debug")
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g -fsanitize=address -fno-omit-frame-pointer")
    set(CMAKE_LINKER_FLAGS_DEBUG "${CMAKE_LINKER_FLAGS_DEBUG} -fsanitize=address")
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    message(STATUS "Build type: Release")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -g -O3 -funroll-loops -march=native -DNDEBUG -fno-omit-frame-pointer")
    set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)
endif()

option(DEBUG_LOG "Enable debug mode" OFF)
if(DEBUG_LOG)
    message(STATUS "Enable debug mode ON")
    add_definitions(-DDEBUG_LOG)
else()
    message(STATUS "Enable debug mode OFF")
endif()

option(LOG_FILE "Enable log file mode" OFF)
if(LOG_FILE)
    message(STATUS "Enable log file mode ON")
    add_definitions(-DLOG_FILE)
else()
    message(STATUS "Enable log file mode OFF")
endif()

#include lib
find_package(Boost REQUIRED COMPONENTS system)
find_package(OpenSSL REQUIRED)
find_package(spdlog REQUIRED)
find_library(
    ANTLR4_LIB antlr4-runtime REQUIRED)
find_library(SIOCLIENT_LIB sioclient REQUIRED)
find_library(SIOCLIENT_TLS_LIB sioclient_tls REQUIRED)

file(GLOB_RECURSE SOURCES "src/*.cpp" "include/common/generated/*.cpp")
list(APPEND SOURCES "main.cpp")

add_executable(botfather ${SOURCES})

set_source_files_properties(src/exchange/binance_future.cpp
    PROPERTIES COMPILE_FLAGS "-O3 -fno-strict-aliasing -fno-lto"
)

message(STATUS "ANTLR4_LIB=${ANTLR4_LIB}")

# remove optimize for OpenSSL::Crypto
add_library(OpenSSL_Crypto_NoLTO INTERFACE IMPORTED)
target_link_libraries(OpenSSL_Crypto_NoLTO INTERFACE OpenSSL::Crypto)
set_property(TARGET OpenSSL_Crypto_NoLTO PROPERTY INTERFACE_INTERPROCEDURAL_OPTIMIZATION FALSE)

target_link_libraries(botfather
    Boost::system
    OpenSSL::SSL
    OpenSSL_Crypto_NoLTO
    pthread
    tbb
    -lhiredis
    mysqlcppconn
    spdlog::spdlog
    ${ANTLR4_LIB}
    ${SIOCLIENT_LIB}
    ${SIOCLIENT_TLS_LIB}
)



file(GLOB_RECURSE HEADER_DIRS RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} "${CMAKE_CURRENT_SOURCE_DIR}/include/*.h")
set(INCLUDE_DIRS "")
foreach(header ${HEADER_DIRS})
    get_filename_component(dir ${header} DIRECTORY)
    list(APPEND INCLUDE_DIRS ${CMAKE_CURRENT_SOURCE_DIR}/${dir})
endforeach()
list(REMOVE_DUPLICATES INCLUDE_DIRS)
message(STATUS "INCLUDE_DIRS=${INCLUDE_DIRS}")

set(LOCAL_INCLUDE_PATHS "/usr/local/include")

target_include_directories(botfather PRIVATE
    ${INCLUDE_DIRS}
    ${LOCAL_INCLUDE_PATHS}
    ${LOCAL_INCLUDE_PATHS}/antlr4-runtime
)

set_target_properties(botfather PROPERTIES
    BUILD_RPATH "${CMAKE_SOURCE_DIR}/lib"
)
