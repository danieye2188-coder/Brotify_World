/******** FIREBASE ********/
firebase.initializeApp({
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
});
const db = firebase.database();

/******** DOM ********/
const productsEl = document.getElementById("products");
const ordersEl = document.getElementById("orders");
const shoppingEl = document.getElementById("shoppingList");
const familyInput = document.getElementById("family");

/******** GROUP ********/
let groupId = null;

/******** ICONS ********/
const ICONS = ["🦊","🐻","🦄","🍄","👻","🐸","🐼","🐱","🐶"];
let selectedIcon = ICONS[0];

/******** PRODUKTE (ORIGINAL) ********/
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

let cart = {};

/******** ICON PICKER ********/
function renderIcons() {
  iconPicker.innerHTML = "";
  ICONS.forEach(icon => {
    const s = document.createElement("span");
    s.textContent = icon;
    s.className = "icon";
    s.onclick = () => {
      document.querySelectorAll(".icon").forEach(i => i.classList.remove("selected"));
      s.classList.add("selected");
      selectedIcon = icon;
    };
    iconPicker.appendChild(s);
  });
}

/******** PRODUKTE ********/
function renderProducts() {
  productsEl.innerHTML = "";
  cart = {};

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

      const amt = document.createElement("div");
      amt.className = "amount";
      amt.textContent = "0";

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

/******** ABHOLER ********/
savePickup.onclick = async () => {
  if (!pickupInput.value || !pickupTime.value) {
    alert("Abholer & Zeit eingeben");
    return;
  }

  if (!groupId) {
    groupId = Math.random().toString(36).substring(2, 7).toUpperCase();
    await db.ref("groups/" + groupId).set({ createdAt: Date.now() });

    const link = location.origin + location.pathname + "?group=" + groupId;
    inviteLink.value = link;
    inviteBox.style.display = "block";
  }

  db.ref(`groups/${groupId}/currentRound`).set({
    pickupBy: pickupInput.value,
    pickupAt: new Date(pickupTime.value).getTime()
  });

  pickupLabel.textContent = "🚗💨 " + pickupInput.value;
  listenOrders();
};

/******** BESTELLUNG ********/
saveBtn.onclick = () => {
  if (!groupId) return alert("Warten bis Abholer startet");
  if (!familyInput.value) return alert("Name fehlt");

  db.ref(`groups/${groupId}/currentRound/orders`).push({
    household: familyInput.value,
    icon: selectedIcon,
    items: cart
  });

  familyInput.value = "";
  renderProducts();
};

/******** BESTELLUNGEN + EINKAUFSZETTEL ********/
function listenOrders() {
  db.ref(`groups/${groupId}/currentRound/orders`).on("value", snap => {
    ordersEl.innerHTML = "";
    shoppingEl.innerHTML = "";

    const sum = {};

    snap.forEach(o => {
      const d = o.val();

      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `${d.icon} <b>${d.household}</b>`;

      for (let i in d.items) {
        if (d.items[i] > 0) {
          box.innerHTML += `<br>${i}: ${d.items[i]}×`;
          sum[i] = (sum[i] || 0) + d.items[i];
        }
      }

      ordersEl.appendChild(box);
    });

    for (let item in sum) {
      const row = document.createElement("div");
      row.className = "box";
      row.innerHTML = `<b>${item}</b>: ${sum[item]}×`;

      const btn = document.createElement("button");
      btn.textContent = "✔ abgehakt";
      btn.className = "check";
      btn.onclick = () => row.classList.add("done");

      row.appendChild(btn);
      shoppingEl.appendChild(row);
    }
  });
}

/******** START ********/
renderIcons();
renderProducts();
