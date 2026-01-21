// Papers Page JavaScript
// Handles loading, filtering, and displaying papers
// papersDatabase is loaded from papers-database.js

// DOM Elements
let papersContainer;
let searchInput;
let filterPillar;
let filterDomain;
let filterTopic;
let filterYear;
let clearFiltersBtn;
let paperModal;
let modalClose;
let modalBody;
let paperCount;
let noResults;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    papersContainer = document.getElementById('papers-container');
    searchInput = document.getElementById('search-input');
    filterPillar = document.getElementById('filter-pillar');
    filterDomain = document.getElementById('filter-domain');
    filterTopic = document.getElementById('filter-topic');
    filterYear = document.getElementById('filter-year');
    clearFiltersBtn = document.getElementById('clear-filters');
    paperModal = document.getElementById('paper-modal');
    modalClose = document.getElementById('modal-close');
    modalBody = document.getElementById('modal-body');
    paperCount = document.getElementById('paper-count');
    noResults = document.getElementById('no-results');
    
    // Populate filter options
    populateFilters();
    
    // Check URL parameters for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const paperParam = urlParams.get('paper');
    const topicParam = urlParams.get('topic');
    const domainParam = urlParams.get('domain');
    
    if (paperParam) {
        // Open specific paper modal
        setTimeout(() => {
            openPaperModal(paperParam);
        }, 100);
        renderPapers(papersDatabase);
    } else if (topicParam || domainParam) {
        // Apply filters from URL
        if (domainParam) {
            // Find the pillar for this domain
            const paper = papersDatabase.find(p => p.domain.includes(domainParam.split('(')[0].trim()));
            if (paper) {
                filterPillar.value = paper.pillar;
                updateDomainOptions();
            }
            filterDomain.value = domainParam;
            updateTopicOptions();
        }
        if (topicParam) {
            filterTopic.value = topicParam;
        }
        applyFilters();
    } else {
        // Render all papers
        renderPapers(papersDatabase);
    }
    
    // Event listeners
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    filterPillar.addEventListener('change', () => {
        updateDomainOptions();
        applyFilters();
    });
    filterDomain.addEventListener('change', () => {
        updateTopicOptions();
        applyFilters();
    });
    filterTopic.addEventListener('change', applyFilters);
    filterYear.addEventListener('change', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    modalClose.addEventListener('click', closeModal);
    paperModal.addEventListener('click', (e) => {
        if (e.target === paperModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

// Populate filter dropdowns
function populateFilters() {
    // Get unique values
    const domains = [...new Set(papersDatabase.map(p => p.domain))].sort();
    const topics = [...new Set(papersDatabase.map(p => p.topic))].sort();
    const years = [...new Set(papersDatabase.map(p => p.year))].sort((a, b) => b - a);
    
    // Populate year filter
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        filterYear.appendChild(option);
    });
    
    // Initial population of domain and topic
    updateDomainOptions();
    updateTopicOptions();
}

function updateDomainOptions() {
    const selectedPillar = filterPillar.value;
    let domains;
    
    if (selectedPillar) {
        domains = [...new Set(papersDatabase
            .filter(p => p.pillar === selectedPillar)
            .map(p => p.domain))].sort();
    } else {
        domains = [...new Set(papersDatabase.map(p => p.domain))].sort();
    }
    
    filterDomain.innerHTML = '<option value="">All Domains</option>';
    domains.forEach(domain => {
        const option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        filterDomain.appendChild(option);
    });
}

function updateTopicOptions() {
    const selectedDomain = filterDomain.value;
    let topics;
    
    if (selectedDomain) {
        topics = [...new Set(papersDatabase
            .filter(p => p.domain === selectedDomain)
            .map(p => p.topic))].sort();
    } else {
        topics = [...new Set(papersDatabase.map(p => p.topic))].sort();
    }
    
    filterTopic.innerHTML = '<option value="">All Tasks</option>';
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        filterTopic.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const pillar = filterPillar.value;
    const domain = filterDomain.value;
    const topic = filterTopic.value;
    const year = filterYear.value;
    
    const filtered = papersDatabase.filter(paper => {
        // Search filter
        const searchMatch = !searchTerm || 
            paper.title.toLowerCase().includes(searchTerm) ||
            paper.authors.toLowerCase().includes(searchTerm) ||
            paper.abstract.toLowerCase().includes(searchTerm) ||
            (paper.keywords && paper.keywords.some(k => k.toLowerCase().includes(searchTerm)));
        
        // Category filters
        const pillarMatch = !pillar || paper.pillar === pillar;
        const domainMatch = !domain || paper.domain === domain;
        const topicMatch = !topic || paper.topic === topic;
        const yearMatch = !year || paper.year.toString() === year;
        
        return searchMatch && pillarMatch && domainMatch && topicMatch && yearMatch;
    });
    
    renderPapers(filtered);
}

// Clear all filters
function clearFilters() {
    searchInput.value = '';
    filterPillar.value = '';
    filterDomain.value = '';
    filterTopic.value = '';
    filterYear.value = '';
    updateDomainOptions();
    updateTopicOptions();
    renderPapers(papersDatabase);
}

// Render papers
function renderPapers(papers) {
    paperCount.textContent = papers.length;
    
    if (papers.length === 0) {
        papersContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    papersContainer.innerHTML = papers.map(paper => `
        <div class="paper-card" onclick="openPaperModal('${paper.id}')">
            <div class="paper-card-header">
                <h3 class="paper-title">${paper.title}</h3>
                <p class="paper-authors">${paper.authors}</p>
            </div>
            <div class="paper-card-body">
                <p class="paper-abstract">${paper.abstract}</p>
            </div>
            <div class="paper-card-footer">
                <div class="paper-tags">
                    <span class="paper-tag tag-pillar">${paper.pillar}</span>
                    <span class="paper-tag tag-domain">${paper.domain.split('(')[0].trim()}</span>
                    <span class="paper-tag tag-topic">${paper.topic}</span>
                    <span class="paper-tag tag-year">${paper.year}</span>
                </div>
                <div class="paper-links">
                    ${paper.url ? `<a href="${paper.url}" target="_blank" class="paper-link" onclick="event.stopPropagation()" title="View Paper"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    ${paper.arxiv ? `<a href="https://arxiv.org/abs/${paper.arxiv}" target="_blank" class="paper-link" onclick="event.stopPropagation()" title="arXiv"><i class="ai ai-arxiv"></i></a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Open paper modal
function openPaperModal(paperId) {
    const paper = papersDatabase.find(p => p.id === paperId);
    if (!paper) return;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${paper.title}</h2>
            <p class="modal-authors"><i class="fas fa-users"></i> ${paper.authors}</p>
            <div class="modal-meta">
                <span class="paper-tag tag-pillar">${paper.pillar}</span>
                <span class="paper-tag tag-domain">${paper.domain}</span>
                <span class="paper-tag tag-topic">${paper.topic}</span>
                <span class="paper-tag tag-year">${paper.year}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Abstract</h3>
            <p class="modal-abstract">${paper.abstract}</p>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Publication Details</h3>
            <div class="modal-taxonomy">
                <div class="taxonomy-item">
                    <div class="taxonomy-label">Venue</div>
                    <div class="taxonomy-value">${paper.venue}</div>
                </div>
                <div class="taxonomy-item">
                    <div class="taxonomy-label">Year</div>
                    <div class="taxonomy-value">${paper.year}</div>
                </div>
                ${paper.doi ? `
                <div class="taxonomy-item">
                    <div class="taxonomy-label">DOI</div>
                    <div class="taxonomy-value"><a href="https://doi.org/${paper.doi}" target="_blank">${paper.doi}</a></div>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Taxonomy Classification</h3>
            <div class="modal-taxonomy">
                <div class="taxonomy-item">
                    <div class="taxonomy-label">Pillar</div>
                    <div class="taxonomy-value">${paper.pillar}</div>
                </div>
                <div class="taxonomy-item">
                    <div class="taxonomy-label">Domain</div>
                    <div class="taxonomy-value">${paper.domain}</div>
                </div>
                <div class="taxonomy-item">
                    <div class="taxonomy-label">AI Task</div>
                    <div class="taxonomy-value">${paper.topic}</div>
                </div>
            </div>
        </div>
        
        ${paper.keywords && paper.keywords.length > 0 ? `
        <div class="modal-section">
            <h3 class="modal-section-title">Keywords</h3>
            <div class="paper-tags">
                ${paper.keywords.map(k => `<span class="paper-tag" style="background: rgba(139, 92, 246, 0.1); color: #8B5CF6;">${k}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="modal-section">
            <h3 class="modal-section-title">Links</h3>
            <div class="modal-links">
                ${paper.url ? `<a href="${paper.url}" target="_blank" class="modal-link-btn primary"><i class="fas fa-external-link-alt"></i> View Paper</a>` : ''}
                ${paper.arxiv ? `<a href="https://arxiv.org/abs/${paper.arxiv}" target="_blank" class="modal-link-btn arxiv"><i class="ai ai-arxiv"></i> arXiv</a>` : ''}
                ${paper.doi ? `<a href="https://doi.org/${paper.doi}" target="_blank" class="modal-link-btn secondary"><i class="fas fa-book"></i> DOI</a>` : ''}
                ${paper.url && paper.url.includes('aclanthology') ? `<a href="${paper.url}" target="_blank" class="modal-link-btn acl"><i class="fas fa-file-alt"></i> ACL Anthology</a>` : ''}
                ${paper.url && paper.url.includes('semanticscholar') ? `<a href="${paper.url}" target="_blank" class="modal-link-btn semantic"><i class="ai ai-semantic-scholar"></i> Semantic Scholar</a>` : ''}
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title">Citation</h3>
            <div class="modal-citation">${generateCitation(paper)}</div>
            <button class="copy-btn" onclick="copyCitation('${paper.id}')">
                <i class="fas fa-copy"></i> Copy Citation
            </button>
        </div>
    `;
    
    paperModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    paperModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Generate citation
function generateCitation(paper) {
    const authors = paper.authors.split(',')[0].split(' ').pop();
    const etAl = paper.authors.includes(',') ? ' et al.' : '';
    return `${authors}${etAl} (${paper.year}). ${paper.title}. ${paper.venue}.${paper.doi ? ` https://doi.org/${paper.doi}` : ''}`;
}

// Copy citation
function copyCitation(paperId) {
    const paper = papersDatabase.find(p => p.id === paperId);
    if (!paper) return;
    
    const citation = generateCitation(paper);
    navigator.clipboard.writeText(citation).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
