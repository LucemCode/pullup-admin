import * as firebase from 'firebase';

let config = {
    apiKey: "AIzaSyBDuGgxEiMCxm4aNFJwlws-_aEWT6-9C88",
    authDomain: "pullup-eu.firebaseapp.com",
    databaseURL: "https://pullup-eu.firebaseio.com",
    projectId: "pullup-eu",
    storageBucket: "pullup-eu.appspot.com",
    messagingSenderId: "601574363047"
};

class Fire {

    static init = () => {
        firebase.initializeApp(config);
        Fire.auth = firebase.auth();
        Fire.db = firebase.database();
        Fire.store = firebase.storage();
    }

}

export default Fire;