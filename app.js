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
const cart = {};

function renderProducts() {
  const container = document.getElementById("products");

  // 🔴 WICHTIGER SCHUTZ
  if (!container) {
    console.error("Element #products nicht gefunden");
    return;
  }

  container.innerHTML = "";

  for (let category in PRODUCTS) {
    const h3 = document.createElement("h3");
    h3.textContent = category;
    container.appendChild(h3);

    PRODUCTS[category].forEach(product => {
      const row = document.createElement("div");
      row.className = "product";

      const label = document.createElement("span");
      label.textContent = product;

      const input = document.createElement("input");
      input.type = "number";
      input.min = 0;
      input.value = 0;

      input.oninput = () => {
        cart[product] = parseInt(input.value) || 0;
      };

      row.appendChild(label);
      row.appendChild(input);
      container.appendChild(row);
    });
  }
}
renderProducts();
