#include <iostream>
#include <string>

#include "common/axios.h"
using namespace std;

int main()
{
    cout << Axios::get("https://fapi.binance.com/fapi/v1/exchangeInfo");
    return 0;
}