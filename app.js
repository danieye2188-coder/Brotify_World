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

/******** EINLADUNG ********/
const inviteUrl =
  window.location.origin + window.location.pathname + "?group=" + groupId;
inviteLink.value = inviteUrl;
copyInvite.onclick = () => {
  inviteLink.select();
  document.execCommand("copy");
  alert("Link kopiert");
};

/******** ICONS ********/
const ICONS = ["🦊","🐻","🦄","🍄","👻","🐸","🐼","🐱","🐶"];
let selectedIcon = ICONS[0];

/******** PRODUKTE (VOLLSTÄNDIG) ********/
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
  ICONS.forEach(i => {
    const s = document.createElement("span");
    s.textContent = i;
    s.className = "icon";
    s.onclick = () => {
      document.querySelectorAll(".icon").forEach(x => x.classList.remove("selected"));
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
  for (let cat in PRODUCTS) {
    products.innerHTML += `<h3>${cat}</h3>`;
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
      plus.onclick = () => amt.textContent = ++cart[p];
      products.appendChild(row);
    });
  }
}

/******** BESTELLUNG ********/
saveBtn.onclick = () => {
  if (!family.value) return alert("Name fehlt");
  db.ref(`groups/${groupId}/currentRound/orders`).push({
    household: family.value,
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
    overview.innerHTML = "";
    snap.forEach(o => {
      const d = o.val();
      const box = document.createElement("div");
      box.className = "overview-box";
      box.innerHTML = `${d.icon} <b>${d.household}</b>`;
      for (let i in d.items) {
        if (d.items[i] > 0) box.innerHTML += `<br>${i}: ${d.items[i]}×`;
      }
      overview.appendChild(box);
    });
  });

/******** ABHOLER + COUNTDOWN ********/
savePickup.onclick = () => {
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
      countdown.textContent = "🚗💨 Wird abgeholt!";
      clearInterval(window._cd);
    } else {
      const h = Math.floor(diff / 3600000);
      const m = Math.floor(diff / 60000) % 60;
      countdown.textContent = `⏳ Noch ${h}h ${m}min`;
    }
  }, 1000);
}

/******** RUNDE ABSCHLIESSEN ********/
closeRound.onclick = async () => {
  const ref = db.ref(`groups/${groupId}`);
  const snap = await ref.child("currentRound").once("value");
  if (!snap.exists()) return;

  const now = Date.now();
  await ref.child("archive").push({
    ...snap.val(),
    closedAt: now,
    deleteAt: now + 14 * 24 * 60 * 60 * 1000
  });
  await ref.child("currentRound").remove();
};

/******** ARCHIV ********/
db.ref(`groups/${groupId}/archive`).on("value", snap => {
  archive.innerHTML = "";
  snap.forEach(r => {
    const d = r.val();
    const box = document.createElement("div");
    box.className = "overview-box";
    box.textContent = new Date(d.pickupAt).toLocaleString("de-DE");
    archive.appendChild(box);
  });
});

/******** START ********/
renderIcons();
renderProducts();
