// firebase-messaging-sw.js
// This is a barebones service worker just to allow Firebase Messaging to work

importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCkZWHXOgFndxsFFCFb57jQaGLCVAmIQ9A",
    authDomain: "e-walletanddistributionsystem.firebaseapp.com",
    projectId: "e-walletanddistributionsystem",
    storageBucket: "e-walletanddistributionsystem.firebasestorage.app",
    messagingSenderId: "299368481701",
    appId: "1:299368481701:web:6bac834ce1f40e849dde4c",
    measurementId: "G-P75BE9525S"
  });
const messaging = firebase.messaging();
