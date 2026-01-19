// Firebase
var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Produkte
const PRODUCTS = [
  "Laugenweckle",
  "Körnerweckle",
  "Doppelweckle",
  "Seelen",
  "Brezel",
  "Buttercroissant"
];

const cart = {};
const productsEl = document.getElementById("products");
const overviewEl = document.getElementById("overview");

// Produkte anzeigen
function renderProducts() {
  productsEl.innerHTML = "";

  PRODUCTS.forEach(p => {
    cart[p] = 0;

    const row = document.createElement("div");
    row.className = "product";

    const name = document.createElement("span");
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

    const amount = document.createElement("span");
    amount.textContent = "0";
    amount.className = "amount";

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

// Bestellung speichern
document.getElementById("saveBtn").onclick = () => {
  const family = document.getElementById("family").value;
  if (!family) return alert("Familienname fehlt");

  db.ref("orders/" + family).set(cart);
};

// Live Übersicht
db.ref("orders").on("value", snap => {
  overviewEl.innerHTML = "";
  snap.forEach(c => {
    const box = document.createElement("div");
    box.className = "overview-box";
    box.innerHTML = `<b>${c.key}</b>`;
    const items = c.val();
    for (let i in items) {
      if (items[i] > 0) box.innerHTML += `<br>${i}: ${items[i]}×`;
    }
    overviewEl.appendChild(box);
  });
});

// Start
renderProducts();
