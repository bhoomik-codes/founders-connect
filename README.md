# Founders Connect — Jaipur Founder Directory

An editorial research directory for the Founders Connect gathering in Jaipur on **21 November 2026**.

The directory currently contains **63 founder profiles across seven research tracks**: Bhoomik Setva and the six teammates named from their submitted workbook filenames. Kunal's workbook contains three founders, so the site shows three profiles for that track rather than filling it with invented entries.

## Browse the research

- Select a researcher in the team strip to view their assigned profiles.
- Switch between the featured profile, gallery, and table views.
- Search across founder names, companies, sectors, and locations.
- Open a profile to review its research notes, event evidence, contact channel, and source links.
- Export the currently available records to CSV or copy them for a spreadsheet.

## Data and sourcing

Research records live in [`js/founders-data.js`](./js/founders-data.js). The original spreadsheets are retained in `data/`. Duplicate assignments were replaced with distinct founders; replacement source links are included in their profiles. Workbook claims remain attributed to the submitted research and should be rechecked before outreach.

Founder images are shown only where a profile image was already verified and available locally. Other profiles use initials so the site does not present an unrelated stock portrait as a real person.

## Project files

```
founders-connect/
├── index.html
├── css/styles.css
├── js/app.js
├── js/founders-data.js
└── data/
    ├── research-bhoomik.xlsx
    └── images/
```

The site is a static HTML, CSS, and JavaScript project and can be hosted on GitHub Pages from the repository root.
