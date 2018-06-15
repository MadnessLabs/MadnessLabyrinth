declare var firebase;

export class StorageService {
  public service: any;

  public constructor() {
    this.service = firebase.storage();
  }

  public async upload(path, file, metadata = {}) {
    return this.service.ref(path).put(file, metadata);
  }
}
