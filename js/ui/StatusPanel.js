// js/ui/StatusPanel.js

import { defaultPlayerConfig } from "../config/player-config.js";

/**
 * Handles updating the player & monster status UI elements.
 */
export class StatusPanel {
  constructor() {
    this.playerHpEl = document.getElementById("playerHp");
    this.playerMaxHpEl = document.getElementById("playerMaxHp");
    this.playerMpEl = document.getElementById("playerMp");
    this.playerMaxMpEl = document.getElementById("playerMaxMp");
    this.playerLevelEl = document.getElementById("playerLevel");
    this.monsterNameEl = document.getElementById("monsterName");
    this.monsterHpEl = document.getElementById("monsterHp");
    this.monsterMaxHpEl = document.getElementById("monsterMaxHp");
  }

  /**
   * Refreshes all status fields based on current player and monster state.
   * @param {Object} player   - current player state
   * @param {Object} monster  - current monster state ({ name, currentHealth, maxHealth })
   */
  update(player, monster) {
    // Player stats
    this.playerHpEl.textContent = player.health;
    this.playerMaxHpEl.textContent = defaultPlayerConfig.health;
    this.playerMpEl.textContent = player.mp ?? 30;
    this.playerMaxMpEl.textContent = 30;
    this.playerLevelEl.textContent = player.level ?? 1;

    // Monster stats
    this.monsterNameEl.textContent = monster.name;
    this.monsterHpEl.textContent = monster.currentHealth;
    this.monsterMaxHpEl.textContent = monster.maxHealth;
  }
}
