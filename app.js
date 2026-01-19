/***********************************
 * 🔥 Firebase Initialisierung
 ***********************************/
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


/***********************************
 * 🥖 PRODUKTKATALOG
 ***********************************/
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


/***********************************
 * 🛒 Warenkorb
 ***********************************/
const cart = {};


/***********************************
 * 📋 Artikelanzeige mit + / –
 ***********************************/
function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  for (let category in PRODUCTS) {
    const h3 = document.createElement("h3");
    h3.textContent = category;
    container.appendChild(h3);

    PRODUCTS[category].forEach(product => {
      if (cart[product] === undefined) cart[product] = 0;

      const row = document.createElement("div");
      row.className = "product";

      const label = document.createElement("span");
      label.textContent = product;

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.onclick = () => {
        if (cart[product] > 0) {
          cart[product]--;
          amount.textContent = cart[product];
        }
      };

      const amount = document.createElement("span");
      amount.textContent = cart[product];
      amount.style.minWidth = "30px";
      amount.style.textAlign = "center";

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.onclick = () => {
        cart[product]++;
        amount.textContent = cart[product];
      };

      row.appendChild(label);
      row.appendChild(minus);
      row.appendChild(amount);
      row.appendChild(plus);

      container.appendChild(row);
    });
  }
}


/***********************************
 * 📦 Bestellung speichern
 ***********************************/
function submitOrder() {
  const family = document.getElementById("family").value;
  const pickup = document.getElementById("pickup").value;
  const note = document.getElementById("note").value;

  if (!family) {
    alert("Bitte Familienname eingeben");
    return;
  }

  db.ref("orders/" + family).set({
    family,
    pickup,
    note,
    items: cart,
    time: Date.now()
  });

  alert("Bestellung gespeichert ✅");
}


/***********************************
 * 🔁 Ansichten umschalten
 ***********************************/
function showOrderView() {
  document.getElementById("orderView").style.display = "block";
  document.getElementById("bakerView").style.display = "none";
}

function showBakerView() {
  document.getElementById("orderView").style.display = "none";
  document.getElementById("bakerView").style.display = "block";
}


/***********************************
 * 🔴 Live-Bestellungen + Löschen
 ***********************************/
db.ref("orders").on("value", snapshot => {
  const overview = document.getElementById("overview");
  if (!overview) return;

  overview.innerHTML = "";
  const totals = {};

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
        totals[item] = (totals[item] || 0) + data.items[item];
      }
    }

    const del = document.createElement("button");
    del.textContent = "❌ Bestellung löschen";
    del.onclick = () => db.ref("orders/" + child.key).remove();

    box.appendChild(document.createElement("br"));
    box.appendChild(del);
    overview.appendChild(box);
  });

  renderBakerList(totals);
});


/***********************************
 * 🧺 Bäcker-Maske mit Abhaken (LIVE)
 ***********************************/
function renderBakerList(totals) {
  const list = document.getElementById("bakerList");
  if (!list) return;

  list.innerHTML = "";

  for (let item in totals) {
    const row = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    db.ref("bought/" + item).once("value", snap => {
      if (snap.val() === true) {
        checkbox.checked = true;
        row.style.textDecoration = "line-through";
      }
    });

    checkbox.onchange = () => {
      db.ref("bought/" + item).set(checkbox.checked);
      row.style.textDecoration = checkbox.checked ? "line-through" : "none";
    };

    const label = document.createElement("span");
    label.textContent = ` ${item}: ${totals[item]}×`;

    row.appendChild(checkbox);
    row.appendChild(label);
    list.appendChild(row);
  }
}


/***********************************
 * 🚀 INITIALISIERUNG (SEHR WICHTIG)
 ***********************************/
renderProducts();
showOrderView();
