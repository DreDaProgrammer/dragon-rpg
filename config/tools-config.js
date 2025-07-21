// config/tools-config.js
// Configuration for all purchasable tools in the game
// Define tools with stats, effects, and costs
export const toolsConfig = [
  // Melee & Close-Combat Tools
  {
    id: "dagger",
    name: "Dagger",
    power: 8,
    cost: { gold: 0, silver: 10, bronze: 0 },
  },
  {
    id: "short_sword",
    name: "Short Sword",
    power: 12,
    cost: { gold: 0, silver: 15, bronze: 0 },
  },
  {
    id: "longsword",
    name: "Longsword",
    power: 20,
    cost: { gold: 1, silver: 0, bronze: 0 },
  },
  {
    id: "war_axe",
    name: "War Axe",
    power: 30,
    cost: { gold: 2, silver: 0, bronze: 0 },
  },
  {
    id: "battle_hammer",
    name: "Battle Hammer",
    power: 35,
    cost: { gold: 3, silver: 0, bronze: 0 },
  },
  {
    id: "spear",
    name: "Spear",
    power: 18,
    cost: { gold: 0, silver: 20, bronze: 0 },
  },
  {
    id: "nunchucks",
    name: "Nunchucks",
    power: 20,
    cost: { gold: 0, silver: 15, bronze: 0 },
  },

  // Ranged Tools
  {
    id: "short_bow",
    name: "Short Bow",
    power: 15,
    cost: { gold: 0, silver: 25, bronze: 0 },
  },
  {
    id: "long_bow",
    name: "Long Bow",
    power: 25,
    cost: { gold: 1, silver: 5, bronze: 0 },
  },
  {
    id: "crossbow",
    name: "Crossbow",
    power: 30,
    cost: { gold: 2, silver: 0, bronze: 0 },
  },

  // Defensive Tools
  {
    id: "light_shield",
    name: "Light Shield",
    defense: 10,
    cost: { gold: 0, silver: 25, bronze: 0 },
  },
  {
    id: "heavy_shield",
    name: "Heavy Shield",
    defense: 20,
    cost: { gold: 1, silver: 10, bronze: 0 },
  },
  {
    id: "magic_shield",
    name: "Magic Shield",
    defense: 30,
    cost: { gold: 2, silver: 0, bronze: 0 },
  },
  {
    id: "leather_armor",
    name: "Leather Armor",
    defense: 15,
    cost: { gold: 0, silver: 20, bronze: 0 },
  },
  {
    id: "chain_mail",
    name: "Chain Mail",
    defense: 25,
    cost: { gold: 1, silver: 0, bronze: 0 },
  },
  {
    id: "plate_armor",
    name: "Plate Armor",
    defense: 35,
    cost: { gold: 2, silver: 0, bronze: 0 },
  },

  // Consumable Tools (Potions & Elixirs)
  {
    id: "health_potion",
    name: "Health Potion",
    effect: { heal: 50 },
    cost: { gold: 0, silver: 10, bronze: 0 },
  },
  {
    id: "health_elixir",
    name: "Health Elixir",
    effect: { heal: 100 },
    cost: { gold: 1, silver: 0, bronze: 0 },
  },
  {
    id: "power_potion",
    name: "Power Potion",
    effect: { power: 10 },
    cost: { gold: 0, silver: 20, bronze: 0 },
  },
  {
    id: "elixir_of_strength",
    name: "Elixir of Strength",
    effect: { power: 20 },
    cost: { gold: 1, silver: 5, bronze: 0 },
  },
  {
    id: "agility_potion",
    name: "Agility Potion",
    effect: { agility: 5 },
    cost: { gold: 0, silver: 15, bronze: 5 },
  },
  {
    id: "elixir_of_swiftness",
    name: "Elixir of Swiftness",
    effect: { agility: 10 },
    cost: { gold: 0, silver: 30, bronze: 0 },
  },
  {
    id: "defense_potion",
    name: "Defense Potion",
    effect: { defense: 10 },
    cost: { gold: 0, silver: 15, bronze: 0 },
  },
  {
    id: "elixir_of_fortitude",
    name: "Elixir of Fortitude",
    effect: { defense: 20 },
    cost: { gold: 1, silver: 0, bronze: 0 },
  },

  // Magic & Utility Tools
  {
    id: "ring_of_power",
    name: "Ring of Power",
    effect: { power: 5 },
    cost: { gold: 1, silver: 0, bronze: 0 },
  },
  {
    id: "boots_of_speed",
    name: "Boots of Speed",
    effect: { agility: 5 },
    cost: { gold: 0, silver: 0, bronze: 50 },
  },
  {
    id: "cloak_of_resistance",
    name: "Cloak of Resistance",
    effect: { defense: 5 },
    cost: { gold: 0, silver: 0, bronze: 75 },
  },
];
