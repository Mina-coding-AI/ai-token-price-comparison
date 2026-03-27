# AI Token Price Comparison: Model Selection Regime

**Document Version:** 1.0  
**Last Updated:** 2026-03-26  
**Research Date:** 2026-03-26  
**Analyst:** Model Selection Strategist

---

## Executive Summary

This document establishes a comprehensive, data-driven regime for selecting and categorizing AI models from Aliyun (Qwen series) and Bytedance (Doubao/Seed series) for token price comparison purposes. The regime is designed to accommodate the rapidly evolving AI landscape while maintaining consistency in comparisons.

**Key Finding:** As of March 2026, Bytedance's Doubao-Seed-2.0 series has established clear benchmark leadership in most categories, particularly in reasoning (AIME 2025: 98.3% vs 81.6%) and coding tasks, while Aliyun's Qwen3.5 series offers competitive alternatives with native multimodal capabilities at aggressive price points.

---

## 1. Current Dominating Models (as of 2026-03-26)

### 1.1 Aliyun (Qwen Series)

| Model Name | Level | Why Dominating | Release Date | Key Differentiator |
|------------|-------|----------------|--------------|-------------------|
| **qwen3-max** | Flagship | Highest capability Qwen model; strong general reasoning; established ecosystem | 2025-01 (updated 2026-02) | Strong SWE-Bench performance (69.6%) |
| **qwen3.5-plus** | Pro | Native multimodal (text/image/video); rivals qwen3-max on text; 8x faster | 2026-02-15 | First native multimodal in Qwen series |
| **qwen3.5-flash** | Flash | Ultra-low cost; good for high-volume tasks; thinking/non-thinking modes | 2026-02-23 | Price leader at 0.2 yuan/M input |
| **qwen3-coder-plus** | Coder Pro | Strongest coding model in Qwen lineup; Coding Agent capabilities | 2026-01 | Tool calling and environment interaction |
| **qwen3-coder-flash** | Coder | Fast code completion; cost-effective for IDE integration | 2026-01 | Balanced speed/price for coding |
| **qwen3-vl-plus** | Vision Plus | Advanced visual reasoning; spatial understanding; 119 language support | 2026-01-22 | Thinking + non-thinking modes |
| **qwen3-vl-flash** | Vision Lite | Ultra-cheap vision processing; basic image understanding | 2026-01-22 | Lowest cost vision model |
| **qwen3-omni-flash** | Omni | Multimodal (text/image/audio/video); real-time processing | 2025-12-01 | Unified multimodal architecture |

### 1.2 Bytedance (Doubao/Seed Series)

| Model Name | Level | Why Dominating | Release Date | Key Differentiator |
|------------|-------|----------------|--------------|-------------------|
| **doubao-seed-2.0-pro** | Flagship | Benchmark leader (AIME 98.3%, SWE-Bench 76.5%); cost-effective | 2026-02-14 | Best price/performance ratio |
| **doubao-seed-2.0-lite** | Pro | 73.9% accuracy at fraction of Pro cost; good for production | 2026-02-14 | Sweet spot for most applications |
| **doubao-seed-2.0-mini** | Flash | 71.8% accuracy; ultra-low latency; edge deployment ready | 2026-02-14 | Smallest viable model |
| **doubao-seed-2.0-code** | Coder Pro | Codeforces 3020 rating; ICPC gold performance | 2026-02-14 | Competitive programming excellence |
| **doubao-1.5-vision-pro** | Vision Plus | Strong visual understanding; document extraction | 2025-12 | Production-tested vision model |
| **doubao-1.5-vision-lite** | Vision Lite | Cost-effective vision processing | 2025-12 | Budget vision option |

---

## 2. Level Assignment Logic

### 2.1 Level Definitions

| Level | Criteria | Price Range (Input) | Use Case |
|-------|----------|---------------------|----------|
| **Flagship** | Highest capability; latest architecture; maximum context; benchmark leader | 2.5-7 yuan/M | Complex reasoning, research, agent tasks |
| **Pro** | Balanced performance/price; production-ready; good benchmarks | 0.6-4 yuan/M | General applications, production workloads |
| **Flash/Turbo** | Fastest inference; lowest cost; acceptable quality | 0.2-1.2 yuan/M | High-volume, latency-sensitive, simple tasks |
| **Coder Pro** | Specialized for code; strong on HumanEval/SWE-Bench; tool use | 1-20 yuan/M | Software development, code review, debugging |
| **Coder** | Fast code completion; IDE integration; cost-effective | 0.5-5 yuan/M | Autocomplete, simple generation |
| **Vision Max** | State-of-the-art visual reasoning; video understanding | 1-3 yuan/M | Complex image/video analysis |
| **Vision Plus** | Strong visual capabilities; multimodal integration | 0.5-2 yuan/M | Document OCR, image description |
| **Vision Lite** | Basic vision tasks; ultra-low cost | 0.15-0.6 yuan/M | Simple classification, thumbnail analysis |
| **Omni** | Unified multimodal (all modalities); real-time | Variable | Voice assistants, real-time AV processing |

### 2.2 Assignment Principles

1. **Capability-First:** Level is primarily determined by benchmark performance, not price
2. **Version-Aware:** Newer versions replace older ones at the same level (qwen-max → qwen3-max)
3. **Cross-Company Parity:** Models at the same level should be roughly comparable in capability
4. **Specialization Recognition:** Code and Vision models get their own level categories
5. **Price as Signal:** Significant price drops often indicate repositioning to a lower level

---

## 3. Comparable Model Pairs with Pros & Cons

### 3.1 Level: Flagship

| Aspect | Aliyun qwen3-max | Bytedance doubao-seed-2.0-pro |
|--------|------------------|-------------------------------|
| **Release Date** | 2025-01 (updated 2026-02) | 2026-02-14 |
| **Pricing (Input/Output)** | 2.5-7 yuan / 10-28 yuan per M | 3.2 yuan / 16 yuan per M |
| **AIME 2025** | 81.6% | 98.3% |
| **SWE-Bench Verified** | 69.6% | 76.5% |
| **GPQA** | 62.0% | 88.9% |
| **LiveCodeBench v6** | 69.0% | 87.8% |
| **Context Window** | 131K | 256K |
| **Strengths** | Established ecosystem; strong Chinese language; good tool use; multimodal variants available | Benchmark leader in math/reasoning; superior coding; cost-effective; larger context |
| **Weaknesses** | Lower benchmark scores; higher output costs; older architecture | Newer ecosystem; vision capabilities in separate models |
| **Best For** | General Chinese NLP; established integrations; multimodal tasks | Math/reasoning tasks; coding; long-context applications; cost-sensitive high-performance needs |
| **Verdict** | Solid all-rounder with ecosystem advantages | Clear performance leader at similar price point |

### 3.2 Level: Pro (Balanced)

| Aspect | Aliyun qwen3.5-plus | Bytedance doubao-seed-2.0-lite |
|--------|---------------------|-------------------------------|
| **Release Date** | 2026-02-15 | 2026-02-14 |
| **Pricing (Input/Output)** | 0.8-4 yuan / 4.8-24 yuan per M | 0.6 yuan / ~3 yuan per M (estimated) |
| **Key Feature** | Native multimodal (text/image/video) | 73.9% accuracy on comprehensive benchmarks |
| **Parameters** | 397B total, 17B active (MoE) | Not disclosed |
| **Strengths** | First native multimodal Qwen; rivals qwen3-max on text; 8x faster than max; extremely cost-effective | Excellent accuracy/cost ratio; production-ready; 11.4% improvement in logic over previous gen |
| **Weaknesses** | Newer model with less production testing | Vision capabilities limited; less ecosystem integration |
| **Best For** | Multimodal applications; high-volume text tasks; image/video understanding | General purpose AI; production workloads; cost optimization |
| **Verdict** | Choose for multimodal needs; excellent value | Choose for pure text tasks at lowest cost |

### 3.3 Level: Flash/Turbo (Speed/Cost)

| Aspect | Aliyun qwen3.5-flash | Bytedance doubao-seed-2.0-mini |
|--------|----------------------|-------------------------------|
| **Release Date** | 2026-02-23 | 2026-02-14 |
| **Pricing (Input/Output)** | 0.2-1.2 yuan / 2-12 yuan per M | Not fully disclosed (estimated <0.5 yuan) |
| **Accuracy** | Good for simple tasks | 71.8% (comprehensive benchmark) |
| **Strengths** | Ultra-low cost; thinking/non-thinking modes; good for simple classification | Smallest footprint; edge deployment; decent accuracy for size |
| **Weaknesses** | Not suitable for complex reasoning | Limited capabilities; primarily for simple tasks |
| **Best For** | Classification; simple extraction; high-volume preprocessing | Edge devices; simple chatbots; latency-critical applications |

### 3.4 Level: Coder Pro

| Aspect | Aliyun qwen3-coder-plus | Bytedance doubao-seed-2.0-code |
|--------|-------------------------|-------------------------------|
| **Release Date** | 2026-01 | 2026-02-14 |
| **Pricing (Input/Output)** | 4-20 yuan / 16-200 yuan per M | Not fully disclosed |
| **Key Metrics** | Strong on HumanEval; Coding Agent capabilities | Codeforces 3020; ICPC gold; competitive programming excellence |
| **Strengths** | Tool calling; environment interaction; debugging capabilities | Elite competitive programming performance; strong algorithmic reasoning |
| **Weaknesses** | Higher cost for output tokens | Limited ecosystem; newer to market |
| **Best For** | Software engineering; debugging; tool-using agents | Competitive programming; algorithm challenges; code contests |

### 3.5 Level: Vision Plus

| Aspect | Aliyun qwen3-vl-plus | Bytedance doubao-1.5-vision-pro |
|--------|----------------------|--------------------------------|
| **Release Date** | 2026-01-22 | 2025-12 |
| **Pricing (Input/Output)** | 1-3 yuan / 10-30 yuan per M | Not fully disclosed |
| **Key Features** | Thinking + non-thinking modes; 119 languages; spatial reasoning | Document extraction; production-tested; strong OCR |
| **Strengths** | Unified architecture with text models; advanced spatial reasoning; multilingual | Mature model with proven production use; excellent document understanding |
| **Weaknesses** | Higher cost; newer with less validation | Older architecture; may lag on latest benchmarks |
| **Best For** | Multilingual vision tasks; spatial reasoning; research | Document processing; OCR-heavy workflows; production stability |

---

## 4. Model Selection Decision Framework

### 4.1 New Model Detection Process

```
TRIGGER: New model announcement detected
    │
    ▼
STEP 1: Gather Official Specs
    - Release date
    - Architecture (MoE, dense, etc.)
    - Context window
    - Pricing tiers
    - Claimed capabilities
    │
    ▼
STEP 2: Collect Benchmark Scores
    - MMLU (general knowledge)
    - HumanEval (coding)
    - AIME/GPQA (reasoning)
    - SWE-Bench (software engineering)
    - Domain-specific benchmarks
    │
    ▼
STEP 3: Community Validation
    - Reddit/ Twitter/ Zhihu sentiment
    - Real-world usage reports
    - Independent evaluations
    │
    ▼
STEP 4: Assign Level
    - Compare to existing models at each level
    - Consider price as secondary factor
    - Assign to appropriate tier
    │
    ▼
STEP 5: Determine Comparison Pair
    - Identify direct competitor at same level
    - Add to price tracking
    - Document in this regime
```

### 4.2 Version Update Handling

| Scenario | Action | Example |
|----------|--------|---------|
| **Major version (qwen-max → qwen3-max)** | Replace in same level; archive old model | qwen2.5-max → qwen3-max |
| **Minor version (qwen3-max → qwen3-max-2026-02)** | Update in place; note changes | Model refresh with same name |
| **New variant (qwen3-max → qwen3.5-plus)** | Evaluate for new level; may create new tier | qwen3.5-plus as Pro level |
| **Price change only** | Update pricing; re-evaluate if level shift warranted | Price drop may indicate Flash repositioning |

### 4.3 Replacement Criteria

A new model should replace an existing comparison model when:

1. **Benchmark Superiority:** New model scores >10% higher on key benchmarks
2. **Price Parity:** New model priced within 20% of existing model
3. **Ecosystem Maturity:** API stability and documentation quality acceptable
4. **Community Adoption:** Evidence of production usage
5. **Version Obsolescence:** Official deprecation of older model

### 4.4 Triggers for Re-evaluation

| Trigger | Frequency | Action |
|---------|-----------|--------|
| New model announcement | As needed | Full evaluation protocol |
| Quarterly review | Every 3 months | Verify all models still current |
| Major benchmark update | As needed | Re-assess level assignments |
| Significant price change | As needed | May indicate repositioning |
| Community sentiment shift | Weekly monitoring | Investigate if major changes reported |

---

## 5. Monitoring Checklist

### 5.1 Aliyun (Qwen) Monitoring

- [ ] **Official Channels:**
  - [ ] Qwen.ai blog (https://qwen.ai/blog)
  - [ ] Alibaba Cloud announcements (https://www.alibabacloud.com/help/en/model-studio/newly-released-models)
  - [ ] Aliyun console notices
  - [ ] GitHub QwenLM releases

- [ ] **Key Models to Track:**
  - [ ] qwen3-max updates
  - [ ] qwen3.5-plus/flash variants
  - [ ] qwen3-coder series
  - [ ] qwen3-vl series
  - [ ] qwen3-omni series
  - [ ] Qwen4 (next major version)

### 5.2 Bytedance (Doubao/Seed) Monitoring

- [ ] **Official Channels:**
  - [ ] Seed.bytedance.com blog (https://seed.bytedance.com/zh/blog)
  - [ ] Volcengine product pages (https://www.volcengine.com/product/doubao)
  - [ ] Volcengine docs (https://www.volcengine.com/docs/82379)
  - [ ] Coze platform announcements

- [ ] **Key Models to Track:**
  - [ ] doubao-seed-2.0-pro updates
  - [ ] doubao-seed-2.0-lite/mini variants
  - [ ] doubao-seed-2.0-code updates
  - [ ] doubao-vision series updates
  - [ ] Seed 3.0 (next major version)

### 5.3 Benchmark Monitoring

- [ ] **Leaderboards:**
  - [ ] SWE-Bench (https://www.swebench.com/)
  - [ ] LiveCodeBench
  - [ ] AIME/GPQA scores
  - [ ] MMLU leaderboard
  - [ ] LMSYS Chatbot Arena

- [ ] **Community Sources:**
  - [ ] r/LocalLLaMA Reddit
  - [ ] Twitter/X AI community
  - [ ] Zhihu AI topics
  - [ ] ArtificialAnalysis.ai
  - [ ] LLM-Stats.com

### 5.4 Pricing Monitoring

- [ ] **Weekly Checks:**
  - [ ] Aliyun Bailian pricing page
  - [ ] Volcengine Ark pricing page
  - [ ] Promotional pricing announcements
  - [ ] Enterprise pricing changes

---

## 6. Key Findings & Recommendations

### 6.1 Current Market Position (March 2026)

1. **Bytedance has benchmark leadership:** Doubao-Seed-2.0-Pro leads in most objective benchmarks (AIME, GPQA, SWE-Bench)

2. **Aliyun has ecosystem and multimodal advantages:** Qwen3.5-Plus offers native multimodal at competitive prices; stronger ecosystem maturity

3. **Price competition is intense:** Both vendors are pricing aggressively, with Flash/Lite models reaching sub-1 yuan per million tokens

4. **Specialization is increasing:** Clear separation between general, coding, and vision models with dedicated variants

### 6.2 Recommended Comparison Pairs

| Level | Primary Comparison | Rationale |
|-------|-------------------|-----------|
| Flagship | qwen3-max vs doubao-seed-2.0-pro | Head-to-head flagship battle |
| Pro | qwen3.5-plus vs doubao-seed-2.0-lite | Balanced performance/price |
| Flash | qwen3.5-flash vs doubao-seed-2.0-mini | Ultra-cost-effective tier |
| Coder Pro | qwen3-coder-plus vs doubao-seed-2.0-code | Coding specialization |
| Vision Plus | qwen3-vl-plus vs doubao-1.5-vision-pro | Vision capabilities |

### 6.3 Strategic Recommendations

1. **Weight benchmarks heavily:** Bytedance's benchmark leadership is substantial and verified
2. **Monitor for Qwen4:** Aliyun typically releases major versions annually; Qwen4 expected late 2026
3. **Track multimodal convergence:** Both vendors moving toward unified multimodal architectures
4. **Watch for price wars:** Both vendors have signaled aggressive pricing; expect further cuts
5. **Validate community sentiment:** Benchmarks don't always match real-world performance; monitor user reports

### 6.4 Risk Factors

| Risk | Mitigation |
|------|------------|
| Rapid model obsolescence | Quarterly review cycle; flexible level assignment |
| Benchmark gaming | Cross-reference multiple benchmarks; weight real-world reports |
| Pricing volatility | Weekly price monitoring; alert on >20% changes |
| API compatibility changes | Track deprecation notices; maintain model alternatives |

---

## 7. Appendix: Reference Data

### 7.1 Pricing Summary (yuan per million tokens, China region)

| Model | Input (low) | Input (high) | Output (low) | Output (high) |
|-------|-------------|--------------|--------------|---------------|
| qwen3-max | 2.5 | 7.0 | 10 | 28 |
| qwen3.5-plus | 0.8 | 4.0 | 4.8 | 24 |
| qwen3.5-flash | 0.2 | 1.2 | 2.0 | 12 |
| qwen3-vl-plus | 1.0 | 3.0 | 10 | 30 |
| qwen3-vl-flash | 0.15 | 0.6 | 1.5 | 6 |
| qwen3-coder-plus | 4.0 | 20.0 | 16 | 200 |
| qwen3-coder-flash | 1.0 | 5.0 | 4 | 25 |
| doubao-seed-2.0-pro | 3.2 | - | 16 | - |
| doubao-seed-2.0-lite | 0.6 | - | ~3 | - |

### 7.2 Benchmark Summary

| Model | AIME 2025 | SWE-Bench | GPQA | LiveCodeBench |
|-------|-----------|-----------|------|---------------|
| qwen3-max | 81.6% | 69.6% | 62.0% | 69.0% |
| doubao-seed-2.0-pro | 98.3% | 76.5% | 88.9% | 87.8% |
| doubao-seed-2.0-lite | - | - | - | 73.9% (overall) |
| doubao-seed-2.0-mini | - | - | - | 71.8% (overall) |

### 7.3 Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-26 | Initial regime establishment |

---

*This document is a living document and should be updated as the AI model landscape evolves.*
