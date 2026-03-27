# AI Token Price Comparison - Notification Integration

## Overview
This document describes how the notification system integrates with the daily update workflow.

## Three-Part Notification System

### 1. Banner Display (Client-Side)
**File**: `token-price-comparison-v5.html`
**Function**: `showChanges()`

The HTML page automatically displays a banner at the top showing price changes and new model releases from the last 7 days.

**Trigger**: Page load
**Data Source**: `D.changes` array in `price-data.js`
**Display Logic**:
- Filters changes from last 7 days
- Groups by type (price_change vs new_model)
- Shows first 3 price changes with "X more..." if more exist
- Shows all new models with 🎉 emoji
- Color-coded: red/green for price up/down, gold for new models

### 2. Email Subscription (Client-Side)
**File**: `token-price-comparison-v5.html`
**Functions**: `openSubscribeModal()`, `confirmSubscribe()`

Users can click the "订阅价格变化" button in the top bar to subscribe via email.

**Flow**:
1. User clicks subscribe button
2. Modal opens with email input field
3. User enters email and confirms
4. Email stored in localStorage (demo mode)
5. In production: API call to store subscription + send confirmation

**TODO**: Implement backend email service for actual notifications

### 3. QoderWork Channel Notification (Server-Side)
**Files**: 
- `notify-owner.js` - Notification script
- Daily update cron job integration

**Trigger**: After successful daily price update (10:05 AM Beijing time, after verification)

**Integration Point**: The daily update skill should:
1. Compare today's prices with yesterday's
2. Detect any changes (price changes or new models)
3. Save changes to `latest-changes.json`
4. Call: `node notify-owner.js latest-changes.json`
5. Parse the generated `pending-notification.txt`
6. Send via QoderWork notification channel

## Cron Job Workflow

### Current Schedule:
- **10:00 AM** - Daily price update (`price-update` skill)
- **10:05 AM** - Verification job (scrapes live pages to validate)
- **10:10 AM** - **NEW**: Notification job (proposed)

### Notification Job Steps:
```bash
# Step 1: Run notification script
node outputs/notify-owner.js outputs/latest-changes.json

# Step 2: Read generated notification
cat outputs/pending-notification.txt

# Step 3: Send via QoderWork
# This would use QoderWork's internal notification API
# or send a message to a designated channel
```

## Change Detection Logic

The daily update process should generate `latest-changes.json`:

```javascript
// Pseudo-code for change detection
const today = getTodayPrices(); // From scraping
const yesterday = getYesterdayPrices(); // From price-data.js history

const changes = [];

// Check each model for price changes
['aliyun', 'bytedance'].forEach(provider => {
    ['language', 'code', 'vision'].forEach(category => {
        today[provider][category].forEach(model => {
            const yesterdayModel = findModel(yesterday[provider][category], model.name);
            if (!yesterdayModel) {
                // New model detected
                changes.push({
                    date: today.metadata.lastUpdated,
                    type: 'new_model',
                    provider,
                    model: model.name,
                    level: model.level
                });
            } else {
                // Check for price changes
                const todayLowest = getLowestPrice(model.tiers);
                const yesterdayLowest = getLowestPrice(yesterdayModel.tiers);
                
                if (todayLowest.input !== yesterdayLowest.input) {
                    changes.push({
                        date: today.metadata.lastUpdated,
                        type: 'price_change',
                        provider,
                        model: model.name,
                        level: model.level,
                        field: 'input',
                        old: yesterdayLowest.input,
                        new: todayLowest.input,
                        pctChange: calculatePctChange(yesterdayLowest.input, todayLowest.input)
                    });
                }
                
                if (todayLowest.output !== yesterdayLowest.output) {
                    changes.push({
                        date: today.metadata.lastUpdated,
                        type: 'price_change',
                        provider,
                        model: model.name,
                        level: model.level,
                        field: 'output',
                        old: yesterdayLowest.output,
                        new: todayLowest.output,
                        pctChange: calculatePctChange(yesterdayLowest.output, todayLowest.output)
                    });
                }
            }
        });
    });
});

// Save to file
fs.writeFileSync('outputs/latest-changes.json', JSON.stringify(changes, null, 2));

// Append to price-data.js changes array (keep last 30 days)
updatePriceDataChanges(changes);
```

## Testing the Notification System

### Manual Test:
```bash
# Create test changes file
cat > outputs/test-changes.json << 'EOF'
[
  {
    "date": "2026-03-25",
    "type": "price_change",
    "provider": "aliyun",
    "model": "qwen3-max",
    "level": "Flagship",
    "field": "input",
    "old": 2.0,
    "new": 2.5,
    "pctChange": 25.0
  },
  {
    "date": "2026-03-25",
    "type": "new_model",
    "provider": "bytedance",
    "model": "doubao-seed-3.0-pro",
    "level": "Flagship"
  }
]
EOF

# Run notification script
node outputs/notify-owner.js outputs/test-changes.json

# View generated notification
cat outputs/pending-notification.txt
```

### Expected Output:
```
=== Notification Message ===
📊 AI Token 价格变化提醒

💰 价格变动 (1 项):
  • 阿里云 Flagship: ¥2.0 → ¥2.5 ↑25.0%

🎉 新模型发布 (1 个):
  • 字节跳动 Flagship

详情查看：file:///C:/Users/Mina/.qoderwork/workspace/mmx9zaoqehlqlg3w/outputs/token-price-comparison-v5.html
更新时间：2026-03-25 10:10:00
===========================
```

## Future Enhancements

1. **Email Service Integration**
   - Set up SMTP service (SendGrid, Mailgun, etc.)
   - Create email template with price comparison table
   - Implement unsubscribe mechanism

2. **Webhook Notifications**
   - Support for Slack/Discord/Teams webhooks
   - Real-time browser push notifications

3. **Historical Analytics**
   - Monthly price trend reports
   - Provider comparison summaries
   - Cost savings recommendations

4. **API Endpoint**
   - REST API for checking latest changes
   - GraphQL endpoint for custom queries
   - RSS feed for price changes

## Files Modified/Created

### Created:
- `outputs/notify-owner.js` - Notification script
- `outputs/NOTIFICATION_SETUP.md` - This documentation

### Modified:
- `outputs/token-price-comparison-v5.html` - Added banner logic, subscribe button, modal
- `outputs/price-data.js` - Updated comments for changes array structure

## Next Steps

1. ✅ Banner display logic - COMPLETE
2. ✅ Subscribe button and form - COMPLETE  
3. ⏳ QoderWork channel integration - IN PROGRESS
4. ⏳ Update daily cron job to call notification script
5. ⏳ Test end-to-end flow with mock data
6. ⏳ Monitor for 3 days before GitHub Pages deployment
