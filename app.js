var firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT.firebaseio.com",
  projectId: "DEIN_PROJEKT",
  appId: "DEINE_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function send() {
  const text = document.getElementById("input").value;
  if (!text) return;

  db.ref("items").push({
    value: text,
    time: Date.now()
  });

  document.getElementById("input").value = "";
}

db.ref("items").on("value", snapshot => {
  const list = document.getElementById("list");
  list.innerHTML = "";

  snapshot.forEach(child => {
    const li = document.createElement("li");
    li.textContent = child.val().value;
    list.appendChild(li);
  });
});
