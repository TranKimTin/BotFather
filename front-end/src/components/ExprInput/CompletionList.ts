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
        detail: '(fast, slow, signal, i)',
        apply: 'macd_value(12, 26, 9, 0)',
        boost: 0,
        info: ` - Đường trung bình động hội tụ phân kỳ MACD tại nến thứ i (Moving Average Convergence Divergence)
                - Trả về giá trị MACD
                - fast: Số nến đường nhanh để tính giá trị MACD
                - slow: Số nến đường chậm để tính giá trị MACD
                - signal: Số nến tính đường Signal MACD
                Ví dụ:
                + macd_value(14, 0) : MACD tại nến 0
                + macd_value(14, 1) : MACD tại nến 1
                `
    },
    {
        type: 'function',
        label: 'macd_signal',
        detail: '(fast, slow, signal, i)',
        apply: 'macd_signal(12, 26, 9, 0)',
        boost: 0,
        info: ` - Đường trung bình động hội tụ phân kỳ MACD tại nến thứ i (Moving Average Convergence Divergence)
                - Trả về giá trị Signal
                - fast: Số nến đường nhanh để tính giá trị MACD
                - slow: Số nến đường chậm để tính giá trị MACD
                - signal: Số nến tính đường Signal MACD
                Ví dụ:
                + macd_signal(14, 0) : Signal tại nến 0
                + macd_signal(14, 1) : Signal tại nến 1
                `
    },
    {
        type: 'function',
        label: 'macd_histogram',
        detail: '(fast, slow, signal, i)',
        apply: 'macd_histogram(12, 26, 9, 0)',
        boost: 0,
        info: ` - Đường trung bình động hội tụ phân kỳ MACD tại nến thứ i (Moving Average Convergence Divergence)
                - Trả về giá trị Histogram
                - fast: Số nến đường nhanh để tính giá trị MACD
                - slow: Số nến đường chậm để tính giá trị MACD
                - signal: Số nến tính đường Signal MACD
                Ví dụ:
                + macd_histogram(14, 0) : Histogram tại nến 0
                + macd_histogram(14, 1) : Histogram tại nến 1
                `
    },
    {
        type: 'function',
        label: 'bb_upper',
        detail: '(period, multiplier, i)',
        apply: 'bb_upper(20, 2, 0)',
        boost: 0,
        info: ` - Đường Bollinger Band (BB) tại nến thứ i
                - Trả về giá trị đường BB phía trên
                - period: Số nến để tính giá trị BB
                - multiplier: Bội số BB
                Ví dụ:
                + bb_upper(20, 2, 0) : BB trên tại nến 0
                + bb_upper(20, 2, 1) : BB trên tại nến 1
                `
    },
    {
        type: 'function',
        label: 'bb_middle',
        detail: '(period, multiplier, i)',
        apply: 'bb_middle(20, 2, 0)',
        boost: 0,
        info: ` - Đường Bollinger Band (BB) tại nến thứ i
                - Trả về giá trị đường BB ở giữa
                - period: Số nến để tính giá trị BB
                - multiplier: Bội số BB
                Ví dụ:
                + bb_middle(20, 2, 0) : BB giữa tại nến 0
                + bb_middle(20, 2, 1) : BB giữa tại nến 1
                `
    },
    {
        type: 'function',
        label: 'bb_lower',
        detail: '(period, multiplier, i)',
        apply: 'bb_lower(20, 2, 0)',
        boost: 0,
        info: ` - Đường Bollinger Band (BB) tại nến thứ i
                - Trả về giá trị đường BB phía dưới
                - period: Số nến để tính giá trị BB
                - multiplier: Bội số BB
                Ví dụ:
                + bb_lower(20, 2, 0) : BB dưới tại nến 0
                + bb_lower(20, 2, 1) : BB dưới tại nến 1
                `
    },
    {
        type: 'function',
        label: 'macd_n_dinh',
        detail: '(fast, slow, signal,...)',
        apply: 'macd_n_dinh(12, 26, 9, 15, 15, 0, 0.5, 0, 0)',
        boost: 0,
        info: ` - Chỉ báo tự bịa ra, quên mất nó như nào rồi
                `
    },
    {
        type: 'function',
        label: 'macd_slope',
        detail: '(fast, slow, signal, i)',
        apply: 'macd_slope(12, 26, 9, 0)',
        boost: 0,
        info: ` - Góc giữa đường MACD Value và đường trung bình MACD Value (slow nến) tại nến thứ i
                - fast: Số nến đường nhanh để tính giá trị MACD
                - slow: Số nến đường chậm để tính giá trị MACD
                - signal: Số nến tính đường Signal MACD
                - Giá trị từ -90 đến 90 độ
                Ví dụ:
                + macd_slope(12, 26, 9, 0): Góc đường MACD Value tại nến 0
                + macd_slope(12, 26, 9, 1): Góc đường MACD Value tại nến 1
                `
    },
    {
        type: 'function',
        label: 'bullish_engulfing',
        detail: '(i)',
        apply: 'bullish_engulfing(0)',
        boost: 0,
        info: ` - Có xuất hiện mô hình nến bullish_engulfing tại nến thứ i không?
                - Xuất hiện: trả về 1
                - Không xuất hiện: trả về 0
                Ví dụ:
                + bullish_engulfing(0): Tại nến 0 có xuất hiện mô hình nến bullish_engulfing không
                + bullish_engulfing(1): Tại nến 1 có xuất hiện mô hình nến bullish_engulfing không
                `
    },
    {
        type: 'function',
        label: 'bearish_engulfing',
        detail: '(i)',
        apply: 'bearish_engulfing(0)',
        boost: 0,
        info: ` - Có xuất hiện mô hình nến bearish_engulfing tại nến thứ i không?
                - Xuất hiện: trả về 1
                - Không xuất hiện: trả về 0
                Ví dụ:
                + bearish_engulfing(0): Tại nến 0 có xuất hiện mô hình nến bearish_engulfing không
                + bearish_engulfing(1): Tại nến 1 có xuất hiện mô hình nến bearish_engulfing không
                `
    },
    {
        type: 'function',
        label: 'bullish_hammer',
        detail: '(i)',
        apply: 'bullish_hammer(0)',
        boost: 0,
        info: ` - Có xuất hiện mô hình nến bullish_hammer tại nến thứ i không? (Nến búa tăng)
                - Xuất hiện: trả về 1
                - Không xuất hiện: trả về 0
                Ví dụ:
                + bullish_hammer(0) = 1: xuất hiện bullish_hammer tại nến 0
                + bullish_hammer(1) = 0: không xuất hiện bullish_hammer tại nến 1
                `
    },
    {
        type: 'function',
        label: 'bearish_hammer',
        detail: '(i)',
        apply: 'bearish_hammer(0)',
        boost: 0,
        info: ` - Có xuất hiện mô hình nến bearish_hammer tại nến thứ i không? (Nến búa giảm)
                - Xuất hiện: trả về 1
                - Không xuất hiện: trả về 0
                Ví dụ:
                + bearish_hammer(0) = 1: xuất hiện bearish_hammer tại nến 0
                + bearish_hammer(1) = 0: không xuất hiện bearish_hammer tại nến 1
                `
    },
    {
        type: 'function',
        label: 'marsi',
        detail: '(period, from, to)',
        apply: 'marsi(14, 14, 0)',
        boost: 0,
        info: ` - Rsi trung bình từ nến from đến nến to
                - period: số nến để tính rsi
                - Giá trị từ 0 - 100
                Ví dụ:
                + marsi(14, 20, 0): trung bình rsi(14) từ nến 0 đến 20
                + marsi(14, 15, 10): trung bình rsi(14) nến 10 đến 15
                + marsi(14, 10, 15): trung bình rsi(14) nến 10 đến 15
                `
    },
    {
        type: 'function',
        label: 'doji',
        detail: '(i)',
        apply: 'doji(0)',
        boost: 0,
        info: ` - Có xuất hiện mô hình nến doji tại nến thứ i không?
                - Xuất hiện: trả về 1
                - Không xuất hiện: trả về 0
                Ví dụ:
                + doji(0) = 1: xuất hiện doji tại nến 0
                + doji(1) = 0: không xuất hiện doji tại nến 1
                `
    },
    {
        type: 'function',
        label: 'avg_open',
        detail: '(from, to)',
        apply: 'avg_open(0, 10)',
        boost: 0,
        info: ` - Giá mở trung bình trong từ nến from đến nến to
                Ví dụ:
                + avg_open(0, 10): Giá mở trung bình từ nến 0 đến nến 10
                + avg_open(15, 20): Giá mở trung bình từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'avg_high',
        detail: '(from, to)',
        apply: 'avg_high(0, 10)',
        boost: 0,
        info: ` - Giá đỉnh trung bình trong từ nến from đến nến to
                Ví dụ:
                + avg_high(0, 10): Giá đỉnh trung bình từ nến 0 đến nến 10
                + avg_high(15, 20): Giá đỉnh trung bình từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'avg_low',
        detail: '(from, to)',
        apply: 'avg_low(0, 10)',
        boost: 0,
        info: ` - Giá đáy trung bình trong từ nến from đến nến to
                Ví dụ:
                + avg_low(0, 10): Giá đáy trung bình từ nến 0 đến nến 10
                + avg_low(15, 20): Giá đáy trung bình từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'avg_close',
        detail: '(from, to)',
        apply: 'avg_close(0, 10)',
        boost: 0,
        info: ` - Giá đóng trung bình trong từ nến from đến nến to
                Ví dụ:
                + avg_close(0, 10): Giá đóng trung bình từ nến 0 đến nến 10
                + avg_close(15, 20): Giá đóng trung bình từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'avg_ampl',
        detail: '(from, to)',
        apply: 'avg_ampl(0, 10)',
        boost: 0,
        info: ` - Biên độ trung bình trong từ nến from đến nến to
                - Đơn vị: USDT
                Ví dụ:
                + avg_ampl(0, 10): Biên độ trung bình từ nến 0 đến nến 10
                + avg_ampl(15, 20): Biên độ trung bình từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'avg_ampl%',
        detail: '(from, to)',
        apply: 'avg_ampl%(0, 10)',
        boost: 0,
        info: ` - Biên độ trung bình trong từ nến from đến nến to
                - Đơn vị: %
                Ví dụ:
                + avg_ampl(0, 10): Biên độ trung bình từ nến 0 đến nến 10
                + avg_ampl(15, 20): Biên độ trung bình từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_open',
        detail: '(from, to)',
        apply: 'max_open(0, 10)',
        boost: 0,
        info: ` - Giá mở cao nhất từ nến from đến nến to
                Ví dụ:
                + max_open(0, 10): Giá mở cao nhất từ nến 0 đến 10
                + max_open(15, 20): Giá mở cao nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_high',
        detail: '(from, to)',
        apply: 'max_high(0, 10)',
        boost: 0,
        info: ` - Giá đỉnh cao nhất từ nến from đến nến to
                Ví dụ:
                + max_high(0, 10): Giá đỉnh cao nhất từ nến 0 đến 10
                + max_high(15, 20): Giá đỉnh cao nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_low',
        detail: '(from, to)',
        apply: 'max_low(0, 10)',
        boost: 0,
        info: ` - Giá đáy cao nhất từ nến from đến nến to
                Ví dụ:
                + max_low(0, 10): Giá đáy cao nhất từ nến 0 đến 10
                + max_low(15, 20): Giá đáy cao nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_close',
        detail: '(from, to)',
        apply: 'max_close(0, 10)',
        boost: 0,
        info: ` - Giá đóng cao nhất từ nến from đến nến to
                Ví dụ:
                + max_close(0, 10): Giá đóng cao nhất từ nến 0 đến 10
                + max_close(15, 20): Giá đóng cao nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_open',
        detail: '(from, to)',
        apply: 'min_open(0, 10)',
        boost: 0,
        info: ` - Giá mở thấp nhất từ nến from đến nến to
                Ví dụ:
                + min_open(0, 10): Giá mở thấp nhất từ nến 0 đến nến 10
                + min_open(15, 20): Giá mở thấp nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_high',
        detail: '(from, to)',
        apply: 'min_high(0, 10)',
        boost: 0,
        info: ` - Giá đỉnh thấp nhất từ nến from đến nến to
                Ví dụ:
                + min_high(0, 10): Giá đỉnh thấp nhất từ nến 0 đến nến 10
                + min_high(15, 20): Giá đỉnh thấp nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_low',
        detail: '(from, to)',
        apply: 'min_low(0, 10)',
        boost: 0,
        info: ` - Giá đáy thấp nhất từ nến from đến nến to
                Ví dụ:
                + min_low(0, 10): Giá đáy thấp nhất từ nến 0 đến nến 10
                + min_low(15, 20): Giá đáy thấp nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_close',
        detail: '(from, to)',
        apply: 'min_close(0, 10)',
        boost: 0,
        info: ` - Giá đóng thấp nhất từ nến from đến nến to
                Ví dụ:
                + min_close(0, 10): Giá đóng thấp nhất từ nến 0 đến nến 10
                + min_close(15, 20): Giá đóng thấp nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_rsi',
        detail: '(period, from, to)',
        apply: 'min_rsi(14, 0, 10)',
        boost: 0,
        info: ` - rsi thấp nhất từ nến from đến nến to
                - period: số nến để tính chỉ báo rsi
                Ví dụ:
                + min_rsi(14, 0, 10): rsi thấp nhất từ nến 0 đến nến 10
                + min_rsi(14, 15, 20): rsi thấp nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_rsi',
        detail: '(period, from, to)',
        apply: 'max_rsi(14, 0, 10)',
        boost: 0,
        info: ` - rsi cao nhất từ nến from đến nến to
                - period: số nến để tính chỉ báo rsi
                Ví dụ:
                + max_rsi(14, 0, 10): rsi cao nhất từ nến 0 đến nến 10
                + max_rsi(14, 15, 20): rsi cao nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_change',
        detail: '(from, to)',
        apply: 'min_change(0, 10)',
        boost: 0,
        info: ` - Thay đổi giá thấp nhất từ nến from đến nến to
                - Đơn vị: USDT
                Ví dụ:
                + min_change(0, 10): Thay đổi giá thấp nhất 0 đến nến 10
                + min_change(15, 20): Thay đổi giá thấp từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_change',
        detail: '(from, to)',
        apply: 'max_change(0, 10)',
        boost: 0,
        info: ` - Thay đổi giá cao nhất từ nến from đến nến to
                - Đơn vị: USDT
                Ví dụ:
                + max_change(0, 10): Thay đổi giá cao nhất 0 đến nến 10
                + max_change(15, 20): Thay đổi giá cao từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_change%',
        detail: '(from, to)',
        apply: 'min_change%(0, 10)',
        boost: 0,
        info: ` - Thay đổi giá thấp nhất từ nến from đến nến to
                - Đơn vị: %
                Ví dụ:
                + min_change(0, 10): Thay đổi giá thấp nhất 0 đến nến 10
                + min_change(15, 20): Thay đổi giá thấp từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_change%',
        detail: '(from, to)',
        apply: 'max_change%(0, 10)',
        boost: 0,
        info: ` - Thay đổi giá cao nhất từ nến from đến nến to
                - Đơn vị: %
                Ví dụ:
                + max_change(0, 10): Thay đổi giá cao nhất 0 đến nến 10
                + max_change(15, 20): Thay đổi giá cao từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_ampl',
        detail: '(from, to)',
        apply: 'min_ampl(0, 10)',
        boost: 0,
        info: ` - Biên độ giá thấp nhất từ nến from đến nến to
                - Đơn vị: USDT
                Ví dụ:
                + min_ampl(0, 10): Biên độ giá thấp nhất từ nến 0 đến nến 10
                + min_ampl(15, 20): Biên độ giá thấp nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_ampl',
        detail: '(from, to)',
        apply: 'max_ampl(0, 10)',
        boost: 0,
        info: ` - Biên độ giá cao nhất từ nến from đến nến to
                - Đơn vị: USDT
                Ví dụ:
                + max_ampl(0, 10): Biên độ giá cao nhất từ nến 0 đến nến 10
                + max_ampl(15, 20): Biên độ giá cao nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'min_ampl%',
        detail: '(from, to)',
        apply: 'min_ampl%(0, 10)',
        boost: 0,
        info: ` - Biên độ giá thấp nhất từ nến from đến nến to
                - Đơn vị: %
                Ví dụ:
                + min_ampl(0, 10): Biên độ giá thấp nhất từ nến 0 đến nến 10
                + min_ampl(15, 20): Biên độ giá thấp nhất từ nến 15 đến nến 20
                `
    },
    {
        type: 'function',
        label: 'max_ampl%',
        detail: '(from, to)',
        apply: 'max_ampl%(0, 10)',
        boost: 0,
        info: ` - Biên độ giá cao nhất từ nến from đến nến to
                - Đơn vị: %
                Ví dụ:
                + max_ampl(0, 10): Biên độ giá cao nhất từ nến 0 đến nến 10
                + max_ampl(15, 20): Biên độ giá cao nhất từ nến 15 đến nến 20
                `
    },
];