var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu",
  storageBucket: "brotifyneu.firebasestorage.app",
  messagingSenderId: "247031375086",
  appId: "1:247031375086:web:08c171ec7e542eeda0ffff"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const PRODUCTS = {
  "Weckle & Brötchen": [
    "Laugenweckle",
    "Körnerweckle",
    "Doppelweckle",
    "Seelen",
    "Sonnenblumeweckle",
    "Kürbisweckle",
    "Dinkelweckle",
    "Vollkornweckle",
    "Mehrkornweckle",
    "Roggenweckle"
  ],

  "Laugengebäck & Laugenecken": [
    "Laugenstange",
    "Laugenhörnchen",
    "Laugenecke klassisch",
    "Laugenecke mit Körnern",
    "Brezel"
  ],

  "Croissants & süßes Gebäck": [
    "Buttercroissant",
    "Schokocroissant"
  ],

  "Brote & Zopf": [
    "Zopf",
    "Kleines Landbrot"
  ]
};
