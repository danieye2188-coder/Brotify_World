/******** FIREBASE ********/
var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/******** STATE ********/
let cart = {};
let selectedIcon = "🦊";
let editOrderId = null;

/******** CONSTANTS ********/
const ICONS = ["🦊","🐻","🦄","🍄","👻","🐸","🐼","🐱","🐶","🦉","🐯","🐷","🐮","🐰","🐵"];

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

/******** DOM ********/
const productsEl = document.getElementById("products");
const overviewEl = document.getElementById("overview");
const shoppingListEl = document.getElementById("shoppingList");
const nameInput = document.getElementById("family");
const remarkInput = document.getElementById("remark");
const pickupInline = document.getElementById("pickupInline");
const pickupInput = document.getElementById("pickupInput");
const saveBtn = document.getElementById("saveBtn");

/******** ICON PICKER ********/
function renderIcons(activeIcon = selectedIcon) {
  const picker = document.getElementById("iconPicker");
  picker.innerHTML = "";

  ICONS.forEach(icon => {
    const span = document.createElement("span");
    span.textContent = icon;
    span.className = "icon";
    if (icon === activeIcon) span.classList.add("selected");

    span.onclick = () => {
      document.querySelectorAll(".icon").forEach(i => i.classList.remove("selected"));
      span.classList.add("selected");
      selectedIcon = icon;
    };

    picker.appendChild(span);
  });
}

/******** PRODUKTE ********/
function renderProducts(items = {}) {
  productsEl.innerHTML = "";
  cart = {};

  for (let cat in PRODUCTS) {
    const h = document.createElement("h3");
    h.textContent = cat;
    productsEl.appendChild(h);

    PRODUCTS[cat].forEach(p => {
      cart[p] = items[p] || 0;

      const row = document.createElement("div");
      row.className = "product";

      const name = document.createElement("div");
      name.textContent = p;

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.className = "pm";

      const amt = document.createElement("div");
      amt.className = "amount";
      amt.textContent = cart[p];

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.className = "pm";

      minus.onclick = () => {
        if (cart[p] > 0) {
          cart[p]--;
          amt.textContent = cart[p];
        }
      };

      plus.onclick = () => {
        cart[p]++;
        amt.textContent = cart[p];
      };

      row.append(name, minus, amt, plus);
      productsEl.appendChild(row);
    });
  }
}

/******** SPEICHERN / UPDATE ********/
saveBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Bitte deinen Namen eingeben");

  const data = {
    name,
    icon: selectedIcon,
    remark: remarkInput.value.trim(),
    items: cart,
    time: Date.now()
  };

  if (editOrderId) {
    db.ref("orders/" + editOrderId).update(data);
  } else {
    db.ref("orders").push(data);
  }

  resetForm();
};

function resetForm() {
  editOrderId = null;
  saveBtn.textContent = "🛒 Bestellung speichern";
  nameInput.value = "";
  remarkInput.value = "";
  selectedIcon = ICONS[0];
  renderIcons();
  renderProducts();
}

/******** LIVE ÜBERSICHT + EINKAUFSZETTEL ********/
db.ref("orders").on("value", snap => {
  overviewEl.innerHTML = "";
  shoppingListEl.innerHTML = "";

  const totalItems = {};
  const remarks = [];

  snap.forEach(c => {
    const d = c.val();

    const box = document.createElement("div");
    box.className = "overview-box";

    box.innerHTML = `${d.icon} <b>${d.name}</b>
      ${d.remark ? `<div class="remark">📝 ${d.remark}</div>` : ""}`;

    for (let i in d.items) {
      if (d.items[i] > 0) {
        totalItems[i] = (totalItems[i] || 0) + d.items[i];
      }
    }

    if (d.remark) remarks.push(`📝 ${d.name}: ${d.remark}`);

    overviewEl.appendChild(box);
  });

  /* Einkaufszettel – Produkte */
  for (let item in totalItems) {
    shoppingListEl.innerHTML += `
      <div class="shopping-item">
        <span class="text">${totalItems[item]}× ${item}</span>
        <input type="checkbox">
      </div>
    `;
  }

  /* Einkaufszettel – Bemerkungen */
  if (remarks.length) {
    remarks.forEach(r => {
      shoppingListEl.innerHTML += `
        <div class="shopping-item remark-item">
          <span class="text">${r}</span>
          <input type="checkbox">
        </div>
      `;
    });
  }
});

/******** ABHOLER ********/
db.ref("meta/abholer").on("value", snap => {
  pickupInline.textContent = snap.val()
    ? `🚗💨 Abholer: ${snap.val()}`
    : "🚗💨 kein Abholer";
});

document.getElementById("savePickup").onclick = () => {
  if (pickupInput.value) {
    db.ref("meta/abholer").set(pickupInput.value);
    pickupInput.value = "";
  }
};

document.getElementById("clearPickup").onclick = () => {
  db.ref("meta/abholer").remove();
};

/******** START ********/
renderIcons();
renderProducts();
