// arena.js
// Renders the battle UI with dynamic monster attacks & a 10-second counter prompt

import { player, updatePlayer } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";
import { handleVictory, handleDefeat } from "./battle.js";

let currentMonster;
let equippedToolId = null;
let buffPower = 0;

/**
 * Prompt the player to counter a monster attack
 * using that monster's own attacks array.
 * Shows a single, clear message with a 10s timer.
 * @param {Object} monster – the current monster config
 * @returns {Promise<boolean>}
 */
function promptEvade(monster) {
  return new Promise((resolve) => {
    const attack =
      monster.attacks[Math.floor(Math.random() * monster.attacks.length)];
    const container = document.getElementById("evadeContainer");
    let timeLeft = 10;

    container.innerHTML = `
      <p>
        ${monster.name} uses <strong>${attack.name}</strong>!<br>
        Press "<strong>${attack.counter.toUpperCase()}</strong>" to counter in time.
      </p>
      <p>Time left: <span id="evadeTimer">${timeLeft}</span>s</p>
    `;

    const interval = setInterval(() => {
      timeLeft--;
      const timerEl = document.getElementById("evadeTimer");
      if (timerEl) timerEl.textContent = timeLeft;
      if (timeLeft <= 0) clearInterval(interval);
    }, 1000);

    function onKey(e) {
      if (e.key === attack.counter) {
        cleanup();
        appendLog(`You successfully countered the ${attack.name}!`);
        resolve(true);
      }
    }

    const timeout = setTimeout(() => {
      cleanup();
      appendLog(`Too slow! You failed to counter the ${attack.name}.`);
      resolve(false);
    }, 10000);

    window.addEventListener("keydown", onKey);

    function cleanup() {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener("keydown", onKey);
      container.innerHTML = "";
    }
  });
}

/**
 * Entry point: render the arena for this monster
 */
export function renderArena(container, monConfig) {
  currentMonster = { ...monConfig, currentHealth: monConfig.power * 5 };
  equippedToolId = player.equippedToolId || null;
  buffPower = 0;

  container.classList.remove("location-view");
  container.style.backgroundImage = "";

  container.innerHTML = `
    <h2>Battle: ${monConfig.name}</h2>
    <div id="battleInfo">
      <p>Your HP: <span id="playerHp">${player.health}</span></p>
      <p>${monConfig.name} HP: <span id="monsterHp">${currentMonster.currentHealth}</span></p>
    </div>
    <div id="inventory"><h3>Inventory</h3><ul id="inventory-list"></ul></div>
    <div id="battle-actions"></div>
    <div id="evadeContainer"></div>    <!-- Dodge prompt & timer -->
    <div id="battleLog"></div>
    <button id="exitBtn">Flee to Town</button>
  `;

  renderInventory();
  renderActionButtons();
  document
    .getElementById("exitBtn")
    .addEventListener("click", () => window.location.reload());
}

/**
 * Renders inventory with Use/Equip buttons
 */
function renderInventory() {
  const invList = document.getElementById("inventory-list");
  invList.innerHTML = "";
  const counts = {};
  player.tools.forEach((id) => (counts[id] = (counts[id] || 0) + 1));

  Object.entries(counts).forEach(([id, qty]) => {
    const tool = getToolById(id);
    if (!tool) return;
    const li = document.createElement("li");
    li.innerHTML = `<strong>${tool.name}</strong> (x${qty}) `;
    const btn = document.createElement("button");

    if (tool.effect) {
      btn.textContent = "Use";
      btn.disabled = qty < 1;
      btn.addEventListener("click", () => {
        if (tool.effect.heal) {
          player.health = Math.min(
            defaultPlayerConfig.health,
            player.health + tool.effect.heal
          );
          updatePlayer({ health: player.health });
          appendLog(`You used ${tool.name}, healed ${tool.effect.heal} HP.`);
          document.getElementById("playerHp").textContent = player.health;
        }
        if (tool.effect.power) {
          buffPower += tool.effect.power;
          appendLog(
            `You used ${tool.name}, +${tool.effect.power} power next attack.`
          );
        }
        if (tool.effect.agility) {
          player.agility += tool.effect.agility;
          updatePlayer({ agility: player.agility });
          appendLog(`You used ${tool.name}, +${tool.effect.agility} agility.`);
        }
        player.tools.splice(player.tools.indexOf(id), 1);
        updatePlayer({ tools: player.tools });
        renderInventory();
      });
    } else {
      const isEquipped = equippedToolId === id;
      btn.textContent = isEquipped ? "Equipped" : "Equip";
      btn.disabled = isEquipped;
      btn.addEventListener("click", () => {
        equippedToolId = id;
        player.equippedToolId = id;
        updatePlayer({ equippedToolId: id });
        appendLog(`You equipped ${tool.name}.`);
        renderInventory();
        renderActionButtons();
      });
    }

    li.appendChild(btn);
    invList.appendChild(li);
  });
}

/**
 * Renders Attack buttons (Fists + equipped tool if any)
 */
function renderActionButtons() {
  const actions = document.getElementById("battle-actions");
  actions.innerHTML = "";

  // Fist attack
  const fistBtn = document.createElement("button");
  fistBtn.textContent = "Attack (Fists)";
  fistBtn.addEventListener("click", () => handleAttack(false));
  actions.appendChild(fistBtn);

  // Tool attack/use
  if (equippedToolId) {
    const tool = getToolById(equippedToolId);
    const btn = document.createElement("button");
    btn.textContent = tool.effect
      ? `Use ${tool.name}`
      : `Attack with ${tool.name}`;
    btn.addEventListener("click", () => handleAttack(true));
    actions.appendChild(btn);
  }
}

/**
 * Handles one round: player moves, then monster attacks with prompt
 * @param {boolean} useTool
 */
async function handleAttack(useTool) {
  // Player's turn
  let dmg = 0;
  if (useTool && equippedToolId) {
    const tool = getToolById(equippedToolId);
    if (tool.effect && tool.effect.defense) {
      appendLog(`You brace with ${tool.name}, no damage dealt.`);
    } else {
      let power = tool.power + buffPower;
      buffPower = 0;
      const base = Math.floor(power * 0.7);
      dmg = base + Math.floor(Math.random() * (player.agility + 1));
      appendLog(`You strike with ${tool.name}, dealing ${dmg} damage.`);
    }
  } else {
    const base = Math.floor(5 * 0.7);
    dmg = base + Math.floor(Math.random() * (player.agility + 1));
    appendLog(`You punch, dealing ${dmg} damage.`);
  }

  currentMonster.currentHealth = Math.max(
    0,
    currentMonster.currentHealth - dmg
  );
  document.getElementById("monsterHp").textContent =
    currentMonster.currentHealth;
  if (currentMonster.currentHealth <= 0) {
    appendLog(`You’ve defeated the ${currentMonster.name}!`);
    handleVictory(currentMonster);
    return;
  }

  // Monster's turn with dodge prompt
  const dodged = await promptEvade(currentMonster);

  // Monster damage calculation
  let mdmg =
    Math.floor(currentMonster.power * 0.7) +
    Math.floor(Math.random() * (currentMonster.agility + 1));

  if (!dodged) {
    if (equippedToolId) {
      const tool = getToolById(equippedToolId);
      if (tool.effect?.defense) {
        const blocked = Math.min(mdmg, tool.effect.defense);
        mdmg -= blocked;
        appendLog(`Your ${tool.name} blocks ${blocked} damage.`);
      }
    }
    player.health = Math.max(0, player.health - mdmg);
    updatePlayer({ health: player.health });
    document.getElementById("playerHp").textContent = player.health;
    appendLog(`${currentMonster.name} hits you for ${mdmg} damage.`);
  }

  if (player.health <= 0) {
    appendLog("You have been slain... returning to town.");
    handleDefeat();
  }
}

/**
 * Appends a line to the battle log and auto-scrolls
 */
function appendLog(text) {
  const log = document.getElementById("battleLog");
  const p = document.createElement("p");
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}
