/**
 * Founders Connect - Application Controller
 * Matches User Wireframe:
 * - Top Global Search Bar (Name, Company, Sector, Address)
 * - Left "Pod Members" Sidebar with scroll down
 * - Main Lead Profile Stage Canvas with surrounding cards & navigation arrows
 */

import { EVENT_DETAILS, SECTORS, TEAM_MEMBERS, FOUNDERS_DATA } from './founders-data.js';

// Application State
const state = {
  currentFellowId: 'bhoomik', // Active pod member ID
  currentLeadIndex: 0,        // Active lead (0 to 9)
  viewMode: 'stage',          // 'stage' | 'grid' | 'table'
  searchQuery: '',
  theme: localStorage.getItem('fc_theme') || 'dark'
};

// DOM References
const elements = {
  // Theme & Global
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  toastNotice: document.getElementById('toast-notice'),
  exportCsvBtn: document.getElementById('export-csv-btn'),

  // Top Search
  globalSearchInput: document.getElementById('global-search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  searchResultsDropdown: document.getElementById('search-results-dropdown'),

  // Left Pod Sidebar
  podMembersList: document.getElementById('pod-members-list'),
  podScrollDownBtn: document.getElementById('pod-scroll-down-btn'),

  // Stage Controls
  activeFellowName: document.getElementById('active-fellow-name'),
  activeFellowRole: document.getElementById('active-fellow-role'),
  activeFellowFocus: document.getElementById('active-fellow-focus'),
  leadStepperPills: document.getElementById('lead-stepper-pills'),
  viewStageBtn: document.getElementById('view-stage-btn'),
  viewGridBtn: document.getElementById('view-grid-btn'),
  viewTableBtn: document.getElementById('view-table-btn'),

  // Stage Canvas (Wireframe Box Layout)
  leadProfileCanvas: document.getElementById('lead-profile-canvas'),
  canvasPrevBtn: document.getElementById('canvas-prev-btn'),
  canvasNextBtn: document.getElementById('canvas-next-btn'),

  // Stage Elements
  stageFounderName: document.getElementById('stage-founder-name'),
  stageFounderDesignation: document.getElementById('stage-founder-designation'),
  stageCompanyName: document.getElementById('stage-company-name'),
  stageSectorTag: document.getElementById('stage-sector-tag'),
  stageFounderAddress: document.getElementById('stage-founder-address'),
  stageWebsiteLink: document.getElementById('stage-website-link'),
  stageLinkedinLink: document.getElementById('stage-linkedin-link'),
  stageFullDossierBtn: document.getElementById('stage-full-dossier-btn'),

  stageBusinessDesc: document.getElementById('stage-business-desc'),
  stageBusinessModel: document.getElementById('stage-business-model'),

  stagePortraitImg: document.getElementById('stage-portrait-img'),
  stageLeadProfileTag: document.getElementById('stage-lead-profile-tag'),
  stageLeadIndexBadge: document.getElementById('stage-lead-index-badge'),
  stageFellowCredit: document.getElementById('stage-fellow-credit'),
  stageContactInfo: document.getElementById('stage-contact-info'),
  stageTagsWrap: document.getElementById('stage-tags-wrap'),

  stageEventsList: document.getElementById('stage-events-list'),
  stageRelevanceText: document.getElementById('stage-relevance-text'),

  // Alternative Directory Views
  directoryViewWrapper: document.getElementById('directory-view-wrapper'),
  foundersGridContainer: document.getElementById('founders-grid-container'),
  foundersTableContainer: document.getElementById('founders-table-container'),
  foundersTableBody: document.getElementById('founders-table-body'),

  // Modal
  modalOverlay: document.getElementById('modal-overlay'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalContentContainer: document.getElementById('modal-content-container')
};

// Initialize Application
function init() {
  applyTheme(state.theme);
  renderPodMembers();
  renderLeadStepper();
  updateStageLeadProfile();
  renderDirectoryViews();
  attachEventListeners();
}

// Theme Switcher
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fc_theme', theme);
}

function toggleTheme() {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

// Get all 90 leads combined
function getAllLeadsFlat() {
  let list = [];
  Object.keys(FOUNDERS_DATA).forEach(fellowId => {
    list = list.concat(FOUNDERS_DATA[fellowId]);
  });
  return list;
}

// Get active fellow's leads
function getActiveFellowLeads() {
  return FOUNDERS_DATA[state.currentFellowId] || [];
}

// Render Left Sidebar: "Pod Members"
function renderPodMembers() {
  if (!elements.podMembersList) return;

  let html = '';
  TEAM_MEMBERS.forEach(fellow => {
    const isActive = state.currentFellowId === fellow.id;
    const leads = FOUNDERS_DATA[fellow.id] || [];

    html += `
      <div 
        class="pod-member-btn ${isActive ? 'active' : ''}" 
        data-fellow-id="${fellow.id}"
        role="button"
        tabindex="0"
        title="${fellow.name} (${fellow.focus})"
      >
        <div class="pod-member-avatar-wrap">
          <img src="${fellow.photoUrl}" alt="${fellow.name}" class="pod-member-photo" loading="lazy" />
          <span class="pod-member-status-indicator" title="Status: Verified (10/10)"></span>
        </div>
        <div class="pod-member-name">${fellow.name}</div>
        <div class="pod-member-leads-tag">${leads.length}/10 Leads</div>
      </div>
    `;
  });

  elements.podMembersList.innerHTML = html;

  // Click handlers for Pod Member avatars
  elements.podMembersList.querySelectorAll('[data-fellow-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentFellowId = btn.dataset.fellowId;
      state.currentLeadIndex = 0; // Reset to 1st lead of this fellow
      renderPodMembers();
      renderLeadStepper();
      updateStageLeadProfile();
      renderDirectoryViews();
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

// Render 1 to 10 Lead Stepper Selector
function renderLeadStepper() {
  if (!elements.leadStepperPills) return;

  const leads = getActiveFellowLeads();
  let html = '';

  for (let i = 0; i < leads.length; i++) {
    const isActive = state.currentLeadIndex === i;
    html += `
      <button class="lead-step-pill ${isActive ? 'active' : ''}" data-lead-idx="${i}" title="View Lead #${i + 1}">
        ${i + 1}
      </button>
    `;
  }

  elements.leadStepperPills.innerHTML = html;

  elements.leadStepperPills.querySelectorAll('[data-lead-idx]').forEach(pill => {
    pill.addEventListener('click', () => {
      state.currentLeadIndex = parseInt(pill.dataset.leadIdx, 10);
      renderLeadStepper();
      updateStageLeadProfile();
    });
  });
}

// Update the Main Stage Canvas with the active lead profile
function updateStageLeadProfile() {
  const fellow = TEAM_MEMBERS.find(f => f.id === state.currentFellowId) || TEAM_MEMBERS[0];
  const leads = getActiveFellowLeads();
  const lead = leads[state.currentLeadIndex] || leads[0];

  if (!lead) return;

  // Update top active fellow meta
  if (elements.activeFellowName) elements.activeFellowName.textContent = fellow.name;
  if (elements.activeFellowRole) elements.activeFellowRole.textContent = fellow.role;
  if (elements.activeFellowFocus) elements.activeFellowFocus.textContent = fellow.focus;

  // Card 1: Top-Left Card (Founder & Startup Profile)
  if (elements.stageFounderName) elements.stageFounderName.textContent = lead.founderName;
  if (elements.stageFounderDesignation) elements.stageFounderDesignation.textContent = lead.designation;
  if (elements.stageCompanyName) elements.stageCompanyName.textContent = lead.companyName;
  if (elements.stageSectorTag) elements.stageSectorTag.textContent = lead.sector;
  if (elements.stageFounderAddress) elements.stageFounderAddress.textContent = lead.address || 'Jaipur, Rajasthan';

  if (elements.stageWebsiteLink) elements.stageWebsiteLink.href = lead.website;
  if (elements.stageLinkedinLink) elements.stageLinkedinLink.href = lead.linkedinUrl;

  // Card 2: Top-Right Card (Business Model & Monetization)
  if (elements.stageBusinessDesc) elements.stageBusinessDesc.textContent = lead.companySummary || lead.businessModel;
  if (elements.stageBusinessModel) elements.stageBusinessModel.textContent = lead.businessModel;

  // Center Bottom: Founder Portrait Area
  if (elements.stagePortraitImg) {
    elements.stagePortraitImg.src = lead.photoUrl;
    elements.stagePortraitImg.alt = lead.founderName;
  }
  if (elements.stageLeadIndexBadge) {
    elements.stageLeadIndexBadge.textContent = `Lead #${state.currentLeadIndex + 1} of ${leads.length}`;
  }
  if (elements.stageFellowCredit) {
    elements.stageFellowCredit.innerHTML = `Researched by <strong>${lead.fellowName}</strong>`;
  }
  if (elements.stageContactInfo) {
    elements.stageContactInfo.innerHTML = `Contact: <strong>${lead.publicContact || 'Available on request'}</strong>`;
  }

  // Tags
  if (elements.stageTagsWrap) {
    elements.stageTagsWrap.innerHTML = (lead.tags || ['Jaipur Startup', 'Founders Connect'])
      .map(tag => `<span class="badge-city" style="font-size: 0.68rem;">${tag}</span>`)
      .join('');
  }

  // Card 3: Bottom-Right Card (Event Participation & Relevance)
  if (elements.stageEventsList) {
    if (lead.previousEvents && lead.previousEvents.length) {
      elements.stageEventsList.innerHTML = lead.previousEvents
        .map(ev => `<li class="event-history-item"><span class="event-bullet-icon">✦</span> ${ev}</li>`)
        .join('');
    } else {
      elements.stageEventsList.innerHTML = `
        <li class="event-history-item"><span class="event-bullet-icon">✦</span> Attended Regional Startup Meetups & Investor Summits</li>
      `;
    }
  }

  if (elements.stageRelevanceText) {
    elements.stageRelevanceText.textContent = lead.relevanceToFoundersConnect;
  }

  // Update Stepper Pill active class
  renderLeadStepper();
}

// Next Lead (Right Arrow ->)
function nextLead() {
  const leads = getActiveFellowLeads();
  state.currentLeadIndex = (state.currentLeadIndex + 1) % leads.length;
  updateStageLeadProfile();
}

// Previous Lead (Left Arrow <-)
function prevLead() {
  const leads = getActiveFellowLeads();
  state.currentLeadIndex = (state.currentLeadIndex - 1 + leads.length) % leads.length;
  updateStageLeadProfile();
}

// Switch View Modes: 'stage' | 'grid' | 'table'
function setViewMode(mode) {
  state.viewMode = mode;

  elements.viewStageBtn.classList.toggle('active', mode === 'stage');
  elements.viewGridBtn.classList.toggle('active', mode === 'grid');
  elements.viewTableBtn.classList.toggle('active', mode === 'table');

  if (mode === 'stage') {
    elements.leadProfileCanvas.style.display = 'grid';
    elements.directoryViewWrapper.classList.remove('active');
  } else if (mode === 'grid') {
    elements.leadProfileCanvas.style.display = 'none';
    elements.directoryViewWrapper.classList.add('active');
    elements.foundersGridContainer.style.display = 'grid';
    elements.foundersTableContainer.style.display = 'none';
  } else if (mode === 'table') {
    elements.leadProfileCanvas.style.display = 'none';
    elements.directoryViewWrapper.classList.add('active');
    elements.foundersGridContainer.style.display = 'none';
    elements.foundersTableContainer.style.display = 'block';
  }
}

// Render Directory Grid and Table views (for the active fellow or all)
function renderDirectoryViews() {
  const leads = getActiveFellowLeads();

  // Grid cards
  if (elements.foundersGridContainer) {
    elements.foundersGridContainer.innerHTML = leads.map((lead, idx) => `
      <article class="founder-card" data-jump-lead="${idx}">
        <div class="card-header-line">
          <img src="${lead.photoUrl}" alt="${lead.founderName}" class="card-thumb-round" />
          <div class="card-title-meta">
            <h3 class="card-name-txt">${lead.founderName}</h3>
            <span class="card-sub-txt">${lead.designation}</span>
          </div>
          <span class="badge-city" style="margin-left: auto;">${lead.sector}</span>
        </div>
        <div style="font-weight: 600; font-size: 0.88rem; color: var(--color-primary-light);">
          ${lead.companyName}
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${lead.address || 'Jaipur, Rajasthan'}
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${lead.businessModel}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
          <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">Lead #${idx + 1}</span>
          <button class="btn-secondary" style="font-size: 0.72rem; padding: 4px 8px;">View Profile ↗</button>
        </div>
      </article>
    `).join('');

    elements.foundersGridContainer.querySelectorAll('[data-jump-lead]').forEach(card => {
      card.addEventListener('click', () => {
        state.currentLeadIndex = parseInt(card.dataset.jumpLead, 10);
        setViewMode('stage');
        updateStageLeadProfile();
      });
    });
  }

  // Table rows
  if (elements.foundersTableBody) {
    elements.foundersTableBody.innerHTML = leads.map((lead, idx) => `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.76rem;">#${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${lead.photoUrl}" alt="${lead.founderName}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
            <div>
              <div style="font-weight: 700; color: var(--text-primary);">${lead.founderName}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${lead.designation}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight: 600;">${lead.companyName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${lead.address || 'Jaipur'}</div>
        </td>
        <td><span class="badge-city">${lead.sector}</span></td>
        <td style="max-width: 240px; font-size: 0.76rem; color: var(--text-secondary);">${lead.businessModel.slice(0, 75)}...</td>
        <td>
          <span class="badge-city" style="background: ${lead.attendedEvents ? 'var(--color-success-bg)' : 'var(--bg-tertiary)'}; color: ${lead.attendedEvents ? 'var(--color-success)' : 'var(--text-muted)'};">
            ${lead.attendedEvents ? 'Verified' : 'Pending'}
          </span>
        </td>
        <td>
          <button class="btn-secondary" style="font-size: 0.72rem; padding: 4px 8px;" onclick="window.selectAndShowLead(${idx})">
            Select
          </button>
        </td>
      </tr>
    `).join('');
  }
}

// Global hook for selecting from table
window.selectAndShowLead = function(idx) {
  state.currentLeadIndex = idx;
  setViewMode('stage');
  updateStageLeadProfile();
};

// Top Search Execution (Matches Image 2)
// Searches: Name, Company, Sector, Address, etc.
function handleGlobalSearch(query) {
  state.searchQuery = query.trim().toLowerCase();

  if (!elements.searchResultsDropdown) return;

  if (state.searchQuery.length === 0) {
    elements.searchResultsDropdown.classList.remove('active');
    elements.searchResultsDropdown.innerHTML = '';
    if (elements.searchClearBtn) elements.searchClearBtn.classList.remove('visible');
    return;
  }

  if (elements.searchClearBtn) elements.searchClearBtn.classList.add('visible');

  const allLeads = getAllLeadsFlat();
  const matches = allLeads.filter(lead => {
    const nameMatch = lead.founderName.toLowerCase().includes(state.searchQuery);
    const companyMatch = lead.companyName.toLowerCase().includes(state.searchQuery);
    const sectorMatch = lead.sector.toLowerCase().includes(state.searchQuery);
    const addressMatch = (lead.address || '').toLowerCase().includes(state.searchQuery);
    const fellowMatch = lead.fellowName.toLowerCase().includes(state.searchQuery);
    const tagsMatch = (lead.tags || []).some(t => t.toLowerCase().includes(state.searchQuery));

    return nameMatch || companyMatch || sectorMatch || addressMatch || fellowMatch || tagsMatch;
  });

  if (matches.length === 0) {
    elements.searchResultsDropdown.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        No founders found matching "<strong>${query}</strong>" across name, company, sector, or Jaipur address.
      </div>
    `;
    elements.searchResultsDropdown.classList.add('active');
    return;
  }

  elements.searchResultsDropdown.innerHTML = matches.slice(0, 8).map(m => `
    <div class="search-result-item" data-jump-fellow="${m.fellowId}" data-jump-lead-id="${m.id}">
      <div class="search-result-left">
        <img src="${m.photoUrl}" alt="${m.founderName}" class="search-result-thumb" />
        <div class="search-result-meta">
          <div class="search-result-name">${m.founderName}</div>
          <div class="search-result-company">${m.designation} • <strong>${m.companyName}</strong></div>
          <div class="search-result-address">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${m.address || 'Jaipur, Rajasthan'}
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="search-result-sector">${m.sector}</span>
        <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">by ${m.fellowName.split(' ')[0]}</div>
      </div>
    </div>
  `).join('');

  elements.searchResultsDropdown.classList.add('active');

  // Jump to selected founder
  elements.searchResultsDropdown.querySelectorAll('[data-jump-fellow]').forEach(item => {
    item.addEventListener('click', () => {
      const fellowId = item.dataset.jumpFellow;
      const leadId = item.dataset.jumpLeadId;
      jumpToFounder(fellowId, leadId);
    });
  });
}

// Jump directly to a founder from search
function jumpToFounder(fellowId, leadId) {
  state.currentFellowId = fellowId;
  const leads = FOUNDERS_DATA[fellowId] || [];
  const idx = leads.findIndex(l => l.id === leadId);
  state.currentLeadIndex = idx >= 0 ? idx : 0;

  // Close search dropdown
  if (elements.searchResultsDropdown) {
    elements.searchResultsDropdown.classList.remove('active');
  }

  // Switch to stage view
  setViewMode('stage');
  renderPodMembers();
  renderLeadStepper();
  updateStageLeadProfile();
  showToast(`Showing profile for ${leads[state.currentLeadIndex].founderName}`);
}

// Open Full Founder Research Dossier Modal
function openFullDossierModal() {
  const leads = getActiveFellowLeads();
  const lead = leads[state.currentLeadIndex];
  if (!lead || !elements.modalOverlay || !elements.modalContentContainer) return;

  elements.modalContentContainer.innerHTML = `
    <div style="display: flex; gap: 18px; align-items: flex-start; padding-bottom: 18px; border-bottom: 1px solid var(--border-subtle);">
      <img src="${lead.photoUrl}" alt="${lead.founderName}" style="width: 72px; height: 72px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-primary);" />
      <div>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">${lead.founderName}</h2>
        <div style="font-size: 0.88rem; color: var(--text-muted);">${lead.designation} • <strong>${lead.companyName}</strong></div>
        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
          <span class="badge-city">${lead.sector}</span>
          <span class="badge-city" style="color: var(--color-success); border-color: rgba(16, 185, 129, 0.3);">
            ${lead.eventAttendanceStatus}
          </span>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div style="background: var(--bg-card-solid); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <strong style="font-size: 0.74rem; text-transform: uppercase; color: var(--color-primary-light); display: block; margin-bottom: 6px;">
          Office Address & Location:
        </strong>
        <p style="font-size: 0.84rem; color: var(--text-secondary);">${lead.address || 'Jaipur, Rajasthan'}</p>
      </div>

      <div style="background: var(--bg-card-solid); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <strong style="font-size: 0.74rem; text-transform: uppercase; color: var(--color-primary-light); display: block; margin-bottom: 6px;">
          Public Contact:
        </strong>
        <p style="font-size: 0.84rem; color: var(--text-secondary);">${lead.publicContact || 'Available via corporate channel'}</p>
      </div>
    </div>

    <div style="background: var(--bg-card-solid); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
      <strong style="font-size: 0.74rem; text-transform: uppercase; color: var(--color-accent); display: block; margin-bottom: 6px;">
        Business Model & Monetization:
      </strong>
      <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6;">${lead.businessModel}</p>
    </div>

    <div style="background: var(--bg-card-solid); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); border-left: 3px solid var(--color-jaipur);">
      <strong style="font-size: 0.74rem; text-transform: uppercase; color: var(--color-jaipur); display: block; margin-bottom: 6px;">
        Why Relevant to Founders Connect (21st Nov):
      </strong>
      <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6;">${lead.relevanceToFoundersConnect}</p>
    </div>

    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
      <a href="${lead.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">LinkedIn Profile ↗</a>
      <a href="${lead.website}" target="_blank" rel="noopener noreferrer" class="btn-secondary">Visit Website ↗</a>
      <button onclick="document.getElementById('modal-overlay').classList.remove('open'); document.body.style.overflow='';" class="btn-primary">Done</button>
    </div>
  `;

  elements.modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (elements.modalOverlay) {
    elements.modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Toast helper
function showToast(msg) {
  if (!elements.toastNotice) return;
  elements.toastNotice.textContent = msg;
  elements.toastNotice.classList.add('show');
  setTimeout(() => {
    elements.toastNotice.classList.remove('show');
  }, 2800);
}

// Export CSV for Google Sheets
function exportSpreadsheetCSV() {
  const allLeads = getAllLeadsFlat();

  const headers = [
    "Pod Member (Fellow)",
    "Founder Name",
    "Designation",
    "Startup / Company Name",
    "Website",
    "LinkedIn Profile URL",
    "Public Contact Number / Email",
    "Office Address / Location",
    "Sector",
    "What Company Does & Business Model",
    "Attended Events (Yes/No)",
    "Previous Event Participation",
    "Relevance to Founders Connect (21st Nov)",
    "Sources"
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = allLeads.map(l => {
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
      escapeCSV(l.address || 'Jaipur, Rajasthan'),
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
  link.setAttribute("download", `Founders_Connect_Jaipur_Research_All_Pods.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Spreadsheet CSV exported with all 90 Jaipur Leads!");
}

// Attach Event Listeners
function attachEventListeners() {
  // Theme toggle
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Top Search Input
  if (elements.globalSearchInput) {
    elements.globalSearchInput.addEventListener('input', (e) => {
      handleGlobalSearch(e.target.value);
    });

    elements.globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstMatch = elements.searchResultsDropdown.querySelector('.search-result-item');
        if (firstMatch) firstMatch.click();
      } else if (e.key === 'Escape') {
        elements.searchResultsDropdown.classList.remove('active');
      }
    });
  }

  // Clear search
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      if (elements.globalSearchInput) elements.globalSearchInput.value = '';
      handleGlobalSearch('');
    });
  }

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-search-container')) {
      if (elements.searchResultsDropdown) {
        elements.searchResultsDropdown.classList.remove('active');
      }
    }
  });

  // Pod sidebar scroll down button
  if (elements.podScrollDownBtn && elements.podMembersList) {
    elements.podScrollDownBtn.addEventListener('click', () => {
      elements.podMembersList.scrollBy({ top: 120, behavior: 'smooth' });
    });
  }

  // Navigation Arrows (<- and ->)
  if (elements.canvasNextBtn) {
    elements.canvasNextBtn.addEventListener('click', nextLead);
  }
  if (elements.canvasPrevBtn) {
    elements.canvasPrevBtn.addEventListener('click', prevLead);
  }

  // Keyboard Arrow navigation (Left / Right keys)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') {
      nextLead();
    } else if (e.key === 'ArrowLeft') {
      prevLead();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  // View mode buttons
  if (elements.viewStageBtn) {
    elements.viewStageBtn.addEventListener('click', () => setViewMode('stage'));
  }
  if (elements.viewGridBtn) {
    elements.viewGridBtn.addEventListener('click', () => setViewMode('grid'));
  }
  if (elements.viewTableBtn) {
    elements.viewTableBtn.addEventListener('click', () => setViewMode('table'));
  }

  // Stage full dossier button
  if (elements.stageFullDossierBtn) {
    elements.stageFullDossierBtn.addEventListener('click', openFullDossierModal);
  }

  // Modal close
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener('click', closeModal);
  }
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    });
  }

  // Export CSV
  if (elements.exportCsvBtn) {
    elements.exportCsvBtn.addEventListener('click', exportSpreadsheetCSV);
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
