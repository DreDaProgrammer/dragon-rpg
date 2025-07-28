// js/ui/ActionMenu.js

export class ActionMenu {
  /**
   * @param {(action: string) => void} onSelect
   */
  constructor(onSelect) {
    this.onSelect = onSelect;
    this.container = document.getElementById("action-menu");
    if (!this.container) {
      throw new Error("Could not find #action-menu in the DOM");
    }

    // cache the buttons
    this.buttons = Array.from(
      this.container.querySelectorAll(".menu-item[data-action]")
    );
  }

  /**
   * “Renders” by wiring up each button’s click → onSelect(action)
   */
  render() {
    this.buttons.forEach((btn) => {
      const action = btn.dataset.action;
      btn.onclick = () => this.onSelect(action);
      btn.disabled = false; // re-enable if you’d ever disable
      btn.classList.remove("disabled");
    });
  }

  /**
   * Optionally disable all buttons until next turn
   */
  disableAll() {
    this.buttons.forEach((btn) => {
      btn.disabled = true;
      btn.classList.add("disabled");
    });
  }
}
