# Day 3 — Role-Based Prompting
**ABTalks 60-Day Claude AI Mastery Challenge**

---

## What is Role-Based Prompting?
Role-Based Prompting means telling Claude WHO to be before asking a question.
Instead of asking directly, you first assign a professional identity (role) to Claude.

**Formula:**
> "Act as a [ROLE]. You are an expert in [DOMAIN]. Help me with [TASK]."

---

## Why It Matters?
Without a role, Claude gives generic answers.
With a role, Claude thinks like a domain expert and gives specific, actionable answers.

---

## Experiment — Same Question, 3 Different Ways

**Question Asked:**
> "How should I price my new productivity software?"

---

### 1. Without Any Role
**Prompt:** "How should I price my new productivity software?"

**Output:**
Pricing depends on your costs, target market, and competitors.
Research similar tools and consider your value proposition.

**Observation:** Generic, surface-level, not very useful.

---

### 2. With Founder Persona
**Prompt:** "Act as an experienced SaaS Founder. How should I price my productivity software?"

**Output:**
Use value-based pricing. Launch with 3 tiers: $29/$99/$299/month.
Offer 20% annual discount to reduce churn.
Start with 14-day free trial, no credit card required.

**Observation:** Specific numbers, strategic thinking, founder mindset.

---

### 3. With Developer Persona
**Prompt:** "Act as a Senior Developer who has built SaaS products. How should I implement pricing?"

**Output:**
Use Stripe with feature flags per tier.
Implement usage metering for consumption-based pricing.
Make sure DB schema supports plan upgrades without data loss.
Start with 2 tiers max — complexity kills MVPs.

**Observation:** Technical focus, architecture-first thinking.

---

## Comparison Table

| Aspect       | No Role     | Founder      | Developer       |
|-------------|-------------|--------------|-----------------|
| Depth        | Surface     | Strategic    | Technical       |
| Focus        | General     | Business     | Architecture    |
| Actionable?  | No          | Yes          | Yes             |
| Numbers?     | No          | Yes          | Yes             |

---

## 3 Practical Benefits

1. **Tailored Expertise** — Domain-specific vocabulary and frameworks
2. **Actionable Depth** — Expert framing, fewer generic disclaimers
3. **Faster Decisions** — Right context = right answer, first try

---

## 5 Personas to Use

| Persona         | Best For                    |
|----------------|----------------------------|
| Developer       | Code, architecture          |
| Founder         | Strategy, pricing, growth   |
| Product Manager | Roadmaps, features, UX      |
| HR Manager      | Hiring, culture, policies   |
| Marketer        | Copy, campaigns, brand      |

---

## Key Learnings
- Same question gives totally different answers with different roles
- Role sets the vocabulary, depth, and focus of the response
- Founder thinks revenue; Developer thinks implementation
- Always be specific with the role for best results

---

## LinkedIn Post
Created a 1080x1080 LinkedIn post graphic with:
- Before/after comparison (Generic vs Expert answer)
- 5 persona cards
- The Role-Based Prompting formula
- ABTalks 60-Day Challenge branding

---

*Part of ABTalks 60-Day Claude AI Mastery Challenge*
*#60DayClaudeChallenge #ClaudeAI #PromptEngineering #AITools*
*@Anthropic @ABTalksOnAI @AnilBajpai*