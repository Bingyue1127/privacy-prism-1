const OpenAI = require('openai');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { fetch: undiciFetch, ProxyAgent } = require('undici');
const config = require('../config/config');
const { getCombinedPrompt, getIndividualPrompt, dimensions } = require('../prompts/dimensions');

// Configure OpenAI with proper proxy support for fetch API
const openaiConfig = {
  apiKey: config.openaiApiKey,
  timeout: 60000, // 60 seconds
  maxRetries: 2
};

// Configure proxy for fetch API (OpenAI SDK v6 uses fetch)
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  
  // Use undici's ProxyAgent for fetch API
  const dispatcher = new ProxyAgent(proxyUrl);
  
  // Create custom fetch with proxy
  openaiConfig.fetch = (url, init) => {
    return undiciFetch(url, { ...init, dispatcher });
  };
  
  console.log('✓ OpenAI configured with proxy:', proxyUrl);
} else {
  console.log('⚠ No proxy configured');
}

const openai = new OpenAI(openaiConfig);

/**
 * Analyze content using Mode A (single API call for all dimensions)
 * @param {string} content - Content to analyze
 * @param {object} res - Express response object for streaming
 */
async function analyzeContentModeA(content, res, headersAlreadySet = false) {
  try {
    const prompt = getCombinedPrompt(content);

    // Set up SSE headers only if not already set
    if (!headersAlreadySet) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert privacy analyst. Provide thorough, professional privacy risk assessments.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000
    });

    // Stream the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // Send each chunk to the client
        res.write(`data: ${JSON.stringify({ 
          type: 'content', 
          content: content 
        })}\n\n`);
      }
    }

    // Send completion signal
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      error: error.message || 'Failed to analyze content' 
    })}\n\n`);
    res.end();
  }
}

/**
 * Analyze content using Mode B (6 separate API calls)
 * @param {string} content - Content to analyze
 * @param {object} res - Express response object for streaming
 */
async function analyzeContentModeB(content, res, headersAlreadySet = false) {
  try {
    // Set up SSE headers only if not already set
    if (!headersAlreadySet) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }

    const dimensionKeys = Object.keys(dimensions);

    // Analyze each dimension separately
    for (const key of dimensionKeys) {
      const prompt = getIndividualPrompt(key, content);
      
      // Send dimension start signal
      res.write(`data: ${JSON.stringify({ 
        type: 'dimension_start', 
        dimension: key,
        name: dimensions[key].name
      })}\n\n`);

      // Create streaming completion for this dimension
      const stream = await openai.chat.completions.create({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert privacy analyst. Provide thorough, professional privacy risk assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 800
      });

      // Stream the response for this dimension
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ 
            type: 'dimension_content',
            dimension: key,
            content: content 
          })}\n\n`);
        }
      }

      // Send dimension completion signal
      res.write(`data: ${JSON.stringify({ 
        type: 'dimension_done',
        dimension: key
      })}\n\n`);
    }

    // Send overall completion signal
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      error: error.message || 'Failed to analyze content' 
    })}\n\n`);
    res.end();
  }
}

/**
 * Main analyze function that routes to appropriate mode
 * @param {string} content - Content to analyze
 * @param {object} res - Express response object
 */
async function analyzeContent(content, res, headersAlreadySet = false) {
  if (config.analysisMode === 'B') {
    return analyzeContentModeB(content, res, headersAlreadySet);
  } else {
    return analyzeContentModeA(content, res, headersAlreadySet);
  }
}

module.exports = {
  analyzeContent
};

