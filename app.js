/******** FIREBASE ********/
var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/******** PRODUKTE ********/
const PRODUCTS = {
  "Weckle & Brötchen": [
    "Laugenweckle","Körnerweckle","Doppelweckle","Seelen",
    "Sonnenblumeweckle","Kürbisweckle","Dinkelweckle",
    "Vollkornweckle","Mehrkornweckle","Roggenweckle"
  ],
  "Laugengebäck & Laugenecken": [
    "Laugenstange","Laugenhörnchen",
    "Laugenecke klassisch","Laugenecke mit Körnern","Brezel"
  ],
  "Croissants & süßes Gebäck": [
    "Buttercroissant","Schokocroissant"
  ],
  "Brote & Zopf": [
    "Zopf","Kleines Landbrot"
  ]
};

const cart = {};
const productsEl = document.getElementById("products");
const overviewEl = document.getElementById("overview");

/******** PRODUKTE ********/
function renderProducts() {
  productsEl.innerHTML = "";

  for (let cat in PRODUCTS) {
    const h = document.createElement("h3");
    h.textContent = cat;
    productsEl.appendChild(h);

    PRODUCTS[cat].forEach(p => {
      cart[p] = 0;

      const row = document.createElement("div");
      row.className = "product";

      const name = document.createElement("div");
      name.textContent = p;

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.className = "pm";
      minus.onclick = () => {
        if (cart[p] > 0) {
          cart[p]--;
          amt.textContent = cart[p];
        }
      };

      const amt = document.createElement("div");
      amt.className = "amount";
      amt.textContent = "0";

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.className = "pm";
      plus.onclick = () => {
        cart[p]++;
        amt.textContent = cart[p];
      };

      row.append(name, minus, amt, plus);
      productsEl.appendChild(row);
    });
  }
}

/******** BESTELLUNG SPEICHERN ********/
document.getElementById("saveBtn").onclick = () => {
  const family = document.getElementById("family").value;
  if (!family) return alert("Familienname fehlt");

  db.ref("orders/" + family).set(cart);
};

/******** 🔴 LIVE + LÖSCHEN ********/
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

    const del = document.createElement("button");
    del.textContent = "❌ Bestellung löschen";
    del.className = "delete-btn";
    del.onclick = () => {
      if (confirm("Bestellung wirklich löschen?")) {
        db.ref("orders/" + c.key).remove();
      }
    };

    box.appendChild(del);
    overviewEl.appendChild(box);
  });
});

/******** 🚗💨 ABHOLER ********/
const pickupInput = document.getElementById("pickupInput");
const savePickup = document.getElementById("savePickup");
const clearPickup = document.getElementById("clearPickup");
const pickupLabel = document.getElementById("pickupLabel");

function loadPickup() {
  const p = localStorage.getItem("pickup");
  if (p) {
    pickupLabel.textContent = `🚗💨 ${p}`;
    pickupInput.style.display = "none";
  }
}

savePickup.onclick = () => {
  if (!pickupInput.value) return;
  localStorage.setItem("pickup", pickupInput.value);
  loadPickup();
};

clearPickup.onclick = () => {
  localStorage.removeItem("pickup");
  pickupLabel.textContent = "🚗💨";
  pickupInput.style.display = "inline-block";
  pickupInput.value = "";
};

/******** START ********/
renderProducts();
loadPickup();
