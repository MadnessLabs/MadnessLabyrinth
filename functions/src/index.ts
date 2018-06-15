import * as admin from "firebase-admin";

// Import Triggers
import * as triggerHelloWorld from "./triggers/helloWorld";

admin.initializeApp();

// Implement Triggers
export const helloWorld = triggerHelloWorld.listener;
