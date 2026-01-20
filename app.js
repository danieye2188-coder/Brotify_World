/******** FIREBASE ********/
firebase.initializeApp({
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
});
const db = firebase.database();

/******** GROUP ********/
const groupId =
  new URLSearchParams(window.location.search).get("group") || "DEMO";

/******** ICONS ********/
const ICONS = ["🦊","🐻","🦄","🍄","👻","🐸","🐼","🐱","🐶"];
let selectedIcon = ICONS[0];

/******** PRODUKTE ********/
const PRODUCTS = {
  "Weckle & Brötchen": ["Laugenweckle","Körnerweckle","Seelen"],
  "Laugengebäck": ["Brezel","Laugenstange"],
  "Süßes": ["Buttercroissant","Schokocroissant"]
};

let cart = {};
const productsEl = document.getElementById("products");
const overviewEl = document.getElementById("overview");
const archiveEl = document.getElementById("archive");

/******** ICON PICKER ********/
function renderIcons() {
  const picker = document.getElementById("iconPicker");
  picker.innerHTML = "";
  ICONS.forEach(icon => {
    const s = document.createElement("span");
    s.textContent = icon;
    s.className = "icon";
    s.onclick = () => {
      document.querySelectorAll(".icon").forEach(i => i.classList.remove("selected"));
      s.classList.add("selected");
      selectedIcon = icon;
    };
    picker.appendChild(s);
  });
}

/******** PRODUKTE ********/
function renderProducts() {
  productsEl.innerHTML = "";
  cart = {};
  for (let cat in PRODUCTS) {
    productsEl.innerHTML += `<h3>${cat}</h3>`;
    PRODUCTS[cat].forEach(p => {
      cart[p] = 0;
      const row = document.createElement("div");
      row.className = "product";
      row.innerHTML = `
        <div>${p}</div>
        <button class="pm">−</button>
        <div class="amount">0</div>
        <button class="pm">+</button>
      `;
      const [minus, amt, plus] = row.querySelectorAll("button, .amount");
      minus.onclick = () => { if (cart[p] > 0) amt.textContent = --cart[p]; };
      plus.onclick = () => { amt.textContent = ++cart[p]; };
      productsEl.appendChild(row);
    });
  }
}

/******** BESTELLUNG SPEICHERN ********/
document.getElementById("saveBtn").onclick = () => {
  const household = family.value.trim();
  if (!household) return alert("Name fehlt");

  db.ref(`groups/${groupId}/currentRound/orders`).push({
    household,
    icon: selectedIcon,
    items: cart,
    createdAt: Date.now()
  });

  family.value = "";
  renderProducts();
};

/******** AKTIVE BESTELLUNGEN ********/
db.ref(`groups/${groupId}/currentRound/orders`)
  .on("value", snap => {
    overviewEl.innerHTML = "";
    snap.forEach(o => {
      const d = o.val();
      const box = document.createElement("div");
      box.className = "overview-box";
      box.innerHTML = `${d.icon} <b>${d.household}</b>`;
      for (let i in d.items) {
        if (d.items[i] > 0) box.innerHTML += `<br>${i}: ${d.items[i]}×`;
      }
      overviewEl.appendChild(box);
    });
  });

/******** ABHOLER + COUNTDOWN ********/
const pickupLabel = document.getElementById("pickupLabel");
const pickupInput = document.getElementById("pickupInput");
const pickupTime = document.getElementById("pickupTime");
const countdownEl = document.getElementById("countdown");

document.getElementById("savePickup").onclick = () => {
  db.ref(`groups/${groupId}/currentRound`).update({
    pickupBy: pickupInput.value || null,
    pickupAt: pickupTime.value ? new Date(pickupTime.value).getTime() : null
  });
};

db.ref(`groups/${groupId}/currentRound`).on("value", snap => {
  const d = snap.val();
  if (!d) return;
  pickupLabel.textContent = d.pickupBy ? `🚗💨 ${d.pickupBy}` : "🚗💨";
  if (d.pickupAt) startCountdown(d.pickupAt);
});

function startCountdown(ts) {
  clearInterval(window._cd);
  window._cd = setInterval(() => {
    const diff = ts - Date.now();
    if (diff <= 0) {
      countdownEl.textContent = "🚗💨 Wird abgeholt!";
      clearInterval(window._cd);
    } else {
      const h = Math.floor(diff / 3600000);
      const m = Math.floor(diff / 60000) % 60;
      countdownEl.textContent = `⏳ Noch ${h}h ${m}min`;
    }
  }, 1000);
}

/******** RUNDE ABSCHLIESSEN → ARCHIV ********/
document.getElementById("closeRound").onclick = async () => {
  const ref = db.ref(`groups/${groupId}`);
  const snap = await ref.child("currentRound").once("value");
  if (!snap.exists()) return;

  const round = snap.val();
  const now = Date.now();

  await ref.child("archive").push({
    ...round,
    closedAt: now,
    deleteAt: now + 14 * 24 * 60 * 60 * 1000
  });

  await ref.child("currentRound").remove();
};

/******** ARCHIV ********/
db.ref(`groups/${groupId}/archive`)
  .on("value", snap => {
    archiveEl.innerHTML = "";
    snap.forEach(r => {
      const d = r.val();
      const box = document.createElement("div");
      box.className = "overview-box";
      box.innerHTML = `🗓️ ${new Date(d.pickupAt).toLocaleString("de-DE")}`;
      archiveEl.appendChild(box);
    });
  });

/******** START ********/
renderIcons();
renderProducts();
