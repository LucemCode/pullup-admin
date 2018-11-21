import * as firebase from 'firebase';
import config from './FireConfig';

class Fire {

    static init = () => {
        firebase.initializeApp(config);
        Fire.auth = firebase.app().auth();
        Fire.db = firebase.database();
        Fire.store = firebase.storage();
    }

}

export default Fire;