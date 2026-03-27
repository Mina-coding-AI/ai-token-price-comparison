/**
 * Notification script for AI Token Price Comparison system
 * 
 * This script is called by the daily update cron job to notify the owner
 * when price changes or new models are detected.
 * 
 * Usage: node notify-owner.js [changes.json]
 * 
 * The changes.json file should contain an array of change objects:
 * [
 *   {
 *     "date": "2026-03-25",
 *     "type": "price_change" | "new_model",
 *     "provider": "aliyun" | "bytedance",
 *     "model": "qwen3-max",
 *     "level": "Flagship",
 *     "field": "input" | "output",
 *     "old": 2.0,
 *     "new": 2.5,
 *     "pctChange": 25.0
 *   }
 * ]
 */

const fs = require('fs');
const path = require('path');

// Load changes from file or use empty array
const changesFile = process.argv[2] || path.join(__dirname, 'latest-changes.json');
let changes = [];

try {
    if (fs.existsSync(changesFile)) {
        const content = fs.readFileSync(changesFile, 'utf8');
        changes = JSON.parse(content);
        console.log(`Loaded ${changes.length} changes from ${changesFile}`);
    } else {
        console.log('No changes file found, skipping notification');
        process.exit(0);
    }
} catch (error) {
    console.error('Error loading changes:', error.message);
    process.exit(1);
}

if (changes.length === 0) {
    console.log('No changes to report');
    process.exit(0);
}

// Filter changes from last 7 days
const today = new Date();
const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const recentChanges = changes.filter(c => new Date(c.date) >= sevenDaysAgo);

if (recentChanges.length === 0) {
    console.log('No recent changes (within 7 days)');
    process.exit(0);
}

// Group changes by type
const priceChanges = recentChanges.filter(c => c.type === 'price_change');
const newModels = recentChanges.filter(c => c.type === 'new_model');

// Build notification message
let message = '📊 AI Token 价格变化提醒\n\n';

if (priceChanges.length > 0) {
    message += `💰 价格变动 (${priceChanges.length} 项):\n`;
    priceChanges.forEach(c => {
        const dir = c.pctChange > 0 ? '↑' : '↓';
        const provider = c.provider === 'aliyun' ? '阿里云' : '字节跳动';
        message += `  • ${provider} ${c.level || c.model}: ¥${c.old} → ¥${c.new} ${dir}${Math.abs(c.pctChange).toFixed(1)}%\n`;
    });
    message += '\n';
}

if (newModels.length > 0) {
    message += `🎉 新模型发布 (${newModels.length} 个):\n`;
    newModels.forEach(c => {
        const provider = c.provider === 'aliyun' ? '阿里云' : '字节跳动';
        message += `  • ${provider} ${c.level || c.model}\n`;
    });
    message += '\n';
}

message += `详情查看：file://${path.join(__dirname, 'token-price-comparison-v5.html')}\n`;
message += `更新时间：${today.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`;

console.log('\n=== Notification Message ===');
console.log(message);
console.log('===========================\n');

// In production, this would call QoderWork's notification API
// For now, save to a file that can be monitored
const outputFile = path.join(__dirname, 'pending-notification.txt');
fs.writeFileSync(outputFile, message);

console.log(`Notification saved to: ${outputFile}`);
console.log('This file should be monitored by the QoderWork cron job system.');

// Exit with success
process.exit(0);
