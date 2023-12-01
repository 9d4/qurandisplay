import "./styles/main.css";

const fetchAyah = async () => {
  const params = new URLSearchParams({
    translations: "134,131",
    fields: "text_indopak",
  });
  return fetch("https://api.quran.com/api/v4/verses/random?" + params)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      if (json.verse.text_indopak.length > 220) {
        return fetchAyah();
      }
      return json;
    });
};

const ayahEl = document.getElementById("ayah");
const ayahTransIdEl = document.getElementById("translate-id");
const ayahTransEnEl = document.getElementById("translate-en");
const showAyah = async () => {
  const ayah = await fetchAyah();
  window.current = ayah;
  ayahEl.innerHTML = ayah.verse.text_indopak;
  ayah.verse.translations.forEach((tr) => {
    switch (tr["resource_id"]) {
      case 134:
        ayahTransIdEl.innerHTML = tr.text;
        break;
      case 131:
        ayahTransEnEl.innerHTML = tr.text;
    }
  });
};

let ayahIval = undefined;

const setAyahIval = (second) => {
  if (typeof ayahIval !== undefined) {
    clearInterval(ayahIval);
  }
  ayahIval = setInterval(() => {
    showAyah();
  }, second * 1000);
};

const intervalInputEl = document.getElementById("interval");
intervalInputEl.onchange = () => {
  if (intervalInputEl.value < 5) {
    alert("Less than 5s not allowed!");
    return;
  }

  setAyahIval(intervalInputEl.value);
  alert("Set " + intervalInputEl.value + " seconds!");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", () => {
  showAyah();
});
