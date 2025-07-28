// js/store.js
// Renders the Dragon Store with real-time coin updates, split sections (offense, defense, armor, potion),
// single “Dragon Store” heading, one set of Buy/Sell tabs, and no extra emojis.

/**
 * Cache DOM lookups
 */
let containerEl;
let coinDiv;
let tabs;
let filterTabs;
let contentEl;

import { player, updatePlayer, addCoins } from "./player-info.js";
import { getAllTools, canAfford } from "./tools.js";

/**
 * Update the coin display, guarding against missing element
 */
function updateCoinDisplay() {
  if (!coinDiv) return;
  coinDiv.textContent = `Gold: ${player.coins.gold} 🥇   Silver: ${player.coins.silver} 🥈   Bronze: ${player.coins.bronze} 🥉`;
}

/**
 * Multiply a cost object by qty
 */
function multiplyCost(cost, qty) {
  return {
    gold: cost.gold * qty,
    silver: cost.silver * qty,
    bronze: cost.bronze * qty,
  };
}

/**
 * Render the Store UI into the given container
 */
export function renderStore(container) {
  containerEl = container;
  container.innerHTML = `
    <h1>Dragon Store</h1>
    <div class="store-currency"></div>

    <div class="store-tabs">
      <button id="buyTab" class="active">Buy</button>
      <button id="sellTab">Sell</button>
    </div>

    <div class="filter-tabs">
      <button data-type="all"   class="active">All</button>
      <button data-type="offense">Offense</button>
      <button data-type="defense">Defense</button>
      <button data-type="armor">Armor</button>
      <button data-type="potion">Potions</button>
    </div>

    <div id="storeContent"></div>
  `;

  // cache references
  coinDiv = container.querySelector(".store-currency");
  tabs = container.querySelector(".store-tabs");
  filterTabs = container.querySelector(".filter-tabs");
  contentEl = container.querySelector("#storeContent");

  // initial coin display
  updateCoinDisplay();

  // Buy/Sell tab switching
  container.querySelector("#buyTab").addEventListener("click", () => {
    tabs
      .querySelectorAll("button")
      .forEach((b) => b.classList.remove("active"));
    filterTabs
      .querySelectorAll("button")
      .forEach((b) => (b.style.display = "inline-block"));
    container.querySelector("#buyTab").classList.add("active");
    renderBuy("all");
  });
  container.querySelector("#sellTab").addEventListener("click", () => {
    tabs
      .querySelectorAll("button")
      .forEach((b) => b.classList.remove("active"));
    container.querySelector("#sellTab").classList.add("active");
    filterTabs
      .querySelectorAll("button")
      .forEach((b) => (b.style.display = "none"));
    renderSell();
  });

  // Filter buttons
  filterTabs.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterTabs
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderBuy(btn.dataset.type);
    });
  });

  // show initial Buy view
  renderBuy("all");
}

/**
 * Build the Buy list for a given type
 */
function renderBuy(filterType) {
  contentEl.innerHTML = `<ul class="store-list"></ul>`;
  const list = contentEl.querySelector("ul");

  // filter tools
  const tools = getAllTools().filter(
    (t) => filterType === "all" || t.type === filterType
  );

  tools.forEach((tool) => {
    const isConsumable = !!tool.consumable;
    const isCombatTool =
      !isConsumable && ["offense", "defense", "armor"].includes(tool.type);
    const owned = player.tools.includes(tool.id);

    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${tool.name}</h3>
      <div>Type: ${tool.type}</div>
      ${tool.power ? `<div>Power: ${tool.power}</div>` : ""}
      ${tool.defense ? `<div>Defense: ${tool.defense}</div>` : ""}
      <div>Cost: ${tool.cost.gold} 🥇 ${tool.cost.silver} 🥈 ${
      tool.cost.bronze
    } 🥉</div>
      ${
        isConsumable
          ? `<input type="number" class="qty" min="1" value="1">`
          : ""
      }
      <button>Buy</button>
    `;

    const btn = li.querySelector("button");
    const qtyInput = li.querySelector(".qty");
    const baseCost = tool.cost;

    // initial disable logic
    const initialQty = isConsumable ? 1 : 1;
    const affordable = canAfford(multiplyCost(baseCost, initialQty));
    if (!affordable || (isCombatTool && owned)) btn.disabled = true;

    // adjust button state on qty change
    if (isConsumable && qtyInput) {
      qtyInput.addEventListener("input", () => {
        let q = parseInt(qtyInput.value, 10) || 1;
        if (q < 1) q = 1;
        qtyInput.value = q;
        btn.disabled = !canAfford(multiplyCost(baseCost, q));
      });
    }

    btn.addEventListener("click", () => {
      const qty = isConsumable
        ? Math.max(1, parseInt(qtyInput.value, 10) || 1)
        : 1;
      const total = multiplyCost(baseCost, qty);

      // deduct coins & add tools
      addCoins({
        gold: -total.gold,
        silver: -total.silver,
        bronze: -total.bronze,
      });
      for (let i = 0; i < qty; i++) {
        player.tools.push(tool.id);
      }
      updatePlayer({ coins: player.coins, tools: player.tools });

      updateCoinDisplay();
      renderBuy(filterType);
      alert(`Purchased ${qty} × ${tool.name}`);
    });

    list.appendChild(li);
  });
}

/**
 * Build the Sell list, with a single Sell All button
 */
function renderSell() {
  contentEl.innerHTML = `
    <button id="sellAllBtn">Sell All</button>
    <ul class="store-list"></ul>
  `;
  const sellAll = containerEl.querySelector("#sellAllBtn");
  const list = contentEl.querySelector("ul");

  sellAll.addEventListener("click", () => {
    const total = player.tools.reduce(
      (acc, id) => {
        const t = getAllTools().find((x) => x.id === id);
        if (!t) return acc;
        acc.gold += Math.floor(t.cost.gold / 2);
        acc.silver += Math.floor(t.cost.silver / 2);
        acc.bronze += Math.floor(t.cost.bronze / 2);
        return acc;
      },
      { gold: 0, silver: 0, bronze: 0 }
    );

    player.tools = [];
    updatePlayer({ tools: player.tools });
    addCoins(total);
    updateCoinDisplay();
    renderSell();
    alert(
      `Sold everything for ${total.gold} 🥇 ${total.silver} 🥈 ${total.bronze} 🥉`
    );
  });

  player.tools.forEach((id, idx) => {
    const t = getAllTools().find((x) => x.id === id);
    if (!t) return;
    const sellPrice = {
      gold: Math.floor(t.cost.gold / 2),
      silver: Math.floor(t.cost.silver / 2),
      bronze: Math.floor(t.cost.bronze / 2),
    };

    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${t.name}</h3>
      <div>Type: ${t.type}</div>
      <div>Sell for: ${sellPrice.gold} 🥇 ${sellPrice.silver} 🥈 ${sellPrice.bronze} 🥉</div>
      <button data-idx="${idx}">Sell</button>
    `;

    const btn = li.querySelector("button");
    btn.addEventListener("click", () => {
      player.tools.splice(idx, 1);
      updatePlayer({ tools: player.tools });
      addCoins(sellPrice);
      updateCoinDisplay();
      renderSell();
      alert(
        `Sold ${t.name} for ${sellPrice.gold} 🥇 ${sellPrice.silver} 🥈 ${sellPrice.bronze} 🥉`
      );
    });

    list.appendChild(li);
  });
}
