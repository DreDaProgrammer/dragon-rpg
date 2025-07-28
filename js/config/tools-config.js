// config/tools-config.js
// Configuration for all purchasable tools in the game
// Includes type, consumable flag, and all stats/effects/costs.

export const toolsConfig = [
  // 🗡 Melee & Close-Combat Tools
  {
    id: "dagger",
    name: "Dagger",
    type: "offense",
    power: 8,
    cost: { gold: 0, silver: 10, bronze: 0 },
    consumable: false,
  },
  {
    id: "short_sword",
    name: "Short Sword",
    type: "offense",
    power: 1200,
    cost: { gold: 0, silver: 15, bronze: 0 },
    consumable: false,
  },
  {
    id: "longsword",
    name: "Longsword",
    type: "offense",
    power: 20,
    cost: { gold: 1, silver: 0, bronze: 0 },
    consumable: false,
  },
  {
    id: "war_axe",
    name: "War Axe",
    type: "offense",
    power: 30,
    cost: { gold: 2, silver: 0, bronze: 0 },
    consumable: false,
  },
  {
    id: "battle_hammer",
    name: "Battle Hammer",
    type: "offense",
    power: 35,
    cost: { gold: 3, silver: 0, bronze: 0 },
    consumable: false,
  },
  {
    id: "spear",
    name: "Spear",
    type: "offense",
    power: 18,
    cost: { gold: 0, silver: 20, bronze: 0 },
    consumable: false,
  },
  {
    id: "nunchucks",
    name: "Nunchucks",
    type: "offense",
    power: 20,
    cost: { gold: 0, silver: 15, bronze: 0 },
    consumable: false,
  },

  // 🏹 Ranged Tools
  {
    id: "short_bow",
    name: "Short Bow",
    type: "offense",
    power: 15,
    cost: { gold: 0, silver: 25, bronze: 0 },
    consumable: false,
  },
  {
    id: "long_bow",
    name: "Long Bow",
    type: "offense",
    power: 25,
    cost: { gold: 1, silver: 5, bronze: 0 },
    consumable: false,
  },
  {
    id: "crossbow",
    name: "Crossbow",
    type: "offense",
    power: 30,
    cost: { gold: 2, silver: 0, bronze: 0 },
    consumable: false,
  },

  // 🛡 Defensive Tools (Shields)
  {
    id: "light_shield",
    name: "Light Shield",
    type: "defense",
    defense: 10,
    cost: { gold: 0, silver: 25, bronze: 0 },
    consumable: false,
  },
  {
    id: "heavy_shield",
    name: "Heavy Shield",
    type: "defense",
    defense: 20,
    cost: { gold: 1, silver: 10, bronze: 0 },
    consumable: false,
  },
  {
    id: "magic_shield",
    name: "Magic Shield",
    type: "defense",
    defense: 30,
    cost: { gold: 2, silver: 0, bronze: 0 },
    consumable: false,
  },

  // 🦾 Armor
  {
    id: "leather_armor",
    name: "Leather Armor",
    type: "armor",
    defense: 15,
    cost: { gold: 0, silver: 20, bronze: 0 },
    consumable: false,
  },
  {
    id: "chain_mail",
    name: "Chain Mail",
    type: "armor",
    defense: 25,
    cost: { gold: 1, silver: 0, bronze: 0 },
    consumable: false,
  },
  {
    id: "plate_armor",
    name: "Plate Armor",
    type: "armor",
    defense: 35,
    cost: { gold: 2, silver: 0, bronze: 0 },
    consumable: false,
  },

  // 🧪 Consumable Tools (Potions & Elixirs)
  {
    id: "health_potion",
    name: "Health Potion",
    type: "potion",
    effect: { heal: 50 },
    cost: { gold: 0, silver: 10, bronze: 0 },
    consumable: true,
  },
  {
    id: "health_elixir",
    name: "Health Elixir",
    type: "potion",
    effect: { heal: 100 },
    cost: { gold: 1, silver: 0, bronze: 0 },
    consumable: true,
  },
  {
    id: "power_potion",
    name: "Power Potion",
    type: "potion",
    effect: { power: 10 },
    cost: { gold: 0, silver: 20, bronze: 0 },
    consumable: true,
  },
  {
    id: "elixir_of_strength",
    name: "Elixir of Strength",
    type: "potion",
    effect: { power: 20 },
    cost: { gold: 1, silver: 5, bronze: 0 },
    consumable: true,
  },
  {
    id: "agility_potion",
    name: "Agility Potion",
    type: "potion",
    effect: { agility: 5 },
    cost: { gold: 0, silver: 15, bronze: 5 },
    consumable: true,
  },
  {
    id: "elixir_of_swiftness",
    name: "Elixir of Swiftness",
    type: "potion",
    effect: { agility: 10 },
    cost: { gold: 0, silver: 30, bronze: 0 },
    consumable: true,
  },
  {
    id: "defense_potion",
    name: "Defense Potion",
    type: "potion",
    effect: { defense: 10 },
    cost: { gold: 0, silver: 15, bronze: 0 },
    consumable: true,
  },
  {
    id: "elixir_of_fortitude",
    name: "Elixir of Fortitude",
    type: "potion",
    effect: { defense: 20 },
    cost: { gold: 1, silver: 0, bronze: 0 },
    consumable: true,
  },

  // 🔮 Magic & Utility Tools
  {
    id: "ring_of_power",
    name: "Ring of Power",
    type: "offense", // grants power, permanent item
    effect: { power: 5 },
    cost: { gold: 1, silver: 0, bronze: 0 },
    consumable: false,
  },
  {
    id: "boots_of_speed",
    name: "Boots of Speed",
    type: "armor", // boosts agility but is worn, not consumed
    effect: { agility: 5 },
    cost: { gold: 0, silver: 0, bronze: 50 },
    consumable: false,
  },
  {
    id: "cloak_of_resistance",
    name: "Cloak of Resistance",
    type: "armor",
    effect: { defense: 5 },
    cost: { gold: 0, silver: 0, bronze: 75 },
    consumable: false,
  },
];
