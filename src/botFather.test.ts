var assert = require('assert');
import * as util from './util';
import { BotInfo, CreateWebConfig, BOT_DATA_DIR, Node, findIndicator, extractParams, checkEval, checkCondition, indicatorSupported, checkParams } from './botFatherConfig';


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
            assert.equal(indicators.length, 2);
            assert.equal(indicators[0], 'rsi(14)');
            assert.equal(indicators[1], 'rsi(14,1)');
        });
        it('upper_shadow() >= ampl() * 0.3', function () {
            let s = 'upper_shadow() >= ampl() * 0.3';
            let indicators = findIndicator(s, 'upper_shadow');
            assert.equal(indicators.length, 1);
            assert.equal(indicators[0], 'upper_shadow()');

            indicators = findIndicator(s, 'ampl');
            assert.equal(indicators.length, 1);
            assert.equal(indicators[0], 'ampl()');
        });
    });


    describe('checkCondition', function () {
        it('rsi(14,5) > 70', function () {
            let s = 'rsi(14,5) > 70';
            let value = checkCondition(s);
            assert.equal(value, true);
        });
        it('console.log(123)', function () {
            let s = 'console.log(123)';
            let value = checkCondition(s);
            assert.equal(value, false);
        });
        it('rsi(14) >= rsi(14,1)', function () {
            let s = 'rsi(14) >= rsi(14,1)';
            let value = checkCondition(s);
            assert.equal(value, true);
        });
        it('change() >= ampl() * 0.3', function () {
            let s = 'change() >= ampl() * 0.3';
            let value = checkCondition(s);
            assert.equal(value, true);
        });
        it('rsi(14,5,5) > 70', function () {
            let s = 'rsi(14,5,5) > 70';
            let value = checkCondition(s);
            assert.equal(value, false);
        });
        it('telegram: send tele', function () {
            let s = 'telegram: send tele';
            let value = checkCondition(s);
            assert.equal(value, true);
        })
    });

    // describe('extractParams', function () {
    //     it('macd(11,9,6,2)', function () {
    //     });
    // });
});