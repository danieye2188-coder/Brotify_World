// 🔥 Firebase
var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🥖 PRODUKTE IN KATEGORIEN
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
const productsEl = document.getElementById("products");
const overviewEl = document.getElementById("overview");

// 🛒 PRODUKTE ANZEIGEN
function renderProducts() {
  productsEl.innerHTML = "";

  for (let category in PRODUCTS) {
    const h3 = document.createElement("h3");
    h3.textContent = category;
    productsEl.appendChild(h3);

    PRODUCTS[category].forEach(p => {
      cart[p] = 0;

      const row = document.createElement("div");
      row.className = "product";

      const name = document.createElement("div");
      name.className = "product-name";
      name.textContent = p;

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.className = "pm";
      minus.onclick = () => {
        if (cart[p] > 0) {
          cart[p]--;
          amount.textContent = cart[p];
        }
      };

      const amount = document.createElement("div");
      amount.className = "amount";
      amount.textContent = "0";

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.className = "pm";
      plus.onclick = () => {
        cart[p]++;
        amount.textContent = cart[p];
      };

      row.append(name, minus, amount, plus);
      productsEl.appendChild(row);
    });
  }
}

// 💾 BESTELLUNG SPEICHERN
document.getElementById("saveBtn").onclick = () => {
  const family = document.getElementById("family").value;
  if (!family) return alert("Familienname fehlt");

  db.ref("orders/" + family).set(cart);
};

// 🔴 LIVE-ÜBERSICHT
db.ref("orders").on("value", snap => {
  overviewEl.innerHTML = "";

  snap.forEach(c => {
    const box = document.createElement("div");
    box.className = "overview-box";
    box.innerHTML = `<b>${c.key}</b>`;

    const items = c.val();
    for (let i in items) {
      if (items[i] > 0) {
        box.innerHTML += `<br>${i}: ${items[i]}×`;
      }
    }

    overviewEl.appendChild(box);
  });
});

// 🚀 START
renderProducts();
