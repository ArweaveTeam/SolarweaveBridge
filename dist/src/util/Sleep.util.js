"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = void 0;
function Sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.Sleep = Sleep;
//# sourceMappingURL=Sleep.util.js.map