# 📊 UML Maintainability Analysis Portal

An **AI-assisted software architecture analysis platform** that evaluates the **maintainability of UML-based software designs** by comparing **patternless architectures** with **design pattern–based architectures** using software quality metrics.

---

# 🧠 Project Overview

Modern software systems rely heavily on maintainable architectures to ensure scalability, extensibility, and reduced technical debt.

The **UML Maintainability Analysis Portal** provides an intelligent environment where developers and researchers can:

- Upload UML architecture diagrams
- Analyze software maintainability metrics
- Compare patternless architecture vs pattern-based architecture
- Compute weighted maintainability scores
- Visualize architectural quality using interactive dashboards
- Automatically generate academic conclusions

The system identifies **which software architecture is more maintainable**.

---

# 🎯 Project Objectives

The platform aims to:

- Evaluate software architecture maintainability
- Compare design pattern implementations
- Provide metric-driven architectural insights
- Support software engineering research and analysis
- Help developers choose the best architectural design

---

# 🏗️ System Architecture

```
User
 │
 ▼
Frontend (React + Vite)
 │
 ▼
Backend API (Node.js + Express)
 │
 ▼
AI Analysis Module
 │
 ▼
Maintainability Metrics Engine
 │
 ▼
Visualization Dashboard
```

---

# ⚙️ Technology Stack

## Frontend

- React
- Vite
- Framer Motion
- Recharts
- CSS

## Backend

- Node.js
- Express.js
- Multer (File Upload Handling)

## AI Analysis Module

A **simulated AI system** that analyzes UML diagrams and generates maintainability metrics.

---

# 📐 UML Diagram Types Analyzed

## Patternless UML

- Class Diagrams
- Component Diagrams
- Package Diagrams

## Pattern-Based UML

Design patterns implemented in UML architecture:

- Singleton Pattern
- Factory Pattern
- Observer Pattern
- Strategy Pattern
- Adapter Pattern

---

# 📏 Maintainability Metrics

The system evaluates software architecture using the following metrics.

### 1️⃣ Coupling
Measures dependency between modules.  
Lower coupling improves maintainability.

### 2️⃣ Cohesion
Measures how strongly related the elements inside a module are.  
Higher cohesion improves maintainability.

### 3️⃣ Modularity
Measures how well the system is divided into independent modules.

### 4️⃣ Extensibility
Measures how easily new functionality can be added.

### 5️⃣ Complexity
Measures structural complexity of the system.

---

# 🧮 Maintainability Score Calculation

The system calculates maintainability using a **weighted scoring model**.

Maintainability Score =  

Σ (Metric Score × Weight)  
———————————————  
Σ (Metric Weights)

Each metric score ranges from **0 to 10**.

---

# 🔄 System Workflow

### Step 1
User uploads UML architecture diagrams.

### Step 2
Frontend sends the diagram to the backend API.

### Step 3
Backend processes the file and sends it to the AI analysis module.

### Step 4
AI module analyzes UML structure and generates maintainability metrics.

### Step 5
Metrics are returned to the frontend.

### Step 6
The system calculates the weighted maintainability score.

### Step 7
Pattern-based designs are compared with the baseline architecture.

### Step 8
Charts and dashboards visualize the results.

### Step 9
The system identifies the most maintainable architecture.

### Step 10
An academic research conclusion is automatically generated.

---

# 📊 Result Page Analysis Features

## KPI Cards

- Baseline Score
- Best Pattern Score
- Improvement Percentage
- Patterns Tested

---

## Metric Comparison Chart

Bar chart comparing maintainability metrics.

---

## Radar Profile

Radar chart showing maintainability distribution.

---

## Pattern Performance Ranking

Table ranking pattern architectures by maintainability score.

---

## Architecture Risk Assessment

| Score Range | Risk Level |
|-------------|------------|
| 0 – 4 | High Risk |
| 4 – 6 | Moderate |
| 6 – 8 | Good |
| 8 – 10 | Excellent |

---

## Academic Conclusion

Auto-generated interpretation of the architecture analysis.

Example:

> The Factory pattern-based architecture achieved the highest maintainability score compared to the patternless baseline architecture. This improvement is mainly due to increased modularity, improved cohesion, and reduced coupling.

---

# 📈 Example Result

Baseline Architecture Score

6.80

Factory Pattern Score

7.20

Maintainability Improvement

+5.9%

Conclusion:

The **Factory pattern-based architecture** achieved the highest maintainability score compared to the baseline architecture.

---

# 📂 Repository Structure

```
uml-portal
│
├── src
├── public
├── uml-backend
│   ├── routes
│   ├── services
│   ├── uploads
│   └── server.js
│
├── package.json
├── vite.config.js
└── README.md
```

---

# 🚀 Project Output

This system helps developers and researchers:

- Evaluate software architecture quality
- Compare design pattern implementations
- Identify the most maintainable architecture

---

# 🔮 Future Improvements

- Real AI-based UML analysis
- Automated design pattern detection
- Integration with UML modeling tools
- Advanced architecture metrics
- Machine learning model training

---

# 👨‍💻 Author

**Rohit Sukale**

B.Tech Computer Engineering

---

# 📜 License

This project is intended for **academic and research purposes**.
