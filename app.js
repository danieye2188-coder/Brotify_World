db.ref("orders").on("value", snapshot => {
  const overview = document.getElementById("overview");
  overview.innerHTML = "";

  const totals = {}; // für Bäcker

  snapshot.forEach(child => {
    const data = child.val();
    const box = document.createElement("div");
    box.className = "overview-box";

    box.innerHTML =
      `<strong>${data.family}</strong><br>
       👤 ${data.pickup || "-"}<br>
       📝 ${data.note || ""}`;

    for (let item in data.items) {
      if (data.items[item] > 0) {
        box.innerHTML += `<br>${item}: ${data.items[item]}×`;

        totals[item] = (totals[item] || 0) + data.items[item];
      }
    }

    // ❌ Löschen-Button
    const del = document.createElement("button");
    del.textContent = "❌ Bestellung löschen";
    del.onclick = () => db.ref("orders/" + child.key).remove();

    box.appendChild(document.createElement("br"));
    box.appendChild(del);

    overview.appendChild(box);
  });

  renderBakerList(totals);
});
