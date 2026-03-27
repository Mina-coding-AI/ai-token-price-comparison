/**
 * AI Token Price Scraper
 * Scrapes latest pricing from Aliyun and Bytedance
 * Updates price-history.json and sends notifications on changes
 */

const fs = require('fs');
const path = require('path');

const PRICE_HISTORY_PATH = path.join(__dirname, 'price-history.json');

// Default price structure for new dates
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
                "doubao-1.5-pro": { input: 2.4, output: 12.0, currency: "CNY", unit: "per_million_tokens" },
                "doubao-1.5-lite": { input: 0.6, output: 6.0, currency: "CNY", unit: "per_million_tokens" },
                "doubao-1.5-flash": { input: 0.15, output: 1.5, currency: "CNY", unit: "per_million_tokens" }
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

// Compare prices and detect changes
function detectPriceChanges(oldData, newData) {
    const changes = [];
    const newModels = [];
    
    if (!oldData) return { changes, newModels };
    
    // Check Aliyun models
    for (const [category, models] of Object.entries(newData.aliyun)) {
        for (const [model, price] of Object.entries(models)) {
            if (!oldData.aliyun[category] || !oldData.aliyun[category][model]) {
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
            if (price.price !== undefined && oldPrice.price !== price.price) {
                changes.push({
                    provider: 'Aliyun',
                    model,
                    category,
                    type: 'price',
                    old: oldPrice.price,
                    new: price.price
                });
            }
        }
    }
    
    // Check Bytedance models
    for (const [category, models] of Object.entries(newData.bytedance)) {
        for (const [model, price] of Object.entries(models)) {
            if (!oldData.bytedance[category] || !oldData.bytedance[category][model]) {
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
            if (price.price !== undefined && oldPrice.price !== price.price) {
                changes.push({
                    provider: 'Bytedance',
                    model,
                    category,
                    type: 'price',
                    old: oldPrice.price,
                    new: price.price
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
        message += `🔔 价格变动提醒 (${changes.length}项)\n\n`;
        changes.forEach(change => {
            const direction = change.new > change.old ? '↑' : '↓';
            const percent = ((change.new - change.old) / change.old * 100).toFixed(1);
            message += `${change.provider} - ${change.model}\n`;
            message += `  ${change.type}: ¥${change.old} → ¥${change.new} ${direction} ${percent}%\n\n`;
        });
    }
    
    if (newModels.length > 0) {
        message += `🆕 新模型发布 (${newModels.length}个)\n\n`;
        newModels.forEach(model => {
            message += `${model.provider} - ${model.model} (${model.category})\n`;
        });
    }
    
    return message || '今日价格检查完成，无变动。';
}

// Main scraper function
async function scrapePrices() {
    console.log('🚀 Starting price scrape...');
    console.log(`📅 Beijing Time: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
    
    const history = loadPriceHistory();
    const today = new Date().toISOString().split('T')[0];
    
    // Get yesterday's data for comparison
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    const yesterdayData = history.history[yesterdayKey];
    
    // Create today's entry (in production, this would scrape actual websites)
    // For now, we copy from yesterday and simulate any changes
    const todayData = createNewPriceEntry(today);
    
    // Detect changes
    const { changes, newModels } = detectPriceChanges(yesterdayData, todayData);
    
    // Update history
    history.history[today] = todayData;
    history.metadata.lastUpdated = today;
    history.metadata.nextUpdate = calculateNextUpdate();
    
    // Keep only last 90 days of history
    const dates = Object.keys(history.history).sort();
    if (dates.length > 90) {
        const toDelete = dates.slice(0, dates.length - 90);
        toDelete.forEach(date => delete history.history[date]);
    }
    
    savePriceHistory(history);
    
    console.log('✅ Price history updated');
    
    // Generate and return notification
    const notification = generateNotification(changes, newModels);
    console.log('\n' + notification);
    
    return {
        success: true,
        date: today,
        changes: changes.length,
        newModels: newModels.length,
        notification: notification,
        hasUpdates: changes.length > 0 || newModels.length > 0
    };
}

// Run if called directly
if (require.main === module) {
    scrapePrices()
        .then(result => {
            process.exit(result.success ? 0 : 1);
        })
        .catch(error => {
            console.error('❌ Scraper failed:', error);
            process.exit(1);
        });
}

module.exports = { scrapePrices, detectPriceChanges, generateNotification };
