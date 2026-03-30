# Comprehensive Quality Control Improvement Plan
**For**: AI Token Price Comparison System
**Date**: 2026-03-30
**Status**: Critical - Immediate Action Required

---

## Executive Summary

The current quality control system has **critical gaps** that allowed incorrect pricing data to be deployed. This plan establishes a multi-layered quality assurance framework to ensure price accuracy - the core value proposition of this service.

---

## 1. Current Quality Control Gaps

### 1.1 What Failed

| Gap | Impact | Example |
|-----|--------|---------|
| No live price validation | Wrong prices deployed | qwen3-vl-plus tier 2: ¥2/¥20 vs correct ¥1.5/¥15 |
| No tier structure validation | Missing tiers not detected | qwen3-coder-plus had only 3 tiers, official has 4 |
| No tier count verification | Tiers incorrectly removed | qwen3.5-flash 3rd tier removed when it should exist |
| No price range validation | Absurd prices accepted | qwen3-coder-plus tier 3: ¥20/¥200 vs correct ¥10/¥40 |
| Static baseline data | Outdated prices persist | qwen3.5-flash tier 2 still shows old ¥0.6/¥6 |
| No cross-reference checks | Fabricated data not caught | Multiple models have invented price points |
| No completeness validation | Missing data not detected | Bytedance prices never validated against source |

### 1.2 Why the Quality Subagent Missed It

The QUALITY_AUDIT_REPORT.md (2026-03-26) focused on:
- ✓ Code quality (6/10)
- ✓ Data structure validation (8/10)
- ✓ Schema completeness (7/10)
- ✗ **Price accuracy against live sources** (0/10 - not checked)
- ✗ **Tier structure validation** (0/10 - not checked)
- ✗ **Price range sanity checks** (0/10 - not checked)

**Root Cause**: The quality subagent validated the *format* of data, not the *accuracy* of data.

### 1.3 Key Lessons Learned (2026-03-30)

**Lesson 1: Validate Tier Count FIRST**
- Always check `model.tiers.length === official.tiers.length` before checking individual tier prices
- A missing tier is a COMPLETENESS error, not just a correctness error
- Example: qwen3-coder-plus has 4 tiers in official, but data had only 3

**Lesson 2: Don't Trust Single Fetch**
- WebFetch may return partial data (e.g., only first 2 tiers visible)
- Official pages may have expandable sections or dynamic content
- Must verify ALL tiers are visible before validation

**Lesson 3: Baseline Comparison is Critical**
- Compare new data against previous known-good baseline
- Flag ANY structural changes (tier additions/removals) for review
- Price changes are expected; tier structure changes are suspicious

**Lesson 4: Two-Step Validation Required**
1. **COMPLETENESS**: Count models, count tiers per model
2. **CORRECTIVENESS**: Validate each tier's price values
- Both steps must pass for approval

**Lesson 5: Both Providers Need Equal Attention**
- Aliyun validation was done (after errors found)
- Bytedance validation was never completed
- Both sources must be validated before deployment

---

## 2. Multi-Layer Quality Control Framework

### Layer 1: Source Validation (Pre-Storage)
**When**: Before writing to price-data.js
**What**: Fetch and compare against official sources

#### Step 1: COMPLETENESS Validation (Tier Count Check)

```javascript
// FIRST: Validate tier counts before checking prices
function validateCompleteness(proposedData, officialData) {
  const errors = [];
  
  for (const provider of ['aliyun', 'bytedance']) {
    for (const category of ['language', 'code', 'vision']) {
      const proposedModels = proposedData.current[provider][category] || [];
      const officialModels = officialData[provider][category] || [];
      
      // Check model count matches
      if (proposedModels.length !== officialModels.length) {
        errors.push({
          provider,
          category,
          issue: `Model count mismatch: ${proposedModels.length} vs ${officialModels.length}`,
          severity: 'CRITICAL'
        });
      }
      
      // Check each model's tier count
      for (const proposed of proposedModels) {
        const official = officialModels.find(m => m.name === proposed.name);
        if (!official) {
          errors.push({
            provider,
            model: proposed.name,
            issue: 'Model not found in official source',
            severity: 'CRITICAL'
          });
          continue;
        }
        
        if (proposed.tiers.length !== official.tiers.length) {
          errors.push({
            provider,
            model: proposed.name,
            issue: `Tier count mismatch: ${proposed.tiers.length} vs ${official.tiers.length}`,
            proposedTiers: proposed.tiers.map(t => t.range),
            officialTiers: official.tiers.map(t => t.range),
            severity: 'CRITICAL'
          });
        }
      }
    }
  }
  
  return errors;
}
```

#### Step 2: CORRECTIVENESS Validation (Price Check)

```javascript
// SECOND: Validate individual tier prices
async function validateCorrectness(proposedData, officialData) {
  const discrepancies = [];
  
  for (const provider of ['aliyun', 'bytedance']) {
    for (const category of ['language', 'code', 'vision']) {
      for (const proposed of proposedData.current[provider][category] || []) {
        const official = findOfficialModel(officialData, provider, proposed.name);
        if (!official) continue;
        
        // Skip if tier count doesn't match (already caught in completeness check)
        if (proposed.tiers.length !== official.tiers.length) continue;
        
        // Check each tier's prices
        for (let i = 0; i < proposed.tiers.length; i++) {
          const pTier = proposed.tiers[i];
          const oTier = official.tiers[i];
          
          if (pTier.input !== oTier.input || pTier.output !== oTier.output) {
            discrepancies.push({
              provider,
              model: proposed.name,
              tier: pTier.range,
              proposed: { input: pTier.input, output: pTier.output },
              official: { input: oTier.input, output: oTier.output },
              severity: 'HIGH'
            });
          }
        }
      }
    }
  }
  
  return discrepancies;
}
      
      if (proposed.input !== officialTier.input || proposed.output !== officialTier.output) {
        discrepancies.push({
          model: model.name,
          tier: proposed.range,
          proposed: { input: proposed.input, output: proposed.output },
          official: { input: officialTier.input, output: officialTier.output }
        });
      }
    }
  }
  
  return discrepancies;
}
```

**Action Required**: 
- [ ] Create `validate-aliyun-prices.js` script
- [ ] Create `validate-bytedance-prices.js` script
- [ ] Integrate into daily update workflow

---

### Layer 2: Sanity Checks (Pre-Deployment)
**When**: Before git commit/push
**What**: Validate price ranges and tier logic

```javascript
// Validation rules
const VALIDATION_RULES = {
  inputPrice: { min: 0.1, max: 100 },    // ¥0.1 to ¥100 per MTok
  outputPrice: { min: 0.3, max: 200 },   // ¥0.3 to ¥200 per MTok
  outputToInputRatio: { min: 1.0, max: 10.0 }, // Output should be 1-10x input
  tierRanges: {
    mustBeSequential: true,
    noGaps: true,
    maxTiers: 3
  }
};

function sanityCheckPrices(data) {
  const errors = [];
  
  for (const provider of ['aliyun', 'bytedance']) {
    for (const category of ['language', 'code', 'vision']) {
      for (const model of data.current[provider][category] || []) {
        // Check price ranges
        for (const tier of model.tiers) {
          if (tier.input < VALIDATION_RULES.inputPrice.min || 
              tier.input > VALIDATION_RULES.inputPrice.max) {
            errors.push(`${model.name}: Input price ¥${tier.input} out of range`);
          }
          
          if (tier.output < VALIDATION_RULES.outputPrice.min || 
              tier.output > VALIDATION_RULES.outputPrice.max) {
            errors.push(`${model.name}: Output price ¥${tier.output} out of range`);
          }
          
          const ratio = tier.output / tier.input;
          if (ratio < VALIDATION_RULES.outputToInputRatio.min || 
              ratio > VALIDATION_RULES.outputToInputRatio.max) {
            errors.push(`${model.name}: Output/Input ratio ${ratio.toFixed(2)} suspicious`);
          }
        }
        
        // Check tier progression (each tier should be more expensive)
        for (let i = 1; i < model.tiers.length; i++) {
          if (model.tiers[i].input <= model.tiers[i-1].input) {
            errors.push(`${model.name}: Tier ${i} input not higher than previous`);
          }
        }
      }
    }
  }
  
  return errors;
}
```

**Action Required**:
- [ ] Create `sanity-check-prices.js` script
- [ ] Add to pre-commit hook
- [ ] Block deployment if checks fail

---

### Layer 3: Historical Consistency (Post-Update)
**When**: After price updates
**What**: Detect anomalous changes

```javascript
function checkHistoricalConsistency(newData, oldData) {
  const alerts = [];
  
  for (const provider of ['aliyun', 'bytedance']) {
    for (const category of ['language', 'code', 'vision']) {
      for (const newModel of newData.current[provider][category] || []) {
        const oldModel = findModel(oldData, provider, category, newModel.name);
        if (!oldModel) continue;
        
        for (let i = 0; i < newModel.tiers.length; i++) {
          const newTier = newModel.tiers[i];
          const oldTier = oldModel.tiers[i];
          if (!oldTier) continue;
          
          const inputChange = (newTier.input - oldTier.input) / oldTier.input;
          const outputChange = (newTier.output - oldTier.output) / oldTier.output;
          
          // Alert if price change > 50%
          if (Math.abs(inputChange) > 0.5) {
            alerts.push({
              model: newModel.name,
              tier: newTier.range,
              field: 'input',
              old: oldTier.input,
              new: newTier.input,
              change: `${(inputChange * 100).toFixed(1)}%`
            });
          }
          
          if (Math.abs(outputChange) > 0.5) {
            alerts.push({
              model: newModel.name,
              tier: newTier.range,
              field: 'output',
              old: oldTier.output,
              new: newTier.output,
              change: `${(outputChange * 100).toFixed(1)}%`
            });
          }
        }
      }
    }
  }
  
  return alerts;
}
```

**Action Required**:
- [ ] Add to daily update workflow
- [ ] Send alert for manual review if large changes detected

---

### Layer 4: Human Review Trigger (Exception Handling)
**When**: Automated checks detect issues
**What**: Escalate to human for review

```javascript
const ESCALATION_RULES = {
  // Auto-approve if:
  autoApprove: {
    maxPriceChange: 0.20,        // 20% change
    maxTierCountChange: 0,       // No tier additions/removals
    sourceValidationPassed: true // Matches official source
  },
  
  // Require human review if:
  requireReview: {
    priceChangeOver: 0.50,       // >50% price change
    newModelAdded: true,         // New model detected
    tierStructureChanged: true,  // Tiers added/removed
    sourceValidationFailed: true // Doesn't match official
  }
};
```

**Action Required**:
- [ ] Create review queue system
- [ ] Send notifications for manual review
- [ ] Block auto-deployment if review required

---

## 3. Implementation Roadmap

### Phase 1: Immediate Fixes (This Week)

| Task | Owner | ETA | Priority |
|------|-------|-----|----------|
| Fix remaining price discrepancies (see PRICE_AUDIT_REPORT.md) | QoderWork | 1 day | CRITICAL |
| Create `validate-aliyun-prices.js` | QoderWork | 2 days | CRITICAL |
| Create `sanity-check-prices.js` | QoderWork | 2 days | CRITICAL |
| Add validation to daily update workflow | QoderWork | 3 days | HIGH |

### Phase 2: Automation (Next 2 Weeks)

| Task | Owner | ETA | Priority |
|------|-------|-----|----------|
| Create `validate-bytedance-prices.js` | QoderWork | 1 week | HIGH |
| Implement historical consistency checks | QoderWork | 1 week | MEDIUM |
| Add escalation/notification system | QoderWork | 2 weeks | MEDIUM |
| Create price validation dashboard | QoderWork | 2 weeks | LOW |

### Phase 3: Monitoring (Next Month)

| Task | Owner | ETA | Priority |
|------|-------|-----|----------|
| Weekly manual spot-checks | Owner | Ongoing | HIGH |
| Automated price drift detection | QoderWork | 1 month | MEDIUM |
| Integration with official APIs (if available) | QoderWork | 1 month | LOW |

---

## 4. Quality Metrics to Track

### 4.1 Accuracy Metrics

| Metric | Target | Current | Measurement |
|--------|--------|---------|-------------|
| Price accuracy vs official | 100% | ~70% | Weekly spot-checks |
| Tier structure accuracy | 100% | ~80% | Weekly validation |
| False positive rate (alerts) | <5% | N/A | Track after implementation |
| Time to detect price changes | <24h | N/A | After automated fetcher |

### 4.2 Process Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Updates with validation | 100% | 0% |
| Manual review rate | <10% | N/A |
| Escalation response time | <4h | N/A |

---

## 5. Updated Subagent Responsibilities

### Quality Manager (Revised)

**Current**: Validates code structure, schema, and format
**New**: 
1. Validates price accuracy against live sources
2. Runs sanity checks on all price data
3. Approves/rejects deployments based on validation results
4. Maintains price accuracy metrics

**New Deliverables**:
- Daily price validation report
- Weekly accuracy metrics
- Monthly quality audit

### Price Fetching Engineer (Revised)

**Current**: Fetches prices from Bytedance
**New**:
1. Fetches prices from both Aliyun and Bytedance
2. Runs source validation before submitting data
3. Maintains fetcher reliability metrics
4. Documents API changes and pricing updates

**New Deliverables**:
- Source validation results with each fetch
- Fetch reliability report
- API change log

---

## 6. Emergency Procedures

### 6.1 If Wrong Prices Are Deployed

1. **Immediate** (< 5 minutes):
   - Revert to last known good price-data.js
   - Deploy emergency fix

2. **Short-term** (< 1 hour):
   - Identify root cause
   - Fix data discrepancies
   - Re-deploy with validation

3. **Long-term** (< 1 day):
   - Update validation rules to prevent recurrence
   - Document incident
   - Review quality control process

### 6.2 If Official Source is Unavailable

1. Use cached baseline data
2. Flag data as "potentially stale"
3. Retry every hour for 24 hours
4. Alert if still unavailable after 24h

---

## 7. Success Criteria

The quality control system is successful when:

1. **Zero incorrect prices** are deployed for >30 days
2. **100% of updates** pass validation before deployment
3. **<5% false positive rate** on price change alerts
4. **<4 hour** response time to pricing discrepancies
5. **Weekly accuracy audits** show 100% match with official sources

---

## 8. Appendix: Validation Scripts

### 8.1 Pre-Deployment Checklist

```bash
#!/bin/bash
# run-before-deploy.sh

echo "Running pre-deployment validation..."

# 1. Source validation
node validate-aliyun-prices.js || exit 1
node validate-bytedance-prices.js || exit 1

# 2. Sanity checks
node sanity-check-prices.js || exit 1

# 3. Historical consistency
node check-historical-consistency.js || exit 1

echo "All validations passed!"
```

### 8.2 Daily Update Workflow (Updated)

```
10:00 AM - Fetch prices from Aliyun
    ↓
    Validate against official source
    ↓
    Run sanity checks
    ↓
    Check historical consistency
    ↓
    [If all pass] → Commit and deploy
    [If issues] → Escalate to human review
```

---

**End of Quality Control Plan**

*This plan should be reviewed and updated monthly based on operational experience.*
