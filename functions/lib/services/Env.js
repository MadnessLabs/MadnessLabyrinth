"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
function envConfig(key) {
    let config = functions.config();
    if (Object.keys(config).length <= 0) {
        const packageJson = require("../../package.json");
        config = packageJson.enjin ? packageJson.enjin : {};
        config.local = true;
    }
    return key ? config[key] : config;
}
exports.envConfig = envConfig;
//# sourceMappingURL=Env.js.map