// store.js
import { getAllTools, getToolById, canAfford } from "./tools.js";
import { player, updatePlayer, addCoins } from "./player-info.js";

/** Multiply a cost object by quantity */
function multiplyCost(cost, qty) {
  return {
    gold: cost.gold * qty,
    silver: cost.silver * qty,
    bronze: cost.bronze * qty,
  };
}

/** Refreshes 🥇🥈🥉 display */
function updateCoinDisplay() {
  document.getElementById("goldCount").textContent = player.coins.gold;
  document.getElementById("silverCount").textContent = player.coins.silver;
  document.getElementById("bronzeCount").textContent = player.coins.bronze;
}

/** Toggle active class among a group */
function setActive(selector, activeSel) {
  document
    .querySelectorAll(selector)
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector(activeSel).classList.add("active");
}

/** Removes all children from an element */
function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Renders the Buy or Sell UI and hooks tabs/filters */
export function renderStore() {
  updateCoinDisplay();

  const buyTab = document.getElementById("buyTab");
  const sellTab = document.getElementById("sellTab");
  const filters = document.querySelector(".filters");
  const buySec = document.getElementById("buy-section");
  const sellSec = document.getElementById("sell-section");
  const buyList = document.getElementById("buy-list");
  const sellList = document.getElementById("sell-list");
  const sellAll = document.getElementById("sellAllBtn");
  const filterBtns = document.querySelectorAll(".filters button");

  // Tab clicks
  buyTab.addEventListener("click", () => {
    setActive(".tabs button", "#buyTab");
    filters.style.display = "flex";
    buySec.style.display = "";
    sellSec.style.display = "none";
    renderBuy("all");
  });
  sellTab.addEventListener("click", () => {
    setActive(".tabs button", "#sellTab");
    filters.style.display = "none";
    buySec.style.display = "none";
    sellSec.style.display = "";
    renderSell();
  });

  // Filter clicks
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      setActive(".filters button", `[data-type="${type}"]`);
      renderBuy(type);
    })
  );

  // Sell All
  sellAll.addEventListener("click", () => {
    const total = player.tools.reduce(
      (acc, id) => {
        const t = getToolById(id);
        if (!t) return acc;
        acc.gold += Math.floor(t.cost.gold / 2);
        acc.silver += Math.floor(t.cost.silver / 2);
        acc.bronze += Math.floor(t.cost.bronze / 2);
        return acc;
      },
      { gold: 0, silver: 0, bronze: 0 }
    );

    player.tools = [];
    updatePlayer({ tools: [] });
    addCoins(total);
    updateCoinDisplay();
    renderSell();
  });

  // Default: show Buy → All
  setActive(".tabs button", "#buyTab");
  setActive(".filters button", `[data-type="all"]`);
  renderBuy("all");
}

/** Populates the Buy list for a given category */
function renderBuy(filterType) {
  const ul = document.getElementById("buy-list");
  clear(ul);
  getAllTools()
    .filter((tool) => filterType === "all" || tool.type === filterType)
    .forEach((tool) => {
      const li = document.createElement("li");

      const isCon = !!tool.effect;
      const isOne =
        !isCon && ["offense", "defense", "armor"].includes(tool.type);
      const owned = player.tools.includes(tool.id);
      const qtyInp = isCon
        ? `<input type="number" class="qty" min="1" value="1">`
        : "";
      const can1 = canAfford(multiplyCost(tool.cost, 1));
      const dis = !can1 || (isOne && owned) ? "disabled" : "";

      li.innerHTML = `
        <h3>${tool.name}</h3>
        ${tool.power ? `<div>Power: ${tool.power}</div>` : ""}
        ${tool.defense ? `<div>Defense: ${tool.defense}</div>` : ""}
        <div>Cost: ${tool.cost.gold}🥇 ${tool.cost.silver}🥈 ${
        tool.cost.bronze
      }🥉</div>
        ${qtyInp}
        <button ${dis}>Buy</button>
      `;

      const btn = li.querySelector("button");
      const inp = li.querySelector(".qty");

      if (inp) {
        inp.addEventListener("input", () => {
          let v = Math.max(1, parseInt(inp.value) || 1);
          inp.value = v;
          btn.disabled = !canAfford(multiplyCost(tool.cost, v));
        });
      }

      btn.addEventListener("click", () => {
        const qty = inp ? Math.max(1, parseInt(inp.value) || 1) : 1;
        const cost = multiplyCost(tool.cost, qty);
        addCoins({
          gold: -cost.gold,
          silver: -cost.silver,
          bronze: -cost.bronze,
        });
        for (let i = 0; i < qty; i++) player.tools.push(tool.id);
        updatePlayer({ coins: player.coins, tools: player.tools });
        updateCoinDisplay();
        renderBuy(filterType);
      });

      ul.appendChild(li);
    });
}

/** Populates the Sell list */
function renderSell() {
  const ul = document.getElementById("sell-list");
  clear(ul);
  if (player.tools.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No tools to sell.";
    return ul.parentElement.insertBefore(p, ul);
  }
  player.tools.forEach((id, idx) => {
    const tool = getToolById(id);
    if (!tool) return;
    const price = {
      gold: Math.floor(tool.cost.gold / 2),
      silver: Math.floor(tool.cost.silver / 2),
      bronze: Math.floor(tool.cost.bronze / 2),
    };
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${tool.name}</h3>
      <div>Sell for: ${price.gold}🥇 ${price.silver}🥈 ${price.bronze}🥉</div>
      <button data-idx="${idx}">Sell</button>
    `;
    li.querySelector("button").addEventListener("click", () => {
      player.tools.splice(idx, 1);
      updatePlayer({ tools: player.tools });
      addCoins(price);
      updateCoinDisplay();
      renderSell();
    });
    ul.appendChild(li);
  });
}
