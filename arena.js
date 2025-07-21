// arena.js
// Renders the battle UI with dynamic monster attacks & a 10-second counter prompt,
// enforces one action per round, shows only “Attack” + “Defend”,
// and always updates the current HP display.

import { player, updatePlayer } from "./player-info.js";
import { defaultPlayerConfig } from "./config/player-config.js";
import { getToolById } from "./tools.js";
import { handleVictory, handleDefeat } from "./battle.js";

let currentMonster;
let equippedToolId = null;
let buffPower = 0;

/** Disable all action buttons while a round is in progress */
function disableActionButtons() {
  document
    .querySelectorAll("#battle-actions button")
    .forEach((btn) => (btn.disabled = true));
}

/** Enable them again after the round */
function enableActionButtons() {
  document
    .querySelectorAll("#battle-actions button")
    .forEach((btn) => (btn.disabled = false));
}

/** Kick off a full round: player acts, then monster acts */
async function startRound(useTool) {
  disableActionButtons();
  await handleAttack(useTool);
  enableActionButtons();
}

/**
 * Prompt the player to counter a monster attack using that monster’s attacks.
 * Shows a single clear message with a 10s timer.
 */
function promptEvade(monster) {
  return new Promise((resolve) => {
    const attack =
      monster.attacks[Math.floor(Math.random() * monster.attacks.length)];
    const container = document.getElementById("evadeContainer");
    let timeLeft = 10;

    container.innerHTML = `
      <p><strong>${monster.name}</strong> uses <em>${attack.name}</em>!</p>
      <p>Press “<strong>${attack.counter.toUpperCase()}</strong>” to counter.</p>
      <p>Time left: <span id="evadeTimer">${timeLeft}</span>s</p>
    `;

    const interval = setInterval(() => {
      if (--timeLeft <= 0) clearInterval(interval);
      document.getElementById("evadeTimer").textContent = timeLeft;
    }, 1000);

    function onKey(e) {
      if (e.key === attack.counter) {
        cleanup();
        appendLog(`You countered the ${attack.name}!`);
        resolve(true);
      }
    }

    const timeout = setTimeout(() => {
      cleanup();
      appendLog(`Failed to counter ${attack.name}.`);
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
 * Entry point: render the arena for this monster config.
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
      <p><strong>Hero:</strong> <span id="playerHp">${player.health}</span> / ${
    defaultPlayerConfig.health
  } HP</p>
      <p><strong>${monConfig.name}:</strong> <span id="monsterHp">${
    currentMonster.currentHealth
  }</span> / ${monConfig.power * 5} HP</p>
    </div>
    <div id="inventory"><h3>Inventory</h3><ul id="inventory-list"></ul></div>
    <div id="battle-actions"></div>
    <div id="evadeContainer"></div>
    <div id="battleLog"></div>
    <button id="exitBtn">Flee to Town</button>
  `;

  renderInventory();
  renderActionButtons();
  updateHPDisplays();

  document
    .getElementById("exitBtn")
    .addEventListener("click", () => window.location.reload());
}

/** Always update the numeric HP spans */
function updateHPDisplays() {
  document.getElementById("playerHp").textContent = player.health;
  document.getElementById("monsterHp").textContent =
    currentMonster.currentHealth;
}

/**
 * Display inventory with Use (for consumables) or Equip (for tools/shields).
 */
function renderInventory() {
  const invList = document.getElementById("inventory-list");
  invList.innerHTML = "";
  const counts = {};
  player.tools.forEach((id) => (counts[id] = (counts[id] || 0) + 1));

  for (const [id, qty] of Object.entries(counts)) {
    const tool = getToolById(id);
    if (!tool) continue;

    const li = document.createElement("li");
    li.innerHTML = `<strong>${tool.name}</strong> (x${qty}) `;
    const btn = document.createElement("button");

    if (tool.effect) {
      // Consumable: Use
      btn.textContent = "Use";
      btn.disabled = qty < 1;
      btn.onclick = () => {
        if (tool.effect.heal) {
          player.health = Math.min(
            defaultPlayerConfig.health,
            player.health + tool.effect.heal
          );
          appendLog(`Used ${tool.name}, healed ${tool.effect.heal} HP.`);
        }
        if (tool.effect.power) {
          buffPower += tool.effect.power;
          appendLog(
            `Used ${tool.name}, +${tool.effect.power} power next attack.`
          );
        }
        if (tool.effect.agility) {
          player.agility += tool.effect.agility;
          appendLog(`Used ${tool.name}, +${tool.effect.agility} agility.`);
        }
        player.tools.splice(player.tools.indexOf(id), 1);
        updatePlayer({
          health: player.health,
          tools: player.tools,
          agility: player.agility,
        });
        renderInventory();
        updateHPDisplays();
      };
    } else {
      // Equipable
      const isEquipped = equippedToolId === id;
      btn.textContent = isEquipped ? "Equipped" : "Equip";
      btn.disabled = isEquipped;
      btn.onclick = () => {
        equippedToolId = id;
        player.equippedToolId = id;
        updatePlayer({ equippedToolId: id });
        appendLog(`Equipped ${tool.name}.`);
        renderInventory();
        renderActionButtons();
      };
    }

    li.appendChild(btn);
    invList.appendChild(li);
  }
}

/**
 * Render action buttons:
 * - Always an "Attack" button (fists or weapon)
 * - If a shield is equipped, show a separate "Defend" button
 */
function renderActionButtons() {
  const actions = document.getElementById("battle-actions");
  actions.innerHTML = "";

  // Attack: fists or weapon
  const atk = document.createElement("button");
  atk.textContent =
    equippedToolId && !getToolById(equippedToolId).effect?.defense
      ? `Attack with ${getToolById(equippedToolId).name}`
      : "Attack";
  atk.onclick = () => startRound(false);
  actions.appendChild(atk);

  // Defend: only if your equipped tool has defense
  if (equippedToolId && getToolById(equippedToolId).effect?.defense) {
    const def = document.createElement("button");
    def.textContent = "Defend";
    def.onclick = () => startRound(true);
    actions.appendChild(def);
  }
}

/**
 * Execute one full round:
 * - Player attacks or defends
 * - Monster attacks with dodge prompt
 */
async function handleAttack(useTool) {
  // Player's turn
  let dmg = 0;
  if (
    useTool &&
    equippedToolId &&
    getToolById(equippedToolId).effect?.defense
  ) {
    appendLog(`You brace with ${getToolById(equippedToolId).name}.`);
  } else {
    const power =
      useTool && equippedToolId
        ? getToolById(equippedToolId).power + buffPower
        : 5;
    buffPower = 0;
    const base = Math.floor(power * 0.7);
    dmg = base + Math.floor(Math.random() * (player.agility + 1));
    appendLog(`You attack for ${dmg} damage.`);
  }

  // Apply to monster
  currentMonster.currentHealth = Math.max(
    0,
    currentMonster.currentHealth - dmg
  );
  updateHPDisplays();
  if (currentMonster.currentHealth <= 0) {
    appendLog(`You’ve slain the ${currentMonster.name}!`);
    handleVictory(currentMonster);
    return;
  }

  // Monster's turn
  const dodged = await promptEvade(currentMonster);
  let mdmg =
    Math.floor(currentMonster.power * 0.7) +
    Math.floor(Math.random() * (currentMonster.agility + 1));

  if (!dodged) {
    if (
      useTool &&
      equippedToolId &&
      getToolById(equippedToolId).effect?.defense
    ) {
      const defVal = getToolById(equippedToolId).effect.defense;
      const blocked = Math.min(mdmg, defVal);
      mdmg -= blocked;
      appendLog(`Shield blocks ${blocked} damage.`);
    }
    player.health = Math.max(0, player.health - mdmg);
    updatePlayer({ health: player.health });
    appendLog(`${currentMonster.name} deals ${mdmg} damage.`);
    updateHPDisplays();
  }

  if (player.health <= 0) {
    appendLog("You have been slain... returning to town.");
    handleDefeat();
  }
}

/**
 * Append text to the battle log and auto-scroll.
 */
function appendLog(text) {
  const log = document.getElementById("battleLog");
  const p = document.createElement("p");
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}
