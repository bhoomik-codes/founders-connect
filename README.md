# 🚀 Founders Connect: Jaipur Startup & Founder Research

An interactive showcase directory and research hub built for the **Founders Connect** event on **21st November 2026** in Jaipur, Rajasthan.

🌐 **Live URL Target**: [https://bhoomik-codes.github.io/founders-connect](https://bhoomik-codes.github.io/founders-connect)

---

## 🎯 Project Overview

This project equips a research cohort of 9 fellows to uncover, document, and present Jaipur's startup ecosystem leaders. Each fellow researches 10 Jaipur-based startup founders across 8 essential dimensions:

1. **Founder Name & Designation**
2. **Startup / Company Name & Website**
3. **LinkedIn Profile URL**
4. **Public Contact Number / Email**
5. **What the company does & its business model**
6. **Startup event, meetup & investor conference attendance history**
7. **Previous event participation details**
8. **Relevance to Founders Connect & networking rationale**

---

## 💎 Features & UI/UX Pro Max Architecture

- **Interactive Team Member Switcher**: Seamlessly switch between all 9 fellows (Bhoomik Setva + 8 team fellow slots) or view all leads combined.
- **Dual View Modes**:
  - **Visual Directory Grid**: Rich cards with sector tags, company links, event badges, and strategic relevance highlights.
  - **Spreadsheet Table View**: Compact tabular format mirroring the Google Sheets submission format.
- **Instant Search & Multi-Filters**: Filter by sector (FinTech, D2C, HealthTech, Agritech, AutoTech, SaaS, etc.) or verified event attendees.
- **In-Depth Founder Dossier (Modal Drawer)**: Complete breakdown of business models, verified sources, past speaking engagements, and contact routes.
- **1-Click Google Sheets / CSV Export**: Generate compliant CSV files matching the assignment's spreadsheet schema.
- **Dark & Light Mode**: Built using high-contrast design tokens, fluid typography, and zero-emoji SVG icon discipline.

---

## 📁 Repository Structure

```
founders-connect/
├── index.html               # Main single-page application
├── css/
│   └── styles.css           # UI/UX Pro Max design system & responsive styling
├── js/
│   ├── app.js               # Application logic, filters, modal, and export
│   └── founders-data.js     # Data store with 9 fellow tracks & 10 founders each
├── .gitignore
└── README.md
```

---

## 👥 How Team Members Can Add / Edit Their 10 Leads

All data resides cleanly in [`js/founders-data.js`](./js/founders-data.js):

1. Open `js/founders-data.js`.
2. Locate your Fellow ID (e.g. `fellow-2`, `fellow-3`, etc.).
3. Update the fellow details in `TEAM_MEMBERS` (Name, Role, Focus).
4. Fill in your 10 researched founders in `FOUNDERS_DATA[yourId]` using the provided template structure.
5. Commit and push to update the live site instantly!

---

## 🚀 GitHub Pages Deployment Steps

To host the site on `bhoomik-codes.github.io/founders-connect`:

1. **Create Repository on GitHub**:
   - Go to [GitHub New Repository](https://github.com/new)
   - Repository name: `founders-connect`
   - Set to **Public**

2. **Push Local Code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: initial skeleton for Founders Connect Jaipur research portal"
   git remote add origin https://github.com/bhoomik-codes/founders-connect.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your GitHub repository, go to **Settings** > **Pages**
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**
   - Branch: `main` / folder: `/(root)`
   - Click **Save**
   - Your site will be live at `https://bhoomik-codes.github.io/founders-connect` within 1-2 minutes!
