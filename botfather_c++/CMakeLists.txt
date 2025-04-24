cmake_minimum_required(VERSION 3.10)

project(botfather)

set(CMAKE_CXX_STANDARD 17)


if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
    # set(CMAKE_BUILD_TYPE Release)
endif()

#set debug or release build type
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    message(STATUS "Build type: Debug")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g")
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    message(STATUS "Build type: Release")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3")
endif()

#include lib
find_package(Boost REQUIRED COMPONENTS system)
find_package(OpenSSL REQUIRED)

file(GLOB_RECURSE SOURCES "src/*.cpp" "include/*.cpp")
list(APPEND SOURCES "main.cpp")

add_executable(botfather ${SOURCES})

target_link_libraries(botfather
    Boost::system
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
    tbb
    ${CMAKE_SOURCE_DIR}/lib/libantlr4-runtime.so.4.13.2
)

file(GLOB_RECURSE HEADER_DIRS RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} "${CMAKE_CURRENT_SOURCE_DIR}/include/*.h")

set(INCLUDE_DIRS "")
foreach(header ${HEADER_DIRS})
    get_filename_component(dir ${header} DIRECTORY)
    list(APPEND INCLUDE_DIRS ${CMAKE_CURRENT_SOURCE_DIR}/${dir})
endforeach()

list(REMOVE_DUPLICATES INCLUDE_DIRS)

target_include_directories(botfather PRIVATE
    ${CMAKE_SOURCE_DIR}/external_include/antlr4-runtime
    ${INCLUDE_DIRS}
)

set_target_properties(botfather PROPERTIES
    BUILD_RPATH "${CMAKE_SOURCE_DIR}/lib"
)