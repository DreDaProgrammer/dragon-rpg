// store.js
// Renders the buy/sell interface with horizontal layout, quantity purchases for consumables,
// single-copy restriction for combat tools, and a "Sell All" button.

import { getAllTools, getToolById, canAfford } from "./tools.js";
import { player, updatePlayer, addCoins } from "./player-info.js";

/**
 * Multiply a cost object by quantity
 * @param {{gold:number, silver:number, bronze:number}} cost
 * @param {number} qty
 * @returns {{gold:number, silver:number, bronze:number}}
 */
function multiplyCost(cost, qty) {
  return {
    gold: cost.gold * qty,
    silver: cost.silver * qty,
    bronze: cost.bronze * qty,
  };
}

/**
 * Render the store UI inside a container
 * @param {HTMLElement} container
 */
export function renderStore(container) {
  container.innerHTML = `
    <h2>Store</h2>
    <div class="store-currency">
      Coins: ${player.coins.gold}🥇 ${player.coins.silver}🥈 ${player.coins.bronze}🥉
    </div>
    <div class="store-tabs">
      <button id="buyTab">Buy</button>
      <button id="sellTab">Sell</button>
    </div>
    <div id="storeContent"></div>
  `;

  document
    .getElementById("buyTab")
    .addEventListener("click", () => renderBuy(container));
  document
    .getElementById("sellTab")
    .addEventListener("click", () => renderSell(container));

  // Show buy tab by default
  renderBuy(container);
}

/**
 * Render the Buy interface
 * @param {HTMLElement} container
 */
function renderBuy(container) {
  const content = container.querySelector("#storeContent");
  content.innerHTML = `<ul class="store-list"></ul>`;
  const list = content.querySelector("ul");

  getAllTools().forEach((tool) => {
    const li = document.createElement("li");

    // Determine categories
    const isConsumable = Boolean(tool.effect);
    const isCombatTool = !isConsumable && tool.power > 0;

    // Ownership check
    const ownedCount = player.tools.filter((id) => id === tool.id).length;
    const canBuyCombat = !player.tools.includes(tool.id);

    // Quantity input for consumables
    const qtyInputHTML = isConsumable
      ? `<input type="number" class="qty-input" min="1" value="1">`
      : "";

    // Initial affordability check (qty = 1)
    const initialCost = multiplyCost(tool.cost, 1);
    const affordableInitially = canAfford(initialCost);

    // Disable button if not affordable or already owned (for combat tools)
    const disabledAttr =
      !affordableInitially || (isCombatTool && !canBuyCombat) ? "disabled" : "";

    li.innerHTML = `
      <strong>${tool.name}</strong>
      ${tool.power ? `(Power: ${tool.power})` : ""}
      <br/>
      Cost: ${tool.cost.gold}🥇 ${tool.cost.silver}🥈 ${tool.cost.bronze}🥉
      <br/>
      ${qtyInputHTML}
      <button ${disabledAttr}>Buy</button>
    `;

    const btn = li.querySelector("button");
    const qtyInput = li.querySelector(".qty-input");

    // Re-check affordability on quantity change
    if (isConsumable && qtyInput) {
      qtyInput.addEventListener("input", () => {
        let qty = parseInt(qtyInput.value, 10) || 1;
        qty = Math.max(1, qty);
        qtyInput.value = qty;
        const totalCost = multiplyCost(tool.cost, qty);
        btn.disabled = !canAfford(totalCost);
      });
    }

    btn.addEventListener("click", () => {
      // Determine purchase quantity
      const qty = isConsumable
        ? Math.max(1, parseInt(qtyInput.value, 10) || 1)
        : 1;

      // Deduct coins
      const totalCost = multiplyCost(tool.cost, qty);
      addCoins({
        gold: -totalCost.gold,
        silver: -totalCost.silver,
        bronze: -totalCost.bronze,
      });

      // Add tool(s) to inventory
      for (let i = 0; i < qty; i++) {
        player.tools.push(tool.id);
      }
      updatePlayer({ coins: player.coins, tools: player.tools });

      alert(`Purchased ${qty}× ${tool.name}!`);
      renderBuy(container);
    });

    list.appendChild(li);
  });
}

/**
 * Render the Sell interface, including a "Sell All" button
 * @param {HTMLElement} container
 */
function renderSell(container) {
  const content = container.querySelector("#storeContent");

  if (!player.tools.length) {
    content.innerHTML = "<p>No tools to sell.</p>";
    return;
  }

  // "Sell All" button + list
  content.innerHTML = `
    <button id="sellAllBtn">Sell All</button>
    <ul class="store-list"></ul>
  `;
  const sellAllBtn = content.querySelector("#sellAllBtn");
  const list = content.querySelector("ul");

  sellAllBtn.addEventListener("click", () => {
    // Calculate total half-cost for all tools
    const total = player.tools.reduce(
      (acc, toolId) => {
        const tool = getToolById(toolId);
        if (!tool) return acc;
        acc.gold += Math.floor(tool.cost.gold / 2);
        acc.silver += Math.floor(tool.cost.silver / 2);
        acc.bronze += Math.floor(tool.cost.bronze / 2);
        return acc;
      },
      { gold: 0, silver: 0, bronze: 0 }
    );

    // Clear inventory and update coins
    player.tools = [];
    updatePlayer({ tools: player.tools });
    addCoins(total);

    alert(
      `Sold all tools for ${total.gold}🥇 ${total.silver}🥈 ${total.bronze}🥉!`
    );
    renderSell(container);
  });

  // Individual sell entries
  player.tools.forEach((toolId, idx) => {
    const tool = getToolById(toolId);
    if (!tool) return;
    const sellPrice = {
      gold: Math.floor(tool.cost.gold / 2),
      silver: Math.floor(tool.cost.silver / 2),
      bronze: Math.floor(tool.cost.bronze / 2),
    };
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${tool.name}</strong><br/>
      Sell for: ${sellPrice.gold}🥇 ${sellPrice.silver}🥈 ${sellPrice.bronze}🥉
      <button data-idx="${idx}">Sell</button>
    `;
    const btn = li.querySelector("button");
    btn.addEventListener("click", () => {
      player.tools.splice(idx, 1);
      updatePlayer({ tools: player.tools });
      addCoins(sellPrice);
      alert(`Sold ${tool.name}!`);
      renderSell(container);
    });
    list.appendChild(li);
  });
}
