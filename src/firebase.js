import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
const firebaseConfig = {
    apiKey: "AIzaSyDQTbP483p2TFp1Hx1n7rNonc_lMkJh8BA",
    authDomain: "melu-s-cakes-6482d.firebaseapp.com",
    projectId: "melu-s-cakes-6482d",
    storageBucket: "melu-s-cakes-6482d.appspot.com",
    messagingSenderId: "927918956071",
    appId: "1:927918956071:web:5af87c5f7365141a607802"
  };

  firebase.initializeApp(firebaseConfig);

  const database = firebase.database();

  export { database };