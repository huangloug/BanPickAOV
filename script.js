let currentMatch = 1;

const heroStateA = {};
const heroStateB = {};
const pickedHistoryA = new Set();
const pickedHistoryB = new Set();
const laneIcons = {
 "Sp": "💖",
 "Rồng": "🐉",
 "Tà": "👹",
 "Mid": "🔥",
 "Rừng": "🌲"
};

function createHeroElement(name, team) {
  const hero = document.createElement("div");
  hero.className = "hero";
  hero.dataset.name = name;
  hero.dataset.team = team;
  hero.dataset.state = "none";

  const img = document.createElement("img");
  img.src = `assets/img/${name}.png`;
  img.alt = name;
  hero.appendChild(img);

  hero.onclick = (e) => {
    if (hero.classList.contains("picking") ||
        hero.classList.contains("picked-by-enemy") ||
        hero.classList.contains("picked-by-self") ||
        hero.classList.contains("banning")) return;

    showActionPopup(hero, e);
  };

  return hero;
}

function showActionPopup(hero, clickEvent) {
 removeExistingPopup();

 const name = hero.dataset.name;
 const team = hero.dataset.team;

 const menu = document.createElement("div");
 menu.className = "popup-menu";
 menu.innerHTML = `
   <button class="pick-btn">Pick</button>
   <button class="ban-btn">Ban</button>
   <button class="cancel-btn">Huỷ</button>
 `;

 document.body.appendChild(menu);

 const rect = hero.getBoundingClientRect();
 menu.style.top = `${rect.top + window.scrollY}px`;
 menu.style.left = `${rect.left + window.scrollX}px`;

 const removeMenu = () => {
   menu.remove();
   document.removeEventListener("click", outsideClickListener);
 };

 menu.querySelector(".pick-btn").onclick = () => {
   handlePick(name, team);
   removeMenu();
   renderStates();
 };
 menu.querySelector(".ban-btn").onclick = () => {
   handleBan(name);
   removeMenu();
   renderStates();
 };
 menu.querySelector(".cancel-btn").onclick = removeMenu;

 function outsideClickListener(event) {
   if (!menu.contains(event.target)) {
     removeMenu();
   }
 }

 setTimeout(() => {
   document.addEventListener("click", outsideClickListener);
 }, 0);
}


function removeExistingPopup() {
  document.querySelectorAll(".popup-menu").forEach(el => el.remove());
}

function handlePick(name, team) {
  if (team === "a") {
    heroStateA[name] = "Picking";
    heroStateB[name] = "PickedByEnemy";
  } else {
    heroStateB[name] = "Picking";
    heroStateA[name] = "PickedByEnemy";
  }
}

function handleBan(name) {
  heroStateA[name] = "Banning";
  heroStateB[name] = "Banning";
}

function renderStates() {
  removeExistingPopup();

  document.querySelectorAll(".hero").forEach(el => {
    const name = el.dataset.name;
    const team = el.dataset.team;
    const state = team === "a" ? heroStateA[name] : heroStateB[name];

    el.className = "hero";
    el.style.pointerEvents = "auto";

    if (pickedHistoryA.has(name) && team === "a") {
      el.classList.add("picked-by-self");
      el.style.pointerEvents = "none";
    } else if (pickedHistoryB.has(name) && team === "b") {
      el.classList.add("picked-by-self");
      el.style.pointerEvents = "none";
    }

    if (state === "Picking") {
      el.classList.add("picking");
      el.style.pointerEvents = "none";
    } else if (state === "PickedByEnemy") {
      el.classList.add("picked-by-enemy");
      el.style.pointerEvents = "none";
    } else if (state === "Banning") {
      el.classList.add("banning");
      el.style.pointerEvents = "none";
    }
  });
}

function renderTeam(containerId, teamLabel) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const layout = {
    "Rồng": 9,
    "Sp": 9,
    "Mid": 10,
    "Rừng": 10,
    "Tà": 9
  };

  Object.entries(lanes).forEach(([laneName, heroList]) => {
    const laneSection = document.createElement("div");
    laneSection.className = "lane-section";

    const title = document.createElement("div");
    title.className = "lane-title";
    title.textContent = `${laneIcons[laneName] || "💠"} ${laneName}`;
    laneSection.appendChild(title);

    const cols = layout[laneName] || 6; // fallback nếu thiếu layout
    const rows = Math.ceil(heroList.length / cols);

    for (let r = 0; r < rows; r++) {
      const rowHeroes = heroList.slice(r * cols, (r + 1) * cols);
      const row = document.createElement("div");
      row.className = "hero-list";

      const list = teamLabel === "b" ? [...rowHeroes].reverse() : rowHeroes;
      list.forEach(name => {
        const el = createHeroElement(name, teamLabel);
        row.appendChild(el);
      });

      laneSection.appendChild(row);
    }

    container.appendChild(laneSection);
  });
}

function renderLaneSymmetric(containerId, teamLabel, reverse = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  Object.entries(lanes).forEach(([laneName, heroList]) => {
    const section = document.createElement("div");
    section.className = "lane-section";

    const title = document.createElement("div");
    title.className = "lane-title";
    title.textContent = `${laneName}`;
    section.appendChild(title);

    const row = document.createElement("div");
    row.className = "hero-list";

    const list = reverse ? [...heroList].reverse() : heroList;

    list.forEach(name => {
      const el = createHeroElement(name, teamLabel);
      row.appendChild(el);
    });

    section.appendChild(row);
    container.appendChild(section);
  });
}

function renderHeroes() {
 renderTeam("team-a", "a");
 renderTeam("team-b", "b");
 renderStates();
 const section = document.createElement("div");
  section.className = "lane-section";
  section.dataset.lane = laneName; 

}



function advanceMatch() {
  for (const name in heroStateA) {
    if (heroStateA[name] === "Picking") pickedHistoryA.add(name);
    if (heroStateB[name] === "Picking") pickedHistoryB.add(name);
  }

  for (const name in heroStateA) {
    heroStateA[name] = pickedHistoryA.has(name) ? "PickedBySelf" : "none";
    heroStateB[name] = pickedHistoryB.has(name) ? "PickedBySelf" : "none";
  }

  currentMatch += 1;
  document.getElementById("match-label").innerText = `Trận ${currentMatch}`;
  renderHeroes();
}
document.getElementById("reset-all").addEventListener("click", () => {
 currentMatch = 1;
 document.getElementById("match-label").innerText = `Trận ${currentMatch}`;

 Object.keys(heroStateA).forEach(name => heroStateA[name] = "none");
 Object.keys(heroStateB).forEach(name => heroStateB[name] = "none");
 pickedHistoryA.clear();
 pickedHistoryB.clear();

 renderHeroes();
});

document.getElementById("next-match").addEventListener("click", advanceMatch);
renderHeroes();
