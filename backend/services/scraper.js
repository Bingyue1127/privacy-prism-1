const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Lightweight web scraper using axios + cheerio
 * Advantages: Small size (5MB vs 350MB), Fast (1-2s vs 5-10s), Vercel compatible
 * Limitation: Cannot handle JavaScript-rendered content (SPAs)
 */
async function extractTextFromURL(url) {
  try {
    console.log(`[Lightweight Scraper] Fetching: ${url}`);
    
    // 1. Fetch HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      timeout: 30000, // 30 seconds
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const htmlSize = response.data.length;
    console.log(`✓ HTML fetched successfully (${(htmlSize / 1024).toFixed(2)} KB)`);

    // 2. Parse HTML with cheerio
    const $ = cheerio.load(response.data);

    // 3. Remove unwanted elements
    $('script, style, noscript, iframe, img, svg, video, audio').remove();
    $('nav, footer, header, aside').remove();
    $('[role="navigation"], [role="complementary"], [role="banner"]').remove();
    $('.advertisement, .ad, .ads, .advert').remove();
    $('[class*="cookie"], [class*="popup"], [class*="modal"]').remove();

    // 4. Extract main content
    // Try common content containers in order of priority
    let mainContent = '';
    
    const contentSelectors = [
      'article',                    // Semantic article tag
      'main',                       // Main content area
      '[role="main"]',              // ARIA main role
      '.article-content',           // Common class names
      '.post-content',
      '.entry-content',
      '.content-body',
      '#content',
      '.story-body',                // BBC, news sites
      '.article-body',
      'body'                        // Fallback to body
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        mainContent = element.text();
        // If we found substantial content, use it
        if (mainContent.length > 100) {
          console.log(`✓ Content extracted using selector: ${selector}`);
          break;
        }
      }
    }

    // If still no content, try to get all visible text
    if (!mainContent || mainContent.length < 100) {
      mainContent = $('body').text();
      console.log('⚠ Using fallback: extracting all body text');
    }

    // 5. Clean up the extracted text
    const cleanedText = mainContent
      .replace(/\s+/g, ' ')           // Multiple spaces to single space
      .replace(/\n\s*\n/g, '\n')      // Multiple newlines to single newline
      .replace(/\t/g, ' ')            // Tabs to spaces
      .trim();

    // 6. Validate content
    if (!cleanedText || cleanedText.length < 50) {
      throw new Error('Could not extract meaningful content from the URL. The page might be empty or require JavaScript to render.');
    }

    console.log(`✓ Text extracted successfully (${cleanedText.length} characters)`);
    
    // Log a preview
    const preview = cleanedText.substring(0, 150) + '...';
    console.log(`Preview: ${preview}`);

    return cleanedText;

  } catch (error) {
    console.error(`[Lightweight Scraper] Error:`, error.message);
    
    // Provide helpful error messages
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Request timeout. The website took too long to respond.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Domain not found. Please check if the URL is correct.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Connection refused. The website might be blocking requests.');
    } else if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        throw new Error('Access forbidden. The website is blocking automated requests.');
      } else if (status === 404) {
        throw new Error('Page not found (404). Please check the URL.');
      } else if (status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (status >= 500) {
        throw new Error(`Server error (${status}). The website might be temporarily unavailable.`);
      } else {
        throw new Error(`HTTP ${status}: ${error.response.statusText}`);
      }
    } else if (error.message.includes('meaningful content')) {
      throw error; // Re-throw our custom error
    } else {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }
  }
}

/**
 * Check if a URL is likely to work with the lightweight scraper
 * This is a heuristic check - not 100% accurate
 */
function isLikelyStaticSite(url) {
  const staticPatterns = [
    /bbc\.com/,
    /wikipedia\.org/,
    /github\.com/,
    /medium\.com/,
    /stackoverflow\.com/,
    /reddit\.com/,
    /news\./,
    /blog\./,
  ];
  
  return staticPatterns.some(pattern => pattern.test(url));
}

module.exports = {
  extractTextFromURL,
  isLikelyStaticSite
};

