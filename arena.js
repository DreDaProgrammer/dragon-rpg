// arena.js
// Handles turn‐based combat UI: wiring up static HTML elements (no innerHTML templates).

import { player, updatePlayer } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";
import { monstersConfig } from "./config/monsters-config.js";
import { handleVictory, handleDefeat } from "./battle.js";

let currentMonster;
let buffPower;
let awaitingPlayerAction;

// --- Cached DOM elements ---
const turnIndicator = document.getElementById("turn-indicator");
const actionButtons = document.querySelectorAll("#action-menu .menu-item");
const playerHpEl = document.getElementById("playerHp");
const playerMaxHpEl = document.getElementById("playerMaxHp");
const playerMpEl = document.getElementById("playerMp");
const playerMaxMpEl = document.getElementById("playerMaxMp");
const playerLvEl = document.getElementById("playerLevel");
const monsterNameEl = document.getElementById("monsterName");
const monsterHpEl = document.getElementById("monsterHp");
const monsterMaxHpEl = document.getElementById("monsterMaxHp");
const logContainer = document.getElementById("battle-log");
const inventoryPanel = document.getElementById("inventory-panel");

// --- Helpers ---
function updateStatusPanels() {
  playerHpEl.textContent = player.health;
  playerMaxHpEl.textContent = defaultPlayerConfig.health;
  playerMpEl.textContent = player.mp || 30;
  playerMaxMpEl.textContent = 30;
  playerLvEl.textContent = player.level || 1;

  monsterNameEl.textContent = currentMonster.name;
  monsterHpEl.textContent = currentMonster.currentHealth;
  monsterMaxHpEl.textContent = currentMonster.maxHealth;
}

function appendLog(text) {
  const p = document.createElement("p");
  p.textContent = text;
  logContainer.appendChild(p);
  logContainer.scrollTop = logContainer.scrollHeight;
}

function clearLog() {
  logContainer.innerHTML = "";
}

// --- Inventory UI ---
function showInventory() {
  awaitingPlayerAction = false;
  inventoryPanel.innerHTML = "";
  inventoryPanel.style.display = "block";

  const sections = [
    { title: "Weapons", type: "offense" },
    { title: "Shields", type: "defense" },
    { title: "Potions", type: "potion" },
  ];

  sections.forEach(({ title, type }) => {
    const sec = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = title;
    sec.appendChild(h3);

    const ul = document.createElement("ul");
    player.tools.forEach((id, idx) => {
      const tool = getToolById(id);
      if (!tool || tool.type !== type) return;

      const li = document.createElement("li");
      li.textContent = tool.name + " ";
      const btn = document.createElement("button");

      if (type === "potion") {
        btn.textContent = "Use";
        btn.onclick = () => {
          if (tool.effect.heal) {
            player.health = Math.min(
              defaultPlayerConfig.health,
              player.health + tool.effect.heal
            );
            appendLog(`Used ${tool.name}, +${tool.effect.heal} HP.`);
          }
          if (tool.effect.power) buffPower += tool.effect.power;
          player.tools.splice(idx, 1);
          updatePlayer({ health: player.health, tools: player.tools });
          updateStatusPanels();
          closeInventory();
          endPlayerTurn();
        };
      } else {
        const equipped =
          type === "offense"
            ? player.equippedCombatToolId === id
            : player.equippedShieldId === id;
        btn.textContent = equipped ? "Unequip" : "Equip";
        btn.onclick = () => {
          if (type === "offense") {
            player.equippedCombatToolId = equipped ? null : id;
            appendLog(
              equipped ? `Unequipped ${tool.name}.` : `Equipped ${tool.name}.`
            );
          } else {
            player.equippedShieldId = equipped ? null : id;
            appendLog(
              equipped ? `Unequipped ${tool.name}.` : `Equipped ${tool.name}.`
            );
          }
          updatePlayer({
            equippedCombatToolId: player.equippedCombatToolId,
            equippedShieldId: player.equippedShieldId,
          });
          updateStatusPanels();
          closeInventory();
          endPlayerTurn();
        };
      }

      li.appendChild(btn);
      ul.appendChild(li);
    });
    sec.appendChild(ul);
    inventoryPanel.appendChild(sec);
  });

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.onclick = () => {
    closeInventory();
    awaitingPlayerAction = true;
  };
  inventoryPanel.appendChild(cancel);
}

function closeInventory() {
  inventoryPanel.style.display = "none";
  inventoryPanel.innerHTML = "";
}

// --- Battle Actions ---
function handleMenuAction(action) {
  if (!awaitingPlayerAction) return;
  switch (action) {
    case "attack":
      playerAttack();
      break;
    case "skills":
      appendLog("No skills available.");
      break;
    case "items":
      showInventory();
      break;
    case "guard":
      playerGuard();
      break;
    case "talk":
      appendLog(`The ${currentMonster.name} does not respond.`);
      endPlayerTurn();
      break;
    case "escape":
      tryEscape();
      break;
    case "pass":
      appendLog("You pass your turn.");
      endPlayerTurn();
      break;
  }
}

function playerAttack() {
  awaitingPlayerAction = false;
  const toolId = player.equippedCombatToolId;
  const power = toolId ? getToolById(toolId).power : 5;
  const dmg = Math.floor(Math.random() * power) + 1 + buffPower;
  buffPower = 0;

  currentMonster.currentHealth = Math.max(
    0,
    currentMonster.currentHealth - dmg
  );
  appendLog(`You deal ${dmg} damage.`);
  updateStatusPanels();

  if (currentMonster.currentHealth === 0) {
    return handleVictory(currentMonster);
  }
  endPlayerTurn();
}

function playerGuard() {
  awaitingPlayerAction = false;
  player.isGuarding = true;
  appendLog("You brace for impact.");
  endPlayerTurn();
}

function tryEscape() {
  awaitingPlayerAction = false;
  if (Math.random() > 0.5) {
    appendLog("You fled the battle!");
    setTimeout(() => (window.location.href = "index.html"), 800);
  } else {
    appendLog("Escape failed.");
    endPlayerTurn();
  }
}

function endPlayerTurn() {
  setTimeout(monsterTurn, 600);
}

function monsterTurn() {
  const atk =
    currentMonster.attacks[
      Math.floor(Math.random() * currentMonster.attacks.length)
    ];
  appendLog(`${currentMonster.name} uses ${atk.name}!`);

  let dmg =
    Math.floor(currentMonster.power * 0.7) +
    Math.floor(Math.random() * currentMonster.agility);

  if (player.isGuarding) {
    const shield = getToolById(player.equippedShieldId);
    if (shield && shield.effect.defense) {
      const blocked = Math.min(shield.effect.defense, dmg);
      dmg -= blocked;
      appendLog(`Blocked ${blocked} damage with shield.`);
    }
    player.isGuarding = false;
  }

  player.health = Math.max(0, player.health - dmg);
  updatePlayer({ health: player.health });
  appendLog(`You take ${dmg} damage.`);
  updateStatusPanels();

  if (player.health === 0) {
    return handleDefeat();
  }
  awaitingPlayerAction = true;
  appendLog("Your turn.");
}

// --- Public API ---
export function renderArena(container, monConfig) {
  currentMonster = {
    ...monConfig,
    maxHealth: monConfig.power * 5,
    currentHealth: monConfig.power * 5,
  };
  buffPower = 0;
  awaitingPlayerAction = true;
  clearLog();
  inventoryPanel.style.display = "none";

  actionButtons.forEach((btn) => {
    btn.removeEventListener("click", handleMenuAction);
    btn.addEventListener("click", () => handleMenuAction(btn.dataset.action));
  });

  updateStatusPanels();
  appendLog(`Battle begins against ${monConfig.name}!`);
}

// Load the monster you clicked on from localStorage:
document.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("currentMonster");
  if (data) {
    const mon = JSON.parse(data);
    renderArena(document.body, mon);
  } else {
    // Fallback if nothing was set:
    console.warn("No monster in storage—defaulting to first config.");
    renderArena(document.body, monstersConfig[0]);
  }
});
