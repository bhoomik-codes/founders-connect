/**
 * Founders Connect - Application Controller
 * Editorial Light Theme with Instagram Reels-Inspired Discovery Carousel
 */

import { EVENT_DETAILS, SECTORS, TEAM_MEMBERS, FOUNDERS_DATA } from './founders-data.js';

// Application State
const state = {
  currentFellowId: 'sameeksha', // Open on the first newly submitted team track
  currentLeadIndex: 0,        // Active lead index (0 to 9)
  viewMode: 'reels',          // 'reels' | 'gallery' | 'table'
  selectedSector: 'All Sectors',
  searchQuery: '',
  // Carousel Drag State
  drag: {
    isDragging: false,
    startX: 0,
    currentX: 0
  }
};

// DOM References
const elements = {
  // Search
  spotlightSearchInput: document.getElementById('spotlight-search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  searchResultsTray: document.getElementById('search-results-tray'),

  // Actions
  copySheetsBtn: document.getElementById('copy-sheets-btn'),
  exportCsvBtn: document.getElementById('export-csv-btn'),
  toastBadge: document.getElementById('toast-badge'),

  // Pod Story Dock
  podStoriesList: document.getElementById('pod-stories-list'),

  // Controls & Filters
  sectorFilterPills: document.getElementById('sector-filter-pills'),
  viewReelsBtn: document.getElementById('view-reels-btn'),
  viewGalleryBtn: document.getElementById('view-gallery-btn'),
  viewTableBtn: document.getElementById('view-table-btn'),

  // Reels Stage & Carousel
  reelsStageWrapper: document.getElementById('reels-stage-wrapper'),
  storyProgressStrip: document.getElementById('story-progress-strip'),
  reelsCarouselTrackContainer: document.getElementById('reels-carousel-track-container'),
  reelsCarouselTrack: document.getElementById('reels-carousel-track'),
  carouselPrevBtn: document.getElementById('carousel-prev-btn'),
  carouselNextBtn: document.getElementById('carousel-next-btn'),

  // Alternative Views
  galleryGridWrapper: document.getElementById('gallery-grid-wrapper'),
  tableViewWrapper: document.getElementById('table-view-wrapper'),
  tableViewBody: document.getElementById('table-view-body'),

  // Slide-Over Modal Drawer
  slideoverModalBackdrop: document.getElementById('slideover-modal-backdrop'),
  slideoverCloseBtn: document.getElementById('slideover-close-btn'),
  slideoverContentBody: document.getElementById('slideover-content-body')
};

// SVG Image fallback helper
window.handleImageError = function(img) {
  img.onerror = null;
  const initials = (img.alt || 'FC').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750"><rect width="100%" height="100%" fill="#E7F2EE"/><text x="50%" y="50%" font-family="sans-serif" font-size="110" font-weight="700" fill="#0F4C3A" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
  img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

function imageMarkup(item, className, loading = '') {
  const initials = item.avatarInitials || (item.founderName || item.name || 'FC').split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  if (!item.photoUrl) return `<div class="${className} founder-monogram" aria-label="Portrait unavailable for ${item.founderName || item.name}"><span>${initials}</span></div>`;
  return `<img src="${item.photoUrl}" alt="${item.founderName || item.name}" class="${className}" ${loading} onerror="window.handleImageError(this)" />`;
}

// URL Parameter Deep-Linking
function parseUrlParameters() {
  try {
    const params = new URLSearchParams(window.location.search);
    const fellow = params.get('fellow') || params.get('pod');
    const lead = params.get('lead');
    const view = params.get('view');
    const search = params.get('search');

    if (fellow && FOUNDERS_DATA[fellow]) {
      state.currentFellowId = fellow;
    }
    if (lead) {
      const num = parseInt(lead, 10);
      if (!isNaN(num) && num >= 1 && num <= (FOUNDERS_DATA[state.currentFellowId] || []).length) {
        state.currentLeadIndex = num - 1;
      }
    }
    if (view && ['reels', 'gallery', 'table'].includes(view)) {
      state.viewMode = view;
    }
    if (search) {
      if (elements.spotlightSearchInput) {
        elements.spotlightSearchInput.value = search;
        setTimeout(() => handleSpotlightSearch(search), 100);
      }
    }
  } catch (err) {
    // Ignore URL parse errors
  }
}

// Initialize Application
function init() {
  parseUrlParameters();
  renderPodStories();
  renderSectorPills();
  renderReelsCarousel();
  renderGalleryGrid();
  renderTableView();
  setViewMode(state.viewMode);
  attachEventListeners();
  requestAnimationFrame(() => document.documentElement.classList.add('app-ready'));
}

// Get every researched profile across the visible team tracks.
function getAllLeadsFlat() {
  let list = [];
  Object.keys(FOUNDERS_DATA).forEach(fellowId => {
    list = list.concat(FOUNDERS_DATA[fellowId]);
  });
  return list;
}

// Get the active researcher's available profiles.
function getActiveFellowLeads() {
  return FOUNDERS_DATA[state.currentFellowId] || [];
}

// Render Pod Story Dock (Instagram Stories / Category bar)
function renderPodStories() {
  if (!elements.podStoriesList) return;

  let html = '';
  TEAM_MEMBERS.forEach(fellow => {
    const isActive = state.currentFellowId === fellow.id;
    const leads = FOUNDERS_DATA[fellow.id] || [];

    html += `
      <div 
        class="fellow-story-pill ${isActive ? 'active' : ''}" 
        data-fellow-id="${fellow.id}"
        role="button"
        tabindex="0"
        title="${fellow.name} • ${fellow.focus}"
      >
        <div class="fellow-story-avatar-wrap">
          ${imageMarkup(fellow, 'fellow-story-avatar', 'loading="lazy"')}
        </div>
        <div class="fellow-story-meta">
          <span class="fellow-story-name">${fellow.name}</span>
          <span class="fellow-story-focus">${fellow.focus.split('&')[0].trim()} • <strong>${leads.length} profiles</strong></span>
        </div>
      </div>
    `;
  });

  elements.podStoriesList.innerHTML = html;

  // Click handlers
  elements.podStoriesList.querySelectorAll('[data-fellow-id]').forEach(pill => {
    pill.addEventListener('click', () => {
      state.currentFellowId = pill.dataset.fellowId;
      state.currentLeadIndex = 0; // Reset to 1st lead of this fellow
      renderPodStories();
      renderReelsCarousel();
      renderGalleryGrid();
      renderTableView();
      showToast(`Browsing research by ${pill.querySelector('.fellow-story-name').textContent}`);
    });

    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });
}

// Render Sector Filter Pills
function renderSectorPills() {
  if (!elements.sectorFilterPills) return;

  elements.sectorFilterPills.innerHTML = SECTORS.map(sec => `
    <button class="filter-chip-btn ${state.selectedSector === sec ? 'active' : ''}" data-sector="${sec}">
      ${sec}
    </button>
  `).join('');

  elements.sectorFilterPills.querySelectorAll('[data-sector]').forEach(chip => {
    chip.addEventListener('click', () => {
      state.selectedSector = chip.dataset.sector;
      renderSectorPills();
      renderGalleryGrid();
      renderTableView();
    });
  });
}

// Render Instagram Reels Story Progress Strip
function renderStoryProgressStrip() {
  if (!elements.storyProgressStrip) return;

  const leads = getActiveFellowLeads();
  let html = '';

  for (let i = 0; i < leads.length; i++) {
    const isCompleted = i < state.currentLeadIndex;
    const isActive = i === state.currentLeadIndex;
    const cls = isActive ? 'active' : (isCompleted ? 'completed' : '');

    html += `
      <div 
        class="story-segment ${cls}" 
        data-segment-idx="${i}" 
        title="Jump to Lead #${i + 1}"
      ></div>
    `;
  }

  elements.storyProgressStrip.innerHTML = html;

  elements.storyProgressStrip.querySelectorAll('[data-segment-idx]').forEach(seg => {
    seg.addEventListener('click', () => {
      state.currentLeadIndex = parseInt(seg.dataset.segmentIdx, 10);
      renderReelsCarousel();
    });
  });
}

// Render Reels Active Founder Card
function renderReelsCarousel() {
  renderStoryProgressStrip();

  const leads = getActiveFellowLeads();
  const lead = leads[state.currentLeadIndex] || leads[0];
  if (!lead || !elements.reelsCarouselTrack) return;

  elements.reelsCarouselTrack.innerHTML = `
    <article class="reel-founder-card" data-founder-id="${lead.id}">
      
      <!-- Card Left: Portrait, Badges & White Title Overlay -->
      <div class="reel-hero-column">
        ${imageMarkup(lead, 'reel-portrait-image')}
        <div class="reel-portrait-gradient-overlay"></div>

        <div class="reel-portrait-top-badges">
          <span class="reel-lead-badge">LEAD #${state.currentLeadIndex + 1} OF ${leads.length}</span>
          <span class="reel-metric-pill">${lead.keyMetric || lead.sector}</span>
        </div>

        <div class="reel-portrait-bottom-info">
          <div class="reel-location-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${lead.address || 'Jaipur, Rajasthan'}</span>
          </div>
          <h2 class="reel-founder-title-white">${lead.founderName}</h2>
          <p class="reel-designation-white">${lead.designation}</p>
        </div>
      </div>

      <!-- Card Right: Editorial Story & Research Details -->
      <div class="reel-editorial-column">
        
        <!-- Header Row -->
        <div class="reel-editorial-head">
          <div class="reel-company-identity">
            <div class="reel-company-name-row">
              <span class="reel-company-name">${lead.companyName}</span>
              ${lead.website ? `<a href="${lead.website}" target="_blank" rel="noopener noreferrer" class="reel-company-link-btn" title="Visit company website">
                <span>Website</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              </a>` : ''}
            </div>
            <span class="reel-fellow-attribution">Researched by <strong>${lead.fellowName}</strong> for Founders Connect</span>
          </div>
          <span class="reel-sector-tag">${lead.sector}</span>
        </div>

        <!-- Section 1: Overview & Vision -->
        <div class="reel-story-section">
          <span class="reel-section-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Company & Regional Context
          </span>
          <p class="reel-bio-text">${lead.companySummary || lead.businessModel}</p>
        </div>

        <!-- Section 2: Business Model -->
        <div class="reel-story-section">
          <span class="reel-section-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Business Model & Monetization
          </span>
          <div class="reel-business-model-box">
            ${lead.businessModel}
          </div>
        </div>

        <!-- Section 3: Event Relevance & Credentials -->
        <div class="reel-relevance-card">
          <span class="reel-relevance-title">✦ Why Relevant for Founders Connect (21st Nov)</span>
          <p class="reel-relevance-text">${lead.relevanceToFoundersConnect}</p>
        </div>

        <!-- Card Footer -->
        <div class="reel-card-footer">
          <div class="reel-social-group">
            ${lead.linkedinUrl ? `<a href="${lead.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="social-circle-btn" title="LinkedIn Profile" aria-label="LinkedIn Profile">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>` : ''}
            <span style="font-size: 0.74rem; color: var(--text-muted); font-family: var(--font-mono); margin-left: 4px;">
              Contact: ${lead.publicContact.split('/')[0].trim()}
            </span>
          </div>

          <button id="open-dossier-btn" class="btn-pill-primary" style="padding: 7px 14px; font-size: 0.78rem;">
            <span>View Full Dossier</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>

      </div>
    </article>
  `;

  // Bind Open Dossier Button
  const dossierBtn = document.getElementById('open-dossier-btn');
  if (dossierBtn) {
    dossierBtn.addEventListener('click', () => openSlideoverDossier(lead));
  }
}

// Next Lead
function nextLead() {
  const leads = getActiveFellowLeads();
  state.currentLeadIndex = (state.currentLeadIndex + 1) % leads.length;
  renderReelsCarousel();
}

// Previous Lead
function prevLead() {
  const leads = getActiveFellowLeads();
  state.currentLeadIndex = (state.currentLeadIndex - 1 + leads.length) % leads.length;
  renderReelsCarousel();
}

// Render Airbnb-style Gallery Grid
function renderGalleryGrid() {
  if (!elements.galleryGridWrapper) return;

  let leads = getActiveFellowLeads();

  if (state.selectedSector !== 'All Sectors') {
    leads = leads.filter(l => l.sector === state.selectedSector);
  }

  if (leads.length === 0) {
    elements.galleryGridWrapper.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
        <p style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">No founders in this category</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Try selecting "All Sectors" to see all research leads.</p>
      </div>
    `;
    return;
  }

  elements.galleryGridWrapper.innerHTML = leads.map(lead => `
    <article class="gallery-founder-card" data-gallery-founder-id="${lead.id}">
      <div class="gallery-image-frame">
        ${imageMarkup(lead, 'gallery-founder-img', 'loading="lazy"')}
        <span class="reel-lead-badge" style="position: absolute; top: 12px; left: 12px;">${lead.keyMetric || lead.sector}</span>
      </div>
      <div class="gallery-card-body">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">${lead.founderName}</h3>
            <span style="font-size: 0.76rem; color: var(--color-emerald); font-weight: 600;">${lead.designation}</span>
          </div>
          <span class="reel-sector-tag">${lead.sector.split('&')[0].trim()}</span>
        </div>
        <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-top: 2px;">
          ${lead.companyName}
        </div>
        <div style="font-size: 0.74rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${lead.address || 'Jaipur, Rajasthan'}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 4px;">
          ${lead.businessModel}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
          <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">By ${lead.fellowName.split(' ')[0]}</span>
          <button class="btn-pill-secondary" style="font-size: 0.74rem; padding: 4px 10px;">Details ↗</button>
        </div>
      </div>
    </article>
  `).join('');

  elements.galleryGridWrapper.querySelectorAll('[data-gallery-founder-id]').forEach(card => {
    card.addEventListener('click', () => {
      const all = getAllLeadsFlat();
      const lead = all.find(l => l.id === card.dataset.galleryFounderId);
      if (lead) openSlideoverDossier(lead);
    });
  });
}

// Render Spreadsheet Table View
function renderTableView() {
  if (!elements.tableViewBody) return;

  let leads = getActiveFellowLeads();

  if (state.selectedSector !== 'All Sectors') {
    leads = leads.filter(l => l.sector === state.selectedSector);
  }

  elements.tableViewBody.innerHTML = leads.map((lead, idx) => `
    <tr>
      <td style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);">#${idx + 1}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          ${imageMarkup(lead, 'table-founder-avatar')}
          <div>
            <div style="font-weight: 800; color: var(--text-primary);">${lead.founderName}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${lead.designation}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-weight: 700; color: var(--text-primary);">${lead.companyName}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">${lead.address || 'Jaipur'}</div>
      </td>
      <td><span class="reel-sector-tag">${lead.sector}</span></td>
      <td style="max-width: 260px; font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45;">
        ${lead.businessModel.slice(0, 80)}...
      </td>
      <td>
        <span class="brand-badge" style="background: ${lead.attendedEvents ? 'var(--color-emerald-subtle)' : 'var(--bg-surface-subtle)'}; color: ${lead.attendedEvents ? 'var(--color-emerald)' : 'var(--text-muted)'};">
          ${lead.attendedEvents ? 'Verified' : 'Pending'}
        </span>
      </td>
      <td>
        <button class="btn-pill-secondary" style="font-size: 0.72rem; padding: 4px 10px;" onclick="window.openDossierById('${lead.id}')">
          View
        </button>
      </td>
    </tr>
  `).join('');
}

// Global handler for opening dossier from table
window.openDossierById = function(id) {
  const all = getAllLeadsFlat();
  const lead = all.find(l => l.id === id);
  if (lead) openSlideoverDossier(lead);
};

// Switch View Modes: 'reels' | 'gallery' | 'table'
function setViewMode(mode) {
  state.viewMode = mode;

  elements.viewReelsBtn.classList.toggle('active', mode === 'reels');
  elements.viewGalleryBtn.classList.toggle('active', mode === 'gallery');
  elements.viewTableBtn.classList.toggle('active', mode === 'table');

  if (mode === 'reels') {
    elements.reelsStageWrapper.style.display = 'flex';
    elements.galleryGridWrapper.classList.remove('active');
    elements.tableViewWrapper.classList.remove('active');
  } else if (mode === 'gallery') {
    elements.reelsStageWrapper.style.display = 'none';
    elements.galleryGridWrapper.classList.add('active');
    elements.tableViewWrapper.classList.remove('active');
    renderGalleryGrid();
  } else if (mode === 'table') {
    elements.reelsStageWrapper.style.display = 'none';
    elements.galleryGridWrapper.classList.remove('active');
    elements.tableViewWrapper.classList.add('active');
    renderTableView();
  }
}

// Open Editorial Slide-Over Drawer Modal
function openSlideoverDossier(lead) {
  if (!elements.slideoverModalBackdrop || !elements.slideoverContentBody) return;

  elements.slideoverContentBody.innerHTML = `
    <!-- Top Identity Box -->
    <div style="display: flex; gap: 16px; align-items: flex-start; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
      ${imageMarkup(lead, 'slideover-founder-avatar')}
      <div>
        <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">${lead.founderName}</h2>
        <div style="font-size: 0.86rem; color: var(--color-emerald); font-weight: 600;">${lead.designation} • <strong>${lead.companyName}</strong></div>
        <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
          <span class="brand-badge">${lead.sector}</span>
          <span class="brand-badge" style="background: var(--color-lime-subtle); color: var(--color-charcoal); border-color: rgba(123, 174, 82, 0.4);">
            ${lead.eventAttendanceStatus}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Info Cards Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
      <div style="background: var(--bg-surface-subtle); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <strong style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-emerald); display: block; margin-bottom: 4px;">
          Office Address & Locality:
        </strong>
        <p style="font-size: 0.84rem; color: var(--text-secondary);">${lead.address || 'Jaipur, Rajasthan'}</p>
      </div>

      <div style="background: var(--bg-surface-subtle); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <strong style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-emerald); display: block; margin-bottom: 4px;">
          Public Contact:
        </strong>
        <p style="font-size: 0.84rem; color: var(--text-secondary);">${lead.publicContact || 'Available via corporate channel'}</p>
      </div>
    </div>

    <!-- What the Company Does -->
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <strong style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-emerald);">
        Company Overview & Scale
      </strong>
      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
        ${lead.companySummary || lead.businessModel}
      </p>
    </div>

    <!-- Business Model -->
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <strong style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-emerald);">
        Business Model & Monetization
      </strong>
      <div class="reel-business-model-box" style="margin: 0;">
        ${lead.businessModel}
      </div>
    </div>

    <!-- Previous Events -->
    <div style="display: flex; flex-direction: column; gap: 6px;">
      <strong style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-emerald);">
        Previous Event Participation Details
      </strong>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; padding: 0;">
        ${(lead.previousEvents || ['Active in TiE Rajasthan and state investor meets']).map(ev => `
          <li style="font-size: 0.82rem; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 6px;">
            <span style="color: var(--color-emerald);">✦</span> ${ev}
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- Relevance to Founders Connect -->
    <div class="reel-relevance-card">
      <span class="reel-relevance-title">✦ Strategic Synergy for Founders Connect (21st Nov)</span>
      <p class="reel-relevance-text">${lead.relevanceToFoundersConnect}</p>
    </div>

    <!-- Verification Sources -->
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <strong style="font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted);">
        Research Sources
      </strong>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${(lead.sourceLinks || []).filter(s => s.url).map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="btn-pill-secondary" style="font-size: 0.74rem; padding: 4px 10px;">
            ${s.label} ↗
          </a>
        `).join('')}
      </div>
    </div>

    <!-- Bottom Actions -->
    <div style="display: flex; gap: 10px; justify-content: flex-end; padding-top: 14px; border-top: 1px solid var(--border-subtle); margin-top: auto;">
      ${lead.linkedinUrl ? `<a href="${lead.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn-pill-secondary">LinkedIn Profile ↗</a>` : ''}
      ${lead.website ? `<a href="${lead.website}" target="_blank" rel="noopener noreferrer" class="btn-pill-secondary">Visit Website ↗</a>` : ''}
      <button onclick="document.getElementById('slideover-modal-backdrop').classList.remove('open');" class="btn-pill-primary">Done</button>
    </div>
  `;

  elements.slideoverModalBackdrop.classList.add('open');
}

function closeSlideover() {
  if (elements.slideoverModalBackdrop) {
    elements.slideoverModalBackdrop.classList.remove('open');
  }
}

// Spotlight Search Logic
function handleSpotlightSearch(query) {
  state.searchQuery = query.trim().toLowerCase();

  if (!elements.searchResultsTray) return;

  if (state.searchQuery.length === 0) {
    elements.searchResultsTray.classList.remove('active');
    elements.searchResultsTray.innerHTML = '';
    if (elements.searchClearBtn) elements.searchClearBtn.classList.remove('visible');
    return;
  }

  if (elements.searchClearBtn) elements.searchClearBtn.classList.add('visible');

  const all = getAllLeadsFlat();
  const matches = all.filter(lead => {
    const nameMatch = lead.founderName.toLowerCase().includes(state.searchQuery);
    const companyMatch = lead.companyName.toLowerCase().includes(state.searchQuery);
    const sectorMatch = lead.sector.toLowerCase().includes(state.searchQuery);
    const addressMatch = (lead.address || '').toLowerCase().includes(state.searchQuery);
    const fellowMatch = lead.fellowName.toLowerCase().includes(state.searchQuery);

    return nameMatch || companyMatch || sectorMatch || addressMatch || fellowMatch;
  });

  if (matches.length === 0) {
    elements.searchResultsTray.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        No founders found matching "<strong>${query}</strong>" across name, company, sector, or Jaipur address.
      </div>
    `;
    elements.searchResultsTray.classList.add('active');
    return;
  }

  elements.searchResultsTray.innerHTML = matches.slice(0, 8).map(m => `
    <div class="search-result-row" data-jump-fellow="${m.fellowId}" data-jump-lead-id="${m.id}">
      <div class="search-result-left">
        ${imageMarkup(m, 'search-result-photo')}
        <div>
          <div class="search-result-title">${m.founderName}</div>
          <div class="search-result-desc">${m.designation} • <strong>${m.companyName}</strong></div>
          <div class="search-result-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${m.address || 'Jaipur, Rajasthan'}
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <span class="reel-sector-tag">${m.sector.split('&')[0].trim()}</span>
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">by ${m.fellowName.split(' ')[0]}</div>
      </div>
    </div>
  `).join('');

  elements.searchResultsTray.classList.add('active');

  elements.searchResultsTray.querySelectorAll('[data-jump-fellow]').forEach(row => {
    row.addEventListener('click', () => {
      const fellowId = row.dataset.jumpFellow;
      const leadId = row.dataset.jumpLeadId;
      jumpToLead(fellowId, leadId);
    });
  });
}

// Jump to Lead from search
function jumpToLead(fellowId, leadId) {
  state.currentFellowId = fellowId;
  const leads = FOUNDERS_DATA[fellowId] || [];
  const idx = leads.findIndex(l => l.id === leadId);
  state.currentLeadIndex = idx >= 0 ? idx : 0;

  if (elements.searchResultsTray) elements.searchResultsTray.classList.remove('active');

  setViewMode('reels');
  renderPodStories();
  renderReelsCarousel();
  showToast(`Showing profile for ${leads[state.currentLeadIndex].founderName}`);
}

// Toast helper
function showToast(msg) {
  if (!elements.toastBadge) return;
  elements.toastBadge.textContent = msg;
  elements.toastBadge.classList.add('show');
  setTimeout(() => {
    elements.toastBadge.classList.remove('show');
  }, 2800);
}

// 1-Click TSV Copy for Google Sheets
function copyDataForGoogleSheets() {
  const all = getAllLeadsFlat();

  const headers = [
    "Pod Fellow",
    "Founder Name",
    "Designation",
    "Startup / Company Name",
    "Website",
    "LinkedIn Profile URL",
    "Public Contact",
    "Jaipur Address / Location",
    "Sector",
    "Business Model",
    "Attended Events (Yes/No)",
    "Previous Event Details",
    "Why Relevant to Founders Connect (21st Nov)"
  ];

  const rows = all.map(l => [
    l.fellowName,
    l.founderName,
    l.designation,
    l.companyName,
    l.website,
    l.linkedinUrl,
    l.publicContact,
    l.address || 'Jaipur, Rajasthan',
    l.sector,
    l.businessModel.replace(/[\r\n\t]+/g, ' '),
    l.attendedEvents ? 'Yes' : 'No',
    (l.previousEvents || []).join('; '),
    l.relevanceToFoundersConnect.replace(/[\r\n\t]+/g, ' ')
  ]);

  const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(tsv).then(() => {
      showToast("Data copied! Open Google Sheets and press Ctrl+V to paste.");
    }).catch(() => {
      fallbackCopyText(tsv);
    });
  } else {
    fallbackCopyText(tsv);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast("Data copied! Open Google Sheets and press Ctrl+V to paste.");
  } catch (err) {
    showToast("Failed to copy. Use 'Export CSV' button instead.");
  }
  document.body.removeChild(textArea);
}

// Export CSV File
function exportCSVFile() {
  const all = getAllLeadsFlat();

  const headers = [
    "Pod Fellow",
    "Founder Name",
    "Designation",
    "Startup / Company Name",
    "Website",
    "LinkedIn Profile URL",
    "Public Contact",
    "Jaipur Address / Location",
    "Sector",
    "Business Model",
    "Attended Events (Yes/No)",
    "Previous Event Details",
    "Why Relevant to Founders Connect (21st Nov)",
    "Sources"
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = all.map(l => {
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

  showToast("CSV file exported successfully!");
}

// Attach Event Listeners
function attachEventListeners() {
  // Navigation Buttons
  if (elements.carouselNextBtn) elements.carouselNextBtn.addEventListener('click', nextLead);
  if (elements.carouselPrevBtn) elements.carouselPrevBtn.addEventListener('click', prevLead);

  // View Mode Toggles
  if (elements.viewReelsBtn) elements.viewReelsBtn.addEventListener('click', () => setViewMode('reels'));
  if (elements.viewGalleryBtn) elements.viewGalleryBtn.addEventListener('click', () => setViewMode('gallery'));
  if (elements.viewTableBtn) elements.viewTableBtn.addEventListener('click', () => setViewMode('table'));

  // Spotlight Search Input
  if (elements.spotlightSearchInput) {
    elements.spotlightSearchInput.addEventListener('input', (e) => handleSpotlightSearch(e.target.value));

    elements.spotlightSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = elements.searchResultsTray.querySelector('.search-result-row');
        if (first) first.click();
      } else if (e.key === 'Escape') {
        elements.searchResultsTray.classList.remove('active');
      }
    });
  }

  // Clear search
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      if (elements.spotlightSearchInput) elements.spotlightSearchInput.value = '';
      handleSpotlightSearch('');
    });
  }

  // Click outside to close search dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-wrap')) {
      if (elements.searchResultsTray) elements.searchResultsTray.classList.remove('active');
    }
  });

  // Action Buttons
  if (elements.copySheetsBtn) elements.copySheetsBtn.addEventListener('click', copyDataForGoogleSheets);
  if (elements.exportCsvBtn) elements.exportCsvBtn.addEventListener('click', exportCSVFile);

  // Slide-Over Modal Close
  if (elements.slideoverCloseBtn) elements.slideoverCloseBtn.addEventListener('click', closeSlideover);
  if (elements.slideoverModalBackdrop) {
    elements.slideoverModalBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.slideoverModalBackdrop) closeSlideover();
    });
  }

  // Mouse & Touch Drag Gestures for Carousel (Instagram Reels swipe feel)
  if (elements.reelsCarouselTrackContainer) {
    const track = elements.reelsCarouselTrackContainer;

    // Mouse drag
    track.addEventListener('mousedown', (e) => {
      state.drag.isDragging = true;
      state.drag.startX = e.clientX;
    });

    window.addEventListener('mouseup', (e) => {
      if (!state.drag.isDragging) return;
      state.drag.isDragging = false;
      const diffX = e.clientX - state.drag.startX;
      if (diffX < -50) {
        nextLead();
      } else if (diffX > 50) {
        prevLead();
      }
    });

    // Touch swipe
    track.addEventListener('touchstart', (e) => {
      state.drag.isDragging = true;
      state.drag.startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!state.drag.isDragging) return;
      state.drag.isDragging = false;
      const diffX = e.changedTouches[0].clientX - state.drag.startX;
      if (diffX < -45) {
        nextLead();
      } else if (diffX > 45) {
        prevLead();
      }
    }, { passive: true });
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
      nextLead();
    } else if (e.key === 'ArrowLeft') {
      prevLead();
    } else if (e.key === 'Escape') {
      closeSlideover();
    } else if (e.key === '/') {
      e.preventDefault();
      if (elements.spotlightSearchInput) elements.spotlightSearchInput.focus();
    } else if (e.key >= '1' && e.key <= '9') {
      const targetIndex = parseInt(e.key, 10) - 1;
      if (targetIndex < getActiveFellowLeads().length) {
        state.currentLeadIndex = targetIndex;
        renderReelsCarousel();
      }
    } else if (e.key === '0' && getActiveFellowLeads().length >= 10) {
      state.currentLeadIndex = 9;
      renderReelsCarousel();
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
