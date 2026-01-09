#include "custom_indicator.h"
#include "vector_pool.h"

static const int MAX_N = 300;
extern thread_local VectorDoublePool vectorDoublePool;

vector<double> iRSI(int period, const double close[], int n)
{
    vector<double> result = vectorDoublePool.acquire();

    if (n <= period)
        return result;

    double avgGain = 0.0, avgLoss = 0.0;

    for (int i = n - 2; i >= n - 1 - period; --i)
    {
        double diff = close[i] - close[i + 1];
        avgGain += diff > 0 ? diff : 0;
        avgLoss += avgLoss < 0 ? diff : 0;
    }
    avgGain /= period;
    avgLoss /= period;

    result.resize(n - 1 - period);
    for (int i = n - 2 - period; i >= 0; --i)
    {
        double diff = close[i] - close[i + 1];
        double gain = diff > 0 ? diff : 0.0;
        double loss = diff < 0 ? -diff : 0.0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        result[i] = (avgLoss == 0.0) ? 100.0 : (100.0 - (100.0 / (1.0 + avgGain / avgLoss)));
    }

    return result;
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
        avgGain += diff > 0 ? diff : 0;
        avgLoss += avgLoss < 0 ? diff : 0;
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
    return slope / M_PI * 180;
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

vector<double> iMACD(int fastPeriod, int slowPeriod, int signalPeriod, const double close[], int n)
{
    vector<double> result = vectorDoublePool.acquire();

    if (n <= slowPeriod || fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0)
        return result;

    double kFast = 2.0 / (fastPeriod + 1);
    double kSlow = 2.0 / (slowPeriod + 1);
    double kSignal = 2.0 / (signalPeriod + 1);

    double emaFast = close[n - 1];
    double emaSlow = close[n - 1];
    double macd = 0.0;
    double signalEMA = 0.0;

    bool signalInitialized = false;

    result.resize((n - 1) * 3);
    for (int i = n - 2; i >= 0; --i)
    {
        emaFast = (close[i] - emaFast) * kFast + emaFast;
        emaSlow = (close[i] - emaSlow) * kSlow + emaSlow;

        macd = emaFast - emaSlow;

        if (signalInitialized)
        {
            signalEMA = (macd - signalEMA) * kSignal + signalEMA;
        }
        else
        {
            signalEMA = macd;
            signalInitialized = true;
        }

        double histogram = macd - signalEMA;
        result[i * 3] = macd;
        result[i * 3 + 1] = signalEMA;
        result[i * 3 + 2] = histogram;
    }

    return result;
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

int macd_n_dinh(int fastPeriod, int slowPeriod, int signalPeriod, int redDepth, int depth, int enableDivergence, double diffCandle0, vector<double> &diffPercents, const double close[], const double open[], const double high[], int length, const double values[], int valueSize)
{
    int i = 0;
    int cnt = 0;
    int n = 0;
    int indexMaxMACD = i, preIndexMaxMACD = i;
    int indexMaxPrice = i, preIndexMaxPrice = i;

    {
        while (i < valueSize - 1)
        {
            if (values[i * 3] <= 0)
            {
                break;
            };
            if (values[i * 3 + 1] <= 0)
            {
                break;
            };
            if (values[i * 3 + 2] >= 0)
                break;
            if (values[i * 3] > values[indexMaxMACD * 3])
            {
                indexMaxMACD = i;
            }
            if (high[i] > high[indexMaxPrice])
            {
                indexMaxPrice = i;
            }

            double topCandle = max(open[i], close[i]);

            if (i != 0 && (topCandle - high[0]) / topCandle > diffCandle0 / 100)
            {
                return 0;
            }

            i++;
        }

        cnt = 0;
        int check = 0;
        while (i < valueSize - 1)
        {
            if (values[i * 3] <= 0)
            {
                check = 3;
                break;
            }
            if (values[i * 3 + 1] <= 0)
            {
                check = 3;
                break;
            }
            if (values[i * 3 + 2] < 0)
                break;
            if (values[i * 3] > values[indexMaxMACD * 3])
            {
                indexMaxMACD = i;
            }
            if (high[i] > high[indexMaxPrice])
            {
                indexMaxPrice = i;
            }

            double topCandle = max(open[i], close[i]);

            if (i != 0 && (topCandle - high[0]) / topCandle > diffCandle0 / 100)
            {
                return 0;
            }

            cnt++;
            i++;
        }
        if (check == 3)
        {
            while (i < valueSize - 1)
            {
                if (values[i * 3 + 2] < 0)
                    break;
                cnt++;
                if (values[i * 3] > values[indexMaxMACD * 3])
                {
                    indexMaxMACD = i;
                }
                if (high[i] > high[indexMaxPrice])
                {
                    indexMaxPrice = i;
                }

                double topCandle = max(open[i], close[i]);

                if (i != 0 && (topCandle - high[0]) / topCandle > diffCandle0 / 100)
                {
                    return 0;
                }

                i++;
            }
        }

        n++;
        if (cnt < depth)
        {
            n--;
        }
        if (check == 3)
        {
            return n;
        }
    }

    preIndexMaxMACD = i;
    preIndexMaxPrice = i;
    for (; i < valueSize - 1; i++)
    {
        cnt = 0;
        int cntRed = 0;
        int check = 0;
        while (i < valueSize - 1)
        {
            if (values[i * 3] <= 0)
            {
                check = 1;
                break;
            };
            if (values[i * 3 + 1] <= 0)
            {
                check = 1;
                break;
            };
            if (values[i * 3 + 2] >= 0)
                break;
            if (values[i * 3] > values[preIndexMaxMACD * 3])
            {
                preIndexMaxMACD = i;
            }
            if (high[i] > high[preIndexMaxPrice])
            {
                preIndexMaxPrice = i;
            }

            cntRed++;
            i++;
        }

        if (check == 1)
        {
            return n;
        }
        // if (check === 2) {
        //     value = 0;
        //     break;
        // }

        cnt = 0;
        while (i < valueSize - 1)
        {
            if (values[i * 3] <= 0)
            {
                check = 3;
                break;
            }
            if (values[i * 3 + 1] <= 0)
            {
                check = 3;
                break;
            }
            if (values[i * 3 + 2] < 0)
                break;
            if (values[i * 3] > values[preIndexMaxMACD * 3])
            {
                preIndexMaxMACD = i;
            }
            if (high[i] > high[preIndexMaxPrice])
            {
                preIndexMaxPrice = i;
            }

            cnt++;
            i++;
        }

        if (check == 3)
        {
            while (i < valueSize - 1)
            {
                if (values[i * 3 + 2] < 0)
                    break;
                if (values[i * 3] > values[preIndexMaxMACD * 3])
                {
                    preIndexMaxMACD = i;
                }
                if (high[i] > high[preIndexMaxPrice])
                {
                    preIndexMaxPrice = i;
                }

                cnt++;
                i++;
            }
        }
        // console.log({ enableDivergence, preIndexMaxMACD, indexMaxMACD, m1: values[preIndexMaxMACD], m2: values[indexMaxMACD], indexMaxPrice, preIndexMaxPrice, p: data[preIndexMaxPrice], p2: data[indexMaxPrice], diff: diffPercents[0] });

        if (enableDivergence == 1 && values[preIndexMaxMACD * 3] <= values[indexMaxMACD * 3])
        {
            return n;
        }
        if (high[indexMaxPrice] - high[preIndexMaxPrice] <= high[preIndexMaxPrice] * diffPercents[0] / 100)
        {
            return n;
        }
        if (diffPercents.size() > 1)
            diffPercents.erase(diffPercents.begin());
        indexMaxMACD = preIndexMaxMACD;
        indexMaxPrice = preIndexMaxPrice;

        preIndexMaxMACD = i;
        preIndexMaxPrice = i;

        n++;
        if (cnt < depth || cntRed < redDepth)
        {
            n--;
        }

        if (check == 3)
        {
            return n;
        }
    }
    return n;
}

int macd_n_day(int fastPeriod, int slowPeriod, int signalPeriod, int redDepth, int depth, int enableDivergence, double diffCandle0, vector<double> &diffPercents, const double close[], const double open[], const double high[], int length)
{
    vector<double> values = iMACD(fastPeriod, slowPeriod, signalPeriod, close, length);

    return 0;
}

double macd_slope(int fastPeriod, int slowPeriod, int signalPeriod, const double close[], int n)
{
    n = min(n, MAX_N + slowPeriod);

    if (n <= slowPeriod || fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0)
        return 0;

    double kFast = 2.0 / (fastPeriod + 1);
    double kSlow = 2.0 / (slowPeriod + 1);
    double kSignal = 2.0 / (signalPeriod + 1);

    double emaFast = close[n - 1];
    double emaSlow = close[n - 1];
    double macd = 0.0;
    double signalEMA = 0.0;

    bool signalInitialized = false;

    MACD_Output m0;
    MACD_Output m1;
    double sum0 = 0.0;
    double sum1 = 0.0;

    for (int i = n - 2; i >= 0; --i)
    {
        emaFast = (close[i] - emaFast) * kFast + emaFast;
        emaSlow = (close[i] - emaSlow) * kSlow + emaSlow;

        macd = emaFast - emaSlow;

        if (!signalInitialized)
        {
            signalEMA = (macd - signalEMA) * kSignal + signalEMA;
        }
        else
        {
            signalEMA = macd;
            signalInitialized = true;
        }

        if (i == 0)
            m0 = {macd, signalEMA, macd - signalEMA};
        if (i == 1)
            m1 = {macd, signalEMA, macd - signalEMA};

        if (i < slowPeriod)
        {
            sum0 += macd;
        }
        if (i > 0 && i <= slowPeriod)
        {
            sum1 += macd;
        }
    }
    double ma0 = sum0 / slowPeriod;
    double ma1 = sum1 / slowPeriod;

    double diffMACD = m0.macd - m1.macd;
    double diffMASignal = abs(ma0 - ma1);
    double tan = diffMACD / diffMASignal;
    double slope = atan(tan);

    return slope / M_PI * 180;
}

double iAvg(int period, const double close[], int n)
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

double iMin(int period, const double close[], int n)
{
    if (period <= 0 || n < period)
        return 0.0;

    double minVal = close[0];
    for (int i = 1; i < period; ++i)
    {
        minVal = min(minVal, close[i]);
    }
    return minVal;
}

double iMax(int period, const double close[], int n)
{
    if (period <= 0 || n < period)
        return 0.0;

    double maxVal = close[0];
    for (int i = 1; i < period; ++i)
    {
        maxVal = max(maxVal, close[i]);
    }
    return maxVal;
}

double iAvg(int period, int n, function<double(int)> f)
{
    if (period <= 0 || n < period)
        return 0.0;

    double sum = 0.0;
    for (int i = 0; i < period; ++i)
    {
        sum += f(i);
    }
    return sum / period;
}

double iMin(int period, int n, function<double(int)> f)
{
    if (period <= 0 || n < period)
        return 0.0;

    double minVal = f(0);

    for (int i = 1; i < period; ++i)
    {
        minVal = min(minVal, f(i));
    }

    return minVal;
}

double iMax(int period, int n, function<double(int)> f)
{
    if (period <= 0 || n < period)
        return 0.0;

    double maxVal = f(0);

    for (int i = 1; i < period; ++i)
    {
        maxVal = max(maxVal, f(i));
    }

    return maxVal;
}

double iMinRSI(int period, int k, const double close[], int n)
{
    n = min(n, MAX_N + period);

    if (n <= period + k)
        return 0.0;

    double avgGain = 0.0, avgLoss = 0.0;
    double minRSI = 100.0;

    for (int i = n - 2; i >= n - 1 - period; --i)
    {
        double diff = close[i] - close[i + 1];
        avgGain += diff > 0 ? diff : 0;
        avgLoss += avgLoss < 0 ? diff : 0;
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

        if (i < k && avgLoss != 0.0)
        {
            double rs = avgGain / avgLoss;
            minRSI = min(minRSI, 100.0 - (100.0 / (1.0 + rs)));
        }
    }

    return minRSI;
}

double iMaxRSI(int period, int k, const double close[], int n)
{
    n = min(n, MAX_N + period);

    if (n <= period + k)
        return 0.0;

    double avgGain = 0.0, avgLoss = 0.0;
    double maxRSI = 0.0;

    for (int i = n - 2; i >= n - 1 - period; --i)
    {
        double diff = close[i] - close[i + 1];
        avgGain += diff > 0 ? diff : 0;
        avgLoss += avgLoss < 0 ? diff : 0;
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

        if (i < k)
        {
            if (avgLoss != 0.0)
            {
                double rs = avgGain / avgLoss;
                maxRSI = max(maxRSI, 100.0 - (100.0 / (1.0 + rs)));
            }
            else
            {
                maxRSI = 100;
                break;
            }
        }
    }

    return maxRSI;
}
double iAvgRSI(int period, int k, const double close[], int n)
{
    n = min(n, MAX_N + period);

    if (n <= period + k)
        return 0.0;

    double avgGain = 0.0, avgLoss = 0.0;
    double sumRSI = 0.0;

    for (int i = n - 2; i >= n - 1 - period; --i)
    {
        double diff = close[i] - close[i + 1];
        avgGain += diff > 0 ? diff : 0;
        avgLoss += avgLoss < 0 ? diff : 0;
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

        if (i < k)
        {
            if (avgLoss != 0.0)
            {
                double rs = avgGain / avgLoss;
                sumRSI += 100.0 - (100.0 / (1.0 + rs));
            }
            else
            {
                sumRSI += 100.0;
            }
        }
    }

    return sumRSI / k;
}

double iMinMACD(int fastPeriod, int slowPeriod, int signalPeriod, int k, const double close[], int n, function<double(MACD_Output)> f)
{
    n = min(n, MAX_N + slowPeriod + k);

    if (n <= slowPeriod || fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0)
        return INF;

    double kFast = 2.0 / (fastPeriod + 1);
    double kSlow = 2.0 / (slowPeriod + 1);
    double kSignal = 2.0 / (signalPeriod + 1);

    double emaFast = close[n - 1];
    double emaSlow = close[n - 1];
    double macd = 0.0;
    double signalEMA = 0.0;

    bool signalInitialized = false;

    double result = INF;

    for (int i = n - 2; i >= 0; --i)
    {
        emaFast = (close[i] - emaFast) * kFast + emaFast;
        emaSlow = (close[i] - emaSlow) * kSlow + emaSlow;

        macd = emaFast - emaSlow;

        if (signalInitialized)
        {
            signalEMA = (macd - signalEMA) * kSignal + signalEMA;
        }
        else
        {
            signalEMA = macd;
            signalInitialized = true;
        }

        if (i < k)
        {
            result = min(result, f({macd, signalEMA, macd - signalEMA}));
        }
    }

    return result;
}

double iMaxMACD(int fastPeriod, int slowPeriod, int signalPeriod, int k, const double close[], int n, function<double(MACD_Output)> f)
{
    n = min(n, MAX_N + slowPeriod + k);

    if (n <= slowPeriod || fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0)
        return INF;

    double kFast = 2.0 / (fastPeriod + 1);
    double kSlow = 2.0 / (slowPeriod + 1);
    double kSignal = 2.0 / (signalPeriod + 1);

    double emaFast = close[n - 1];
    double emaSlow = close[n - 1];
    double macd = 0.0;
    double signalEMA = 0.0;

    bool signalInitialized = false;

    double result = -INF;

    for (int i = n - 2; i >= 0; --i)
    {
        emaFast = (close[i] - emaFast) * kFast + emaFast;
        emaSlow = (close[i] - emaSlow) * kSlow + emaSlow;

        macd = emaFast - emaSlow;

        if (signalInitialized)
        {
            signalEMA = (macd - signalEMA) * kSignal + signalEMA;
        }
        else
        {
            signalEMA = macd;
            signalInitialized = true;
        }

        if (i < k)
        {
            result = max(result, f({macd, signalEMA, macd - signalEMA}));
        }
    }

    return result;
}
double iAvgMACD(int fastPeriod, int slowPeriod, int signalPeriod, int k, const double close[], int n, function<double(MACD_Output)> f)
{
    n = min(n, MAX_N + slowPeriod + k);

    if (n <= slowPeriod || fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0)
        return 0.0;

    double kFast = 2.0 / (fastPeriod + 1);
    double kSlow = 2.0 / (slowPeriod + 1);
    double kSignal = 2.0 / (signalPeriod + 1);

    double emaFast = close[n - 1];
    double emaSlow = close[n - 1];
    double macd = 0.0;
    double signalEMA = 0.0;

    bool signalInitialized = false;

    double sum = 0;

    for (int i = n - 2; i >= 0; --i)
    {
        emaFast = (close[i] - emaFast) * kFast + emaFast;
        emaSlow = (close[i] - emaSlow) * kSlow + emaSlow;

        macd = emaFast - emaSlow;

        if (signalInitialized)
        {
            signalEMA = (macd - signalEMA) * kSignal + signalEMA;
        }
        else
        {
            signalEMA = macd;
            signalInitialized = true;
        }

        if (i < k)
        {
            sum += f({macd, signalEMA, macd - signalEMA});
        }
    }

    return sum / k;
}