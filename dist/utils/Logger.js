"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.log = void 0;
const safe_1 = __importDefault(require("colors/safe"));
const Timestamp_1 = require("./Timestamp");
const log = (content, type) => {
    const timestamp = safe_1.default.white(`[${(0, Timestamp_1.Timestamp)()}]`);
    switch (type) {
        case "log":
            return console.log(`${safe_1.default.gray("[LOG]")} ${timestamp} ${content}`);
        case "info":
            return console.log(`${safe_1.default.cyan("[INFO]")} ${timestamp} ${content}`);
        case "warn":
            return console.log(`${safe_1.default.yellow("[WARN]")} ${timestamp} ${content}`);
        case "error":
            return console.log(`${safe_1.default.red("[ERROR]")} ${timestamp} ${content}`);
        case "debug":
            return console.log(`${safe_1.default.magenta("[DEBUG]")} ${timestamp} ${content}`);
        case "ready":
            return console.log(`${safe_1.default.green("[READY]")} ${timestamp} ${content}`);
        default:
            throw new TypeError("Logger 타입이 올바르지 않습니다.");
    }
};
exports.log = log;
exports.Logger = {
    log: (content) => (0, exports.log)(content, "log"),
    warn: (content) => (0, exports.log)(content, "warn"),
    error: (content) => (0, exports.log)(content, "error"),
    debug: (content) => (0, exports.log)(content, "debug"),
    info: (content) => (0, exports.log)(content, "info"),
    ready: (content) => (0, exports.log)(content, "ready")
};
