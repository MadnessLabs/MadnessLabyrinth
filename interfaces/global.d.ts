import * as firebase from "firebase";

declare global {
  namespace MadnessLabs {

    namespace User {
      export interface ISession extends firebase.User {}

      export interface IQueryDocumentSnapshot
        extends firebase.firestore.QueryDocumentSnapshot {
        data(options?: firebase.firestore.SnapshotOptions): IDocument;
      }

      export interface IColllection extends firebase.firestore.QuerySnapshot {
        readonly docs: IQueryDocumentSnapshot[];
      }

      export interface IDocument {
        /**
         * The email address for the user
         */
        email?: string;
      }

      export interface IDocumentWithId extends IDocument {
        /**
         * The unique ID of the user
         */
        id?: string;
      }

      export interface IAuthInfo extends firebase.UserInfo {}

      export interface IDocumentSnapshot
        extends firebase.firestore.DocumentSnapshot {
        data(options?: firebase.firestore.SnapshotOptions): IDocument;
      }
      export interface IDocumentReference
        extends firebase.firestore.DocumentReference {
        get(): Promise<IDocumentSnapshot>;
      }
    }
  }
}
