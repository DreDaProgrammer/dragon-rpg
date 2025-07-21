// store.js
// Renders the buy/sell interface with currency display, multi-mode pricing, and "Sell All"

import { getAllTools, canAfford, getToolById } from "./tools.js";
import { player, updatePlayer, addCoins } from "./player-info.js";
import { storeConfig } from "./config/store-config.js";

/**
 * Compute effective cost based on storeConfig modes:
 * - exactPriceEnabled: uses exactPrice
 * - priceIncreaseEnabled: baseCost + priceIncrease
 * - saleEnabled: applies discountPercent
 * Otherwise: baseCost
 */
function getEffectiveCost(baseCost) {
  // Exact price overrides all
  if (storeConfig.exactPriceEnabled) {
    return {
      gold: Math.max(0, storeConfig.exactPrice.gold),
      silver: Math.max(0, storeConfig.exactPrice.silver),
      bronze: Math.max(0, storeConfig.exactPrice.bronze),
    };
  }
  // Price increase overrides sale
  if (storeConfig.priceIncreaseEnabled) {
    return {
      gold: Math.max(0, baseCost.gold + storeConfig.priceIncrease.gold),
      silver: Math.max(0, baseCost.silver + storeConfig.priceIncrease.silver),
      bronze: Math.max(0, baseCost.bronze + storeConfig.priceIncrease.bronze),
    };
  }
  // Sale discount
  if (storeConfig.saleEnabled && storeConfig.discountPercent > 0) {
    const factor = (100 - storeConfig.discountPercent) / 100;
    return {
      gold: Math.ceil(baseCost.gold * factor),
      silver: Math.ceil(baseCost.silver * factor),
      bronze: Math.ceil(baseCost.bronze * factor),
    };
  }
  // No modifications
  return { ...baseCost };
}

/**
 * Render the store UI inside a container
 */
export function renderStore(container) {
  const currency = `<div class="store-currency">
    Coins: ${player.coins.gold}🥇 ${player.coins.silver}🥈 ${player.coins.bronze}🥉
  </div>`;
  const tabs = `<div class="store-tabs">
    <button id="buyTab">Buy</button>
    <button id="sellTab">Sell</button>
  </div>`;
  container.innerHTML = `<h2>Store</h2>${currency}${tabs}<div id="storeContent"></div>`;

  document.getElementById("buyTab").onclick = () => renderBuy(container);
  document.getElementById("sellTab").onclick = () => renderSell(container);

  // Default to Buy tab
  renderBuy(container);
}

function renderBuy(container) {
  const content = container.querySelector("#storeContent");
  content.innerHTML = `<ul class="store-list"></ul>`;
  const list = content.querySelector("ul");

  getAllTools().forEach((tool) => {
    const cost = getEffectiveCost(tool.cost);
    const affordable =
      player.coins.gold >= cost.gold &&
      player.coins.silver >= cost.silver &&
      player.coins.bronze >= cost.bronze;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${tool.name}</strong> (Power: ${tool.power})<br/>
      Cost: ${cost.gold}🥇 ${cost.silver}🥈 ${cost.bronze}🥉
    `;

    const btn = document.createElement("button");
    btn.textContent = "Buy";
    btn.disabled = !affordable;
    btn.onclick = () => {
      if (!affordable) return;
      // Deduct coins
      addCoins({
        gold: -cost.gold,
        silver: -cost.silver,
        bronze: -cost.bronze,
      });
      // Add tool to inventory and persist
      player.tools.push(tool.id);
      updatePlayer({ coins: player.coins, tools: player.tools });
      renderStore(container);
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

function renderSell(container) {
  const content = container.querySelector("#storeContent");
  if (!player.tools.length) {
    content.innerHTML = "<p>No tools to sell.</p>";
    return;
  }

  content.innerHTML = `
    <button id="sellAllBtn">Sell All</button>
    <ul class="store-list"></ul>
  `;
  const sellAllBtn = content.querySelector("#sellAllBtn");
  sellAllBtn.onclick = () => {
    let total = { gold: 0, silver: 0, bronze: 0 };
    player.tools.forEach((toolId) => {
      const tool = getToolById(toolId);
      if (!tool) return;
      total.gold += Math.floor(tool.cost.gold / 2);
      total.silver += Math.floor(tool.cost.silver / 2);
      total.bronze += Math.floor(tool.cost.bronze / 2);
    });
    // Clear inventory
    player.tools = [];
    updatePlayer({ tools: player.tools });
    // Add coins
    addCoins(total);
    alert(
      `Sold all tools for ${total.gold}🥇 ${total.silver}🥈 ${total.bronze}🥉`
    );
    renderStore(container);
  };

  const list = content.querySelector("ul");
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
    `;

    const btn = document.createElement("button");
    btn.textContent = "Sell";
    btn.onclick = () => {
      player.tools.splice(idx, 1);
      updatePlayer({ tools: player.tools });
      addCoins(sellPrice);
      renderSell(container);
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}
