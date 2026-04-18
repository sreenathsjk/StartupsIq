/**
 * lib/analyzer.js
 * AI processing pipeline using Claude claude-sonnet-4-20250514
 * Converts raw items → structured intelligence report
 */

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Prompt Templates ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a world-class startup intelligence analyst combining the analytical rigor of a top-tier VC (like Sequoia or a16z) with the tactical insight of a serial founder.

Your job is to transform raw news and data into structured, actionable intelligence that helps founders and investors make better decisions.

ANALYSIS PRINCIPLES:
- Think like a hedge fund analyst: every insight needs a "so what"
- Think like a founder: every trend needs a "what to build"  
- Think like a VC: every funding event needs "why now, why this team"
- Be specific, not generic. Avoid platitudes.
- Prioritize signal over noise. Less is more.
- For Indian ecosystem items: give cultural and regulatory context

OUTPUT RULES:
- Return ONLY valid JSON, no markdown, no explanation
- Every field must be substantive (2-3 sentences minimum for analysis fields)
- Signal scores are 1-10 (10 = highest signal)
- Urgency: "high" | "medium" | "low"
- Momentum: "rising" | "peaking" | "stable" | "fading"`;

const CLASSIFICATION_PROMPT = (items) => `
Analyze these ${items.length} raw news/data items and extract a structured intelligence report.

RAW ITEMS:
${items
  .slice(0, 80)
  .map(
    (item, i) => `[${i + 1}] SOURCE: ${item.source}
TITLE: ${item.title}
DESC: ${item.description?.slice(0, 300) || "N/A"}
URL: ${item.url}
DATE: ${item.publishedAt}`
  )
  .join("\n\n---\n\n")}

Extract and return a JSON object with this EXACT structure. Be thorough and analytical:

{
  "summary": "3-4 sentence executive brief like a hedge fund morning note. What's the dominant theme today? What should founders/investors pay attention to? What signal is strongest?",
  
  "startups": [
    {
      "name": "Company name",
      "stage": "Pre-seed|Seed|Series A|Series B|Growth|Public",
      "raised": "Amount or 'Undisclosed'",
      "sector": "Primary sector",
      "hq": "City, Country",
      "founded": "Year or 'Unknown'",
      "headline": "One crisp sentence about what happened",
      "insight": "Why this is notable — the signal behind the headline",
      "whyItMatters": "2-3 sentences: market implications, competitive dynamics, what changes because of this",
      "founderNote": "Specific traction metric, investor signal, or team note that makes this credible",
      "signalScore": 8,
      "url": "source url"
    }
  ],
  
  "aiTools": [
    {
      "name": "Tool name",
      "category": "Category (e.g. Code Generation, Voice AI, Research)",
      "pricing": "Pricing info",
      "availability": "Generally Available|Beta|Waitlist",
      "description": "What it does in 1-2 sentences",
      "useCase": "Most valuable use case for founders/builders",
      "deepDive": "2-3 sentences: technical differentiation, why this matters now, who wins",
      "bestFor": "Specific persona it's best for",
      "signalScore": 7,
      "url": "source url"
    }
  ],
  
  "funding": [
    {
      "company": "Company name",
      "amount": "Amount raised",
      "stage": "Funding stage",
      "sector": "Sector",
      "hq": "City, Country",
      "investors": "Lead investors if mentioned",
      "use": "What the capital will be used for (infer if not stated)",
      "insight": "One-line analyst take",
      "whyNow": "2-3 sentences: why this company is raising now, what tailwind they're riding, what this signals for the sector",
      "signalScore": 7,
      "url": "source url"
    }
  ],
  
  "indianApps": [
    {
      "name": "App/company name",
      "type": "Category",
      "org": "Parent org or startup name",
      "status": "New Launch|Update|Expansion|Funding|Regulatory",
      "headline": "What happened",
      "context": "India-specific market context — regulatory, cultural, or competitive",
      "opportunity": "2-3 sentences: what builder/founder opportunity this creates in India",
      "callToAction": "Specific, actionable recommendation for an Indian founder",
      "signalScore": 6,
      "url": "source url"
    }
  ],
  
  "trends": [
    {
      "trend": "Trend name (4-6 words max)",
      "signal": "One sentence evidence from today's data",
      "momentum": "rising|peaking|stable|fading",
      "signalScore": 8,
      "detail": "2-3 sentences full context: what's driving this, how fast is it moving, who's affected",
      "implication": "Specific founder/investor takeaway — what to do about this trend",
      "timeHorizon": "0-6 months|6-18 months|2-5 years"
    }
  ],
  
  "opportunities": [
    {
      "area": "Opportunity name (5-8 words)",
      "why": "Why this gap exists right now — the root cause",
      "urgency": "high|medium|low",
      "market": "TAM estimate and target segment",
      "competition": "Current competitive landscape — who's trying, who's failing, why",
      "buildWith": "Specific technical approach: tools, APIs, stack, timeline",
      "revenueModel": "How to monetize with specific price points",
      "signalScore": 8
    }
  ],
  
  "ideas": [
    {
      "title": "Startup idea name",
      "problem": "Specific problem, with a number if possible",
      "solution": "How to solve it with AI/tech",
      "businessModel": "Revenue model with price points",
      "targetMarket": "Specific ICP",
      "inspiration": "Which news item/trend inspired this",
      "techStack": "Core tech to build MVP",
      "mvpTimeline": "Realistic timeline to first paying customer",
      "signalScore": 7
    }
  ],

  "underratedOpportunities": [
    {
      "area": "The overlooked angle",
      "why": "Why most people are missing this",
      "insight": "The contrarian take",
      "actionable": "What to do in the next 30 days"
    }
  ],
  
  "agenticWorkflows": [
    {
      "workflow": "Workflow being automated",
      "who": "Who is building/deploying it",
      "status": "Early|Growing|Mainstream",
      "opportunity": "Adjacent opportunity not yet captured"
    }
  ],

  "metadata": {
    "totalItemsAnalyzed": ${items.length},
    "dominantTheme": "1-2 word theme of today",
    "topSource": "Most signal-rich source today",
    "indiaSignalStrength": "1-10 score for India ecosystem activity today"
  }
}

IMPORTANT: 
- Include 3-5 items per array section
- Prioritize items with real data (funding amounts, user numbers, specific companies)
- For Indian ecosystem, be extra detailed on market context
- Make "ideas" genuinely novel, not generic
- "underratedOpportunities" must be contrarian/non-obvious
- Return ONLY the JSON object, nothing else`;

// ─── Main AI analysis function ─────────────────────────────────────────────────
export async function analyzeWithAI(rawItems) {
  console.log(`[AI] Analyzing ${rawItems.length} items...`);
  const start = Date.now();

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: CLASSIFICATION_PROMPT(rawItems),
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const content = response.content[0]?.text || "";

    // Parse JSON — strip any accidental markdown fences
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const report = JSON.parse(cleaned);

    console.log(`[AI] Analysis complete in ${Date.now() - start}ms`);
    console.log(
      `[AI] Extracted: ${report.startups?.length} startups, ${report.funding?.length} funding, ${report.aiTools?.length} tools`
    );

    return {
      ...report,
      generatedAt: new Date().toISOString(),
      processingMs: Date.now() - start,
    };
  } catch (err) {
    console.error("[AI] Analysis failed:", err.message);
    throw new Error(`AI analysis failed: ${err.message}`);
  }
}

// ─── Incremental re-analysis (for partial refreshes) ──────────────────────────
export async function analyzeSection(items, section) {
  const sectionPrompts = {
    india: `Focus ONLY on Indian startup ecosystem items. Return JSON array of indianApps items.`,
    funding: `Focus ONLY on funding rounds. Return JSON array of funding items.`,
    ai: `Focus ONLY on AI tools and products. Return JSON array of aiTools items.`,
  };

  const prompt = sectionPrompts[section];
  if (!prompt) throw new Error(`Unknown section: ${section}`);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `${prompt}\n\nItems:\n${items
          .slice(0, 30)
          .map((i) => `${i.title}: ${i.description?.slice(0, 200)}`)
          .join("\n")}`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const text = response.content[0]?.text || "[]";
  return JSON.parse(text.replace(/```json?/g, "").replace(/```/g, "").trim());
}
