/**
 * Bytedance (Volcengine/Doubao) Price Fetcher
 * Uses Puppeteer to scrape pricing from the React SPA
 * Fallback: Returns hardcoded baseline data if scraping fails
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  url: 'https://www.volcengine.com/docs/82379/1544106',
  timeout: 30000,
  waitForSelector: 'table', // Wait for pricing tables to load
  outputPath: path.join(__dirname, 'price-data.js'),
  backupPath: path.join(__dirname, 'price-data.backup.js'),
  dryRun: process.argv.includes('--dry-run'),
  useBaseline: process.argv.includes('--use-baseline')
};

// Baseline pricing data (hardcoded as ultimate fallback)
const BASELINE_PRICES = {
  metadata: {
    lastUpdated: new Date().toISOString().split('T')[0],
    updateTime: "10:00 AM Beijing Time",
    sources: {
      aliyun: "https://help.aliyun.com/zh/model-studio/model-pricing",
      bytedance: "https://www.volcengine.com/docs/82379/1544106"
    },
    fetchMethod: "baseline-fallback"
  },
  current: {
    aliyun: {
      // Aliyun data remains unchanged - fetched via their JSON API
      language: [
        {
          name: "qwen3-max",
          displayName: "Flagship",
          level: "Flagship",
          desc: "最高能力，复杂推理",
          tiers: [
            { range: "0-32K", input: 2.5, output: 10.0 },
            { range: "32K-128K", input: 4.0, output: 16.0 },
            { range: "128K-256K", input: 7.0, output: 28.0 }
          ]
        },
        {
          name: "qwen3.5-plus",
          displayName: "Pro",
          level: "Pro",
          desc: "性能与成本平衡",
          tiers: [
            { range: "0-128K", input: 0.8, output: 4.8 },
            { range: "128K-256K", input: 2.4, output: 12.0 },
            { range: "256K-1M", input: 4.0, output: 24.0 }
          ]
        },
        {
          name: "qwen3.5-flash",
          displayName: "Flash",
          level: "Flash",
          desc: "极速响应",
          tiers: [
            { range: "0-128K", input: 0.2, output: 2.0 },
            { range: "128K-256K", input: 0.6, output: 6.0 },
            { range: "256K-1M", input: 1.2, output: 12.0 }
          ]
        }
      ],
      code: [
        {
          name: "qwen3-coder-plus",
          displayName: "Coder Pro",
          level: "Coder Pro",
          desc: "代码生成与补全",
          tiers: [
            { range: "0-128K", input: 4.0, output: 16.0 },
            { range: "128K-256K", input: 12.0, output: 80.0 },
            { range: "256K-1M", input: 20.0, output: 200.0 }
          ]
        },
        {
          name: "qwen-coder-turbo",
          displayName: "Coder Lite",
          level: "Coder Lite",
          desc: "快速代码生成",
          tiers: [
            { range: "无阶梯", input: 2.0, output: 6.0 }
          ]
        },
        {
          name: "qwq-32b",
          displayName: "Reasoning",
          level: "Reasoning",
          desc: "深度推理",
          tiers: [
            { range: "无阶梯", input: 1.6, output: 4.0 }
          ]
        }
      ],
      vision: [
        {
          name: "qwen-vl-max",
          displayName: "Vision Max",
          level: "Vision Max",
          desc: "高级图像理解",
          tiers: [
            { range: "无阶梯", input: 1.6, output: 4.0 }
          ]
        },
        {
          name: "qwen3-vl-plus",
          displayName: "Vision Plus",
          level: "Vision Plus",
          desc: "平衡视觉理解",
          tiers: [
            { range: "0-128K", input: 1.0, output: 10.0 },
            { range: "128K-256K", input: 2.0, output: 20.0 },
            { range: "256K-1M", input: 3.0, output: 30.0 }
          ]
        },
        {
          name: "qwen-omni",
          displayName: "Omni",
          level: "Omni",
          desc: "全模态理解",
          tiers: [
            { range: "0-128K", input: 1.8, output: 6.9 }
          ]
        },
        {
          name: "qvq-max",
          displayName: "Visual Reasoning",
          level: "Visual Reasoning",
          desc: "视觉推理分析",
          tiers: [
            { range: "0-128K", input: 8.0, output: 32.0 }
          ]
        }
      ],
      image: [
        {
          name: "qwen-image-2.0",
          price: 0.50,
          unit: "per_image"
        },
        {
          name: "wanxiang-2.1-t2i",
          price: 0.20,
          unit: "per_image"
        }
      ],
      video: [
        {
          name: "wanxiang-video",
          price: 0.50,
          unit: "per_video",
          notes: "按长度变化"
        }
      ]
    },
    bytedance: {
      language: [
        {
          name: "doubao-seed-2.0-pro",
          displayName: "Flagship",
          level: "Flagship",
          desc: "旗舰版，最强能力",
          tiers: [
            { range: "0-32K", input: 3.2, output: 16.0 },
            { range: "32K-128K", input: 4.8, output: 24.0 },
            { range: "128K-256K", input: 9.6, output: 48.0 }
          ]
        },
        {
          name: "doubao-seed-2.0-lite",
          displayName: "Pro",
          level: "Pro",
          desc: "高性能通用模型",
          tiers: [
            { range: "0-32K", input: 0.6, output: 3.6 },
            { range: "32K-128K", input: 0.9, output: 5.4 },
            { range: "128K-256K", input: 1.8, output: 10.8 }
          ]
        },
        {
          name: "doubao-seed-2.0-mini",
          displayName: "Flash",
          level: "Flash",
          desc: "轻量版，经济实惠",
          tiers: [
            { range: "0-32K", input: 0.2, output: 2.0 },
            { range: "32K-128K", input: 0.4, output: 4.0 },
            { range: "128K-256K", input: 0.8, output: 8.0 }
          ]
        },
        {
          name: "doubao-seed-1.6-flash",
          displayName: "Flash",
          level: "Flash",
          desc: "极速版，最低成本",
          tiers: [
            { range: "0-32K", input: 0.15, output: 1.5 },
            { range: "32K-128K", input: 0.3, output: 3.0 },
            { range: "128K-256K", input: 0.6, output: 6.0 }
          ]
        },
        {
          name: "doubao-1.5-pro-32k",
          displayName: "Pro 32K",
          level: "Pro",
          desc: "高性能长上下文",
          tiers: [
            { range: "无阶梯", input: 0.8, output: 2.0 }
          ]
        },
        {
          name: "doubao-1.5-lite-32k",
          displayName: "Lite 32K",
          level: "Lite",
          desc: "轻量长上下文",
          tiers: [
            { range: "无阶梯", input: 0.3, output: 0.6 }
          ]
        }
      ],
      code: [
        {
          name: "doubao-seed-2.0-code",
          displayName: "Coder Pro",
          level: "Coder Pro",
          desc: "代码生成与补全",
          tiers: [
            { range: "0-32K", input: 3.2, output: 16.0 },
            { range: "32K-128K", input: 4.8, output: 24.0 },
            { range: "128K-256K", input: 9.6, output: 48.0 }
          ]
        },
        {
          name: "doubao-seed-code",
          displayName: "Coder",
          level: "Coder",
          desc: "通用代码模型",
          tiers: [
            { range: "0-32K", input: 1.2, output: 8.0 },
            { range: "32K-128K", input: 1.4, output: 12.0 },
            { range: "128K-256K", input: 2.8, output: 16.0 }
          ]
        }
      ],
      vision: [
        {
          name: "doubao-1.5-vision-pro",
          displayName: "Vision Max",
          level: "Vision Max",
          desc: "专业视觉理解",
          tiers: [
            { range: "无阶梯", input: 3.0, output: 9.0 }
          ]
        },
        {
          name: "doubao-1.5-vision-lite",
          displayName: "Vision Lite",
          level: "Vision Lite",
          desc: "轻量视觉理解",
          tiers: [
            { range: "无阶梯", input: 1.5, output: 4.5 }
          ]
        },
        {
          name: "doubao-seed-1.6-vision",
          displayName: "Vision Plus",
          level: "Vision Plus",
          desc: "视觉理解",
          tiers: [
            { range: "0-32K", input: 0.8, output: 8.0 },
            { range: "32K-128K", input: 1.2, output: 16.0 },
            { range: "128K-256K", input: 2.4, output: 24.0 }
          ]
        }
      ],
      image: [
        {
          name: "doubao-image",
          price: 0.22,
          unit: "per_image",
          range: "0.15-0.30"
        }
      ],
      video: [
        {
          name: "doubao-seedance",
          price: 1.10,
          unit: "per_minute",
          range: "0.20-2.00"
        }
      ],
      audio: [
        {
          name: "doubao-asr",
          price: 2.70,
          unit: "per_hour",
          range: "0.80-4.60"
        }
      ]
    },
    thirdParty: [
      {
        name: "deepseek-v3",
        provider: "deepseek",
        desc: "推理与编码",
        aliyun: { input: 2.0, output: 8.0 },
        bytedance: { input: 2.0, output: 8.0 }
      },
      {
        name: "deepseek-r1",
        provider: "deepseek",
        desc: "深度推理",
        aliyun: { input: 4.0, output: 16.0 },
        bytedance: { input: 4.0, output: 16.0 }
      },
      {
        name: "kimi-k2",
        provider: "moonshot",
        desc: "长上下文",
        aliyun: { input: 4.0, output: 16.0 },
        bytedance: { input: 4.0, output: 16.0 }
      },
      {
        name: "glm-4",
        provider: "zhipu",
        desc: "通用场景",
        aliyun: { input: 2.0, output: 8.0 },
        bytedance: null
      }
    ]
  },
  changes: [],
  history: {
    dates: [new Date().toISOString().split('T')[0]],
    models: {
      "doubao-seed-2.0-pro": { input: [3.2], output: [16.0] },
      "doubao-seed-2.0-lite": { input: [0.6], output: [3.6] },
      "doubao-seed-2.0-mini": { input: [0.2], output: [2.0] },
      "doubao-seed-1.6-flash": { input: [0.15], output: [1.5] },
      "doubao-1.5-pro-32k": { input: [0.8], output: [2.0] },
      "doubao-1.5-lite-32k": { input: [0.3], output: [0.6] }
    }
  }
};

/**
 * Attempt to scrape pricing using Puppeteer (headless browser)
 * This is the secondary method - tries to extract live data from the React SPA
 */
async function scrapeWithPuppeteer() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.log('Puppeteer not installed. Run: npm install puppeteer');
    return null;
  }

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log(`Navigating to ${CONFIG.url}...`);
    await page.goto(CONFIG.url, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
    
    // Wait for content to load
    console.log('Waiting for pricing tables to load...');
    await page.waitForSelector(CONFIG.waitForSelector, { timeout: 10000 });
    
    // Additional wait for React to render
    await page.waitForTimeout(3000);
    
    // Extract pricing data from tables
    const pricingData = await page.evaluate(() => {
      const data = {
        language: [],
        code: [],
        vision: [],
        image: [],
        video: [],
        audio: []
      };
      
      // Find all tables on the page
      const tables = document.querySelectorAll('table');
      
      tables.forEach((table, tableIndex) => {
        const rows = table.querySelectorAll('tr');
        const headers = [];
        
        // Extract headers
        const headerRow = table.querySelector('thead tr') || rows[0];
        if (headerRow) {
          headerRow.querySelectorAll('th, td').forEach(th => {
            headers.push(th.textContent.trim());
          });
        }
        
        // Extract data rows
        const dataRows = table.querySelector('thead') ? 
          Array.from(rows).slice(1) : 
          Array.from(rows).slice(1);
        
        dataRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            const modelName = cells[0]?.textContent?.trim() || '';
            
            // Skip header rows or empty rows
            if (!modelName || modelName.includes('模型名称')) return;
            
            // Detect model type from name
            const modelType = detectModelType(modelName);
            
            // Extract pricing
            const pricing = {
              name: normalizeModelName(modelName),
              displayName: extractDisplayName(modelName),
              tiers: extractTiers(cells, headers)
            };
            
            if (modelType && pricing.tiers.length > 0) {
              data[modelType].push(pricing);
            }
          }
        });
      });
      
      return data;
      
      function detectModelType(name) {
        const lower = name.toLowerCase();
        if (lower.includes('vision') || lower.includes('vl')) return 'vision';
        if (lower.includes('code') || lower.includes('coder')) return 'code';
        if (lower.includes('image') || lower.includes('seedream')) return 'image';
        if (lower.includes('video') || lower.includes('dance')) return 'video';
        if (lower.includes('audio') || lower.includes('asr') || lower.includes('tts')) return 'audio';
        return 'language';
      }
      
      function normalizeModelName(name) {
        return name.toLowerCase()
          .replace(/[^a-z0-9\-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      function extractDisplayName(name) {
        // Extract clean display name from model name
        return name.replace(/\([^)]*\)/g, '').trim();
      }
      
      function extractTiers(cells, headers) {
        const tiers = [];
        
        // Look for price patterns in cells
        for (let i = 1; i < cells.length; i++) {
          const text = cells[i]?.textContent?.trim() || '';
          
          // Match price patterns like "0.0008元/千tokens" or "3.2元/百万tokens"
          const priceMatch = text.match(/(\d+\.?\d*)\s*元\s*\/(\w+)/);
          if (priceMatch) {
            const price = parseFloat(priceMatch[1]);
            const unit = priceMatch[2];
            
            // Convert to standard unit (per million tokens)
            let normalizedPrice = price;
            if (unit.includes('千') || unit.includes('k')) {
              normalizedPrice = price * 1000;
            }
            
            tiers.push({
              range: headers[i] || '标准',
              price: normalizedPrice,
              unit: 'per_million_tokens'
            });
          }
        }
        
        return tiers;
      }
    });
    
    console.log('Scraped pricing data:', JSON.stringify(pricingData, null, 2));
    return pricingData;
    
  } catch (error) {
    console.error('Puppeteer scraping failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

/**
 * Save pricing data to file
 */
function savePricingData(data) {
  const output = `window.PRICE_DATA = ${JSON.stringify(data, null, 2)};`;
  
  // Backup existing file
  if (fs.existsSync(CONFIG.outputPath)) {
    fs.copyFileSync(CONFIG.outputPath, CONFIG.backupPath);
  }
  
  // Write new data
  fs.writeFileSync(CONFIG.outputPath, output, 'utf8');
  console.log(`Pricing data saved to ${CONFIG.outputPath}`);
}

/**
 * Load existing pricing data
 */
function loadExistingData() {
  try {
    if (fs.existsSync(CONFIG.outputPath)) {
      const content = fs.readFileSync(CONFIG.outputPath, 'utf8');
      // Extract JSON from window.PRICE_DATA = {...};
      const match = content.match(/window\.PRICE_DATA\s*=\s*({[\s\S]*});?$/);
      if (match) {
        return JSON.parse(match[1]);
      }
    }
  } catch (e) {
    console.error('Failed to load existing data:', e.message);
  }
  return null;
}

/**
 * Compare new data with existing to detect changes
 */
function detectChanges(existing, newData) {
  const changes = [];
  
  if (!existing || !existing.current) return changes;
  
  // Compare Bytedance pricing
  const existingBytedance = existing.current.bytedance || {};
  const newBytedance = newData.bytedance || {};
  
  for (const [category, models] of Object.entries(newBytedance)) {
    const existingModels = existingBytedance[category] || [];
    
    for (const newModel of models) {
      const existingModel = existingModels.find(m => m.name === newModel.name);
      
      if (!existingModel) {
        changes.push({ type: 'new_model', category, model: newModel.name });
      } else {
        // Compare tiers
        for (const newTier of newModel.tiers || []) {
          const existingTier = existingModel.tiers?.find(t => t.range === newTier.range);
          if (existingTier) {
            if (newTier.input !== undefined && existingTier.input !== newTier.input) {
              changes.push({
                type: 'price_change',
                category,
                model: newModel.name,
                tier: newTier.range,
                field: 'input',
                old: existingTier.input,
                new: newTier.input
              });
            }
            if (newTier.output !== undefined && existingTier.output !== newTier.output) {
              changes.push({
                type: 'price_change',
                category,
                model: newModel.name,
                tier: newTier.range,
                field: 'output',
                old: existingTier.output,
                new: newTier.output
              });
            }
          }
        }
      }
    }
  }
  
  return changes;
}

/**
 * Main execution
 */
async function main() {
  console.log('=== Bytedance Price Fetcher ===');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log('');
  
  // Option: Use baseline data only
  if (CONFIG.useBaseline) {
    console.log('Using baseline pricing data (hardcoded fallback)...');
    if (!CONFIG.dryRun) {
      savePricingData(BASELINE_PRICES);
    }
    console.log('Baseline data ready.');
    return { success: true, method: 'baseline', data: BASELINE_PRICES };
  }
  
  // Try 1: Scrape with Puppeteer
  console.log('Attempting to scrape live pricing data...');
  let scrapedData = null;
  
  try {
    scrapedData = await scrapeWithPuppeteer();
  } catch (e) {
    console.error('Scraping error:', e.message);
  }
  
  if (scrapedData && Object.values(scrapedData).some(arr => arr.length > 0)) {
    console.log('Successfully scraped pricing data!');
    
    // Merge with baseline structure
    const newData = JSON.parse(JSON.stringify(BASELINE_PRICES));
    newData.metadata.fetchMethod = 'puppeteer-scrape';
    newData.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Update with scraped data
    for (const [category, models] of Object.entries(scrapedData)) {
      if (models.length > 0) {
        newData.current.bytedance[category] = models;
      }
    }
    
    // Detect changes
    const existingData = loadExistingData();
    const changes = detectChanges(existingData, newData);
    
    if (changes.length > 0) {
      console.log(`\nDetected ${changes.length} changes:`);
      changes.forEach(c => console.log(`  - ${c.type}: ${c.model || c.category}`));
      newData.changes = changes;
    }
    
    if (!CONFIG.dryRun) {
      savePricingData(newData);
    } else {
      console.log('Dry run - not saving data');
    }
    
    return { success: true, method: 'puppeteer', changes: changes.length, data: newData };
  }
  
  // Fallback: Use baseline data
  console.log('\nScraping failed or returned no data. Using baseline fallback...');
  
  if (!CONFIG.dryRun) {
    savePricingData(BASELINE_PRICES);
  }
  
  console.log('Baseline fallback data ready.');
  console.log('\nNOTE: To get live data, ensure Puppeteer is installed:');
  console.log('  npm install puppeteer');
  
  return { success: true, method: 'baseline-fallback', data: BASELINE_PRICES };
}

// Run main
main()
  .then(result => {
    console.log('\n=== Fetch Complete ===');
    console.log(`Method: ${result.method}`);
    console.log(`Success: ${result.success}`);
    if (result.changes !== undefined) {
      console.log(`Changes detected: ${result.changes}`);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\n=== Fetch Failed ===');
    console.error(error);
    process.exit(1);
  });
