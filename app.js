/******** FIREBASE ********/
var firebaseConfig = {
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

/******** ABHOLER ********/
function savePickup() {
  const name = pickupInput.value;
  if (!name) return;
  localStorage.setItem("pickup", name);
  pickupInput.value = "";
  pickupBox.style.display = "none";
  updatePickupDisplay();
}

function updatePickupDisplay() {
  const p = localStorage.getItem("pickup");
  if (p) {
    pickupDisplay.textContent = `👤🚗 Abholer: ${p}`;
    pickupBaker.textContent = `👤🚗 Abholer: ${p}`;
  }
}

/******** ICON PICKER ********/
function renderIcons() {
  iconPicker.innerHTML = "";
  ICONS.forEach(i => {
    const span = document.createElement("span");
    span.textContent = i;
    span.className = "icon";
    span.onclick = () => {
      document.querySelectorAll(".icon").forEach(x=>x.classList.remove("selected"));
      span.classList.add("selected");
      selectedIcon = i;
    };
    iconPicker.appendChild(span);
  });
  iconPicker.firstChild.classList.add("selected");
}

/******** PRODUKTE ********/
function renderProducts() {
  products.innerHTML = "";
  cart = {};
  for (let cat in PRODUCTS) {
    const h = document.createElement("h3");
    h.textContent = cat;
    products.appendChild(h);

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
      products.appendChild(row);
    });
  }
}

/******** RESET BEI FAMILIE ********/
family.addEventListener("input", e => {
  if (e.target.value !== lastFamily) {
    lastFamily = e.target.value;
    renderProducts();
  }
});

/******** BESTELLUNG ********/
function submitOrder() {
  if (!family.value) return alert("Familienname fehlt");
  db.ref("orders/" + family.value).set({
    family: family.value,
    icon: selectedIcon,
    items: cart
  });
}

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
        totals[i] = (totals[i]||0) + d.items[i];
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
function showOrderView(){orderView.style.display="block";bakerView.style.display="none";}
function showBakerView(){orderView.style.display="none";bakerView.style.display="block";}

/******** INIT ********/
renderIcons();
renderProducts();
showOrderView();
updatePickupDisplay();

if (localStorage.getItem("pickup")) {
  pickupBox.style.display = "none";
}
