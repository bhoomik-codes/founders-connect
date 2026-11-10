/**
 * Founders Connect - Application Controller
 * UI/UX Pro Max Architecture
 */

import { EVENT_DETAILS, SECTORS, TEAM_MEMBERS, FOUNDERS_DATA } from './founders-data.js';

// Application State
const state = {
  currentFellowId: 'all', // 'all' or specific fellow ID like 'bhoomik'
  searchQuery: '',
  selectedSector: 'All Sectors',
  filterAttendedOnly: false,
  viewMode: 'grid', // 'grid' | 'table'
  theme: localStorage.getItem('fc_theme') || 'dark'
};

// DOM Elements
const elements = {
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  fellowsCarousel: document.getElementById('fellows-carousel'),
  sectorChipsWrap: document.getElementById('sector-chips-wrap'),
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  attendedFilterBtn: document.getElementById('attended-filter-btn'),
  viewGridBtn: document.getElementById('view-grid-btn'),
  viewTableBtn: document.getElementById('view-table-btn'),
  foundersGrid: document.getElementById('founders-grid'),
  foundersTableContainer: document.getElementById('founders-table-container'),
  foundersTableBody: document.getElementById('founders-table-body'),
  visibleCountEl: document.getElementById('visible-count'),
  totalCountEl: document.getElementById('total-count'),
  statFoundersCount: document.getElementById('stat-founders-count'),
  statFellowsCount: document.getElementById('stat-fellows-count'),
  statEventsCount: document.getElementById('stat-events-count'),
  exportCsvBtn: document.getElementById('export-csv-btn'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  toastNotice: document.getElementById('toast-notice')
};

// Initialize Application
function init() {
  applyTheme(state.theme);
  renderFellowsTabs();
  renderSectorChips();
  attachEventListeners();
  updateDirectory();
  updateStatsCounters();
}

// Theme Management
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fc_theme', theme);
}

function toggleTheme() {
  const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
}

// Compute all leads combined or filtered
function getAllLeads() {
  let all = [];
  Object.keys(FOUNDERS_DATA).forEach(fellowId => {
    all = all.concat(FOUNDERS_DATA[fellowId]);
  });
  return all;
}

function getFilteredLeads() {
  let leads = state.currentFellowId === 'all' 
    ? getAllLeads() 
    : (FOUNDERS_DATA[state.currentFellowId] || []);

  // Search Filter
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase().trim();
    leads = leads.filter(lead => 
      lead.founderName.toLowerCase().includes(q) ||
      lead.companyName.toLowerCase().includes(q) ||
      lead.sector.toLowerCase().includes(q) ||
      lead.businessModel.toLowerCase().includes(q) ||
      lead.fellowName.toLowerCase().includes(q) ||
      (lead.tags && lead.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Sector Filter
  if (state.selectedSector !== 'All Sectors') {
    leads = leads.filter(lead => lead.sector === state.selectedSector);
  }

  // Event Attended Only Filter
  if (state.filterAttendedOnly) {
    leads = leads.filter(lead => lead.attendedEvents);
  }

  return leads;
}

// Render Team Fellows Tab Carousel
function renderFellowsTabs() {
  if (!elements.fellowsCarousel) return;

  const allCount = getAllLeads().length;

  let html = `
    <button class="all-fellows-pill ${state.currentFellowId === 'all' ? 'active' : ''}" data-fellow-id="all" aria-label="View all founders leads">
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 2px;">All Fellows</div>
      <div style="font-size: 0.75rem; color: var(--color-primary-light); font-family: var(--font-mono);">${allCount} Leads Combined</div>
    </button>
  `;

  TEAM_MEMBERS.forEach(fellow => {
    const isActive = state.currentFellowId === fellow.id;
    const leads = FOUNDERS_DATA[fellow.id] || [];
    const isCompleted = fellow.status === 'Completed';

    html += `
      <div class="fellow-tab-card ${isActive ? 'active' : ''}" data-fellow-id="${fellow.id}" role="button" tabindex="0">
        <div class="fellow-card-top">
          <div class="fellow-avatar">${fellow.avatar}</div>
          <span class="fellow-badge-status ${isCompleted ? 'status-completed' : 'status-draft'}">
            ${isCompleted ? 'Verified 10/10' : 'Draft 10/10'}
          </span>
        </div>
        <div class="fellow-info-name" title="${fellow.name}">${fellow.name}</div>
        <div class="fellow-info-role">${fellow.role}</div>
        <div class="fellow-info-focus">${fellow.focus}</div>
        <div class="fellow-lead-count">
          <span>Leads Target</span>
          <span><strong>${leads.length}</strong> / ${fellow.target}</span>
        </div>
      </div>
    `;
  });

  elements.fellowsCarousel.innerHTML = html;

  // Add click events to fellow tabs
  elements.fellowsCarousel.querySelectorAll('[data-fellow-id]').forEach(tab => {
    tab.addEventListener('click', () => {
      state.currentFellowId = tab.dataset.fellowId;
      renderFellowsTabs();
      updateDirectory();
    });

    // Keyboard support
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
  });
}

// Render Sector Filter Pills
function renderSectorChips() {
  if (!elements.sectorChipsWrap) return;

  let html = '';
  SECTORS.forEach(sec => {
    const isActive = state.selectedSector === sec;
    html += `<button class="filter-chip ${isActive ? 'active' : ''}" data-sector="${sec}">${sec}</button>`;
  });

  elements.sectorChipsWrap.innerHTML = html;

  elements.sectorChipsWrap.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.selectedSector = chip.dataset.sector;
      renderSectorChips();
      updateDirectory();
    });
  });
}

// Update directory listing & counts
function updateDirectory() {
  const filtered = getFilteredLeads();
  const total = getAllLeads().length;

  if (elements.visibleCountEl) elements.visibleCountEl.textContent = filtered.length;
  if (elements.totalCountEl) elements.totalCountEl.textContent = total;

  if (state.viewMode === 'grid') {
    elements.foundersGrid.style.display = 'grid';
    elements.foundersTableContainer.classList.remove('active');
    renderGrid(filtered);
  } else {
    elements.foundersGrid.style.display = 'none';
    elements.foundersTableContainer.classList.add('active');
    renderTable(filtered);
  }
}

// Render Grid Cards
function renderGrid(leads) {
  if (!elements.foundersGrid) return;

  if (leads.length === 0) {
    elements.foundersGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; color: var(--text-primary); font-weight: 600; margin-bottom: 8px;">No founders found matching your criteria</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 18px;">Try clearing filters or searching with a different term.</p>
        <button id="reset-filters-btn" class="btn-secondary" style="margin: 0 auto;">Reset Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.searchQuery = '';
        state.selectedSector = 'All Sectors';
        state.filterAttendedOnly = false;
        state.currentFellowId = 'all';
        if (elements.searchInput) elements.searchInput.value = '';
        if (elements.searchClearBtn) elements.searchClearBtn.classList.remove('visible');
        if (elements.attendedFilterBtn) elements.attendedFilterBtn.classList.remove('active');
        renderFellowsTabs();
        renderSectorChips();
        updateDirectory();
      });
    }
    return;
  }

  let html = '';
  leads.forEach(lead => {
    const initials = lead.founderName.split(' ').map(n => n[0]).slice(0, 2).join('');
    
    html += `
      <article class="founder-card" data-founder-id="${lead.id}">
        <div class="card-top-row">
          <div class="founder-profile-group">
            <div class="founder-avatar-badge">${initials}</div>
            <div class="founder-titles">
              <h3 class="founder-name">${lead.founderName}</h3>
              <span class="founder-designation">${lead.designation}</span>
            </div>
          </div>
          <span class="sector-tag">${lead.sector}</span>
        </div>

        <div class="company-box">
          <div class="company-name-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary-light);"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
            <span>${lead.companyName}</span>
          </div>
          <a href="${lead.website}" target="_blank" rel="noopener noreferrer" class="website-link" title="Visit Website">
            <span>Website</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </a>
        </div>

        <p class="business-summary-text">${lead.businessModel}</p>

        <div>
          <span class="event-status-pill ${lead.attendedEvents ? 'event-attended' : 'event-pending'}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
            ${lead.eventAttendanceStatus}
          </span>
        </div>

        <div class="relevance-highlight">
          <strong>Why Relevant to Founders Connect:</strong>
          <span>${lead.relevanceToFoundersConnect}</span>
        </div>

        <div class="card-footer-row">
          <div class="card-social-links">
            <a href="${lead.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="social-btn" title="LinkedIn Profile" aria-label="LinkedIn Profile of ${lead.founderName}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); margin-left: 4px;">
              By ${lead.fellowName.split(' ')[0]}
            </span>
          </div>
          <button class="btn-card-details" data-open-modal="${lead.id}">
            <span>View Full Research</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </article>
    `;
  });

  elements.foundersGrid.innerHTML = html;

  // Detail Modal trigger bindings
  elements.foundersGrid.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      openFounderModal(btn.dataset.openModal);
    });
  });
}

// Render Table (Spreadsheet Style)
function renderTable(leads) {
  if (!elements.foundersTableBody) return;

  if (leads.length === 0) {
    elements.foundersTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 36px; color: var(--text-muted);">
          No matching founders found.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  leads.forEach((lead, idx) => {
    html += `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.78rem;">#${idx + 1}</td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary);">${lead.founderName}</div>
          <div style="font-size: 0.74rem; color: var(--text-muted);">${lead.designation}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${lead.companyName}</div>
          <a href="${lead.website}" target="_blank" rel="noopener noreferrer" style="font-size: 0.74rem; color: var(--color-primary-light);">Visit ↗</a>
        </td>
        <td><span class="sector-tag">${lead.sector}</span></td>
        <td>
          <span class="event-status-pill ${lead.attendedEvents ? 'event-attended' : 'event-pending'}" style="margin: 0;">
            ${lead.attendedEvents ? 'Verified' : 'Pending'}
          </span>
        </td>
        <td style="max-width: 260px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">
          ${lead.businessModel.slice(0, 85)}...
        </td>
        <td>
          <button class="btn-card-details" data-open-modal="${lead.id}" style="padding: 4px 8px; font-size: 0.74rem;">
            Details
          </button>
        </td>
      </tr>
    `;
  });

  elements.foundersTableBody.innerHTML = html;

  elements.foundersTableBody.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      openFounderModal(btn.dataset.openModal);
    });
  });
}

// Founder Detail Modal Viewer
function openFounderModal(founderId) {
  const all = getAllLeads();
  const founder = all.find(f => f.id === founderId);
  if (!founder || !elements.modalOverlay) return;

  const initials = founder.founderName.split(' ').map(n => n[0]).slice(0, 2).join('');

  const modalContentEl = document.getElementById('modal-content-container');
  if (modalContentEl) {
    modalContentEl.innerHTML = `
      <div class="modal-hero-box">
        <div class="modal-avatar-lg">${initials}</div>
        <div class="modal-founder-meta">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px; flex-wrap: wrap;">
            <h2 class="modal-founder-name">${founder.founderName}</h2>
            <span class="sector-tag">${founder.sector}</span>
            <span class="event-status-pill ${founder.attendedEvents ? 'event-attended' : 'event-pending'}" style="margin: 0;">
              ${founder.eventAttendanceStatus}
            </span>
          </div>
          <div class="modal-founder-sub">${founder.designation} • <strong>${founder.companyName}</strong></div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
            Researched by <strong>${founder.fellowName}</strong> for Founders Connect (21st Nov)
          </div>
        </div>
      </div>

      <div class="modal-grid-details">
        <div class="modal-section-card">
          <div class="modal-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Contact & Profiles
          </div>
          <p class="modal-text" style="margin-bottom: 8px;">
            <strong>Public Contact:</strong> ${founder.publicContact || 'Available via company corporate PR'}
          </p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <a href="${founder.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.78rem; padding: 6px 12px;">
              LinkedIn Profile ↗
            </a>
            <a href="${founder.website}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 0.78rem; padding: 6px 12px;">
              Company Website ↗
            </a>
          </div>
        </div>

        <div class="modal-section-card">
          <div class="modal-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Business Model & Monetization
          </div>
          <p class="modal-text">${founder.businessModel}</p>
        </div>
      </div>

      <div class="modal-section-card">
        <div class="modal-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Company Overview & Jaipur Roots
        </div>
        <p class="modal-text">${founder.companySummary || founder.businessModel}</p>
      </div>

      <div class="modal-section-card">
        <div class="modal-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
          Previous Event Participation & Meetups
        </div>
        <ul class="modal-list">
          ${founder.previousEvents && founder.previousEvents.length 
            ? founder.previousEvents.map(e => `<li>${e}</li>`).join('') 
            : '<li>Actively invited to regional conferences and startup mixers</li>'}
        </ul>
      </div>

      <div class="modal-section-card" style="border-left: 3px solid var(--color-jaipur);">
        <div class="modal-section-title" style="color: var(--color-jaipur);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Strategic Fit for Founders Connect (21st Nov)
        </div>
        <p class="modal-text">${founder.relevanceToFoundersConnect}</p>
      </div>

      <div class="modal-section-card">
        <div class="modal-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Verified Information Sources
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${(founder.sourceLinks || []).map(s => `
            <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="website-link" style="background: var(--bg-tertiary); padding: 4px 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">
              ${s.label} ↗
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  elements.modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (elements.modalOverlay) {
    elements.modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Update Top Statistics Ribbon
function updateStatsCounters() {
  const all = getAllLeads();
  const attendedCount = all.filter(l => l.attendedEvents).length;

  if (elements.statFoundersCount) elements.statFoundersCount.textContent = all.length;
  if (elements.statFellowsCount) elements.statFellowsCount.textContent = TEAM_MEMBERS.length;
  if (elements.statEventsCount) elements.statEventsCount.textContent = attendedCount;
}

// Toast notification helper
function showToast(message) {
  if (!elements.toastNotice) return;
  elements.toastNotice.textContent = message;
  elements.toastNotice.classList.add('show');
  setTimeout(() => {
    elements.toastNotice.classList.remove('show');
  }, 3200);
}

// Export formatted CSV for Google Sheets
function exportSpreadsheetCSV() {
  const leads = getFilteredLeads();
  if (leads.length === 0) {
    showToast("No leads to export.");
    return;
  }

  const headers = [
    "Fellow Researcher",
    "Founder Name",
    "Designation",
    "Startup / Company Name",
    "Website",
    "LinkedIn Profile URL",
    "Public Contact Number / Email",
    "Sector",
    "What the Company Does & Business Model",
    "Attended Startup Events (Yes/No)",
    "Previous Event Participation Details",
    "Relevance to Founders Connect",
    "Source Links"
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = leads.map(l => {
    const prevEvents = (l.previousEvents || []).join('; ');
    const sources = (l.sourceLinks || []).map(s => `${s.label}: ${s.url}`).join(' | ');
    return [
      escapeCSV(l.fellowName),
      escapeCSV(l.founderName),
      escapeCSV(l.designation),
      escapeCSV(l.companyName),
      escapeCSV(l.website),
      escapeCSV(l.linkedinUrl),
      escapeCSV(l.publicContact),
      escapeCSV(l.sector),
      escapeCSV(l.businessModel),
      escapeCSV(l.attendedEvents ? 'Yes' : 'No'),
      escapeCSV(prevEvents),
      escapeCSV(l.relevanceToFoundersConnect),
      escapeCSV(sources)
    ].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Founders_Connect_Jaipur_Research_${state.currentFellowId}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Spreadsheet CSV exported! Ready for Google Sheets.");
}

// Attach Event Listeners
function attachEventListeners() {
  // Theme toggle
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Search input
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (elements.searchClearBtn) {
        if (state.searchQuery.length > 0) {
          elements.searchClearBtn.classList.add('visible');
        } else {
          elements.searchClearBtn.classList.remove('visible');
        }
      }
      updateDirectory();
    });
  }

  // Search clear
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      if (elements.searchInput) elements.searchInput.value = '';
      state.searchQuery = '';
      elements.searchClearBtn.classList.remove('visible');
      updateDirectory();
    });
  }

  // Event attended filter toggle
  if (elements.attendedFilterBtn) {
    elements.attendedFilterBtn.addEventListener('click', () => {
      state.filterAttendedOnly = !state.filterAttendedOnly;
      elements.attendedFilterBtn.classList.toggle('active', state.filterAttendedOnly);
      updateDirectory();
    });
  }

  // View switchers
  if (elements.viewGridBtn) {
    elements.viewGridBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      elements.viewGridBtn.classList.add('active');
      elements.viewTableBtn.classList.remove('active');
      updateDirectory();
    });
  }

  if (elements.viewTableBtn) {
    elements.viewTableBtn.addEventListener('click', () => {
      state.viewMode = 'table';
      elements.viewTableBtn.classList.add('active');
      elements.viewGridBtn.classList.remove('active');
      updateDirectory();
    });
  }

  // Export CSV
  if (elements.exportCsvBtn) {
    elements.exportCsvBtn.addEventListener('click', exportSpreadsheetCSV);
  }

  // Modal close buttons
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener('click', closeModal);
  }

  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) {
        closeModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

// Run on load
document.addEventListener('DOMContentLoaded', init);

