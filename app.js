var firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT.firebaseio.com",
  projectId: "DEIN_PROJEKT",
  appId: "DEINE_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
