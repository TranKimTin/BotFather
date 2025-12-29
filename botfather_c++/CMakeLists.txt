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
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -g -Ofast -flto -funroll-loops -march=native -DNDEBUG -fno-omit-frame-pointer")
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
find_package(ZLIB REQUIRED)
find_library(ANTLR4_LIB antlr4-runtime REQUIRED)
find_library(SIOCLIENT_LIB sioclient REQUIRED)
find_library(SIOCLIENT_TLS_LIB sioclient_tls REQUIRED)
find_library(MINIZIP_LIB minizip)
if (NOT MINIZIP_LIB)
    message(FATAL_ERROR "minizip not found")
endif()

file(GLOB_RECURSE SOURCES "src/*.cpp" "include/common/generated/*.cpp")

message(STATUS "ANTLR4_LIB=${ANTLR4_LIB}")

add_library(botfather_core ${SOURCES})

target_link_libraries(botfather_core PUBLIC
    Boost::system
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
    tbb
    -lhiredis
    mysqlcppconn
    spdlog::spdlog
    ZLIB::ZLIB
    ${MINIZIP_LIB}
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

target_include_directories(botfather_core PUBLIC
    ${INCLUDE_DIRS}
    ${LOCAL_INCLUDE_PATHS}
    ${LOCAL_INCLUDE_PATHS}/antlr4-runtime
)

function(add_botfather_exe name main_file)
    add_executable(${name} ${main_file})
    target_link_libraries(${name} botfather_core)
    set_target_properties(${name} PROPERTIES
        BUILD_RPATH "${CMAKE_SOURCE_DIR}/lib"
    )
endfunction()

add_botfather_exe(botfather main.cpp)
add_botfather_exe(backtest main_backtest.cpp)