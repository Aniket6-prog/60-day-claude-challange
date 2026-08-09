# 🤖 Autonomous Agent Studio

**Autonomous Agent Studio** is a single-page AI orchestration application that demonstrates how a multi-agent system can autonomously research, create, evaluate, critique, improve, remember, and finalize AI-generated blog content.

The system is designed for **AI professionals** and focuses on creating blog articles about **emerging AI developments** with the highest possible factual accuracy.

## 🎯 Project Goal

Most AI content systems follow a simple pattern:

**Prompt → Generate → Done**

Autonomous Agent Studio uses a different approach:

**Plan → Research → Draft → Evaluate → Critique → Improve → Remember → Evaluate Again**

The system continues this loop dynamically until a defined stopping condition is reached.

## 🧠 Multi-Agent Architecture

The application automatically designs and orchestrates the following agents:

| Agent              | Responsibility                                                 |
| ------------------ | -------------------------------------------------------------- |
| **Planner**        | Defines objectives, scope, research strategy, and content plan |
| **Executor**       | Researches the topic and gathers evidence                      |
| **Evaluator**      | Evaluates factual accuracy against the rubric                  |
| **Critic**         | Identifies unsupported claims, contradictions, and weaknesses  |
| **Improver**       | Revises the draft using evaluation and critique                |
| **Memory Manager** | Stores useful knowledge, patterns, and lessons                 |
| **Safety Monitor** | Checks safety, compliance, and potential risks                 |
| **Final Reviewer** | Performs the final review before publication                   |

## 🔄 Real Autonomous Loop

The core workflow is not a fixed sequence.

```text
                    ┌─────────────────────┐
                    │       Planner       │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │      Executor       │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
              ┌────→│      Evaluator      │
              │     └──────────┬──────────┘
              │                ↓
              │     ┌─────────────────────┐
              │     │       Critic        │
              │     └──────────┬──────────┘
              │                ↓
              │     ┌─────────────────────┐
              │     │      Improver       │
              │     └──────────┬──────────┘
              │                ↓
              │     ┌─────────────────────┐
              │     │   Memory Manager    │
              │     └──────────┬──────────┘
              │                ↓
              └──────────── Evaluator
                               │
                         Stop condition?
                         /            \
                       No              Yes
                       ↓                ↓
                 Continue loop    Final Reviewer
                                      ↓
                              Publish / Human Review
```

Each iteration receives the state from the previous round.

The **Evaluator** receives the current draft and rubric.

The **Critic** receives the evaluation.

The **Improver** receives both the previous evaluation and critique before producing the next version.

A running history records:

* Accuracy score
* Evaluation
* Critique
* Draft
* Improvement delta
* Memory updates
* Stop-condition status

## 🎯 Stop Conditions

The system checks stopping conditions after every evaluation.

### 1. Plateau

The system stops if accuracy improves by **less than 2% for two consecutive rounds**.

### 2. Accuracy Threshold

The target is:

**100% factual accuracy**

If the target is reached, the system proceeds to the Final Reviewer and can automatically publish.

### 3. Hard Safety Cap

A hard iteration limit exists only as a **safety fallback** to prevent uncontrolled execution.

The system does not use a predetermined round count as its intended stopping mechanism.

## 📰 Content Workflow

The configured workflow focuses on:

**Domain:** AI & Emerging Technology
**Trigger:** Emerging AI developments
**Audience:** AI professionals
**Content:** Blog articles
**Evidence standard:** Multiple independent sources
**Optimization goal:** Maximum factual accuracy

## 📊 Dashboard

The interface provides real-time visibility into the autonomous execution process.

### Live Monitoring

* Active agent
* Current status
* Open-ended round indicator
* API calls
* Retry count
* Execution time
* Activity log

### Iteration History

Each round displays:

* Accuracy score
* Score delta
* Draft
* Critique
* Evaluation
* Stop-condition result

### Agent Visualization

The UI represents the workflow as a real cycle rather than a simple linear pipeline.

The **Improver → Evaluator** return path makes the autonomous refinement loop visible.

## 🛡️ Human Review Safety

Automatic publication is allowed only after the system reaches the required accuracy threshold.

If the system cannot continue making meaningful progress and reaches the plateau condition, the content is saved for **human review** rather than being automatically published.

## 🛠️ Technology

* HTML5
* CSS3
* Vanilla JavaScript
* Claude API
* Fetch API
* Multi-agent orchestration
* Iterative evaluation
* Runtime state management
* Retry handling
* Error recovery

No React, Vue, Angular, Bootstrap, Tailwind, or external JavaScript libraries are required.

## 🚀 Running the Project

1. Download the HTML file.
2. Open it in a modern browser.
3. Enter your Anthropic API key.
4. Provide an emerging AI news event.
5. Start the autonomous run.
6. Monitor the agents as they research, evaluate, critique, and improve the article.

> **Note:** The Claude API requires valid authentication. The browser application therefore expects an API key rather than pretending that the API can be called anonymously.

## 💡 What This Project Demonstrates

This project explores an important shift in AI application design:

> **From AI that responds to AI that operates.**

Instead of asking a model to generate an answer once, the system creates a controlled environment where multiple specialized agents collaborate and repeatedly improve an artifact.

The important engineering concepts include:

* Agent specialization
* State propagation
* Iterative self-improvement
* Model-based evaluation
* Memory management
* Dynamic stopping conditions
* Safety fallbacks
* Human-in-the-loop recovery
* Observable agent workflows

## 🔮 Future Improvements

Potential extensions include:

* Real-time AI news monitoring
* RSS/API-based source discovery
* Automated source credibility scoring
* Citation verification
* Database-backed long-term memory
* Scheduled autonomous runs
* CMS integrations
* WordPress publishing
* LinkedIn publishing
* X publishing
* Human approval dashboard
* Multi-model orchestration
* Cost-aware agent routing
* Agent performance analytics
* Persistent workflow history
* Source conflict detection

## 📌 Project Status

**Prototype → Agentic AI Workflow**

Built to explore practical patterns for autonomous multi-agent systems and reliable AI content generation.
