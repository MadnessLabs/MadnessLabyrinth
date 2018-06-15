import * as admin from "firebase-admin";
import * as fs from "fs";

export class DatabaseService {
  service: admin.firestore.Firestore;

  constructor(
    options: {
      local?: boolean;
      project?: string;
    } = {}
  ) {
    if (admin.apps.length === 0) {
      this.connect({
        local: options.local ? options.local : false,
        project: options.project ? options.project : null
      });
    }
    this.service = admin.firestore();
  }

  async connect(options: { local?: boolean; project: string }) {
    const serviceAccountFile = options.local
      ? process.cwd() + "/serviceAccountKey.json"
      : process.cwd() + "/serviceAccountKey.live.json";

    const serviceAccountKey = JSON.parse(
      fs.readFileSync(serviceAccountFile, "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      databaseURL: `https://${options.project}.firebaseio.com`,
      storageBucket: `${options.project}.appspot.com`
    });
  }

  async all(collectionName: string): Promise<any> {
    const collection = await this.get(collectionName);
    const data = {};

    await Promise.all(
      collection.docs.map(async doc => {
        data[doc.id] = { ...doc.data(), id: doc.id };
        return;
      })
    );

    return data;
  }

  async list(collectionName: string) {
    const collection = await this.get(collectionName);
    const data = [];

    await Promise.all(
      collection.docs.map(async doc => {
        data.push({ ...doc.data(), id: doc.id });
        return true;
      })
    );

    return data;
  }

  async add(collectionName: string, data: any, id?: string | string) {
    const document = await this.collection(collectionName);

    const ref: any = id
      ? await document.doc(id).set(data)
      : await document.add(data);

    return { id: id ? id : ref.id };
  }

  collection(collectionName: string): any {
    return this.service.collection(collectionName);
  }

  delete(collectionName: string, id: string): any {
    return this.collection(collectionName)
      .doc(id)
      .delete();
  }

  document(collectionName: string, id: string): any {
    return this.collection(collectionName).doc(id);
  }

  get(collectionName: string): any {
    return this.collection(collectionName).get();
  }

  getDocument(collectionName: string, id: string) {
    return this.collection(collectionName)
      .doc(id)
      .get();
  }

  async find(collectionName: string, id: string): Promise<any> {
    const document = await this.getDocument(collectionName, id);

    return document.exists ? { ...document.data(), id: document.id } : null;
  }

  async findDocument(collectionName: string, id: string): Promise<any> {
    const document = await this.getDocument(collectionName, id);

    return document.exists ? { ...document.data() } : null;
  }

  async set(collectionName: string, id: string, data: any) {
    const document = await this.collection(collectionName).doc(id);

    return document.set(data);
  }

  async update(collectionName: string, id: string, data: any) {
    const document = await this.collection(collectionName).doc(id);

    return document.set(data, { merge: true });
  }
}
