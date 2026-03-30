# Price Data Audit Report
**Audit Date**: 2026-03-30
**Auditor**: QoderWork
**Sources**: 
- Aliyun Official: https://help.aliyun.com/zh/model-studio/model-pricing
- Current Data File: price-data.js (as of 2026-03-30)

---

## 1. Critical Discrepancies Found

### 1.1 qwen3-vl-plus (Vision Plus) - FIXED
| Tier | Current (Wrong) | Official (Correct) | Status |
|------|-----------------|-------------------|--------|
| 0-32K | ¥1.0 / ¥10.0 | ¥1.0 / ¥10.0 | ✓ Correct |
| 32K-128K | ¥2.0 / ¥20.0 | ¥1.5 / ¥15.0 | ✗ WRONG - Fixed |
| 128K-256K | ¥3.0 / ¥30.0 | ¥3.0 / ¥30.0 | ✓ Correct |

**Issue**: Second tier prices were fabricated (¥2/¥20 instead of ¥1.5/¥15)

---

### 1.2 qwen3.5-flash (Flash) - DISCREPANCY FOUND
| Tier | Current | Official Aliyun | Status |
|------|---------|-----------------|--------|
| 0-128K | ¥0.2 / ¥2.0 | ¥0.2 / ¥2.0 | ✓ Correct |
| 128K-256K | ¥0.6 / ¥6.0 | ¥0.8 / ¥8.0 | ✗ WRONG |

**Issue**: Second tier prices are outdated. Current shows ¥0.6/¥6.0, official is ¥0.8/¥8.0

---

### 1.3 qwen3-coder-plus (Coder Pro) - DISCREPANCY FOUND
| Tier | Current | Official Aliyun | Status |
|------|---------|-----------------|--------|
| 0-32K | ¥4.0 / ¥16.0 | ¥4.0 / ¥16.0 | ✓ Correct |
| 32K-128K | ¥12.0 / ¥80.0 | ¥6.0 / ¥24.0 | ✗ WRONG |
| 128K-256K | ¥20.0 / ¥200.0 | ¥10.0 / ¥40.0 | ✗ WRONG |

**Issue**: Tiers 2 and 3 are completely wrong. Current data shows fabricated/exaggerated prices.

---

### 1.4 qwen3-max (Flagship) - TIER RANGE DISCREPANCY
| Tier | Current | Official Aliyun | Status |
|------|---------|-----------------|--------|
| 0-32K | ¥2.5 / ¥10.0 | ¥2.5 / ¥10.0 | ✓ Correct |
| 32K-128K | ¥4.0 / ¥16.0 | ¥4.0 / ¥16.0 | ✓ Correct |
| 128K-256K | ¥7.0 / ¥28.0 | N/A (max 128K) | ⚠️ Extra tier |

**Issue**: Current data shows a 128K-256K tier that doesn't exist in official pricing. Official max is 128K with ¥7/¥28 for 128K-252K.

---

### 1.5 qwen3.5-plus (Pro) - TIER RANGE DISCREPANCY
| Tier | Current | Official Aliyun | Status |
|------|---------|-----------------|--------|
| 0-128K | ¥0.8 / ¥4.8 | ¥0.8 / ¥4.8 | ✓ Correct |
| 128K-256K | ¥2.4 / ¥12.0 | ¥2.0 / ¥12.0 | ✗ Input price wrong |
| 256K-1M | ¥4.0 / ¥24.0 | N/A | ⚠️ Extra tier |

**Issue**: 
- 128K-256K input should be ¥2.0, not ¥2.4
- 256K-1M tier doesn't exist in official pricing

---

## 2. Summary of Issues

| Model | Issue Type | Severity | Details |
|-------|-----------|----------|---------|
| qwen3-vl-plus | Wrong prices | **CRITICAL** | Fixed - tier 2 was ¥2/¥20, should be ¥1.5/¥15 |
| qwen3.5-flash | Outdated prices | **HIGH** | Tier 2: ¥0.6/¥6 → ¥0.8/¥8 |
| qwen3-coder-plus | Wrong prices | **CRITICAL** | Tiers 2-3 completely wrong |
| qwen3-max | Extra tier | **MEDIUM** | 128K-256K tier doesn't exist |
| qwen3.5-plus | Wrong price + Extra tier | **HIGH** | Input ¥2.4→¥2.0; 256K-1M tier doesn't exist |

---

## 3. Root Cause Analysis

### Why the Quality Subagent Missed This

Looking at the QUALITY_AUDIT_REPORT.md from 2026-03-26:

1. **No Price Validation Against Live Sources**: The audit checked code quality, data structure, and schema - but did NOT compare actual prices against official sources.

2. **Static Baseline Data**: The price-data.js appears to contain manually entered or outdated baseline data that was never validated against live API/documentation.

3. **Missing Automated Fetcher**: There's no active Aliyun price fetcher that validates current prices. The Bytedance fetcher exists but Aliyun validation is missing.

4. **No Cross-Reference**: The audit didn't cross-reference stored prices with:
   - Official Aliyun pricing page
   - Historical trends (all history values were identical)
   - Expected price ranges

---

## 4. Immediate Actions Required

### 4.1 Fix Remaining Price Discrepancies

```javascript
// qwen3.5-flash - Fix tier 2
{ range: "128K-256K", input: 0.8, output: 8.0 }  // Was: 0.6, 6.0

// qwen3-coder-plus - Fix all tiers
{ range: "0-32K", input: 4.0, output: 16.0 },     // Keep
{ range: "32K-128K", input: 6.0, output: 24.0 },  // Was: 12.0, 80.0
{ range: "128K-256K", input: 10.0, output: 40.0 } // Was: 20.0, 200.0

// qwen3.5-plus - Fix tier 2, remove tier 3
{ range: "128K-256K", input: 2.0, output: 12.0 }  // Was: 2.4, 12.0
// REMOVE: 256K-1M tier

// qwen3-max - Remove extra tier
// REMOVE: 128K-256K tier (official max is 128K/252K)
```

### 4.2 Data Integrity Issues

1. **History data is all identical** - No actual historical variation tracked
2. **lastUpdated date is stale** - Shows 2026-03-25, should be current date
3. **No validation on tier ranges** - Extra tiers were added that don't exist

---

## 5. Quality Control Improvement Plan

See QUALITY_CONTROL_PLAN.md for comprehensive recommendations.

---

**End of Audit Report**
