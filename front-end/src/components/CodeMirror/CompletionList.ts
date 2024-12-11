export default [
    {
        type: 'function',
        label: 'abs',
        detail: '(x)',
        apply: 'abs(0)',
        boost: 0,
        info: ` - Giá trị tuyệt đối của x
                - x là số hoặc biểu thức
                Ví dụ:
                + abs(-10) = 10
                + abs(open()-close()) = |giá mở - giá đóng|
                `
    },
    {
        type: 'function',
        label: 'min',
        detail: '(x, y,...)',
        apply: 'min(0, 0)',
        boost: 0,
        info: ` - Giá trị nhỏ nhất trong các tham số truyền vào
                - Mỗi tham số x, y,... là số hoặc biểu thức
                - Các tham số cách nhau bởi dấu ","
                Ví dụ:
                + min(1, 2) = 1
                + min(10, 5, -3) = -3
                + min(close(0), close(1), close(2)) = giá đóng thấp nhất trong 3 nến gần nhất
                `
    },
    {
        type: 'function',
        label: 'max',
        detail: '(x, y,...)',
        apply: 'max(0, 0)',
        boost: 0,
        info: ` - Giá trị lớn nhất trong các tham số truyền vào
                - Mỗi tham số x, y,... là số hoặc biểu thức
                - Các tham số cách nhau bởi dấu ","
                Ví dụ:
                + max(1, 2) = 1
                + max(10, 5, -3) = -3
                + max(close(0), close(1), close(2)) = giá đóng cao nhất trong 3 nến gần nhất
                `
    },
    {
        type: 'function',
        label: 'broker',
        detail: '()',
        apply: 'broker()',
        boost: 0,
        info: ` - Tên sàn hiện tại
                Ví dụ:
                + broker() = 'binance'
                + broker() = 'binance_future'
                `
    },
    {
        type: 'function',
        label: 'symbol',
        detail: '()',
        apply: 'symbol()',
        boost: 0,
        info: ` - Tên cặp token hiện tại
                Ví dụ:
                + symbol() = 'BTCUSDT'
                `
    },
    {
        type: 'function',
        label: 'timeframe',
        detail: '()',
        apply: 'timeframe()',
        boost: 0,
        info: ` - Khung thời gian hiện tại
                - Giá trị: '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'
                Ví dụ:
                + timeframe() = '15m'
                `
    },
    {
        type: 'function',
        label: 'hour',
        detail: '()',
        apply: 'hour()',
        boost: 0,
        info: ` - Giờ gian hiện tại 
                - Giá trị từ 0 - 23
                Ví dụ:
                + hour() = 7
                `
    },
    {
        type: 'function',
        label: 'minute',
        detail: '()',
        apply: 'minute()',
        boost: 0,
        info: ` - Phút gian hiện tại 
                - Giá trị từ 0 - 59
                Ví dụ:
                + minute() = 15
                `
    },
    {
        type: 'function',
        label: 'open',
        detail: '(i)',
        apply: 'open(0)',
        boost: 0,
        info: ` - Giá mở tại nến thứ i
                Ví dụ:
                + open(0) : giá mở nến 0
                + open(1) : giá mở nến 1
                `
    },
    {
        type: 'function',
        label: 'high',
        detail: '(i)',
        apply: 'high(0)',
        boost: 0,
        info: ` - Giá đỉnh tại nến thứ i
                Ví dụ:
                + high(0) : giá đỉnh nến 0
                + high(1) : giá đỉnh nến 1
                `
    },
    {
        type: 'function',
        label: 'low',
        detail: '(i)',
        apply: 'low(0)',
        boost: 0,
        info: ` - Giá đáy tại nến thứ i
                Ví dụ:
                + low(0) : giá đáy nến 0
                + low(1) : giá đáy nến 1
                `
    },
    {
        type: 'function',
        label: 'close',
        detail: '(i)',
        apply: 'close(0)',
        boost: 0,
        info: ` - Giá đóng tại nến thứ i
                Ví dụ:
                + close(0) : giá đóng nến 0
                + close(1) : giá đóng nến 1
                `
    },
    {
        type: 'function',
        label: 'volume',
        detail: '(i)',
        apply: 'volume(0)',
        boost: 0,
        info: ` - Khối lượng giao dịch tại nến thứ i
                - Đơn vị: token
                Ví dụ:
                + volume(0) : Khối lượng giao dịch nến 0
                + volume(1) : Khối lượng giao dịch nến 1
                + volume(0) * close(0): Khối lượng giao dịch tính theo USDT
                `
    },
    {
        type: 'function',
        label: 'volume24h_in_usd',
        detail: '()',
        apply: 'volume24h_in_usd()',
        boost: 0,
        info: ` - Khối lượng giao dịch trong 24h gần nhất
                - Đơn vị: token
                Ví dụ:
                + volume24h_in_usd()
                `
    },
    {
        type: 'function',
        label: 'change',
        detail: '(i)',
        apply: 'change(0)',
        boost: 0,
        info: ` - Thay đổi giá nến thứ i
                - Công thức: change() = close() - open()
                - Đơn vị: USDT
                Ví dụ:
                + change(0) : thay đổi giá nến 0 (USDT)
                + change(1) : thay đổi giá nến 1 (USDT)
                `
    },
    {
        type: 'function',
        label: 'change%',
        detail: '(i)',
        apply: 'change%(0)',
        boost: 0,
        info: ` - Thay đổi giá nến thứ i
                - Công thức: change%() = (close() - open()) / open() * 100
                - Đơn vị: %
                Ví dụ:
                + change%(0) : thay đổi giá nến 0 (%)
                + change%(1) : thay đổi giá nến 1 (%)
                `
    },
    {
        type: 'function',
        label: 'ampl',
        detail: '(i)',
        apply: 'ampl(0)',
        boost: 0,
        info: ` - Biên độ giá nến thứ i
                - Công thức: ampl() = high() - low()
                - Đơn vị: USDT
                Ví dụ:
                + ampl(0) : biên độ giá nến 0 (USDT)
                + ampl(1) : biên độ giá nến 1 (USDT)
                `
    },
    {
        type: 'function',
        label: 'ampl%',
        detail: '(i)',
        apply: 'ampl%(0)',
        boost: 0,
        info: ` - Biên độ giá nến thứ i
                - Công thức: ampl() = (high() - low()) / open() * 100
                - Đơn vị: %
                Ví dụ:
                + ampl%(0) : biên độ giá nến 0 (%)
                + ampl%(1) : biên độ giá nến 1 (%)
                `
    },
    {
        type: 'function',
        label: 'upper_shadow',
        detail: '(i)',
        apply: 'upper_shadow(0)',
        boost: 0,
        info: ` - Râu trên nến thứ i
                - Công thức: upper_shadow() = high() - max(open(), close())
                - Đơn vị: USDT
                Ví dụ:
                + upper_shadow(0) : râu trên nến 0 (USDT)
                + upper_shadow(1) : râu trên nến 1 (USDT)
                `
    },
    {
        type: 'function',
        label: 'upper_shadow%',
        detail: '(i)',
        apply: 'upper_shadow%(0)',
        boost: 0,
        info: ` - Râu trên nến thứ i
                - Công thức: upper_shadow() = (high() - max(open(), close())) / open() * 100
                - Đơn vị: %
                Ví dụ:
                + upper_shadow%(0) : râu trên nến 0 (%)
                + upper_shadow%(1) : râu trên nến 1 (%)
                `
    },
    {
        type: 'function',
        label: 'lower_shadow',
        detail: '(i)',
        apply: 'lower_shadow(0)',
        boost: 0,
        info: ` - Râu dưới nến thứ i
                - Công thức: lower_shadow() = min(open(), close()) - low()
                - Đơn vị: USDT
                Ví dụ:
                + lower_shadow(0) : râu dưới nến 0 (USDT)
                + lower_shadow(1) : râu dưới nến 1 (USDT)
                `
    },
    {
        type: 'function',
        label: 'lower_shadow%',
        detail: '(i)',
        apply: 'lower_shadow%(0)',
        boost: 0,
        info: ` - Râu dưới nến thứ i
                - Công thức: lower_shadow() = (min(open(), close()) - low()) / open() * 100
                - Đơn vị: %
                Ví dụ:
                + lower_shadow%(0) : râu dưới nến 0 (%)
                + lower_shadow%(1) : râu dưới nến 1 (%)
                `
    },
    {
        type: 'function',
        label: 'rsi',
        detail: '(period, i)',
        apply: 'rsi(14, 0)',
        boost: 0,
        info: ` - Chỉ số sức mạnh tương đối RSI tại nến thứ i (Relative Strength Index)
                - period: số nến để tính RSI
                - Giá trị từ 0 - 100
                Ví dụ:
                + rsi(14, 0) : RSI tại nến 0
                + rsi(14, 1) : RSI tại nến 1
                `
    },
    {
        type: 'function',
        label: 'rsi_slope',
        detail: '(period, i)',
        apply: 'rsi_slope(14, 0)',
        boost: 0,
        info: ` - Góc của đường RSI tại nến thứ i
                - period: số nến để tính RSI
                - Giá trị từ -90 đến 90 độ
                - Công thức: góc giữa đường RSI và cạnh song song với trục x có độ dài 3
                Ví dụ:
                + rsi(14, 0) : RSI tại nến 0
                + rsi(14, 1) : RSI tại nến 1
                `
    },
    {
        type: 'function',
        label: 'ma',
        detail: '(period, i)',
        apply: 'ma(14, 0)',
        boost: 0,
        info: ` - Đường trung bình động MA tại nến thứ i (Moving Average)
                - period: số nến để tính MA
                - Công thức: trung bình giá đóng của của <period> nến gần nhất
                Ví dụ:
                + ma(14, 0) : MA tại nến 0
                + ma(14, 1) : MA tại nến 1
                `
    },
    {
        type: 'function',
        label: 'ema',
        detail: '(period, i)',
        apply: 'ema(14, 0)',
        boost: 0,
        info: ` - Đường trung bình động hàm mũ EMA tại nến thứ i (Exponential Moving Average)
                - period: số nến để tính EMA
                Ví dụ:
                + ma(14, 0) : MA tại nến 0
                + ma(14, 1) : MA tại nến 1
                `
    },
    {
        type: 'function',
        label: 'macd_value',
        detail: '(fastPeriod, slowPeriod, signalPeriod, i)',
        apply: 'macd_value(12, 26, 9, 0)',
        boost: 0,
        info: ` - Đường trung bình động hội tụ phân kỳ MACD tại nến thứ i (Moving Average Convergence Divergence)
                - Trả về giá trị MACD
                - fastPeriod: Số nến đường nhanh để tính giá trị MACD
                - slowPeriod: Số nến đường chậm để tính giá trị MACD
                - signalPeriod: Số nến tính đường Signal MACD
                Ví dụ:
                + macd_value(14, 0) : MACD tại nến 0
                + macd_value(14, 1) : MACD tại nến 1
                `
    },
    {
        type: 'function',
        label: 'macd_signal',
        detail: '(fastPeriod, slowPeriod, signalPeriod, i)',
        apply: 'macd_signal(12, 26, 9, 0)',
        boost: 0,
        info: ` - Đường trung bình động hội tụ phân kỳ MACD tại nến thứ i (Moving Average Convergence Divergence)
                - Trả về giá trị Signal
                - fastPeriod: Số nến đường nhanh để tính giá trị MACD
                - slowPeriod: Số nến đường chậm để tính giá trị MACD
                - signalPeriod: Số nến tính đường Signal MACD
                Ví dụ:
                + macd_signal(14, 0) : Signal tại nến 0
                + macd_signal(14, 1) : Signal tại nến 1
                `
    },
    {
        type: 'function',
        label: 'macd_histogram',
        detail: '(fastPeriod, slowPeriod, signalPeriod, i)',
        apply: 'macd_histogram(12, 26, 9, 0)',
        boost: 0,
        info: ` - Đường trung bình động hội tụ phân kỳ MACD tại nến thứ i (Moving Average Convergence Divergence)
                - Trả về giá trị Histogram
                - fastPeriod: Số nến đường nhanh để tính giá trị MACD
                - slowPeriod: Số nến đường chậm để tính giá trị MACD
                - signalPeriod: Số nến tính đường Signal MACD
                Ví dụ:
                + macd_histogram(14, 0) : Histogram tại nến 0
                + macd_histogram(14, 1) : Histogram tại nến 1
                `
    },
];