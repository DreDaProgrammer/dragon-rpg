// config/store-config.js
// Configuration for store-wide pricing rules: discounts, exact pricing, and price adjustments

/**
 * @typedef {Object} StoreConfig
 * @property {boolean} saleEnabled           - Toggle store-wide sale on/off
 * @property {number}  discountPercent       - Percent off on all items (0–100). 100 = free, 50 = half off.
 * @property {boolean} exactPriceEnabled     - Toggle exact price mode (overrides other modes)
 * @property {{gold:number, silver:number, bronze:number}} exactPrice
 *           - Exact price for all items when exactPriceEnabled is true
 * @property {boolean} priceIncreaseEnabled  - Toggle price increase mode (overrides sale)
 * @property {{gold:number, silver:number, bronze:number}} priceIncrease
 *           - Absolute price delta for all items when priceIncreaseEnabled is true (negative to decrease price)
 */

/** @type {StoreConfig} */
export const storeConfig = {
  // Discount-based sale settings
  saleEnabled: false,
  discountPercent: 0,

  // Exact pricing settings
  exactPriceEnabled: false,
  exactPrice: { gold: 0, silver: 0, bronze: 0 },

  // Price adjustment settings
  priceIncreaseEnabled: false,
  priceIncrease: { gold: 0, silver: 0, bronze: 0 },
};
