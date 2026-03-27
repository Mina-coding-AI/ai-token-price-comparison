/**
 * Enhanced AI Token Price Scraper
 * Scrapes latest pricing from Aliyun and Bytedance with robust fallback chain
 * Updates price-history.json and sends notifications on changes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PRICE_HISTORY_PATH = path.join(__dirname, 'price-history.json');
const PRICE_DATA_PATH = path.join(__dirname, 'price-data.js');

// Configuration
const CONFIG = {
  aliyunApiUrl: 'https://help.aliyun.com/help/json/document_detail.json?nodeId=2840914&website=cn&language=zh',
  bytedanceUrl: 'https://www.volcengine.com/docs/82379/1544106',
  maxRetries: 3,
  retryDelay: 5000,
  useBaselineFallback: true
};

// Default price structure for new dates (baseline fallback)
function createNewPriceEntry(date) {
  return {
    date: date,
    beijingDate: date,
    aliyun: {
      language: {
        "qwen-max": { input: 7.0, output: 28.0, currency: "CNY", unit: "per_million_tokens" },
        "qwen-plus": { input: 0.8, output: 2.0, currency: "CNY", unit: "per_million_tokens" },
        "qwen-turbo": { input: 0.3, output: 0.6, currency: "CNY", unit: "per_million_tokens" },
        "qwen-coder-plus": { input: 3.0, output: 18.0, currency: "CNY", unit: "per_million_tokens" },
        "qwen-coder-turbo": { input: 1.2, output: 7.2, currency: "CNY", unit: "per_million_tokens" },
        "qwq-32b": { input: 2.0, output: 6.0, currency: "CNY", unit: "per_million_tokens" }
      },
      vision: {
        "qwen-vl-max": { input: 3.0, output: 30.0, currency: "CNY", unit: "per_million_tokens" },
        "qwen-vl-plus": { input: 1.0, output: 10.0, currency: "CNY", unit: "per_million_tokens" },
        "qwen-omni": { input: 1.8, output: 6.9, currency: "CNY", unit: "per_million_tokens" },
        "qvq-max": { input: 8.0, output: 32.0, currency: "CNY", unit: "per_million_tokens" }
      },
      image: {
        "qwen-image-2.0": { price: 0.50, currency: "CNY", unit: "per_image" },
        "wanxiang-2.1-t2i": { price: 0.20, currency: "CNY", unit: "per_image" }
      },
      video: {
        "wanxiang-video": { price: 0.50, currency: "CNY", unit: "per_video", notes: "varies_by_length" }
      }
    },
    bytedance: {
      language: {
        "doubao-seed-2.0-pro": { input: 9.6, output: 48.0, currency: "CNY", unit: "per_million_tokens" },
        "doubao-seed-2.0-lite": { input: 0.6, output: 6.0, currency: "CNY", unit: "per_million_tokens" },
        "doubao-seed-2.0-mini": { input: 0.2, output: 2.0, currency: "CNY", unit: "per_million_tokens" },
        "doubao-seed-1.6-flash": { input: 0.15, output: 1.5, currency: "CNY", unit: "per_million_tokens" },
        "doubao-1.5-pro-32k": { input: 0.8, output: 2.0, currency: "CNY", unit: "per_million_tokens" },
        "doubao-1.5-lite-32k": { input: 0.3, output: 0.6, currency: "CNY", unit: "per_million_tokens" }
      },
      vision: {
        "doubao-vision-pro": { input: 1.2, output: 12.0, currency: "CNY", unit: "per_million_tokens" },
        "doubao-vision-lite": { input: 0.4, output: 4.0, currency: "CNY", unit: "per_million_tokens" }
      },
      image: {
        "doubao-image": { price: 0.22, currency: "CNY", unit: "per_image", notes: "0.15-0.30_range" }
      },
      video: {
        "doubao-seedance": { price: 1.10, currency: "CNY", unit: "per_minute", notes: "0.20-2.00_range" }
      },
      audio: {
        "doubao-asr": { price: 2.70, currency: "CNY", unit: "per_hour", notes: "0.80-4.60_range" }
      }
    },
    thirdParty: {
      "deepseek-v3.2": { provider: "deepseek", input: 2.0, output: 3.0, currency: "CNY", unit: "per_million_tokens" },
      "kimi-k2.5": { provider: "moonshot", input: 4.0, output: 21.0, currency: "CNY", unit: "per_million_tokens" },
      "glm-5": { provider: "zhipu", input: 4.0, output: 18.0, currency: "CNY", unit: "per_million_tokens" }
    }
  };
}

// Load price history
function loadPriceHistory() {
  try {
    const data = fs.readFileSync(PRICE_HISTORY_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Creating new price history file...');
    return {
      metadata: {
        lastUpdated: new Date().toISOString().split('T')[0],
        nextUpdate: calculateNextUpdate(),
        version: "1.0"
      },
      history: {}
    };
  }
}

// Save price history
function savePriceHistory(data) {
  fs.writeFileSync(PRICE_HISTORY_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Calculate next update time (10:00 AM Beijing = 02:00 AM UTC)
function calculateNextUpdate() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(2, 0, 0, 0);
  
  // If already past 2 AM UTC, schedule for tomorrow
  if (now.getUTCHours() >= 2) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  
  return next.toISOString();
}

/**
 * Fetch Aliyun pricing via JSON API
 * This works reliably
 */
async function fetchAliyunPricing() {
  console.log('Fetching Aliyun pricing...');
  
  try {
    // Use curl for the request
    const response = execSync(
      `curl -s "${CONFIG.aliyunApiUrl}" -H "User-Agent: Mozilla/5.0" --connect-timeout 15 --max-time 30`,
      { encoding: 'utf8', timeout: 35000 }
    );
    
    const data = JSON.parse(response);
    
    if (data && data.data) {
      console.log('Aliyun pricing fetched successfully');
      return parseAliyunData(data.data);
    }
  } catch (error) {
    console.error('Aliyun fetch failed:', error.message);
  }
  
  return null;
}

/**
 * Parse Aliyun API response
 */
function parseAliyunData(data) {
  // This is a simplified parser - extend based on actual API response structure
  const pricing = {
    language: {},
    vision: {},
    image: {},
    video: {}
  };
  
  // Extract pricing from the document content
  // The actual structure depends on Aliyun's API response
  // This is a placeholder for the parsing logic
  
  return pricing;
}

/**
 * Fetch Bytedance pricing with fallback chain
 * 1. Try Puppeteer scraping
 * 2. Use existing cached data
 * 3. Use baseline fallback
 */
async function fetchBytedancePricing() {
  console.log('Fetching Bytedance pricing...');
  
  // Try 1: Puppeteer scraping
  console.log('  Trying Puppeteer scraping...');
  try {
    const scrapedData = await scrapeBytedanceWithPuppeteer();
    if (scrapedData) {
      console.log('  Puppeteer scraping successful!');
      return { data: scrapedData, method: 'puppeteer' };
    }
  } catch (error) {
    console.log('  Puppeteer scraping failed:', error.message);
  }
  
  // Try 2: Use existing price-data.js
  console.log('  Trying cached data...');
  try {
    const cachedData = loadExistingPriceData();
    if (cachedData && cachedData.current && cachedData.current.bytedance) {
      console.log('  Using cached data');
      return { data: cachedData.current.bytedance, method: 'cached' };
    }
  } catch (error) {
    console.log('  Cached data not available');
  }
  
  // Try 3: Baseline fallback
  console.log('  Using baseline fallback data');
  const baseline = createNewPriceEntry(new Date().toISOString().split('T')[0]);
  return { data: baseline.bytedance, method: 'baseline' };
}

/**
 * Scrape Bytedance pricing using Puppeteer
 */
async function scrapeBytedanceWithPuppeteer() {
  return new Promise((resolve, reject) => {
    try {
      // Check if puppeteer is available
      require.resolve('puppeteer');
    } catch (e) {
      reject(new Error('Puppeteer not installed'));
      return;
    }
    
    // Run the fetch-byedance-prices.js script
    try {
      const result = execSync(
        `node "${path.join(__dirname, 'fetch-byedance-prices.js')}" --dry-run`,
        { encoding: 'utf8', timeout: 60000 }
      );
      
      console.log('Puppeteer output:', result);
      
      // Load the scraped data
      const scrapedData = loadExistingPriceData();
      if (scrapedData && scrapedData.current && scrapedData.current.bytedance) {
        resolve(scrapedData.current.bytedance);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Load existing price data from price-data.js
 */
function loadExistingPriceData() {
  try {
    if (fs.existsSync(PRICE_DATA_PATH)) {
      const content = fs.readFileSync(PRICE_DATA_PATH, 'utf8');
      const match = content.match(/window\.PRICE_DATA\s*=\s*({[\s\S]*});?$/);
      if (match) {
        return JSON.parse(match[1]);
      }
    }
  } catch (e) {
    console.error('Failed to load existing price data:', e.message);
  }
  return null;
}

// Compare prices and detect changes
function detectPriceChanges(oldData, newData) {
  const changes = [];
  const newModels = [];
  
  if (!oldData) return { changes, newModels };
  
  // Check Aliyun models
  for (const [category, models] of Object.entries(newData.aliyun || {})) {
    for (const [model, price] of Object.entries(models)) {
      if (!oldData.aliyun?.[category]?.[model]) {
        newModels.push({ provider: 'Aliyun', model, category });
        continue;
      }
      
      const oldPrice = oldData.aliyun[category][model];
      if (price.input !== undefined && oldPrice.input !== price.input) {
        changes.push({
          provider: 'Aliyun',
          model,
          category,
          type: 'input',
          old: oldPrice.input,
          new: price.input
        });
      }
      if (price.output !== undefined && oldPrice.output !== price.output) {
        changes.push({
          provider: 'Aliyun',
          model,
          category,
          type: 'output',
          old: oldPrice.output,
          new: price.output
        });
      }
    }
  }
  
  // Check Bytedance models
  for (const [category, models] of Object.entries(newData.bytedance || {})) {
    for (const [model, price] of Object.entries(models)) {
      if (!oldData.bytedance?.[category]?.[model]) {
        newModels.push({ provider: 'Bytedance', model, category });
        continue;
      }
      
      const oldPrice = oldData.bytedance[category][model];
      if (price.input !== undefined && oldPrice.input !== price.input) {
        changes.push({
          provider: 'Bytedance',
          model,
          category,
          type: 'input',
          old: oldPrice.input,
          new: price.input
        });
      }
      if (price.output !== undefined && oldPrice.output !== price.output) {
        changes.push({
          provider: 'Bytedance',
          model,
          category,
          type: 'output',
          old: oldPrice.output,
          new: price.output
        });
      }
    }
  }
  
  return { changes, newModels };
}

// Generate notification message
function generateNotification(changes, newModels) {
  let message = '';
  
  if (changes.length > 0) {
    message += `Price Change Alert (${changes.length} items)\n\n`;
    changes.forEach(change => {
      const direction = change.new > change.old ? 'UP' : 'DOWN';
      const percent = ((change.new - change.old) / change.old * 100).toFixed(1);
      message += `${change.provider} - ${change.model}\n`;
      message += `  ${change.type}: ¥${change.old} → ¥${change.new} ${direction} ${percent}%\n\n`;
    });
  }
  
  if (newModels.length > 0) {
    message += `New Models (${newModels.length})\n\n`;
    newModels.forEach(model => {
      message += `${model.provider} - ${model.model} (${model.category})\n`;
    });
  }
  
  return message || 'Daily price check completed - no changes.';
}

/**
 * Send alert notification
 */
function sendAlert(message, method) {
  console.log('\n=== ALERT ===');
  console.log(message);
  console.log(`Fetch method used: ${method}`);
  console.log('=============');
  
  // TODO: Implement actual notification (email, Slack, DingTalk, etc.)
  // For now, just log to console
}

// Main scraper function
async function scrapePrices() {
  console.log('=== Enhanced Price Scraper ===');
  console.log(`Beijing Time: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log('');
  
  const history = loadPriceHistory();
  const today = new Date().toISOString().split('T')[0];
  
  // Get yesterday's data for comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  const yesterdayData = history.history[yesterdayKey];
  
  // Create today's entry
  const todayData = createNewPriceEntry(today);
  
  // Fetch Aliyun pricing (reliable)
  const aliyunPricing = await fetchAliyunPricing();
  if (aliyunPricing) {
    todayData.aliyun = aliyunPricing;
  }
  
  // Fetch Bytedance pricing (with fallback chain)
  const bytedanceResult = await fetchBytedancePricing();
  todayData.bytedance = bytedanceResult.data;
  
  // Detect changes
  const { changes, newModels } = detectPriceChanges(yesterdayData, todayData);
  
  // Update history
  history.history[today] = todayData;
  history.metadata.lastUpdated = today;
  history.metadata.nextUpdate = calculateNextUpdate();
  history.metadata.lastBytedanceMethod = bytedanceResult.method;
  
  // Keep only last 90 days of history
  const dates = Object.keys(history.history).sort();
  if (dates.length > 90) {
    const toDelete = dates.slice(0, dates.length - 90);
    toDelete.forEach(date => delete history.history[date]);
  }
  
  savePriceHistory(history);
  
  console.log('\nPrice history updated');
  console.log(`Bytedance fetch method: ${bytedanceResult.method}`);
  
  // Generate and return notification
  const notification = generateNotification(changes, newModels);
  console.log('\n' + notification);
  
  // Send alert if using fallback methods
  if (bytedanceResult.method === 'baseline') {
    sendAlert(
      'WARNING: Using baseline fallback for Bytedance pricing. ' +
      'Please verify pricing at https://www.volcengine.com/docs/82379/1544106',
      bytedanceResult.method
    );
  } else if (bytedanceResult.method === 'cached') {
    console.log('Note: Using cached Bytedance data (may be stale)');
  }
  
  return {
    success: true,
    date: today,
    changes: changes.length,
    newModels: newModels.length,
    bytedanceMethod: bytedanceResult.method,
    notification: notification,
    hasUpdates: changes.length > 0 || newModels.length > 0
  };
}

// Run if called directly
if (require.main === module) {
  scrapePrices()
    .then(result => {
      console.log('\n=== Scraper Complete ===');
      console.log(`Success: ${result.success}`);
      console.log(`Changes: ${result.changes}`);
      console.log(`New Models: ${result.newModels}`);
      console.log(`Bytedance Method: ${result.bytedanceMethod}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n=== Scraper Failed ===');
      console.error(error);
      process.exit(1);
    });
}

module.exports = { scrapePrices, detectPriceChanges, generateNotification };
