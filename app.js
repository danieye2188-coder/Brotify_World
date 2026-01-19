/******** FIREBASE ********/
var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/******** DOM ELEMENTE ********/
const productsEl = document.getElementById("products");
const familyInput = document.getElementById("familyInput");
const iconPicker = document.getElementById("iconPicker");
const overview = document.getElementById("overview");
const bakerList = document.getElementById("bakerList");
const orderView = document.getElementById("orderView");
const bakerView = document.getElementById("bakerView");

const pickupBox = document.getElementById("pickupBox");
const pickupInput = document.getElementById("pickupInput");
const pickupDisplay = document.getElementById("pickupDisplay");
const pickupBaker = document.getElementById("pickupBaker");

/******** ICONS ********/
const ICONS = ["🦊","🐻","🦄","🍄","👻","🐸","🐼","🐱","🐶","🦉","🐯","🐷","🐮","🐰","🐵"];
let selectedIcon = ICONS[0];

/******** PRODUKTE ********/
const PRODUCTS = {
  "Weckle & Brötchen": ["Laugenweckle","Körnerweckle","Doppelweckle","Seelen"],
  "Laugengebäck": ["Brezel","Laugenstange"],
  "Croissants": ["Buttercroissant","Schokocroissant"],
  "Brot": ["Zopf"]
};

let cart = {};
let lastFamily = "";

/******** ICON PICKER ********/
function renderIcons() {
  iconPicker.innerHTML = "";
  ICONS.forEach(icon => {
    const span = document.createElement("span");
    span.textContent = icon;
    span.className = "icon";
    span.onclick = () => {
      document.querySelectorAll(".icon").forEach(i=>i.classList.remove("selected"));
      span.classList.add("selected");
      selectedIcon = icon;
    };
    iconPicker.appendChild(span);
  });
  iconPicker.firstChild.classList.add("selected");
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

      const name = document.createElement("span");
      name.textContent = p;

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.className = "pm";
      minus.onclick = () => {
        if (cart[p] > 0) cart[p]--;
        amt.textContent = cart[p];
      };

      const amt = document.createElement("span");
      amt.textContent = "0";
      amt.className = "amount";

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

/******** ABHOLER ********/
function updatePickup() {
  const p = localStorage.getItem("pickup");
  if (p) {
    pickupDisplay.textContent = `👤🚗 Abholer: ${p}`;
    pickupBaker.textContent = `👤🚗 Abholer: ${p}`;
    pickupBox.style.display = "none";
  }
}

document.getElementById("savePickupBtn").onclick = () => {
  if (!pickupInput.value) return;
  localStorage.setItem("pickup", pickupInput.value);
  updatePickup();
};

/******** RESET BEI FAMILIE ********/
familyInput.addEventListener("input", e => {
  if (e.target.value !== lastFamily) {
    lastFamily = e.target.value;
    renderProducts();
  }
});

/******** BESTELLUNG ********/
document.getElementById("saveOrderBtn").onclick = () => {
  if (!familyInput.value) return alert("Familienname fehlt");

  db.ref("orders/" + familyInput.value).set({
    family: familyInput.value,
    icon: selectedIcon,
    items: cart
  });
};

/******** LIVE ********/
db.ref("orders").on("value", snap => {
  overview.innerHTML = "";
  bakerList.innerHTML = "";
  const totals = {};

  snap.forEach(c => {
    const d = c.val();
    const box = document.createElement("div");
    box.className = "overview-box";
    box.innerHTML = `${d.icon} <b>${d.family}</b>`;
    for (let i in d.items) {
      if (d.items[i] > 0) {
        box.innerHTML += `<br>${i}: ${d.items[i]}×`;
        totals[i] = (totals[i] || 0) + d.items[i];
      }
    }
    overview.appendChild(box);
  });

  for (let i in totals) {
    const r = document.createElement("div");
    r.textContent = `${i}: ${totals[i]}×`;
    bakerList.appendChild(r);
  }
});

/******** VIEW ********/
document.getElementById("orderBtn").onclick = () => {
  orderView.style.display = "block";
  bakerView.style.display = "none";
};
document.getElementById("bakerBtn").onclick = () => {
  orderView.style.display = "none";
  bakerView.style.display = "block";
};

/******** INIT ********/
renderIcons();
renderProducts();
updatePickup();
