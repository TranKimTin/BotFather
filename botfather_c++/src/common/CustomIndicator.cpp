#include "CustomIndicator.h"

RSI::RSI(int period) : period(period), count(0), prevClose(0),
                  avgGain(0), avgLoss(0) {}

double RSI::nextValue(double close)
{
    if (!prevClose)
    {
        prevClose = close;
        count++;
        return 0.0;
    }

    double delta = close - prevClose;
    prevClose = close;

    double gain = delta > 0 ? delta : 0;
    double loss = delta < 0 ? -delta : 0;

    gains.push_back(gain);
    losses.push_back(loss);
    count++;

    if (count < period + 1)
    {
        return 0.0;
    }
    else if (count == period + 1)
    {
        avgGain = std::accumulate(gains.end() - period, gains.end(), 0.0) / period;
        avgLoss = std::accumulate(losses.end() - period, losses.end(), 0.0) / period;
    }
    else
    {
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    if (avgLoss == 0)
    {
        return 100.0;
    }

    double rs = avgGain / avgLoss;
    double rsi = 100.0 - (100.0 / (1.0 + rs));
    return rsi;
}
