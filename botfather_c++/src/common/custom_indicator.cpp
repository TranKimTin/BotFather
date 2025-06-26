#include "custom_indicator.h"

static const int MAX_N = 300;

double iRSI(int period, const double close[], int n)
{
    n = min(n, MAX_N + period);

    if (n <= period)
        return 0.0;

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

double iRSI_slope(int period, const double close[], int n)
{
    n = min(n, MAX_N + period);

    if (n <= period)
        return 0.0;

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

    for (int i = n - 2 - period; i >= 1; --i)
    {
        double diff = close[i] - close[i + 1];
        double gain = diff > 0 ? diff : 0.0;
        double loss = diff < 0 ? -diff : 0.0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    double rsi0, rsi1;

    if (avgLoss == 0.0)
    {
        rsi1 = 100.0;
    }
    else
    {
        double rs = avgGain / avgLoss;
        rsi1 = 100.0 - (100.0 / (1.0 + rs));
    }

    {
        double diff = close[0] - close[1];
        double gain = diff > 0 ? diff : 0.0;
        double loss = diff < 0 ? -diff : 0.0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    if (avgLoss == 0.0)
    {
        rsi0 = 100.0;
    }
    else
    {
        double rs = avgGain / avgLoss;
        rsi0 = 100.0 - (100.0 / (1.0 + rs));
    }

    double diffRSI = rsi0 - rsi1;
    double wide = 3.0;
    double tan = diffRSI / wide;
    double slope = atan(tan);
    return round(slope / M_PI * 180);
}

double iMA(int period, const double close[], int n)
{
    if (period <= 0 || n < period)
        return 0.0;

    double sum = 0.0;
    for (int i = 0; i < period; ++i)
    {
        sum += close[i];
    }
    return sum / period;
}

double iEMA(int period, const double close[], int n)
{
    n = min(n, MAX_N + period);

    if (n <= 0 || period <= 0)
        return 0.0;

    double k = 2.0 / (period + 1);

    double ema = close[n - 1];

    for (int i = n - 2; i >= 0; --i)
    {
        ema = close[i] * k + ema * (1 - k);
    }

    return ema;
}

MACD_Output iMACD(int fastPeriod, int slowPeriod, int signalPeriod, const double close[], int n)
{
    n = min(n, MAX_N + slowPeriod);

    if (n <= slowPeriod || fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0)
        return {0.0, 0.0, 0.0};

    double kFast = 2.0 / (fastPeriod + 1);
    double kSlow = 2.0 / (slowPeriod + 1);
    double kSignal = 2.0 / (signalPeriod + 1);

    double emaFast = close[n - 1];
    double emaSlow = close[n - 1];
    double macd = 0.0;
    double signalEMA = 0.0;

    bool signalInitialized = false;

    for (int i = n - 2; i >= 0; --i)
    {
        emaFast = (close[i] - emaFast) * kFast + emaFast;
        emaSlow = (close[i] - emaSlow) * kSlow + emaSlow;

        macd = emaFast - emaSlow;

        if (!signalInitialized)
        {
            signalEMA = macd;
            signalInitialized = true;
        }
        else
        {
            signalEMA = (macd - signalEMA) * kSignal + signalEMA;
        }
    }

    double histogram = macd - signalEMA;

    return {macd, signalEMA, histogram};
}

BB_Output iBB(int period, double stdDev, const double close[], int n)
{
    if (n < period || period <= 0 || stdDev < 0)
        return {0.0, 0.0, 0.0};

    double sum = 0.0;
    for (int i = 0; i < period; ++i)
    {
        sum += close[i];
    }

    double mean = sum / period;

    double variance = 0.0;
    for (int i = 0; i < period; ++i)
    {
        double diff = close[i] - mean;
        variance += diff * diff;
    }

    variance /= period;
    double std = sqrt(variance);

    double upper = mean + stdDev * std;
    double lower = mean - stdDev * std;

    return {lower, mean, upper};
}