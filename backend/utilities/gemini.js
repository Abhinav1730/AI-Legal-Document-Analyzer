import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

if (!GEMINI_API_KEY) {
  console.warn("Gemini API key not found. Please set GEMINI_API_KEY environment variable.");
}

export function chunkText(text, chunkSize = 2000, overlap = 100) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + chunkSize);
    chunks.push(text.slice(i, end));
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks;
}

export async function callGeminiModel(prompt) {
  if (!genAI) {
    throw new Error("Gemini API not initialized. Please check your API key.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

export function parseGeminiOutput(output) {
  if (!output) return [];
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(output);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    // If not JSON, try to extract JSON from the response
    const jsonMatch = output.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.log("Could not parse JSON from Gemini response:", parseError);
      }
    }
  }
  
  // Fallback: return as raw text
  return [{
    type: "raw",
    snippet: output.trim(),
    confidence: null
  }];
}

/**
 * Extract legal clauses from text using Google Gemini API
 * Returns array of annotations {type, snippet, start, end, confidence}
 */
// Enhanced fallback analysis using comprehensive keyword matching
function fallbackAnalysis(text) {
  const keywords = {
    'termination & expiry': {
      words: ['terminate', 'termination', 'end', 'expire', 'cancel', 'discontinue', 'breach', 'default', 'notice period', 'renewal'],
      subcategories: ['contract termination', 'expiration dates', 'breach provisions', 'notice periods']
    },
    'payment & financial terms': {
      words: ['payment', 'pay', 'fee', 'cost', 'price', 'amount', 'due', 'invoice', 'billing', 'refund', 'penalty', 'late payment', 'currency'],
      subcategories: ['payment schedules', 'fees and costs', 'late penalties', 'refund policies']
    },
    'liability & risk allocation': {
      words: ['liability', 'liable', 'responsible', 'damages', 'loss', 'injury', 'insurance', 'force majeure', 'risk', 'limitation'],
      subcategories: ['limitation of liability', 'damage provisions', 'insurance requirements', 'force majeure']
    },
    'confidentiality & privacy': {
      words: ['confidential', 'secret', 'proprietary', 'private', 'non-disclosure', 'data protection', 'privacy', 'trade secret'],
      subcategories: ['non-disclosure', 'confidential information', 'data protection', 'trade secrets']
    },
    'governing law & jurisdiction': {
      words: ['governing law', 'jurisdiction', 'legal', 'court', 'law', 'venue', 'regulatory', 'compliance', 'international'],
      subcategories: ['applicable law', 'court venue', 'regulatory compliance', 'international law']
    },
    'indemnification & protection': {
      words: ['indemnify', 'indemnification', 'hold harmless', 'defend', 'protection', 'third-party', 'mutual'],
      subcategories: ['hold harmless', 'defense obligations', 'third-party claims', 'mutual indemnification']
    },
    'dispute resolution': {
      words: ['dispute', 'arbitration', 'mediation', 'resolution', 'conflict', 'litigation', 'escalation', 'alternative'],
      subcategories: ['arbitration procedures', 'mediation requirements', 'litigation processes', 'escalation procedures']
    },
    'performance & obligations': {
      words: ['performance', 'obligation', 'service level', 'delivery', 'quality', 'compliance', 'standard', 'requirement'],
      subcategories: ['service level agreements', 'performance standards', 'delivery requirements', 'compliance obligations']
    },
    'intellectual property': {
      words: ['intellectual property', 'ip', 'patent', 'trademark', 'copyright', 'license', 'ownership', 'rights', 'work-for-hire'],
      subcategories: ['IP ownership', 'license terms', 'patent provisions', 'copyright protection']
    },
    'warranties & representations': {
      words: ['warranty', 'warranties', 'representation', 'guarantee', 'assurance', 'disclaimer', 'truth', 'accuracy'],
      subcategories: ['warranties provided', 'representations made', 'guarantees', 'disclaimers']
    }
  };

  const annotations = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  for (const [type, data] of Object.entries(keywords)) {
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      const matchedWords = data.words.filter(word => lowerSentence.includes(word));
      
      if (matchedWords.length > 0) {
        const start = text.indexOf(sentence);
        if (start !== -1) {
          // Determine subcategory based on matched words
          let subcategory = data.subcategories[0];
          if (matchedWords.some(word => ['breach', 'default'].includes(word))) {
            subcategory = 'breach provisions';
          } else if (matchedWords.some(word => ['late payment', 'penalty'].includes(word))) {
            subcategory = 'late penalties';
          } else if (matchedWords.some(word => ['force majeure', 'insurance'].includes(word))) {
            subcategory = 'force majeure';
          }

          annotations.push({
            type,
            snippet: sentence.trim(),
            start,
            end: start + sentence.length,
            confidence: 0.7,
            subcategory: subcategory
          });
        }
      }
    }
  }

  return annotations;
}

export default async function extractClausesFromText(fullText, lang = "en") {
  if (!fullText || !fullText.trim()) return [];
  
  // Increased text limit for Gemini 2.5 Flash (more powerful model)
  const maxTextLength = 10000; // 10KB limit for Gemini 2.5 Flash
  if (fullText.length > maxTextLength) {
    console.warn(`Text too long (${fullText.length} chars), truncating to ${maxTextLength} chars`);
    fullText = fullText.substring(0, maxTextLength);
  }

  console.log(`Processing text with Gemini API (${fullText.length} chars)...`);

  try {
    // Comprehensive legal analysis prompt for Gemini 2.5 Flash
    const prompt = `You are an expert legal document analyzer. Perform a comprehensive analysis of the following legal document and extract ALL relevant legal clauses, terms, and provisions.

ANALYSIS CATEGORIES:

1. TERMINATION & EXPIRY
   - Contract termination conditions
   - Expiration dates and renewal terms
   - Breach and default provisions
   - Notice periods for termination

2. PAYMENT & FINANCIAL TERMS
   - Payment schedules and amounts
   - Fees, costs, and charges
   - Late payment penalties
   - Currency and payment methods
   - Refund and cancellation policies

3. LIABILITY & RISK ALLOCATION
   - Limitation of liability clauses
   - Damage and loss provisions
   - Insurance requirements
   - Force majeure clauses
   - Risk allocation between parties

4. CONFIDENTIALITY & PRIVACY
   - Non-disclosure agreements
   - Confidential information handling
   - Data protection provisions
   - Trade secret protection
   - Privacy policy references

5. GOVERNING LAW & JURISDICTION
   - Applicable law and jurisdiction
   - Court venue and process
   - Legal system references
   - Regulatory compliance
   - International law considerations

6. INDEMNIFICATION & PROTECTION
   - Hold harmless provisions
   - Defense obligations
   - Indemnity scope and limits
   - Third-party claims
   - Mutual indemnification

7. DISPUTE RESOLUTION
   - Arbitration procedures
   - Mediation requirements
   - Litigation processes
   - Alternative dispute resolution
   - Escalation procedures

8. PERFORMANCE & OBLIGATIONS
   - Service level agreements
   - Performance standards
   - Delivery requirements
   - Quality specifications
   - Compliance obligations

9. INTELLECTUAL PROPERTY
   - IP ownership and rights
   - License terms and conditions
   - Patent and trademark provisions
   - Copyright protection
   - Work-for-hire clauses

10. WARRANTIES & REPRESENTATIONS
    - Warranties provided
    - Representations made
    - Guarantees and assurances
    - Disclaimers and limitations
    - Truth and accuracy statements

INSTRUCTIONS:
- Extract ALL relevant clauses, not just obvious ones
- Include context and surrounding text
- Provide high confidence scores (0.7-1.0) for clear clauses
- Lower confidence (0.4-0.6) for implied or indirect clauses
- Be thorough and comprehensive
- Look for both explicit and implicit legal terms

Return format: [{"type": "category_name", "snippet": "exact text excerpt with context", "confidence": 0.0-1.0, "subcategory": "specific aspect"}]

Text to analyze:
${fullText}

Comprehensive JSON analysis:`;

    const output = await callGeminiModel(prompt);
    const parsed = parseGeminiOutput(output);
    
    if (Array.isArray(parsed) && parsed.length > 0) {
      const annotations = [];
      for (const item of parsed) {
        if (!item || !item.snippet) continue;
        
        const type = item.type || "unknown";
        const snippet = String(item.snippet).trim();
        
        // Find start index in original text
        let start = fullText.indexOf(snippet);
        if (start === -1) {
          // Try normalized search
          const normSnippet = snippet.replace(/\s+/g, " ").slice(0, 200);
          const normalizedFull = fullText.replace(/\s+/g, " ");
          start = normalizedFull.indexOf(normSnippet);
        }
        
        const end = start !== -1 ? start + snippet.length : null;
        annotations.push({
          type,
          snippet,
          start: start !== -1 ? start : null,
          end,
          confidence: typeof item.confidence === "number" ? item.confidence : 0.8
        });
      }
      
      console.log(`Gemini analysis completed. Found ${annotations.length} annotations.`);
      return annotations;
    }
  } catch (error) {
    console.error(`Gemini analysis failed:`, error.message);
    console.log(`Falling back to keyword-based analysis...`);
    
    // Use fallback analysis if Gemini fails
    const fallbackResults = fallbackAnalysis(fullText);
    console.log(`Fallback analysis completed. Found ${fallbackResults.length} annotations.`);
    return fallbackResults;
  }
  
  // Final fallback
  console.log(`Using fallback keyword analysis...`);
  return fallbackAnalysis(fullText);
}
