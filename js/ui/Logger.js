// js/ui/Logger.js

/**
 * Manages the battle log: appending new messages and clearing old ones.
 */
export class Logger {
  constructor() {
    this.container = document.getElementById("battle-log");
  }

  /** Clears all messages from the log. */
  clear() {
    this.container.innerHTML = "";
  }

  /**
   * Appends a new message to the log.
   * @param {string} text  The message to display.
   */
  log(text) {
    const p = document.createElement("p");
    p.textContent = text;
    this.container.appendChild(p);
    // Auto‐scroll to bottom
    this.container.scrollTop = this.container.scrollHeight;
  }
}
