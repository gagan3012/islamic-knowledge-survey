// Papers Loader - Dynamically loads papers from CSV file
// and creates interactive filtering and display

let allPapers = [];
let filteredPapers = [];
let currentPage = 1;
const papersPerPage = 12;
let currentFilter = 'all';
let searchQuery = '';

// Stream colors for visual categorization
const streamColors = {
  'Scriptural Sources': { bg: 'linear-gradient(135deg, #10B981, #059669)', border: '#10B981' },
  'Law & Practice': { bg: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: '#3B82F6' },
  'History & Heritage': { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', border: '#F59E0B' },
  'Education & Community': { bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', border: '#8B5CF6' },
  'Objectives & Governance': { bg: 'linear-gradient(135deg, #EF4444, #DC2626)', border: '#EF4444' },
  'Shared Resources': { bg: 'linear-gradient(135deg, #6B7280, #4B5563)', border: '#6B7280' }
};

// Stream icons
const streamIcons = {
  'Scriptural Sources': 'fa-book-quran',
  'Law & Practice': 'fa-balance-scale',
  'History & Heritage': 'fa-landmark',
  'Education & Community': 'fa-graduation-cap',
  'Objectives & Governance': 'fa-shield-alt',
  'Shared Resources': 'fa-database'
};

// Parse CSV data
function parseCSV(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const papers = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    // Handle CSV with quoted fields
    const row = parseCSVLine(lines[i]);
    if (row.length < headers.length) continue;

    const paper = {};
    headers.forEach((header, index) => {
      paper[header] = row[index] || '';
    });

    if (paper.title && paper.stream) {
      papers.push(paper);
    }
  }

  return papers;
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Load papers from CSV
async function loadPapers() {
  try {
    const response = await fetch('../papers/Papers Islamic Survey - Sheet3.csv');
    const csvText = await response.text();
    allPapers = parseCSV(csvText);
    filteredPapers = [...allPapers];

    // Initialize UI
    createFilterTabs();
    createSearchBar();
    renderPapers();
    updateStats();

    console.log(`Loaded ${allPapers.length} papers`);
  } catch (error) {
    console.error('Error loading papers:', error);
    const container = document.getElementById('papers-grid');
    if (container) {
      container.innerHTML =
        '<p class="error-message">Error loading papers. Please try again later.</p>';
    }
  }
}

// Create filter tabs
function createFilterTabs() {
  const tabsContainer = document.getElementById('filter-tabs');
  if (!tabsContainer) return;

  const streams = ['all', ...new Set(allPapers.map(p => p.stream).filter(Boolean))];

  tabsContainer.innerHTML = streams.map(stream => {
    const count = stream === 'all' ? allPapers.length : allPapers.filter(p => p.stream === stream).length;
    const isActive = stream === currentFilter;
    const color = stream === 'all' ? '#1F2937' : (streamColors[stream]?.border || '#6B7280');

    return `
      <button class="filter-tab ${isActive ? 'active' : ''}"
              data-stream="${stream}"
              style="--tab-color: ${color};"
              onclick="filterByStream('${stream}')">
        ${stream === 'all' ? '<i class="fas fa-layer-group"></i>' : `<i class="fas ${streamIcons[stream] || 'fa-tag'}"></i>`}
        <span>${stream === 'all' ? 'All Papers' : stream}</span>
        <span class="tab-count">${count}</span>
      </button>
    `;
  }).join('');
}

// Create search bar
function createSearchBar() {
  const searchContainer = document.getElementById('search-container');
  if (!searchContainer) return;

  searchContainer.innerHTML = `
    <div class="search-wrapper">
      <i class="fas fa-search search-icon"></i>
      <input type="text"
             id="paper-search"
             placeholder="Search papers by title, abstract, or domain..."
             oninput="handleSearch(this.value)">
      <button class="search-clear" onclick="clearSearch()" style="display: none;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

// Filter by stream
function filterByStream(stream) {
  currentFilter = stream;
  currentPage = 1;

  if (stream === 'all') {
    filteredPapers = allPapers.filter(p => matchesSearch(p));
  } else {
    filteredPapers = allPapers.filter(p => p.stream === stream && matchesSearch(p));
  }

  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.stream === stream);
  });

  renderPapers();
  updateStats();
}

// Handle search
function handleSearch(query) {
  searchQuery = query.toLowerCase().trim();
  currentPage = 1;

  const clearBtn = document.querySelector('.search-clear');
  if (clearBtn) {
    clearBtn.style.display = searchQuery ? 'block' : 'none';
  }

  filterByStream(currentFilter);
}

// Clear search
function clearSearch() {
  document.getElementById('paper-search').value = '';
  searchQuery = '';
  handleSearch('');
}

// Check if paper matches search query
function matchesSearch(paper) {
  if (!searchQuery) return true;

  return (
    paper.title?.toLowerCase().includes(searchQuery) ||
    paper.abstract?.toLowerCase().includes(searchQuery) ||
    paper.domain?.toLowerCase().includes(searchQuery) ||
    paper.topic?.toLowerCase().includes(searchQuery) ||
    paper.leaf?.toLowerCase().includes(searchQuery)
  );
}

// Render papers grid
function renderPapers() {
  const container = document.getElementById('papers-grid');
  if (!container) return;

  const start = (currentPage - 1) * papersPerPage;
  const end = start + papersPerPage;
  const pagePapers = filteredPapers.slice(start, end);

  if (pagePapers.length === 0) {
    container.innerHTML = `
      <div class="no-papers">
        <i class="fas fa-search" style="font-size: 3rem; color: #CBD5E1; margin-bottom: 1rem;"></i>
        <p>No papers found matching your criteria.</p>
        <button class="btn-secondary" onclick="clearSearch(); filterByStream('all');">
          Show All Papers
        </button>
      </div>
    `;
    document.getElementById('pagination-container').innerHTML = '';
    return;
  }

  container.innerHTML = pagePapers.map(paper => createPaperCard(paper)).join('');
  renderPagination();
}

// Create paper card HTML
function createPaperCard(paper) {
  const colorStyle = streamColors[paper.stream] || streamColors['Shared Resources'];

  return `
    <article class="paper-card" style="--card-border-color: ${colorStyle.border}">
      <div class="paper-card-header">
        <span class="paper-stream-badge" style="background: ${colorStyle.bg}">
          <i class="fas ${streamIcons[paper.stream] || 'fa-tag'}"></i>
          ${paper.stream}
        </span>
      </div>

      <h3 class="paper-title">${escapeHtml(paper.title)}</h3>

      <p class="paper-abstract">${truncateText(escapeHtml(paper.abstract), 200)}</p>

      <div class="paper-tags">
        ${paper.domain ? `<span class="paper-tag domain-tag"><i class="fas fa-folder"></i> ${escapeHtml(paper.domain)}</span>` : ''}
        ${paper.topic ? `<span class="paper-tag topic-tag"><i class="fas fa-tag"></i> ${escapeHtml(paper.topic)}</span>` : ''}
      </div>

      ${paper.leaf ? `<div class="paper-methods"><small><i class="fas fa-cogs"></i> ${escapeHtml(paper.leaf)}</small></div>` : ''}

      <div class="paper-actions">
        ${paper.url ? `
          <a href="${escapeHtml(paper.url)}" target="_blank" rel="noopener" class="paper-link-btn">
            <i class="fas fa-external-link-alt"></i> View Paper
          </a>
        ` : ''}
      </div>
    </article>
  `;
}

// Render pagination
function renderPagination() {
  const container = document.getElementById('pagination-container');
  if (!container) return;

  const totalPages = Math.ceil(filteredPapers.length / papersPerPage);

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let paginationHTML = '<div class="pagination">';

  // Previous button
  paginationHTML += `
    <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}"
            onclick="goToPage(${currentPage - 1})"
            ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fas fa-chevron-left"></i>
    </button>
  `;

  // Page numbers
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<span class="page-ellipsis">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}"
              onclick="goToPage(${i})">${i}</button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span class="page-ellipsis">...</span>`;
    }
    paginationHTML += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  // Next button
  paginationHTML += `
    <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}"
            onclick="goToPage(${currentPage + 1})"
            ${currentPage === totalPages ? 'disabled' : ''}>
      <i class="fas fa-chevron-right"></i>
    </button>
  `;

  paginationHTML += '</div>';
  container.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
  const totalPages = Math.ceil(filteredPapers.length / papersPerPage);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderPapers();

  // Scroll to papers section
  document.getElementById('papers-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update statistics display
function updateStats() {
  const statsContainer = document.getElementById('papers-stats');
  if (!statsContainer) return;

  const streamCounts = {};
  allPapers.forEach(p => {
    streamCounts[p.stream] = (streamCounts[p.stream] || 0) + 1;
  });

  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card total">
        <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
        <div class="stat-content">
          <span class="stat-number">${allPapers.length}</span>
          <span class="stat-label">Total Papers</span>
        </div>
      </div>
      <div class="stat-card showing">
        <div class="stat-icon"><i class="fas fa-filter"></i></div>
        <div class="stat-content">
          <span class="stat-number">${filteredPapers.length}</span>
          <span class="stat-label">Showing</span>
        </div>
      </div>
      ${Object.entries(streamCounts).slice(0, 4).map(([stream, count]) => `
        <div class="stat-card stream" style="--stat-color: ${streamColors[stream]?.border || '#6B7280'}">
          <div class="stat-icon"><i class="fas ${streamIcons[stream] || 'fa-tag'}"></i></div>
          <div class="stat-content">
            <span class="stat-number">${count}</span>
            <span class="stat-label">${stream.split(' ')[0]}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Utility: Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Utility: Truncate text
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('papers-grid') || document.getElementById('filter-tabs')) {
    loadPapers();
  }
});
