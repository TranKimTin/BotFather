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
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -g")
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -fsanitize=address -fno-omit-frame-pointer")
    set(CMAKE_LINKER_FLAGS_DEBUG "${CMAKE_LINKER_FLAGS_DEBUG} -fsanitize=address")
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    message(STATUS "Build type: Release")
    set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -Ofast -flto -funroll-loops -march=native -DNDEBUG")
    set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)

endif()

#include lib
find_package(Boost REQUIRED COMPONENTS system)
find_package(OpenSSL REQUIRED)

file(GLOB_RECURSE SOURCES "src/*.cpp" "include/*.cpp")
list(APPEND SOURCES "main.cpp")

add_executable(botfather ${SOURCES})

file(GLOB LIB_FILES "${CMAKE_SOURCE_DIR}/lib/*.so*")
message(STATUS "lib=${LIB_FILES}")
target_link_libraries(botfather
    Boost::system
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
    tbb
    -lhiredis
    mysqlcppconn
    ${LIB_FILES}
)

file(GLOB_RECURSE HEADER_DIRS RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} "${CMAKE_CURRENT_SOURCE_DIR}/include/*.h")
set(INCLUDE_DIRS "")
foreach(header ${HEADER_DIRS})
    get_filename_component(dir ${header} DIRECTORY)
    list(APPEND INCLUDE_DIRS ${CMAKE_CURRENT_SOURCE_DIR}/${dir})
endforeach()
list(REMOVE_DUPLICATES INCLUDE_DIRS)
message(STATUS "INCLUDE_DIRS=${INCLUDE_DIRS}")

file(GLOB EXTERNAL_INCLUDE "${CMAKE_SOURCE_DIR}/external_include/*")
message(STATUS "EXTERNAL_INCLUDE=${EXTERNAL_INCLUDE}")

target_include_directories(botfather PRIVATE
    ${INCLUDE_DIRS}
    ${EXTERNAL_INCLUDE}
)

set_target_properties(botfather PROPERTIES
    BUILD_RPATH "${CMAKE_SOURCE_DIR}/lib"
)
