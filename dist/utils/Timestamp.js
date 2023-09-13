"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
const Timestamp = () => {
    const Now = new Date();
    Now.setHours(Now.getHours() + 9);
    return Now.toISOString().replace('T', ' ').substring(0, 19).slice(2);
};
exports.Timestamp = Timestamp;
