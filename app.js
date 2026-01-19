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


// 🥖 Produktkatalog
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


// 🛒 Warenkorb
const cart = {};


// 📋 PRODUKTE ANZEIGEN (DAS FEHLTE BEI DIR)
function renderProducts() {
  const container = document.getElementById("products");
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


// 🚀 WICHTIG: FUNKTION AUFRUFEN
renderProducts();


// 📦 BESTELLUNG SPEICHERN
function submitOrder() {
  const family = document.getElementById("family").value;
  const pickup = document.getElementById("pickup").value;
  const note = document.getElementById("note").value;

  if (!family) {
    alert("Bitte Familienname eingeben");
    return;
  }

  db.ref("orders/" + family).set({
    family: family,
    pickup: pickup,
    note: note,
    items: cart,
    time: Date.now()
  });

  alert("Bestellung gespeichert");
}


// 🔴 LIVE-GESAMTÜBERSICHT
db.ref("orders").on("value", snapshot => {
  const overview = document.getElementById("overview");
  overview.innerHTML = "";

  snapshot.forEach(child => {
    const data = child.val();

    const box = document.createElement("div");
    box.className = "overview-box";

    box.innerHTML =
      `<strong>${data.family}</strong><br>
       👤 Abholung: ${data.pickup || "-"}<br>
       📝 ${data.note || ""}`;

    for (let item in data.items) {
      if (data.items[item] > 0) {
        box.innerHTML += `<br>${item}: ${data.items[item]}×`;
      }
    }

    overview.appendChild(box);
  });
});
