/******** FIREBASE ********/
firebase.initializeApp({
  apiKey: "AIzaSyA8dGj6T1E3PkO3YBu3OdpW_ZjCg00dncU",
  authDomain: "brotifyneu.firebaseapp.com",
  databaseURL: "https://brotifyneu-default-rtdb.firebaseio.com",
  projectId: "brotifyneu"
});
const db = firebase.database();

/******** GROUP ********/
let groupId =
  new URLSearchParams(window.location.search).get("group") || null;

/******** ICONS ********/
const ICONS = ["🦊","🐻","🦄","🍄","👻","🐸","🐼","🐱","🐶"];
let selectedIcon = ICONS[0];

/******** PRODUKTE (DEIN VOLLSTÄNDIGES SORTIMENT) ********/
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

/******** ABHOLER → GRUPPE ERSTELLEN ********/
savePickup.onclick = async () => {
  const name = pickupInput.value.trim();
  const time = pickupTime.value;

  if (!name || !time) {
    alert("Abholer & Abholzeit eingeben");
    return;
  }

  if (!groupId) {
    groupId = Math.random().toString(36).substring(2, 7).toUpperCase();
    await db.ref(`groups/${groupId}`).set({ createdAt: Date.now() });

    const link =
      window.location.origin +
      window.location.pathname +
      "?group=" + groupId;

    window.history.replaceState({}, "", link);
    inviteLink.value = link;
    inviteBox.style.display = "block";
  }

  await db.ref(`groups/${groupId}/currentRound`).set({
    pickupBy: name,
    pickupAt: new Date(time).getTime()
  });
};

/******** EINLADUNG KOPIEREN ********/
copyInvite.onclick = () => {
  inviteLink.select();
  document.execCommand("copy");
  alert("Einladungslink kopiert");
};

/******** BESTELLUNG ********/
saveBtn.onclick = () => {
  if (!groupId) {
    alert("Warte bis der Abholer die Runde startet");
    return;
  }
  if (!family.value.trim()) {
    alert("Haushaltsname fehlt");
    return;
  }

  db.ref(`groups/${groupId}/currentRound/orders`).push({
    household: family.value.trim(),
    icon: selectedIcon,
    items: cart,
    createdAt: Date.now()
  });

  family.value = "";
  renderProducts();
};

/******** AKTIVE BESTELLUNGEN ********/
if (groupId) {
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
}

/******** COUNTDOWN ********/
db.ref().on("value", () => {
  if (!groupId) return;

  db.ref(`groups/${groupId}/currentRound`).once("value", snap => {
    const d = snap.val();
    if (!d || !d.pickupAt) return;

    clearInterval(window._cd);
    window._cd = setInterval(() => {
      const diff = d.pickupAt - Date.now();
      if (diff <= 0) {
        countdown.textContent = "🚗💨 Wird abgeholt!";
        clearInterval(window._cd);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor(diff / 60000) % 60;
        countdown.textContent = `⏳ Noch ${h}h ${m}min`;
      }
    }, 1000);
  });
});

/******** RUNDE ABSCHLIESSEN → ARCHIV ********/
closeRound.onclick = async () => {
  if (!groupId) return;

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
if (groupId) {
  db.ref(`groups/${groupId}/archive`).on("value", snap => {
    archive.innerHTML = "";
    snap.forEach(r => {
      const d = r.val();
      const box = document.createElement("div");
      box.className = "overview-box";
      box.textContent =
        "🗓️ " + new Date(d.pickupAt).toLocaleString("de-DE");
      archive.appendChild(box);
    });
  });
}

/******** START ********/
renderIcons();
renderProducts();
