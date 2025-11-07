// In backend/server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['https://privacy-prism-1.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// DEBUGGING LOG: Check Vercel logs to see if this appears
console.log("Privacy Prism Serverless Function Loaded");

// Health check endpoint
app.post('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    model: 'gpt-4o-mini',
    mode: 'A',
    openaiKey: process.env.OPENAI_API_KEY ? 'Set' : 'NOT SET'
  });
});


// ========================================
// Your main API route
// ========================================
  app.all('/api/analyze/:dimension', async (req, res) => {
    try{
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dimension } = req.params;
  const { input, type } = req.body;



    console.log(`[${dimension}] Analysis request received`);

    const validDimensions = ['exposure', 'inference', 'audience', 'platforms', 'amplification', 'manipulability'];
    if (!validDimensions.includes(dimension)) {
      return res.status(400).json({ 
        error: 'Invalid dimension. Must be one of: ' + validDimensions.join(', ')
      });
    }

    if (!input || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: input and type' 
      });
    }

    const { OpenAI } = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompts = {
      exposure: `Analyze this content for EXPOSURE risks: Identify explicit personal details (names, phone numbers, addresses, workplaces, schedules, locations) that directly reveal the user's identity. Content: "${input}"`,
      inference: `Analyze this content for INFERENCE risks: Identify subtle cues (tone, habits, interests, timing, location hints) that allow algorithms to infer hidden attributes (emotions, income, health, relationships). Content: "${input}"`,
      audience: `Analyze this content for AUDIENCE & CONSEQUENCES risks: Identify potential unintended audiences (employers, institutions, unknown viewers) and possible reputational effects. Content: "${input}"`,
      platforms: `Analyze this content for PLATFORMS & RULES risks: Assess how platform algorithms and policies affect content visibility, circulation, and privacy risk. Content: "${input}"`,
      amplification: `Analyze this content for AMPLIFICATION risks: Evaluate potential for viral spread through algorithms, public opinion, or group sharing. Content: "${input}"`,
      manipulability: `Analyze this content for MANIPULABILITY risks: Assess how the content could be reframed, edited, taken out of context, or combined with other data to alter meaning. Content: "${input}"`
    };

    const prompt = prompts[dimension] || prompts.exposure;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a privacy analysis expert specializing in ${dimension}. Analyze the given content and provide a comprehensive assessment. Be concise but thorough.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.1
    });

    const result = completion.choices[0].message.content;
    
    console.log(`[${dimension}] Analysis completed successfully`);
    
    res.json({
      content: result,
      dimension: dimension,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${req.params.dimension}] Analysis error:`, error);
    res.status(500).json({ 
      error: `Failed to analyze ${req.params.dimension}:${error.message}` 
    });
  }
});



// ========================================
// PDF generation endpoint - CORRECTED VERSION
// ========================================
app.post('/api/generate-pdf', async (req, res) => {
  try {
    // CORRECTED: Match the data structure from your app.js
    const { content, results, timestamp, footerText } = req.body;
    
    console.log('PDF generation request received');
    
    if (!content || !results) {
      console.error('Missing required data: content or results');
      return res.status(400).json({ 
        error: 'Missing content or results in request body' 
      });
    }

    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();
    
    let yPosition = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    
    const addText = (text, fontSize = 12, isBold = false) => {
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      doc.setFontSize(fontSize);
      
      const lines = doc.splitTextToSize(text, doc.internal.pageSize.width - 2 * margin);
      
      for (let i = 0; i < lines.length; i++) {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(lines[i], margin, yPosition);
        yPosition += lineHeight;
      }
      yPosition += 2;
    };
    
    addText('PRIVACY PRISM', 20, true);
    addText('Privacy Risk Analysis Report', 16, true);
    addText(`Generated on ${timestamp || new Date().toLocaleString()}`, 10);
    yPosition += 10;
    
    addText('Analyzed Content', 14, true);
    addText(content, 12);
    yPosition += 5;
    
    const dimensions = [
      { key: 'exposure', title: '01 EXPOSURE' },
      { key: 'inference', title: '02 INFERENCE' },
      { key: 'audience', title: '03 AUDIENCE & CONSEQUENCES' },
      { key: 'platforms', title: '04 PLATFORMS & RULES' },
      { key: 'amplification', title: '05 AMPLIFICATION' },
      { key: 'manipulability', title: '06 MANIPULABILITY' }
    ];
    
    dimensions.forEach(dim => {
      const result = results[dim.key]; // CORRECTED: Use results object
      if (result && result.length > 0) {
        addText(dim.title, 14, true);
        addText(result, 11);
        yPosition += 3;
      }
    });
    
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
    
    addText('About Privacy Prism', 14, true);
    addText(footerText || 'This report was generated by Privacy Prism, a privacy risk analysis tool.', 10);
    
    yPosition += 10;
    addText('DISCLAIMER: This platform provides AI-powered privacy risk assessments for educational and informational purposes only. All analysis results should be reviewed by qualified privacy professionals before making critical decisions.', 9);
    
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.text('© 2025 Privacy Prism. All rights reserved.', margin, footerY);
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    console.log('PDF generated successfully');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="privacy-analysis.pdf"');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
  }
});


module.exports = app;
