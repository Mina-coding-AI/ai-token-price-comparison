# AI Token Price Comparison - Task Requirements (Persistent Memory)

## Core Requirements (CRITICAL - Never Forget)

### 1. Comparison Table Display
- **MUST show LOWEST tier price** in the main comparison table
- Purpose: Enable fair cross-company price comparison
- Implementation: Uses `getLowestPrice()` function which selects tier with minimum input price

### 2. Tiered Pricing Details
- **MUST show COMPLETE tier ladder** below the comparison table
- Purpose: Show full pricing structure for each model
- Each tier must display: range (e.g., "0-32K"), input price, output price

### 3. Data Structure Requirements
```javascript
// Each model must have:
{
  name: "model-name",
  displayName: "Display Name",
  desc: "Description",
  tiers: [
    { range: "0-32K", input: X.X, output: Y.Y },     // Lowest tier first
    { range: "32K-128K", input: X.X, output: Y.Y },  // Middle tiers...
    { range: "128K-256K", input: X.X, output: Y.Y }  // Highest tier last
  ]
}
```

### 4. Data Sources (Validated & Working)

#### Aliyun (Primary)
- **Endpoint**: `https://help.aliyun.com/help/json/document_detail.json?nodeId=284914&website=cn&language=zh`
- **Method**: WebFetch with detailed extraction prompt
- **CRITICAL RULE - Latest Model Priority**: When multiple versions exist (e.g., qwen-max vs qwen3-max), ALWAYS pick the LATEST version (higher version number = newer)
- **Current Latest Models by Level**:
  - **Flagship**: qwen3-max (NOT qwen-max)
  - **Pro**: qwen3.5-plus (NOT qwen-plus)
  - **Turbo**: qwen-turbo
  - **Flash**: qwen3.5-flash
  - **Coder Pro**: qwen3-coder-plus (NOT qwen-coder-plus)
  - **Vision Max**: qwen-vl-max
  - **Vision Plus**: qwen3-vl-plus (NOT qwen-vl-plus)
  - **Omni**: qwen-omni
  - **Visual Reasoning**: qvq-max
- **Level Assignment Rules**:
  - Flagship: Highest capability model (usually highest price, often named "max" or with version number like "3-max")
  - Pro: Mid-tier balanced model
  - Turbo/Lite: Low-cost fast models
  - Coder Pro/Lite: Code-specific models
  - Vision Max/Plus: Vision understanding models
  - Reasoning: Chain-of-thought models (qwq series)

#### Bytedance (Primary)
- **Method**: User-provided Markdown file from `https://www.volcengine.com/docs/82379/1544106`
- **Dynamic Model Detection**: MUST extract ALL models from the document and categorize by capability/price tier
- **CRITICAL RULE - Latest Model Priority**: Same as Aliyun, always pick the latest version when multiple exist
- **Current Latest Models by Level**:
  - **Flagship**: doubao-seed-2.0-pro
  - **Pro**: doubao-seed-2.0-lite, doubao-1.5-pro-32k
  - **Turbo**: doubao-seed-2.0-mini (paired with qwen-turbo)
  - **Lite**: doubao-1.5-lite-32k
  - **Flash**: doubao-seed-1.6-flash
  - **Coder Pro**: doubao-seed-2.0-code
  - **Coder**: doubao-seed-code
  - **Vision Max**: doubao-1.5-vision-pro
  - **Vision Plus**: doubao-seed-1.6-vision
  - **Vision Lite**: doubao-1.5-vision-lite

### 5. Validation Rules
- Input prices must be within 0.1-100 元/百万tokens
- Output prices must be within 0.3-200 元/百万tokens
- Output price should generally >= input price
- Flag any price change >50% from previous day
- Every model must have corresponding extracted price

### 6. Common Mistakes to Avoid
- ❌ Showing highest tier price in comparison table (MUST show LOWEST)
- ❌ Truncating tier list to only lowest tier (MUST show ALL tiers in ladder)
- ❌ Using international pricing instead of China Mainland
- ❌ Using "thinking mode" prices instead of non-thinking
- ❌ Missing models during extraction (must check ALL categories)
- ❌ Using static model name lists (MUST dynamically detect latest models from API)
- ❌ Hardcoding model-level mappings (MUST judge based on capability/price tier)
- ❌ **Using old version models when newer versions exist** (CRITICAL: Always pick qwen3-max over qwen-max, qwen3.5-plus over qwen-plus, etc.)

### 7. File Locations
- **Data**: `C:\Users\Mina\.qoderwork\workspace\mmx9zaoqehlqlg3w\outputs\price-data.js`
- **HTML**: `C:\Users\Mina\.qoderwork\workspace\mmx9zaoqehlqlg3w\outputs\token-price-comparison-v5.html`
- **Skill**: `C:\Users\Mina\.qoderwork\skills\price-update\SKILL.md`

### 8. Cron Jobs
- **Daily Update**: 10:00 AM Beijing Time (02:00 UTC)
- **Verification**: 10:05 AM Beijing Time (02:05 UTC)
- Both jobs use updated JSON API endpoint for Aliyun

### 9. Third-Party Model Display
- **Format**: Side-by-side comparison (Aliyun vs Bytedance) for the SAME model
- **Data Structure**: Array of models, each with `aliyun` and `bytedance` price objects
- **Example**:
  ```javascript
  {
    name: "deepseek-v3",
    provider: "deepseek",
    desc: "推理与编码",
    aliyun: { input: 2.0, output: 8.0 },
    bytedance: { input: 2.0, output: 8.0 }
  }
  ```
- **Note**: If a provider doesn't offer the model, display "-"

### 10. Date Selector Feature
- **Location**: Top of page, below provider cards
- **Function**: Allow users to view historical prices
- **Constraints**: 
  - Minimum date: 2026-03-25 (first day of data collection)
  - Show note: "* 仅支持 2026-03-25 及之后的价格数据" / "* Only price data after 2026-03-25 is available"
- **Behavior**: When date selected, render prices from history for that date
- **Fallback**: If no data for selected date, show alert and display latest data

---
Last Updated: 2026-03-25
