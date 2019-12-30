import * as firebase from "firebase/app";
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
require("firebase/functions");
const firebaseConfig = {
  apiKey: "AIzaSyBxrfbj9GHBixhpLHhAcQYPQ3bxdGoJ98c",
  authDomain: "minimart-management-bimtech.firebaseapp.com",
  databaseURL: "https://minimart-management-bimtech.firebaseio.com",
  projectId: "minimart-management-bimtech",
  storageBucket: "minimart-management-bimtech.appspot.com",
  messagingSenderId: "85629196184",
  appId: "1:85629196184:web:ac35d5db0ba0e149a53ded",
  measurementId: "G-4FC0N3CW5E"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();
export { auth, firestore, storage, functions, firebase as default };
