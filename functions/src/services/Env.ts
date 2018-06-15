import * as functions from "firebase-functions";

export function envConfig(key?: string) {
  let config = functions.config();

  if (Object.keys(config).length <= 0) {
    const packageJson = require("../../package.json");
    config = packageJson.enjin ? packageJson.enjin : {};
    config.local = true;
  }

  return key ? config[key] : config;
}
