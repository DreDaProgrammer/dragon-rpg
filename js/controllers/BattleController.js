// js/controllers/BattleController.js

import { player, updatePlayer } from "../player-info.js";
import { defaultPlayerConfig } from "../config/player-config.js";
import { getToolById } from "../tools.js";

import {
  playerAttack as calculatePlayerDamage,
  monsterAttack as calculateMonsterDamage,
  handleVictory,
  handleDefeat,
} from "../battle.js";

import { ActionMenu } from "../ui/ActionMenu.js";
import { StatusPanel } from "../ui/StatusPanel.js";
import { Logger } from "../ui/Logger.js";
import { InventoryPanel } from "../ui/InventoryPanel.js";

export class BattleController {
  constructor(container) {
    this.container = container;
    this.awaitingPlayerAction = true;

    this.actionMenu = new ActionMenu((action) => this.handleAction(action));
    this.statusPanel = new StatusPanel();
    this.logger = new Logger(container.querySelector("#battle-log"));
    this.inventory = new InventoryPanel(() => {
      this.awaitingPlayerAction = true;
      this.statusPanel.update(player, this.currentMonster);
    });
  }

  /**
   * Start a new battle against `monsterConfig`.
   */
  render(monsterConfig) {
    // initialize monster
    this.currentMonster = {
      ...monsterConfig,
      maxHealth: monsterConfig.power * 5,
      currentHealth: monsterConfig.power * 5,
    };
    player.buffPower = 0;
    this.awaitingPlayerAction = true;

    // clear log and redraw UI
    this.logger.clear();
    this.actionMenu.render();
    // ← use update(), not render()
    this.statusPanel.update(player, this.currentMonster);

    this.logger.log(`Battle begins against ${monsterConfig.name}!`);
  }

  handleAction(action) {
    if (!this.awaitingPlayerAction) return;
    switch (action) {
      case "attack":
        this.playerAttack();
        break;
      case "items":
        this.openInventory();
        break;
      case "guard":
        this.playerGuard();
        break;
      case "talk":
        this.logger.log(`The ${this.currentMonster.name} does not respond.`);
        this.endPlayerTurn();
        break;
      case "escape":
        this.tryEscape();
        break;
      case "pass":
        this.logger.log("You pass your turn.");
        this.endPlayerTurn();
        break;
      default:
        this.logger.log("Unknown action.");
    }
  }

  playerAttack() {
    this.awaitingPlayerAction = false;
    const dmg = calculatePlayerDamage(this.currentMonster);
    this.logger.log(`You deal ${dmg} damage.`);
    this.statusPanel.update(player, this.currentMonster);

    if (this.currentMonster.currentHealth === 0) {
      handleVictory(this.currentMonster);
      this.redirectToTown();
      return;
    }
    this.endPlayerTurn();
  }

  playerGuard() {
    this.awaitingPlayerAction = false;
    player.isGuarding = true;
    this.logger.log("You brace for the next attack.");
    this.endPlayerTurn();
  }

  openInventory() {
    this.awaitingPlayerAction = false;
    this.inventory.open();
  }

  tryEscape() {
    this.awaitingPlayerAction = false;
    if (Math.random() > 0.5) {
      this.logger.log("You successfully fled!");
      setTimeout(() => this.redirectToTown(), 800);
    } else {
      this.logger.log("Escape failed.");
      this.endPlayerTurn();
    }
  }

  endPlayerTurn() {
    setTimeout(() => this.monsterTurn(), 600);
  }

  monsterTurn() {
    const dmg = calculateMonsterDamage(this.currentMonster);
    this.logger.log(`${this.currentMonster.name} deals ${dmg} damage.`);
    this.statusPanel.update(player, this.currentMonster);

    if (player.health === 0) {
      handleDefeat();
      this.redirectToTown();
      return;
    }

    this.awaitingPlayerAction = true;
    this.logger.log("Your turn.");
  }

  /**
   * After victory/defeat or escape, go back home after 3 seconds.
   */
  redirectToTown() {
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }
}
