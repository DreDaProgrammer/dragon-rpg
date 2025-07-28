// js/ui/InventoryPanel.js
import { player, updatePlayer } from "../player-info.js";
import { defaultPlayerConfig } from "../config/player-config.js";
import { getToolById } from "../tools.js";

export class InventoryPanel {
  constructor(onClose) {
    this.onClose = onClose;
    this.container = document.getElementById("inventory-panel");
  }

  open() {
    this.container.innerHTML = "";
    this.container.style.display = "block";

    // Sections we support
    const sections = [
      { title: "Weapons", type: "offense" },
      { title: "Shields", type: "defense" },
      { title: "Potions", type: "potion" },
    ];

    sections.forEach(({ title, type }) => {
      const wrapper = document.createElement("div");
      const header = document.createElement("h3");
      header.textContent = title;
      wrapper.appendChild(header);

      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.padding = "0";

      player.tools.forEach((toolId, idx) => {
        const tool = getToolById(toolId);
        if (!tool || tool.type !== type) return;

        const li = document.createElement("li");
        li.style.marginBottom = "8px";
        li.textContent = tool.name + " ";

        const btn = document.createElement("button");
        btn.style.marginLeft = "8px";

        if (type === "potion") {
          btn.textContent = "Use";
          btn.onclick = () => {
            // Heal effect
            if (tool.effect.heal) {
              player.health = Math.min(
                defaultPlayerConfig.health,
                player.health + tool.effect.heal
              );
            }
            // Buff effect
            if (tool.effect.power) {
              player.buffPower = (player.buffPower || 0) + tool.effect.power;
            }
            // Remove one potion
            player.tools.splice(idx, 1);
            updatePlayer({ health: player.health, tools: player.tools });
            this.close();
          };
        } else {
          // offense or defense
          const isEquipped =
            type === "offense"
              ? player.equippedCombatToolId === toolId
              : player.equippedShieldId === toolId;

          btn.textContent = isEquipped ? "Unequip" : "Equip";
          btn.onclick = () => {
            if (type === "offense") {
              player.equippedCombatToolId = isEquipped ? null : toolId;
            } else {
              player.equippedShieldId = isEquipped ? null : toolId;
            }
            updatePlayer({
              equippedCombatToolId: player.equippedCombatToolId,
              equippedShieldId: player.equippedShieldId,
            });
            this.close();
          };
        }

        li.appendChild(btn);
        ul.appendChild(li);
      });

      wrapper.appendChild(ul);
      this.container.appendChild(wrapper);
    });

    // Cancel button
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.onclick = () => this.close();
    cancel.style.display = "block";
    cancel.style.marginTop = "12px";
    this.container.appendChild(cancel);
  }

  close() {
    this.container.style.display = "none";
    this.onClose && this.onClose();
  }
}
