# 🧠 Personal AI Playbook

> A local-first AI workflow builder for creating, customizing, reusing, and improving AI prompts.

Personal AI Playbook is designed around one idea:

**Don't just collect prompts. Build reusable AI systems.**

Instead of maintaining hundreds of disconnected prompts, users can create modular workflows from reusable building blocks and turn ordinary prompts into iterative improvement loops.

## ✨ Features

### 🏠 Dashboard

Get a clear overview of your AI workflows:

* Total workflows
* Favorites
* Recently used workflows
* Estimated time saved
* Workflow categories
* Recent workflows
* Quick-start actions

A persistent explainer makes the application's purpose clear even for first-time users.

---

## 🧩 Prompt Builder

Build reusable prompts using modular building blocks.

Available blocks include:

* **Role** — defines the expertise and perspective of the AI
* **Objective** — defines the desired outcome
* **Context** — provides background information
* **Constraints** — defines rules and limitations
* **Reasoning Strategy** — provides a structured approach to solving the task
* **Output Format** — defines the structure of the final response
* **Tone** — controls communication style
* **Examples** — demonstrates the desired result
* **Quality Checks** — adds a final verification layer

Every block explains:

1. What it does
2. Why it matters
3. How it contributes to the workflow

The complete prompt is generated in a live preview.

---

## 🔄 Loop Builder

Convert a normal prompt into an autonomous improvement workflow.

Users define:

* Goal
* Evaluation criteria
* Improvement strategy
* Stop conditions
* Safety rules

The generated loop follows a structured process:

```text
Produce
   ↓
Evaluate
   ↓
Identify weaknesses
   ↓
Improve
   ↓
Re-evaluate
   ↓
Stop or repeat
```

This makes iterative AI workflows easier to design and reuse.

---

## 📚 Workflow Management

Users can:

* Create workflows
* Edit workflows
* Duplicate workflows
* Favorite workflows
* Search workflows
* Filter by category
* Copy workflows
* Delete workflows
* View recently used workflows

Everything is stored locally in the browser.

---

## 🧰 Built-in Templates

Starter workflow systems include:

* Research & Insight Synthesizer
* LinkedIn Content System
* Study Guide Generator
* Coding Debug Assistant
* Career Application Helper
* Meeting → Action Plan

Templates are starting points rather than fixed prompts.

Users can customize their building blocks before saving the final workflow.

---

## 💾 Local-first Architecture

Personal AI Playbook requires:

* No backend
* No database
* No authentication
* No external API
* No npm
* No framework
* No external JavaScript library

Workflow data is stored using:

```javascript
localStorage
```

Users can also export their data as JSON and import it later.

---

## ⌨️ Keyboard Shortcuts

| Shortcut   | Action            |
| ---------- | ----------------- |
| `Ctrl + K` | Focus search      |
| `Ctrl + N` | Create new prompt |
| `Esc`      | Close help        |

---

## 🎨 UX Principles

The interface was designed around several principles:

### 1. Explainability

Users should understand what every building block does before adding it.

### 2. Reusability

A workflow should be useful beyond one conversation.

### 3. Modularity

Small building blocks can be combined into many different workflows.

### 4. Iteration

AI output should be evaluated and improved instead of blindly accepted.

### 5. Local-first privacy

The application works entirely inside the browser.

### 6. Progressive complexity

Users can start with a simple prompt and gradually build more sophisticated AI systems.

---

## 🛠️ Tech Stack

```text
HTML5
CSS3
Vanilla JavaScript
LocalStorage
JSON Import / Export
```

No frameworks or external dependencies are required.

---

## 🚀 Running Locally

Simply download:

```text
personal-ai-playbook.html
```

Then open it directly in any modern browser.

No installation is required.

---

## 📁 Project Structure

```text
personal-ai-playbook.html
```

The entire application is intentionally contained inside one file.

This makes it:

* Portable
* Easy to share
* Easy to inspect
* Easy to modify
* Offline-friendly
* Beginner-friendly

---

## 🎯 Future Improvements

Possible future versions could add:

* AI API integrations
* Cloud synchronization
* User authentication
* Workflow analytics
* Prompt version history
* Workflow sharing
* Team workspaces
* AI-generated workflow recommendations
* Model-specific prompt optimization
* Workflow performance scoring
* Automatic prompt testing
* Multi-model comparison

---

## 💡 Core Philosophy

Traditional prompt libraries answer:

> "What prompt should I use?"

Personal AI Playbook asks:

> **"How can I build a reusable AI system for this type of work?"**

That shift—from individual prompts to reusable workflows—is the central idea behind this project.

---

## 📜 License

Use, modify, and extend this project for learning and experimentation.
::: 
