// arena.js
// Battle UI with full inventory (combat tools, shields, potions),
// key-driven Attack (A), block (S), and seamless tool switching.

import { player, updatePlayer } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";
import { monstersConfig } from "./config/monsters-config.js";
import { handleVictory, handleDefeat } from "./battle.js";

let currentMonster;
let buffPower = 0;
let awaitingPlayer = true;
let awaitingEvade = false;
let currentMove;
let countdownInterval;
let evadeTimeout;

// Render the arena and inventory
export function renderArena(container, monConfig) {
  currentMonster = { ...monConfig, currentHealth: monConfig.power * 5 };
  buffPower = 0;
  awaitingPlayer = true;
  awaitingEvade = false;

  container.classList.remove("location-view");
  container.style.backgroundImage = "";
  container.innerHTML = `
    <h2>Battle: ${monConfig.name}</h2>
    <div id="battleInfo">
      <p><strong>Hero:</strong> <span id="playerHp">${player.health}</span> / ${
    defaultPlayerConfig.health
  }</p>
      <p><strong>${monConfig.name}:</strong> <span id="monsterHp">${
    currentMonster.currentHealth
  }</span> / ${monConfig.power * 5}</p>
    </div>

    <div id="inventory">
      <h3>Inventory</h3>
      <div id="inventory-sections">
        <div>
          <strong>Combat Tools</strong>
          <ul id="combat-list"></ul>
        </div>
        <div>
          <strong>Shields</strong>
          <ul id="shield-list"></ul>
        </div>
        <div>
          <strong>Potions</strong>
          <ul id="potion-list"></ul>
        </div>
      </div>
    </div>

    <div id="battle-actions">
      <button id="attackBtn">Attack (A)</button>
    </div>
    <div id="evadeContainer"></div>
    <div id="battleLog"></div>
    <button id="exitBtn">Flee to Town</button>
  `;

  document
    .getElementById("attackBtn")
    .addEventListener("click", () => tryAttack());
  document
    .getElementById("exitBtn")
    .addEventListener("click", () => window.location.reload());
  document.addEventListener("keydown", handleKey);

  renderInventory();
  updateHPDisplays();
  appendLog(
    "Battle begins! Equip your tools, then Attack with A, block with S."
  );
}

// Key press handling
function handleKey(e) {
  if (awaitingPlayer && !awaitingEvade && (e.key === "a" || e.key === "A")) {
    e.preventDefault();
    tryAttack();
  }
  if (awaitingEvade && (e.key === "s" || e.key === "S")) {
    resolveEvade(true);
  }
}

// Attempt to attack
function tryAttack() {
  if (!awaitingPlayer) return;
  awaitingPlayer = false;
  document.getElementById("attackBtn").disabled = true;
  round();
}

// One round: hero → monster → reset
async function round() {
  // Hero attack
  const toolId = player.equippedCombatToolId;
  const power = toolId ? getToolById(toolId).power : 5;
  const dmg = Math.floor(Math.random() * power) + 1 + buffPower;
  buffPower = 0;
  appendLog(`You deal ${dmg} damage.`);
  currentMonster.currentHealth = Math.max(
    0,
    currentMonster.currentHealth - dmg
  );
  updateHPDisplays();
  if (currentMonster.currentHealth <= 0) {
    appendLog(`You’ve slain the ${currentMonster.name}!`);
    return handleVictory(currentMonster);
  }

  // Monster turn
  await new Promise((r) => setTimeout(r, 300));
  await monsterTurn();

  // Reset
  document.getElementById("attackBtn").disabled = false;
  awaitingPlayer = true;
}

// Monster’s attack prompt
function monsterTurn() {
  return new Promise((resolve) => {
    currentMove =
      currentMonster.attacks[
        Math.floor(Math.random() * currentMonster.attacks.length)
      ];
    awaitingEvade = true;
    let t = 7;
    const container = document.getElementById("evadeContainer");
    container.innerHTML = `
      <p>${currentMonster.name} uses ${currentMove.name}!</p>
      <p>Press <strong>S</strong> to block</p>
      <p>Time left: <span id="evadeTimer">${t}</span>s</p>
    `;

    countdownInterval = setInterval(() => {
      if (--t <= 0) clearInterval(countdownInterval);
      document.getElementById("evadeTimer").textContent = t;
    }, 1000);

    evadeTimeout = setTimeout(() => resolveEvade(false, resolve), 7000);
    resolveEvade.callback = resolve;
  });
}

// Resolve block or take damage
function resolveEvade(didBlock, res) {
  clearInterval(countdownInterval);
  clearTimeout(evadeTimeout);
  awaitingEvade = false;
  document.getElementById("evadeContainer").innerHTML = "";

  let dmg =
    Math.floor(currentMonster.power * 0.7) +
    Math.floor(Math.random() * currentMonster.agility);

  const shieldId = player.equippedShieldId;
  if (didBlock && shieldId) {
    const def = getToolById(shieldId).effect?.defense || 0;
    const blocked = Math.min(def, dmg);
    dmg -= blocked;
    appendLog(`Blocked ${blocked} damage with shield.`);
  } else {
    appendLog(`Took ${dmg} damage.`);
  }

  player.health = Math.max(0, player.health - dmg);
  updatePlayer({ health: player.health });
  updateHPDisplays();
  if (player.health <= 0) {
    appendLog("You have been slain...");
    return handleDefeat();
  }
  (res || resolveEvade.callback)();
}

// Update HP UI
function updateHPDisplays() {
  document.getElementById("playerHp").textContent = player.health;
  document.getElementById("monsterHp").textContent =
    currentMonster.currentHealth;
}

// Single-line log
function appendLog(text) {
  document.getElementById("battleLog").innerHTML = `<p>${text}</p>`;
}

// Render inventory lists and equip/unequip/use logic
function renderInventory() {
  const cList = document.getElementById("combat-list");
  const sList = document.getElementById("shield-list");
  const pList = document.getElementById("potion-list");
  cList.innerHTML = sList.innerHTML = pList.innerHTML = "";

  for (const id of player.tools) {
    const tool = getToolById(id);
    const li = document.createElement("li");
    li.textContent = tool.name + " ";
    const btn = document.createElement("button");

    if (tool.effect) {
      // Potion
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
        if (tool.effect.agility) player.agility += tool.effect.agility;
        player.tools.splice(player.tools.indexOf(id), 1);
        updatePlayer({
          health: player.health,
          tools: player.tools,
          agility: player.agility,
        });
        updateHPDisplays();
        renderInventory();
      };
      pList.appendChild(li).appendChild(btn);
    } else if (tool.effect?.defense) {
      // Shield
      if (player.equippedShieldId === id) {
        btn.textContent = "Unequip";
        btn.onclick = () => {
          player.equippedShieldId = null;
          updatePlayer({ equippedShieldId: null });
          appendLog("Shield unequipped.");
          renderInventory();
        };
      } else {
        btn.textContent = "Equip";
        btn.onclick = () => {
          player.equippedShieldId = id;
          updatePlayer({ equippedShieldId: id });
          appendLog(`Equipped shield ${tool.name}.`);
          renderInventory();
        };
      }
      sList.appendChild(li).appendChild(btn);
    } else {
      // Combat tool
      if (player.equippedCombatToolId === id) {
        btn.textContent = "Unequip";
        btn.onclick = () => {
          player.equippedCombatToolId = null;
          updatePlayer({ equippedCombatToolId: null });
          appendLog("Weapon unequipped.");
          renderInventory();
        };
      } else {
        btn.textContent = "Equip";
        btn.onclick = () => {
          player.equippedCombatToolId = id;
          updatePlayer({ equippedCombatToolId: id });
          appendLog(`Equipped weapon ${tool.name}.`);
          renderInventory();
        };
      }
      cList.appendChild(li).appendChild(btn);
    }
  }
}
