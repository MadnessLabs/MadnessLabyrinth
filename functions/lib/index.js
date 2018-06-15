"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
// Import Triggers
const triggerHelloWorld = require("./triggers/helloWorld");
admin.initializeApp();
// Implement Triggers
exports.helloWorld = triggerHelloWorld.listener;
//# sourceMappingURL=index.js.map