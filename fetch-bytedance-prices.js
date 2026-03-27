/**
 * Bytedance (Volcengine) Price Scraper
 * Uses Puppeteer to extract pricing from React SPA
 * Target: https://www.volcengine.com/docs/82379/1544106
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    url: 'https://www.volcengine.com/docs/82379/1544106',
    timeout: 30000,
    outputFile: path.join(__dirname, 'bytedance-prices.json'),
    logFile: path.join(__dirname, 'logs', `bytedance-scrape-${new Date().toISOString().split('T')[0]}.log`)
};

function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level}] ${message}`;
    console.log(entry);
    
    // Ensure logs directory exists
    const logsDir = path.dirname(CONFIG.logFile);
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(CONFIG.logFile, entry + '\n');
}

async function scrapeBytedancePrices() {
    log('=== Bytedance Price Scraper Started ===');
    
    let browser;
    try {
        // Launch browser
        log('Launching Puppeteer browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Navigate to pricing page
        log(`Navigating to ${CONFIG.url}...`);
        await page.goto(CONFIG.url, { 
            waitUntil: 'networkidle2',
            timeout: CONFIG.timeout 
        });
        
        // Wait for React to render content
        log('Waiting for page to fully render...');
        await page.waitForTimeout(5000);
        
        // Extract pricing data
        log('Extracting pricing data...');
        const prices = await page.evaluate(() => {
            const data = {
                language: [],
                code: [],
                vision: [],
                image: [],
                video: [],
                audio: [],
                scrapedAt: new Date().toISOString()
            };
            
            // Helper to extract price from text
            const extractPrice = (text) => {
                const match = text.match(/(\d+\.?\d*)/);
                return match ? parseFloat(match[1]) : null;
            };
            
            // Helper to extract tier range
            const extractRange = (text) => {
                const match = text.match(/(\d+)K?\s*-\s*(\d+)K?/);
                if (match) {
                    return `${match[1]}K-${match[2]}K`;
                }
                return '无阶梯';
            };
            
            // Look for pricing tables
            const tables = document.querySelectorAll('table');
            tables.forEach((table, tableIndex) => {
                const rows = table.querySelectorAll('tr');
                let currentCategory = null;
                
                rows.forEach((row, rowIndex) => {
                    if (rowIndex === 0) return; // Skip header
                    
                    const cells = row.querySelectorAll('td, th');
                    if (cells.length < 3) return;
                    
                    const modelName = cells[0]?.textContent?.trim();
                    const inputPrice = cells[1]?.textContent?.trim();
                    const outputPrice = cells[2]?.textContent?.trim();
                    
                    if (!modelName || modelName.includes('模型名称')) return;
                    
                    // Detect category based on model name
                    if (modelName.includes('vision') || modelName.includes('vl') || modelName.includes('视觉')) {
                        currentCategory = 'vision';
                    } else if (modelName.includes('code') || modelName.includes('coder') || modelName.includes('编程')) {
                        currentCategory = 'code';
                    } else if (modelName.includes('image') || modelName.includes('图像')) {
                        currentCategory = 'image';
                    } else if (modelName.includes('video') || modelName.includes('视频')) {
                        currentCategory = 'video';
                    } else if (modelName.includes('audio') || modelName.includes('asr') || modelName.includes('语音')) {
                        currentCategory = 'audio';
                    } else {
                        currentCategory = 'language';
                    }
                    
                    const priceData = {
                        name: modelName,
                        input: extractPrice(inputPrice),
                        output: extractPrice(outputPrice),
                        rawInput: inputPrice,
                        rawOutput: outputPrice
                    };
                    
                    // Check for tier information
                    if (cells.length > 3) {
                        const tierInfo = cells[3]?.textContent?.trim();
                        if (tierInfo) {
                            priceData.range = extractRange(tierInfo);
                        }
                    }
                    
                    if (data[currentCategory]) {
                        data[currentCategory].push(priceData);
                    }
                });
            });
            
            // Also try to find pricing in specific elements
            const priceElements = document.querySelectorAll('[class*="price"], [class*="pricing"], [class*="cost"]');
            priceElements.forEach(el => {
                const text = el.textContent;
                if (text.includes('元') || text.includes('¥') || text.includes('CNY')) {
                    log(`Found price element: ${text}`);
                }
            });
            
            return data;
        });
        
        log(`Scraped ${prices.language.length} language models`);
        log(`Scraped ${prices.code.length} code models`);
        log(`Scraped ${prices.vision.length} vision models`);
        log(`Scraped ${prices.image.length} image models`);
        log(`Scraped ${prices.video.length} video models`);
        log(`Scraped ${prices.audio.length} audio models`);
        
        // Save to file
        fs.writeFileSync(CONFIG.outputFile, JSON.stringify(prices, null, 2), 'utf8');
        log(`Prices saved to: ${CONFIG.outputFile}`);
        
        // Validate scraped data
        const validation = validateScrapedData(prices);
        if (!validation.valid) {
            log(`Validation warnings: ${validation.warnings.join(', ')}`, 'WARNING');
        }
        
        log('=== Bytedance Price Scraper Completed ===');
        
        return {
            success: true,
            data: prices,
            validation: validation
        };
        
    } catch (error) {
        log(`Error: ${error.message}`, 'ERROR');
        log(error.stack, 'ERROR');
        
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    } finally {
        if (browser) {
            await browser.close();
            log('Browser closed');
        }
    }
}

function validateScrapedData(data) {
    const warnings = [];
    
    // Check if we got any data
    const totalModels = data.language.length + data.code.length + data.vision.length + 
                        data.image.length + data.video.length + data.audio.length;
    
    if (totalModels === 0) {
        warnings.push('No models scraped - page structure may have changed');
    }
    
    // Check for expected models
    const expectedModels = ['doubao-seed-2.0-pro', 'doubao-seed-2.0-lite', 'doubao-seed-2.0-mini'];
    const foundModels = data.language.map(m => m.name.toLowerCase());
    
    expectedModels.forEach(expected => {
        if (!foundModels.some(found => found.includes(expected))) {
            warnings.push(`Expected model not found: ${expected}`);
        }
    });
    
    // Check for valid prices
    data.language.forEach(model => {
        if (model.input === null || model.output === null) {
            warnings.push(`Invalid price for model: ${model.name}`);
        }
    });
    
    return {
        valid: warnings.length === 0,
        warnings: warnings
    };
}

// Run if called directly
if (require.main === module) {
    scrapeBytedancePrices()
        .then(result => {
            if (result.success) {
                console.log('\n✅ Scraping successful');
                process.exit(0);
            } else {
                console.log('\n❌ Scraping failed:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Unhandled error:', error);
            process.exit(1);
        });
}

module.exports = { scrapeBytedancePrices };
