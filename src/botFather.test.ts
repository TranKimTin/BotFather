var assert = require('assert');
import * as util from './util';
import { BotInfo, CreateWebConfig, BOT_DATA_DIR, Node, findIndicator, extractParams, checkEval, checkCondition, indicatorSupported, checkParams } from './botFatherConfig';
import { RateData } from './BinanceFuture';


describe('BotFather', function () {
    describe('extractParams', function () {
        it('rsi(14)', function () {
            let s = 'rsi(14)';
            let params = extractParams(s);
            assert.equal(params.length, 1);
            assert.equal(params[0], 14);
        });
        it('rsi(14,5)', function () {
            let s = 'rsi(14,5)';
            let params = extractParams(s);
            assert.equal(params.length, 2);
            assert.equal(params[0], 14);
            assert.equal(params[1], 5);
        });
        it('macd(11,9,6,2)', function () {
            let s = 'macd(11,9,6,2)';
            let params = extractParams(s);
            assert.equal(params.length, 4);
            assert.equal(params[0], 11);
            assert.equal(params[1], 9);
            assert.equal(params[2], 6);
            assert.equal(params[3], 2);
        });
    });

    describe('findIndicator', function () {
        it('rsi(14) >= rsi(14,1) * 0.3', function () {
            let s = 'rsi(14) >= rsi(14,1) * 0.3';
            let indicators = findIndicator(s, 'rsi');
            assert.deepStrictEqual(indicators, ['rsi(14)', 'rsi(14,1)'])
        });
        it('upper_shadow() >= ampl() * 0.3', function () {
            let s = 'upper_shadow() >= ampl() * 0.3';

            assert.deepStrictEqual(findIndicator(s, 'upper_shadow'), ['upper_shadow()'])
            assert.deepStrictEqual(findIndicator(s, 'ampl'), ['ampl()'])
        });

        it('telegram: ma14: ma(14,0) ma(14,1) ma(14,2)', function () {
            let s = 'telegram: ma14: ma(14,0) ma(14,1) ma(14,2)';
            assert.deepStrictEqual(findIndicator(s, 'ma'), ['ma(14,0)', 'ma(14,1)', 'ma(14,2)'])
        });

        it('telegram: ema(14,0) ma(14,1) ema(14,2)', function () {
            let s = 'telegram: ema(14,0) ma(14,1) ema(14,2)';
            assert.deepStrictEqual(findIndicator(s, 'ma'), ['ma(14,1)']);
            assert.deepStrictEqual(findIndicator(s, 'ema'), ['ema(14,0)', 'ema(14,2)']);
        });
    });


    describe('checkCondition', function () {
        it('rsi(14,5) > 70', function () {
            let s = 'rsi(14,5) > 70';
            let value = checkCondition(s);
            assert.strictEqual(value, true);
        });
        it('console.log(123)', function () {
            let s = 'console.log(123)';
            let value = checkCondition(s);
            assert.strictEqual(value, false);
        });
        it('rsi(14) >= rsi(14,1)', function () {
            let s = 'rsi(14) >= rsi(14,1)';
            let value = checkCondition(s);
            assert.strictEqual(value, true);
        });
        it('change() >= ampl() * 0.3', function () {
            let s = 'change() >= ampl() * 0.3';
            let value = checkCondition(s);
            assert.strictEqual(value, true);
        });
        it('rsi(14,5,5) > 70', function () {
            let s = 'rsi(14,5,5) > 70';
            let value = checkCondition(s);
            assert.equal(value, false);
        });
        it('telegram: send tele', function () {
            let s = 'telegram: send tele';
            let value = checkCondition(s);
            assert.strictEqual(value, true);
        })
    });

    // describe('extractParams', function () {
    //     it('macd(11,9,6,2)', function () {
    //     });
    // });
});


describe('util', function () {
    describe('indicator', function () {
        it('iMA', function () {
            let period = 8;
            let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
            let data = values.map(item => ({ close: item } as RateData));
            let ma = util.iMA(data, period);
            let expected = [4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
            assert.deepStrictEqual(ma, expected);
        });
    });
})