/******** FIREBASE ********/
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
const productsEl = document.getElementById("products");
const overviewEl = document.getElementById("overview");
const bakerList = document.getElementById("bakerList");

/******** ICONS ********/
function renderIcons() {
  const picker = document.getElementById("iconPicker");
  picker.innerHTML = "";
  ICONS.forEach((i, idx) => {
    const s = document.createElement("span");
    s.textContent = i;
    s.className = "icon" + (idx===0?" selected":"");
    s.onclick = () => {
      document.querySelectorAll(".icon").forEach(x=>x.classList.remove("selected"));
      s.classList.add("selected");
      selectedIcon = i;
    };
    picker.appendChild(s);
  });
}

/******** PRODUKTE ********/
function renderProducts() {
  productsEl.innerHTML = "";
  cart = {};
  for (let c in PRODUCTS) {
    productsEl.innerHTML += `<h3>${c}</h3>`;
    PRODUCTS[c].forEach(p => {
      cart[p] = 0;
      productsEl.innerHTML += `
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

/******** BESTELLUNG ********/
document.getElementById("saveBtn").onclick = () => {
  const family = family.value;
  if (!family) return alert("Name fehlt");

  db.ref("orders/"+family).set({
    family,
    icon: selectedIcon,
    items: cart,
    note: note.value,
    done: false
  });

  family.value = "";
  note.value = "";
  renderProducts();
  renderIcons();
};

/******** LIVE ********/
db.ref("orders").on("value", snap => {
  overviewEl.innerHTML = "";
  bakerList.innerHTML = "";

  snap.forEach(c => {
    const d = c.val();

    // Übersicht
    const box = document.createElement("div");
    box.className = "overview-box";
    box.innerHTML = `${d.icon} <b>${d.family}</b><br>${d.note||""}`;
    overviewEl.appendChild(box);

    // Bäcker
    const b = document.createElement("div");
    b.className = "baker-box" + (d.done?" checked":"");
    b.innerHTML = `${d.icon} ${d.family} – ${d.note||""}`;
    b.onclick = () => db.ref("orders/"+c.key+"/done").set(!d.done);
    bakerList.appendChild(b);
  });
});

/******** MODUS ********/
window.showOrder = () => {
  orderView.style.display="block";
  bakerView.style.display="none";
};
window.showBaker = () => {
  orderView.style.display="none";
  bakerView.style.display="block";
};

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
