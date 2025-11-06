require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  model: process.env.MODEL || 'gpt-4o', // 'gpt-4o' or 'gpt-4o-mini'
  analysisMode: process.env.ANALYSIS_MODE || 'A', // 'A' = single call, 'B' = 6 separate calls
  // Removed puppeteerOptions - now using lightweight scraper (axios + cheerio)
};

