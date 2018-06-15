/**
 * @module Services
 */
// import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
// import { TwitterConnect } from '@ionic-native/twitter-connect';
// import * as firebase from 'firebase';

// import firebase from 'firebase';

declare var firebase: any;

export class AuthService {
  // public service: firebase.auth.Auth;
  public service: any;
  public session: any;

  constructor(
    // private facebook: Facebook,
    // private twitter: TwitterConnect
    config?: any
  ) {
    // this.user = afAuth.authState;
    let firstRun = false;
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
      firstRun = true;
    }
    this.service = firebase.auth();

    if (firstRun) {
      this.service.getRedirectResult().then((data) => {
        if (data && data.user) {
          this.emitLoggedInEvent(data);
        }
      });
    }

  }

  async onEmailLink() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      const authUser = await firebase.auth().signInWithEmailLink(email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');

      this.emitLoggedInEvent(authUser);

      return authUser;
    }
  }

  createCaptcha(buttonId: string) {
    (<any>window).RecaptchaVerifier = new firebase.auth.RecaptchaVerifier(buttonId, {
      'size': 'invisible',
      'callback': function () {
        // On Capture Creation
      }
    });
  }

  withPhoneNumber(phoneNumber: string, capId: any){
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        phoneNumber = '+' + phoneNumber;
        window.localStorage.setItem('phoneForSignIn', phoneNumber);

        return this.service.signInWithPhoneNumber(phoneNumber, capId);
  }

  withEmailLink(email: string, actionCodeSettings: any) {
    window.localStorage.setItem('emailForSignIn', email);

    return this.service.sendSignInLinkToEmail(email, actionCodeSettings);
  }

  anonymously() {
    return this.service.signInAnonymously();
  }

  onAuthChanged(callback) {
    this.service.onAuthStateChanged((session) => {
      if (!session || (!session.emailVerified && session.providerData && session.providerData[0].providerId === 'password')) {
        return false;
      }
      console.log('session - ', session);
      if (session) {
        localStorage.setItem('tmg:session', JSON.stringify(session));
      }
      if (callback && typeof callback === 'function') {
        callback(session);
      }
    });
  }

  getFromStorage() {
    return localStorage.getItem('referaflood:session') ? JSON.parse(localStorage.getItem('referaflood:session')) : null;
  }

  isLoggedIn() {
    return this.service.currentUser ? this.service.currentUser : this.getFromStorage();
  }

  emitLoggedInEvent(data) {
    document.body.dispatchEvent(new CustomEvent('authLoggedIn', { detail: { data } }));
  }

  emitLoggedOutEvent() {
    document.body.dispatchEvent(new CustomEvent('authLoggedOut', { detail: {} }));
  }

  createUser(email: string
  ) {
    return new Promise((resolve, reject) => {
      try {
        console.log('am I here?');
        this.service.createUserWithEmailAndPassword(email).then((data) => {
          resolve(data);
        }).catch((error) => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  sendEmailVerification(options?) {
    return this.service.currentUser.sendEmailVerification(options ? options : null);
  }

  sendPasswordReset(emailAddress: string, options?) {
    return this.service.sendPasswordResetEmail(emailAddress, options ? options : null);
  }

  withEmail(email: string, password: string) {
    return new Promise((resolve, reject) => {
      try {
        this.service.signInWithEmailAndPassword(email, password).then((user) => {
          this.emitLoggedInEvent({ user });
          resolve({ data: { user } });
        }).catch((error) => {
          reject(error);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // facebookNative(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         if (this.platform.is('cordova')) {
  //             this.facebook.login(['email', 'public_profile', 'user_friends'])
  //                 .then((facebookData: FacebookLoginResponse) => {
  //                     const credential = firebase.auth.FacebookAuthProvider.credential(facebookData.authResponse.accessToken);
  //                     firebase.auth().signInWithCredential(credential).then((firebaseData) => {
  //                         resolve(firebaseData);
  //                     });
  //                 }, (error) => {
  //                     reject(error);
  //                 });
  //         } else {
  //             reject({ message: 'This platform does not support native login.' });
  //         }
  //     });
  // }

  googleNative(): Promise<any> {
    return new Promise((resolve, reject) => {
      (<any>window).plugins.googleplus.login({
        webClientId: '423724975087-uqfg4lrfe2fsal8v1oihf5mcj3ikvqnl.apps.googleusercontent.com',
        offline: true
      }, (googleData) => {
        const credential = firebase.auth.GoogleAuthProvider.credential(googleData.idToken);
        firebase.auth().signInWithCredential(credential).then((firebaseData) => {
          resolve(firebaseData);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  // twitterNative(): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //         this.twitter.login().then((twitterData) => {
  //             const credential = firebase.auth.TwitterAuthProvider.credential(twitterData.token, twitterData.secret);
  //             firebase.auth().signInWithCredential(credential).then((firebaseData) => {
  //                 resolve(firebaseData);
  //             });
  //         }, (error) => {
  //             reject(error);
  //         });
  //     });
  // }

  withSocial(network: string, redirect = false): Promise<any> {
    console.log(network);
    // let provider;
    // return new Promise((resolve, reject) => {
    //     if (this.platform.is('cordova')) {
    //         if (network === 'facebook') {
    //             this.facebookNative().then((result) => {
    //                 resolve(result);
    //             });
    //         } else if (network === 'google') {
    //             this.googleNative().then((result) => {
    //                 resolve(result);
    //             });
    //         } else if (network === 'twitter') {
    //             this.twitterNative().then((result) => {
    //                 resolve(result);
    //             });
    //         } else {
    //             reject({ message: 'A social network is required or the one provided is not yet supported.' });
    //         }
    //     } else {

    //     }
    // });
    let provider;
    let shouldRedirect = redirect;
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Running in PWA mode...');
      shouldRedirect = shouldRedirect ? shouldRedirect : true;
    }

    return new Promise((resolve, reject) => {
      // console.log('here or not?');

      // if ((<any>window).Capacitor.isNative) {
      //   console.log('what')
      //   if (network === 'google') {
      //     this.googleNative().then((result) => {
      //       resolve(result);
      //     });
      //   }
      // }
        if (network === 'facebook') {
          provider = new firebase.auth.FacebookAuthProvider();
        } else if (network === 'google') {
          provider = new firebase.auth.GoogleAuthProvider();
        } else if (network === 'twitter') {
          provider = new firebase.auth.TwitterAuthProvider();
        } else {
          reject({ message: 'A social network is required or the one provided is not yet supported.' });
        }
        this.service[shouldRedirect ? 'signInWithRedirect' : 'signInWithPopup'](provider).then((data) => {
          this.emitLoggedInEvent(data);
          resolve(data);
        }).catch((error) => {
          reject(error);
        });

    });
  }

  logout() {
    this.emitLoggedOutEvent();

    return this.service.signOut();
  }

  async updatePassword(newPassword: string) {
    console.log(firebase.auth().currentUser);
    // await user.reauthenticateWithCredential(credential);

    return firebase.auth().currentUser.updatePassword(newPassword);
  }
}
