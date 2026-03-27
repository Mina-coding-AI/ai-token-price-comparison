# AI Token Price Comparison - Session Handover

**Date**: 2026-03-26  
**Status**: System deployed and operational  
**Live URL**: https://mina-coding-ai.github.io/ai-token-price-comparison/token-price-comparison-v5.html

---

## 1. What Was Built

### Core System
- **HTML Page**: `token-price-comparison-v5.html` - Complete price comparison interface
- **Data File**: `price-data.js` - External data source loaded by HTML
- **GitHub Pages**: Live deployment for public access

### Key Features
1. **Real-time price comparison** between Aliyun and Bytedance
2. **Category tables**: Language, Vision, Code, Image, Video, Third-party models
3. **"Best For" column** showing use case scenarios for each level
4. **Tiered pricing ladder** for models with multiple price tiers
5. **Date selector** for viewing historical prices (from 2026-03-25)
6. **Bilingual support** (Chinese/English)
7. **Price change banner** showing changes from last 7 days
8. **Email subscription button** (UI only - see limitations below)
9. **Notification system** via QoderWork channel

---

## 2. File Locations

### Main Files (GitHub Repository)
- Repository: `Mina-coding-AI/ai-token-price-comparison`
- Files:
  - `token-price-comparison-v5.html` (main page)
  - `price-data.js` (data source)

### Local Working Files
- Workspace: `C:\Users\Mina\.qoderwork\workspace\mmx9zaoqehlqlg3w\outputs\`
- Key files:
  - `token-price-comparison-v5.html`
  - `price-data.js`
  - `notify-owner.ps1` (PowerShell notification script)
  - `TASK_REQUIREMENTS.md` (core requirements)
  - `FIRST_PRINCIPLES.md` (user preference for critical thinking)

### Skill Documentation
- `C:\Users\Mina\.qoderwork\skills\token-price-comparison\SKILL.md` (complete workflow)
- `C:\Users\Mina\.qoderwork\skills\price-update\SKILL.md` (daily update process)

---

## 3. Cron Job Schedule (Beijing Time)

| Time | Job | Status |
|------|-----|--------|
| **10:00 AM** | AI Token Price Daily Update | ✅ Active |
| **10:30 AM** | AI Token Price Verification | ✅ Active |
| **10:35 AM** | AI Token Price Notification | ✅ Active |

**Note**: Schedule was adjusted from original 10:05/10:10 to allow more time for daily update completion.

---

## 4. Critical Rules (From SKILL.md)

### Model Selection
- **ALWAYS pick latest models**: qwen3-max (NOT qwen-max), qwen3.5-plus (NOT qwen-plus)
- **Comparison table shows LOWEST tier price** - use getLowestPrice() logic
- **ALL models MUST have `level` field** for proper categorization

### Level Assignments
| Level | Aliyun | Bytedance | Best For |
|-------|--------|-----------|----------|
| Flagship | qwen3-max | doubao-seed-2.0-pro | Complex reasoning |
| Pro | qwen3.5-plus | doubao-seed-2.0-lite | Daily conversations |
| Flash | qwen3.5-flash | doubao-seed-2.0-mini | Fast response |

---

## 5. Known Issues & Limitations

### Email Subscription Button
- **Status**: UI exists but NOT FUNCTIONAL
- **Problem**: I cannot send emails (no SMTP server, no backend)
- **Current behavior**: Collects emails to localStorage only (demo mode)
- **User preference**: Keep as-is for now, address later

### Data Sources
- **Aliyun**: JSON API endpoint (reliable)
- **Bytedance**: May require manual Markdown file if WebFetch fails

### Date in price-data.js
- File was updated on 2026-03-26 but `lastUpdated` field still shows "2026-03-25"
- This may indicate the update logic isn't changing the date field

---

## 6. User Preferences (CRITICAL)

### First Principles Thinking
> "I would like you to keep 'First Principles Thinking', rather than only do whatever I request as a robot"

**What this means**:
- ❌ Don't blindly implement features
- ✅ Question feasibility before building
- ✅ Explain limitations upfront
- ✅ Propose alternatives when direct request isn't feasible
- ✅ Validate end-to-end functionality

**Example**: Email subscription was built but cannot actually send emails. Should have been caught earlier.

---

## 7. Next Steps / TODO

### Immediate
1. ✅ GitHub Pages deployed - **COMPLETE**
2. ⏳ Monitor daily cron jobs for 3 days (as agreed)
3. ⏳ Verify prices update correctly

### Short-term
1. Fix email subscription or remove it
2. Ensure `lastUpdated` date updates correctly
3. Verify notification system works end-to-end

### Long-term
1. Add more providers (OpenAI, Anthropic, etc.)
2. Add price trend charts
3. Add API endpoint for programmatic access

---

## 8. Quick Reference

### To Update Prices Manually
```bash
# Read SKILL.md for full process
# Key steps:
1. Fetch Aliyun: https://help.aliyun.com/help/json/document_detail.json?nodeId=2840914
2. Fetch Bytedance: https://www.volcengine.com/docs/82379/1544106
3. Update price-data.js
4. Commit to GitHub
```

### To Test Notification
```powershell
# Run notification script
.\notify-owner.ps1 test-changes.json
```

### Live Site
**URL**: https://mina-coding-ai.github.io/ai-token-price-comparison/token-price-comparison-v5.html

---

## 9. Key Contacts/Documents

- **Requirements**: `TASK_REQUIREMENTS.md`
- **First Principles**: `FIRST_PRINCIPLES.md`
- **Skill Docs**: `token-price-comparison/SKILL.md`
- **Notification Setup**: `NOTIFICATION_SETUP.md`

---

**Handover Complete** ✅

Next session should start by verifying the daily cron jobs are working correctly.
