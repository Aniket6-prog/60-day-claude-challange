# ⚖️ Compare & Decide Builder

**Compare smarter. Decide confidently.**

Compare & Decide Builder is a responsive, research-oriented decision-support web application that helps users compare multiple options using measurable criteria and customizable weights.

Instead of relying on a simple “best option” recommendation, the application allows users to control what matters most and see how those priorities affect the final ranking.

## 🚀 Features

* Compare multiple options side-by-side
* Define measurable comparison criteria
* Customize criteria weights
* Live weighted-score calculation
* Automatic ranking of options
* Overall recommendation
* 0–10 normalized scoring
* Research methodology panel
* Visible source/citation section
* Identification of estimates and placeholders
* Research conflict notes
* Loading and empty-state handling
* Responsive design
* Export comparison results

## 🧠 Scoring Method

Each option receives a score from **0–10** for every criterion.

The final score is calculated using:

```text
Weighted Score = Σ(Criterion Score × Criterion Weight)
```

For example:

```text
Price        → 25%
Performance  → 25%
Battery      → 20%
Portability  → 15%
Display      → 10%
Build        → 5%
```

Changing any weight immediately changes the ranking.

## 🖥️ Example Comparison

The included demonstration compares laptops across:

* Price
* Performance
* Battery Life
* Portability
* Display Quality
* Build Quality

The interface presents the results through:

**Criteria → Scores → Weighted Ranking → Recommendation**

## 🔎 Research Transparency

A major goal of this project is to make comparison logic transparent.

The application includes:

* Source references
* Research methodology
* Data verification indicators
* Notes about conflicting sources
* Clear identification of estimates
* Explanation of how final scores are calculated

No unsupported number should be presented as verified research data.

## 🛠️ Tech Stack

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**

No React, Vue, Angular, Bootstrap, Tailwind, or external frontend libraries are required.

## 📱 Responsive Design

The interface is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

## 📂 Project Structure

```text
compare-decide-builder/
│
└── index.html
```

The entire application can run from a **single HTML file**.

## ▶️ How to Run

1. Clone the repository.
2. Open `index.html`.
3. Start comparing options.

No backend or package installation is required.

## 🎯 Future Improvements

* Real-time API-based data collection
* Automatic source verification
* More comparison categories
* User-created comparison templates
* Save and load comparisons
* Advanced data visualization
* Confidence scores for individual data points
* AI-assisted research summaries
* PDF report generation
* Multi-user comparison sharing

## 💡 Project Goal

The objective is to transform complex decisions into a structured and transparent process.

Instead of asking:

> **“Which option is the best?”**

Compare & Decide Builder asks:

> **“Which option is best for MY priorities, based on the available evidence?”**

---

**Built with HTML, CSS & JavaScript. ⚖️**

#JavaScript #WebDevelopment #Frontend #HTML #CSS #DataVisualization #UXDesign #DecisionSupport
