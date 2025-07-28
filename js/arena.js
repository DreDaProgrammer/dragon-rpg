// js/arena.js

import { BattleController } from "./controllers/BattleController.js";
import { monstersConfig } from "./config/monsters-config.js";

document.addEventListener("DOMContentLoaded", () => {
  // Grab the main battle UI container
  const uiContainer = document.getElementById("battle-ui");
  if (!uiContainer) {
    throw new Error("Could not find #battle-ui in the DOM");
  }

  // Load the monster you clicked on, or default to the first one
  const saved = localStorage.getItem("currentMonster");
  const monster = saved ? JSON.parse(saved) : monstersConfig[0];

  // Instantiate the controller and render the battle
  const battle = new BattleController(uiContainer);
  battle.render(monster);
});
