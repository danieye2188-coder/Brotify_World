var firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT.firebaseio.com",
  projectId: "DEIN_PROJEKT",
  appId: "DEINE_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const PRODUCTS = {
  "Weckle & Brötchen": [
    "Laugenweckle",
    "Körnerweckle",
    "Doppelweckle",
    "Seelen",
    "Sonnenblumeweckle",
    "Kürbisweckle",
    "Dinkelweckle",
    "Vollkornweckle",
    "Mehrkornweckle",
    "Roggenweckle"
  ],
  "Laugengebäck & Laugenecken": [
    "Laugenstange",
    "Laugenhörnchen",
    "Laugenecke klassisch",
    "Laugenecke mit Körnern",
    "Brezel"
  ],
  "Croissants & süßes Gebäck": [
    "Buttercroissant",
    "Schokocroissant"
  ],
  "Brote & Zopf": [
    "Zopf",
    "Kleines Landbrot"
  ]
};
const cart = {};

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  for (let category in PRODUCTS) {
    const h3 = document.createElement("h3");
    h3.textContent = category;
    container.appendChild(h3);

    PRODUCTS[category].forEach(product => {
      const row = document.createElement("div");
      row.className = "product";

      const label = document.createElement("span");
      label.textContent = product;

      const input = document.createElement("input");
      input.type = "number";
      input.min = 0;
      input.value = 0;

      input.onchange = () => {
        cart[product] = parseInt(input.value) || 0;
      };

      row.appendChild(label);
      row.appendChild(input);
      container.appendChild(row);
    });
  }
}

// ⬇️ WICHTIG: Funktion AUFRUFEN
renderProducts();
function submitOrder() {
  const family = document.getElementById("family").value;
  const note = document.getElementById("note").value;

  if (!family) {
    alert("Bitte Familiennamen eingeben");
    return;
  }

  db.ref("orders/" + family).set({
    family: family,
    note: note,
    items: cart,
    time: Date.now()
  });

  alert("Bestellung gespeichert");
}
db.ref("orders").on("value", snapshot => {
  const overview = document.getElementById("overview");
  overview.innerHTML = "";

  snapshot.forEach(child => {
    const data = child.val();
    const box = document.createElement("div");
    box.className = "overview-box";

    box.innerHTML = `<strong>${data.family}</strong><br>${data.note || ""}`;

    for (let item in data.items) {
      if (data.items[item] > 0) {
        box.innerHTML += `<br>${item}: ${data.items[item]}×`;
      }
    }

    const del = document.createElement("button");
    del.textContent = "Bestellung löschen";
    del.onclick = () => db.ref("orders/" + child.key).remove();

    box.appendChild(document.createElement("br"));
    box.appendChild(del);

    overview.appendChild(box);
  });
});
