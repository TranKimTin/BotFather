var assert = require('assert');
import * as util from './common/util';
import { isValidCondition } from './common/Expr';
import { NODE_TYPE, RateData } from './common/Interface';


describe('BotFather', function () {
    describe('isValidCondition', function () {
        it('rsi(14,5) > 70', function () {
            const s = 'rsi(14,5) > 70';
            const value = isValidCondition({ id: 'test', type: NODE_TYPE.EXPR, value: s });
            assert.strictEqual(value, true);
        });
        it('console.log(123)', function () {
            const s = 'console.log(123)';
            const value = isValidCondition({ id: 'test', type: NODE_TYPE.EXPR, value: s });
            assert.strictEqual(value, false);
        });
        it('rsi(14) >= rsi(14,1)', function () {
            const s = 'rsi(14) >= rsi(14,1)';
            const value = isValidCondition({ id: 'test', type: NODE_TYPE.EXPR, value: s });
            assert.strictEqual(value, true);
        });
        it('change() >= ampl() * 0.3', function () {
            const s = 'change() >= ampl() * 0.3';
            const value = isValidCondition({ id: 'test', type: NODE_TYPE.EXPR, value: s });
            assert.strictEqual(value, true);
        });
        it('telegram: send tele', function () {
            const s = 'send tele rsi={rsi(14)}';
            const value = isValidCondition({ id: 'test', type: NODE_TYPE.TELEGRAM, value: s });
            assert.strictEqual(value, true);
        })
    });
});


describe('util', function () {
    describe('indicator', function () {
        it('iMA', function () {
            const period = 8;
            const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
            const data = values.map(item => ({ close: item } as RateData));
            const ma = util.iMA(data, period);
            const expected = [4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
            assert.deepStrictEqual(ma, expected);
        });
    });
})