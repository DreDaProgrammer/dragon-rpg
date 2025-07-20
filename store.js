// store.js
// Renders the buy/sell interface and handles purchases and sales

import { getAllTools, purchaseTool, getToolById } from "./tools.js";
import { player, updatePlayer, addCoins } from "./player-info.js";

/**
 * Render the store UI inside a container
 * @param {HTMLElement} container
 */
export function renderStore(container) {
  container.innerHTML = `
    <h2>Store</h2>
    <div class="store-tabs">
      <button id="buyTab">Buy</button>
      <button id="sellTab">Sell</button>
    </div>
    <div id="storeContent"></div>
  `;

  const buyTab = document.getElementById("buyTab");
  const sellTab = document.getElementById("sellTab");
  const content = document.getElementById("storeContent");

  buyTab.addEventListener("click", () => renderBuy(content));
  sellTab.addEventListener("click", () => renderSell(content));

  // Show buy tab by default
  renderBuy(content);
}

/**
 * Render the buy interface
 * @param {HTMLElement} container
 */
function renderBuy(container) {
  const tools = getAllTools();
  container.innerHTML = `<ul class="store-list"></ul>`;
  const list = container.querySelector("ul");

  tools.forEach((tool) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${tool.name}</strong> (Power: ${tool.power})<br />
      Cost: ${tool.cost.gold}🥇 ${tool.cost.silver}🥈 ${tool.cost.bronze}🥉
      <button ${!purchaseTool && "disabled"} data-id="${tool.id}">Buy</button>
    `;
    const btn = li.querySelector("button");
    // Enable/disable based on affordability
    if (!purchaseTool(tool.id)) {
      // Undo purchase side-effect if triggered
      // Instead, check affordability first
      if (!isAffordable(tool.cost)) {
        btn.disabled = true;
      }
    } else {
      // Actually did purchase; reverse for initial render
      undoPurchase(tool.cost, tool.id);
    }
    btn.addEventListener("click", () => {
      if (purchaseTool(tool.id)) {
        alert(`Purchased ${tool.name}!`);
        renderBuy(container);
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
  container.innerHTML = `<ul class="store-list"></ul>`;
  const list = container.querySelector("ul");

  if (!player.tools.length) {
    container.innerHTML = "<p>No tools to sell.</p>";
    return;
  }

  player.tools.forEach((toolId, idx) => {
    const tool = getToolById(toolId);
    if (!tool) return;
    // Sell at half cost
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
      // Remove tool from inventory
      player.tools.splice(idx, 1);
      updatePlayer({ tools: player.tools });
      // Give coins
      addCoins(sellPrice);
      alert(`Sold ${tool.name}!`);
      renderSell(container);
    });
    list.appendChild(li);
  });
}

/**
 * Check if player can afford cost
 */
function isAffordable(cost) {
  return (
    player.coins.gold >= (cost.gold || 0) &&
    player.coins.silver >= (cost.silver || 0) &&
    player.coins.bronze >= (cost.bronze || 0)
  );
}

/**
 * Undo a purchase by refunding cost and removing toolId
 */
function undoPurchase(cost, toolId) {
  // Refund cost
  player.coins.gold += cost.gold || 0;
  player.coins.silver += cost.silver || 0;
  player.coins.bronze += cost.bronze || 0;
  // Remove last tool entry
  const idx = player.tools.lastIndexOf(toolId);
  if (idx > -1) player.tools.splice(idx, 1);
  updatePlayer({ coins: player.coins, tools: player.tools });
}
