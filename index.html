/******** FIREBASE ********/
var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/******** 🧩 FAMILIEN ICONS ********/
const ICONS = ["🦊","🐻","🦄","🍄","👻","🐸","🐼","🐱","🐶","🦉","🐯","🐷","🐮","🐰","🐵"];
let selectedIcon = ICONS[0];

/******** 🥖 PRODUKTE ********/
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

/******** 🧩 ICON PICKER ********/
function renderIcons() {
  const picker = document.getElementById("iconPicker");
  picker.innerHTML = "";

  ICONS.forEach(icon => {
    const span = document.createElement("span");
    span.textContent = icon;
    span.className = "icon";
    span.onclick = () => {
      document.querySelectorAll(".icon").forEach(i => i.classList.remove("selected"));
      span.classList.add("selected");
      selectedIcon = icon;
    };
    picker.appendChild(span);
  });

  picker.firstChild.classList.add("selected");
}

/******** 🛒 PRODUKTE ********/
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

/******** 💾 BESTELLUNG ********/
document.getElementById("saveBtn").onclick = () => {
  const family = document.getElementById("family").value;
  if (!family) return alert("Familienname fehlt");

  db.ref("orders/" + family).set({
    family,
    icon: selectedIcon,
    items: cart
  });
};

/******** 🔴 LIVE + ❌ LÖSCHEN ********/
db.ref("orders").on("value", snap => {
  overviewEl.innerHTML = "";

  snap.forEach(c => {
    const d = c.val();
    const box = document.createElement("div");
    box.className = "overview-box";

    box.innerHTML = `${d.icon} <b>${c.key}</b>`;

    for (let i in d.items) {
      if (d.items[i] > 0) {
        box.innerHTML += `<br>${i}: ${d.items[i]}×`;
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

/******** 🚗💨 ABHOLER (LIVE) ********/
const pickupInput = document.getElementById("pickupInput");
const pickupLabel = document.getElementById("pickupLabel");

db.ref("meta/abholer").on("value", snap => {
  const name = snap.val();
  pickupLabel.textContent = name ? `🚗💨 ${name}` : "🚗💨";
  pickupInput.style.display = name ? "none" : "inline-block";
});

document.getElementById("savePickup").onclick = () => {
  if (!pickupInput.value) return;
  db.ref("meta/abholer").set(pickupInput.value);
};

document.getElementById("clearPickup").onclick = () => {
  db.ref("meta/abholer").remove();
};

/******** START ********/
renderIcons();
renderProducts();
