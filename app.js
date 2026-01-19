firebase.initializeApp({
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
});
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

/******** ICON PICKER ********/
function renderIcons() {
  iconPicker.innerHTML = "";
  ICONS.forEach((i, idx) => {
    const s = document.createElement("span");
    s.textContent = i;
    s.className = "icon" + (idx===0?" selected":"");
    s.onclick = () => {
      document.querySelectorAll(".icon").forEach(x=>x.classList.remove("selected"));
      s.classList.add("selected");
      selectedIcon = i;
    };
    iconPicker.appendChild(s);
  });
}

/******** PRODUKTE ********/
function renderProducts() {
  products.innerHTML = "";
  cart = {};
  for (let c in PRODUCTS) {
    products.innerHTML += `<h3>${c}</h3>`;
    PRODUCTS[c].forEach(p => {
      cart[p] = 0;
      products.innerHTML += `
        <div class="product">
          <div>${p}</div>
          <button onclick="change('${p}',-1)">−</button>
          <div id="a_${p}">0</div>
          <button onclick="change('${p}',1)">+</button>
        </div>`;
    });
  }
}
window.change = (p,d) => {
  cart[p] = Math.max(0, cart[p]+d);
  document.getElementById("a_"+p).innerText = cart[p];
};

/******** SPEICHERN ********/
saveBtn.onclick = () => {
  if (!family.value) return alert("Familienname fehlt");

  db.ref("orders/"+family.value).set({
    family: family.value,
    icon: selectedIcon,
    items: cart,
    note: note.value
  });

  family.value = "";
  note.value = "";
  renderProducts();
  renderIcons();
};

/******** LIVE ********/
db.ref("orders").on("value", snap => {
  overview.innerHTML = "";
  totals.innerHTML = "";
  families.innerHTML = "";

  const sum = {};

  snap.forEach(c => {
    const d = c.val();

    // Übersicht Bestellung
    overview.innerHTML += `
      <div class="box">
        ${d.icon} <b>${d.family}</b><br>
        ${d.note || ""}
      </div>`;

    // Familie einzeln
    let famHtml = `<div class="box">${d.icon} <b>${d.family}</b><br>`;
    for (let i in d.items) {
      if (d.items[i] > 0) {
        famHtml += `${i}: ${d.items[i]}×<br>`;
        sum[i] = (sum[i] || 0) + d.items[i];
      }
    }
    famHtml += `<i>${d.note||""}</i></div>`;
    families.innerHTML += famHtml;
  });

  // Gesamt
  for (let i in sum) {
    totals.innerHTML += `<div>${i}: <b>${sum[i]}×</b></div>`;
  }
});

/******** MODUS ********/
function showOrder() {
  orderView.style.display="block";
  shopView.style.display="none";
}
function showShop() {
  orderView.style.display="none";
  shopView.style.display="block";
}

/******** ABHOLER ********/
db.ref("meta/abholer").on("value", s=>{
  pickupLabel.innerText = s.val()?`🚗💨 ${s.val()}`:"🚗💨";
  pickupInput.style.display = s.val()?"none":"inline";
});
savePickup.onclick = ()=> pickupInput.value && db.ref("meta/abholer").set(pickupInput.value);
clearPickup.onclick = ()=> db.ref("meta/abholer").remove();

/******** START ********/
renderIcons();
renderProducts();
