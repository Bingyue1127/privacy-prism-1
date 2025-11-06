// Professional prompts for each of the 6 privacy analysis dimensions

const dimensions = {
  exposure: {
    name: 'Exposure',
    prompt: `Analyze the following content for EXPOSURE risks - whether it contains identifiable personal information.

Check for:
- Direct personal identifiers (names, phone numbers, email addresses, physical addresses)
- Location markers or geographic information that could identify someone
- Workplace or institutional affiliations
- Social media handles or online identities
- Any information that could lead to real identity tracing or privacy breaches

Provide a detailed analysis of what personal information is exposed and the potential risk level.

Content to analyze:
`
  },
  
  inference: {
    name: 'Inference',
    prompt: `Analyze the following content for INFERENCE risks - whether sensitive information about the author can be inferred.

Check for:
- Emotional states or psychological profile indicators
- Occupation, professional status, or career trajectory clues
- Income level or financial situation hints
- Health conditions or medical information
- Location patterns or living situation
- Lifestyle choices, habits, or personal preferences
- Any contextual clues that could reveal private attributes through deduction

Provide a detailed analysis of what can be inferred about the author and the sensitivity of these inferences.

Content to analyze:
`
  },
  
  audience: {
    name: 'Audience & Consequences',
    prompt: `Analyze the following content for AUDIENCE & CONSEQUENCES risks - who might see this and what could happen.

Evaluate:
- Potential audiences who could access or be exposed to this content
- Intended vs. unintended audience reach
- Possible consequences if widely disseminated (social judgment, reputation damage, discrimination)
- Emotional impact on various stakeholders
- Risk of misinterpretation or identity confusion
- Privacy violations that could result from different audiences seeing this
- Professional, personal, or legal ramifications

Provide a detailed analysis of potential audiences and consequences.

Content to analyze:
`
  },
  
  platforms: {
    name: 'Platforms & Rules',
    prompt: `Analyze the following content for PLATFORM & RULES risks - how platform policies could amplify privacy concerns.

Examine:
- How platform data collection mechanisms might capture and use this information
- Content management rules that could affect privacy (moderation, retention, archiving)
- Data storage duration and deletion policies
- Legal and regulatory compliance issues (GDPR, CCPA, etc.)
- Terms of service implications
- Platform sharing or recommendation algorithms that could spread the content
- Third-party access or data sharing practices

Provide a detailed analysis of platform-related privacy risks.

Content to analyze:
`
  },
  
  amplification: {
    name: 'Amplification',
    prompt: `Analyze the following content for AMPLIFICATION risks - potential for viral spread or increased exposure.

Assess:
- Viral potential (likelihood of being shared, forwarded, or reposted)
- Platform mechanisms that could amplify reach (recommendations, trending, hashtags)
- User behaviors that increase spread (screenshot sharing, cross-posting)
- Network effects and cascade potential
- Features that make content easy to share
- Risk escalation through amplification
- How amplification could transform the privacy impact

Provide a detailed analysis of amplification risks and potential spread patterns.

Content to analyze:
`
  },
  
  manipulability: {
    name: 'Manipulability',
    prompt: `Analyze the following content for MANIPULABILITY risks - susceptibility to distortion or misuse.

Check for:
- How easily the content could be taken out of context
- Potential for selective editing or quote mining
- Risk of deepfake or synthetic media creation
- Vulnerability to tampering, alteration, or falsification
- Possibility of "secondary creation" with malicious intent
- Reinterpretation or framing that changes meaning
- Potential for weaponization or harassment
- How modifications could harm the original author

Provide a detailed analysis of manipulability risks and potential misuse scenarios.

Content to analyze:
`
  }
};

// Combined prompt for Mode A (single API call analyzing all dimensions)
const getCombinedPrompt = (content) => {
  return `You are a privacy analysis expert. Analyze the following content across six critical privacy dimensions. For each dimension, provide a thorough and professional assessment.

**CONTENT TO ANALYZE:**
${content}

---

Please provide your analysis in the following JSON format:

{
  "exposure": "Detailed analysis of exposure risks...",
  "inference": "Detailed analysis of inference risks...",
  "audience": "Detailed analysis of audience and consequences...",
  "platforms": "Detailed analysis of platform-related risks...",
  "amplification": "Detailed analysis of amplification potential...",
  "manipulability": "Detailed analysis of manipulability risks..."
}

**DIMENSIONS TO ANALYZE:**

1. **Exposure**: Check for identifiable personal information (names, phone numbers, addresses, location markers, workplace, social media handles). Identify what personal information is exposed.

2. **Inference**: Analyze what can be inferred about the author (emotions, occupation, income, health, location, lifestyle). Even without direct disclosure, what private attributes could be deduced?

3. **Audience & Consequences**: Evaluate potential audiences and consequences if disseminated (social judgment, reputation damage, privacy violations, emotional impact, misinterpretation).

4. **Platforms & Rules**: Examine how platform data collection and content management rules could amplify privacy risks (legal compliance, storage duration, third-party access).

5. **Amplification**: Assess viral potential and how platform mechanisms or user behaviors could increase spread (sharing, forwarding, trending, network effects).

6. **Manipulability**: Analyze susceptibility to distortion, tampering, or falsification (out-of-context use, selective editing, deepfakes, malicious reinterpretation).

Provide comprehensive, professional analysis for each dimension. Be specific and cite examples from the content.`;
};

// Get individual prompt for Mode B (separate API calls)
const getIndividualPrompt = (dimensionKey, content) => {
  const dimension = dimensions[dimensionKey];
  return dimension.prompt + content;
};

module.exports = {
  dimensions,
  getCombinedPrompt,
  getIndividualPrompt
};

