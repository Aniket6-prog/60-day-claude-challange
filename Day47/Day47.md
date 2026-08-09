# 🧠 Content Intelligence Studio

**Content Intelligence Studio** is an AI-powered content consultant that analyzes content through a dynamically designed multi-stage reviewer workflow.

Instead of using fixed scoring rules or canned feedback, the application uses Claude to design specialized reviewers based on the submitted content, platform, objective, and available performance data.

## 🚀 Features

* 📊 AI-generated content health score
* 🧠 Dynamic multi-stage AI reviewer workflow
* 🎯 Platform-specific content analysis
* 💬 Engagement and audience analysis
* 🔍 Strengths and weaknesses detection
* 💡 Missed opportunity identification
* ✍️ AI-powered content rewriting
* 🪝 Alternative hooks and titles
* 📈 AI-estimated performance potential
* ✅ Publishing checklist
* 🔄 Before-vs-after comparison
* 📋 Comprehensive final report
* 🖼️ Image and screenshot analysis
* 📑 Analytics/performance data analysis
* ⚡ Live reviewer activity log
* 🌙 Premium responsive dark-mode interface
* 🛡️ Error handling and graceful retry states

## 🧩 AI Reviewer Architecture

The system dynamically creates a reviewer team appropriate for the submitted content.

Example reviewer roles include:

* Platform Fit Reviewer
* Engagement Strategist
* Psychology Reviewer
* Content Quality Analyst
* Growth Coach
* Final Synthesizer

Each reviewer receives a specialized system prompt and independently evaluates the content from its assigned perspective.

The final synthesizer combines the specialist insights into a comprehensive content intelligence report.

## 🔄 Workflow

```text
User Input
    ↓
Content + Analytics + Supporting Files
    ↓
AI Workflow Architect
    ↓
Specialized Reviewer Team
    ↓
Parallel/Sequential AI Analysis
    ↓
Final Synthesis
    ↓
Content Score
    ↓
Strategic Recommendations
    ↓
Rewritten Content
    ↓
Performance Potential
    ↓
Executive Report
```

## 🛠️ Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* Claude Messages API
* Claude Vision capabilities for image inputs
* Browser File API
* Fetch API

## 🎯 Current Use Case

The current experience is optimized for:

**Content Type:** Social Media Post
**Platform:** LinkedIn
**Primary Goal:** Improve Engagement
**Review Style:** Light Feedback
**Desired Outcome:** Improve Content Quality

The architecture can be extended to other platforms and content types.

## 📂 Project Structure

```text
content-intelligence-studio/
│
└── content_intelligence_studio.html
```

The project is intentionally implemented as a **single self-contained HTML file**.

No React, Vue, Angular, Bootstrap, Tailwind, npm packages, or external UI libraries are required.

## 🔐 API Configuration

The application communicates with the Anthropic Messages API directly from the browser.

You need an Anthropic API key to perform live analysis.

The application does not embed a permanent API key in the source code.

> For production deployment, a backend proxy is recommended so API credentials are never exposed to the browser.

## ⚠️ Important

The quality of the generated analysis depends on the content supplied, available analytics, and the AI model's interpretation.

Performance predictions are **AI estimates**, not guarantees.

## 🌟 Why I Built This

Most content tools provide isolated metrics.

Content Intelligence Studio is designed around a different idea:

> **Content optimization should feel like having a complete AI strategy team reviewing your work before you publish.**

The project combines:

**AI Agents + Prompt Engineering + Content Strategy + Behavioral Psychology + UX Design + Frontend Engineering**

## 🔮 Future Improvements

* Multi-platform support for X, Instagram, YouTube and blogs
* Historical content benchmarking
* Content library
* A/B testing workflow
* Automated analytics ingestion
* Trend-aware recommendations
* Creator profile intelligence
* Team collaboration
* Scheduled optimization
* Backend API proxy
* Persistent reviewer memory
* Automated content experiments

---

### ⭐ If you find the project interesting

Give the repository a ⭐ and feel free to contribute ideas for improving the AI reviewer architecture.

**Built with AI, strategy, and frontend engineering.**
