"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const fs = require("fs-extra");
class DatabaseService {
    constructor(options = {}) {
        if (admin.apps.length === 0) {
            this.connect({
                local: options.local ? options.local : false,
                project: options.project ? options.project : null
            });
        }
        this.service = admin.firestore();
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceAccountFile = options.local
                ? process.cwd() + "/serviceAccountKey.json"
                : process.cwd() + "/serviceAccountKey.live.json";
            const serviceAccountKey = JSON.parse(fs.readFileSync(serviceAccountFile, "utf8"));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountKey),
                databaseURL: `https://${options.project}.firebaseio.com`,
                storageBucket: `${options.project}.appspot.com`
            });
        });
    }
    all(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.get(collectionName);
            const data = {};
            yield Promise.all(collection.docs.map((doc) => __awaiter(this, void 0, void 0, function* () {
                data[doc.id] = Object.assign({}, doc.data(), { id: doc.id });
                return;
            })));
            return data;
        });
    }
    list(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.get(collectionName);
            const data = [];
            yield Promise.all(collection.docs.map((doc) => __awaiter(this, void 0, void 0, function* () {
                data.push(Object.assign({}, doc.data(), { id: doc.id }));
                return true;
            })));
            return data;
        });
    }
    add(collectionName, data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.collection(collectionName);
            const ref = id
                ? yield document.doc(id).set(data)
                : yield document.add(data);
            return { id: id ? id : ref.id };
        });
    }
    collection(collectionName) {
        return this.service.collection(collectionName);
    }
    delete(collectionName, id) {
        return this.collection(collectionName)
            .doc(id)
            .delete();
    }
    document(collectionName, id) {
        return this.collection(collectionName).doc(id);
    }
    get(collectionName) {
        return this.collection(collectionName).get();
    }
    getDocument(collectionName, id) {
        return this.collection(collectionName)
            .doc(id)
            .get();
    }
    find(collectionName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocument(collectionName, id);
            return document.exists ? Object.assign({}, document.data(), { id: document.id }) : null;
        });
    }
    findDocument(collectionName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocument(collectionName, id);
            return document.exists ? Object.assign({}, document.data()) : null;
        });
    }
    set(collectionName, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.collection(collectionName).doc(id);
            return document.set(data);
        });
    }
    update(collectionName, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.collection(collectionName).doc(id);
            return document.set(data, { merge: true });
        });
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=Database.js.map