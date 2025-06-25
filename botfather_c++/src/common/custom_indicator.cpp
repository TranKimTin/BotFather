#include "custom_indicator.h"
const int MAX_N = 300;

double iRSI(int period, const double close[], int n)
{
    n = min(n, MAX_N);

    if (n <= period)
        return NAN;

    double avgGain = 0.0, avgLoss = 0.0;

    for (int i = n - 2; i >= n - 1 - period; --i)
    {
        double diff = close[i] - close[i + 1];
        if (diff > 0)
            avgGain += diff;
        else
            avgLoss -= diff;
    }
    avgGain /= period;
    avgLoss /= period;

    for (int i = n - 2 - period; i >= 0; --i)
    {
        double diff = close[i] - close[i + 1];
        double gain = diff > 0 ? diff : 0.0;
        double loss = diff < 0 ? -diff : 0.0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    if (avgLoss == 0.0)
        return 100.0;
    double rs = avgGain / avgLoss;
    return 100.0 - (100.0 / (1.0 + rs));
}