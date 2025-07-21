// store.js
// Renders the buy/sell interface with currency display and disabled buy buttons

import { getAllTools, purchaseTool, canAfford, getToolById } from "./tools.js";
import { player, updatePlayer, addCoins } from "./player-info.js";

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
 * Render the buy interface
 * @param {HTMLElement} container
 */
function renderBuy(container) {
  const tools = getAllTools();
  const content = container.querySelector("#storeContent");
  content.innerHTML = `<ul class="store-list"></ul>`;
  const list = content.querySelector("ul");

  tools.forEach((tool) => {
    const affordable = canAfford(tool.cost);
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${tool.name}</strong> (Power: ${tool.power})<br />
      Cost: ${tool.cost.gold}🥇 ${tool.cost.silver}🥈 ${tool.cost.bronze}🥉
      <button data-id="${tool.id}" ${!affordable ? "disabled" : ""}>Buy</button>
    `;
    const btn = li.querySelector("button");
    btn.addEventListener("click", () => {
      if (purchaseTool(tool.id)) {
        alert(`Purchased ${tool.name}!`);
        renderStore(container);
      } else {
        alert("You can't afford that.");
      }
    });
    list.appendChild(li);
  });
}

/**
 * Render the sell interface
 * @param {HTMLElement} container
 */
function renderSell(container) {
  const content = container.querySelector("#storeContent");
  if (!player.tools.length) {
    content.innerHTML = "<p>No tools to sell.</p>";
    return;
  }

  content.innerHTML = `<ul class="store-list"></ul>`;
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
      <strong>${tool.name}</strong><br />
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
