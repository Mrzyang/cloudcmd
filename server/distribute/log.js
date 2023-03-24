'use strict';

const wraptile = require('wraptile');
const chalk = require('chalk');

const datetime = require('../../common/datetime');

const log = (isLog, name, msg) => isLog && console.log(`${datetime()} -> ${name}: ${msg}`);
const makeColor = (a) => chalk.blue(a);
const getMessage = (e) => e.message || e;
const getDescription = (e) => e.message;

module.exports = log;
module.exports.logWraped = wraptile(log);
module.exports.stringToRGB = stringToRGB;
module.exports.makeColor = makeColor;
module.exports.getMessage = getMessage;
module.exports.getDescription = getDescription;

module.exports.importStr = 'import';
module.exports.exportStr = 'export';
module.exports.connectedStr = chalk.green('connected');
module.exports.disconnectedStr = chalk.red('disconnected');
module.exports.tokenRejectedStr = chalk.red('token rejected');
module.exports.authTryStr = chalk.yellow('try to auth');

function stringToRGB(a) {
    return [
        a.charCodeAt(0),
        a.length,
        crc(a),
    ];
}

const add = (a, b) => a + b.charCodeAt(0);

function crc(a) {
    return a
        .split('')
        .reduce(add, 0);
}

