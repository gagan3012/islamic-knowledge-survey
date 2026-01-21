// Taxonomy Tree Visualization using D3.js
// Creates an interactive hierarchical tree diagram for the Islamic Knowledge Survey

let papersData = [];

const taxonomyData = {
  name: "AI Applications in\nIslamic Knowledge",
  children: [
    {
      name: "Foundations",
      category: "pillar",
      color: "#10B981",
      children: [
        {
          name: "Qur'an",
          category: "domain",
          children: [
            {
              name: "Benchmarks",
              category: "topic",
              children: [
                { name: "Aljaji et al. 2025", category: "leaf", citation: "aljaji2025quranBenchmark" },
                { name: "Khalila et al. 2025", category: "leaf", citation: "khalila2025investigating" },
                { name: "Mubarak et al. 2025", category: "leaf", citation: "mubarak-etal-2025-islamiceval" }
              ]
            },
            {
              name: "Corpus Building",
              category: "topic",
              children: [
                { name: "Salman et al. 2025", category: "leaf", citation: "salman2025quranmd" },
                { name: "Akra et al. 2025", category: "leaf", citation: "AHJ25" },
                { name: "Zerrouki & Balla 2017", category: "leaf", citation: "zerrouki2017tashkeela" }
              ]
            },
            {
              name: "Extraction",
              category: "topic",
              children: [
                { name: "Ameen 2024", category: "leaf", citation: "ameen2024ai" },
                { name: "Sahebi et al. 2025", category: "leaf", citation: "sahebi2025quranRefs" },
                { name: "Harrag 2020", category: "leaf", citation: "harrag2020quran" }
              ]
            },
            {
              name: "RAG and Evidence",
              category: "topic",
              children: [
                { name: "Bhatia et al. 2026", category: "leaf", citation: "bhatia2026agenticrag" },
                { name: "Khalila et al. 2025", category: "leaf", citation: "khalila2025quranicrag" },
                { name: "Premasiri et al. 2022", category: "leaf", citation: "premasiri2022dtw" }
              ]
            },
            {
              name: "Search / IR",
              category: "topic",
              children: [
                { name: "Shohoud 2023", category: "leaf", citation: "shohoud2023quranic" },
                { name: "Pavlova et al. 2025", category: "leaf", citation: "pavlova2025multi-stage" },
                { name: "Oshallah et al. 2025", category: "leaf", citation: "oshallah2025crosslanguage" }
              ]
            },
            {
              name: "Speech/Audio",
              category: "topic",
              children: [
                { name: "El-Kheir et al. 2025", category: "leaf", citation: "el-kheir-etal-2025-iqraeval" },
                { name: "Mazid & Ahmad 2025", category: "leaf", citation: "mazid2025tajweedai" },
                { name: "Salameh et al. 2024", category: "leaf", citation: "salameh2024quranic" }
              ]
            },
            {
              name: "Image-text",
              category: "topic",
              children: [
                { name: "Badry et al. 2018", category: "leaf", citation: "badry2018qtid" },
                { name: "Martínez et al. 2025", category: "leaf", citation: "martínez2025a" },
                { name: "Gürer et al. 2025", category: "leaf", citation: "gurer2025textextraction" }
              ]
            },
            {
              name: "Summarization",
              category: "topic",
              children: [
                { name: "Mursheda 2025", category: "leaf", citation: "mursheda2025artificial" }
              ]
            }
          ]
        },
        {
          name: "Hadith",
          category: "domain",
          children: [
            {
              name: "Corpus Building",
              category: "topic",
              children: [
                { name: "Altammami et al. 2020", category: "leaf", citation: "altammami2020hadithparallel" },
                { name: "Namoun et al. 2024", category: "leaf", citation: "namoun2024multimodalScraping" },
                { name: "Sunnah.com 2024", category: "leaf", citation: "sunnah2024" }
              ]
            },
            {
              name: "Safety and Integrity",
              category: "topic",
              children: [
                { name: "Al-Adel et al. 2025", category: "leaf", citation: "al-adel-etal-2025-burhanai" },
                { name: "Omayrah et al. 2025", category: "leaf", citation: "omayrah-etal-2025-humain" },
                { name: "Mubarak et al. 2025", category: "leaf", citation: "mubarak-etal-2025-islamiceval" }
              ]
            },
            {
              name: "Search / IR",
              category: "topic",
              children: [
                { name: "Azmi et al. 2019", category: "leaf", citation: "Azmi2019" },
                { name: "Rushdi 2025", category: "leaf", citation: "rushdi2025techVsCultural" }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Disciplines\n(Ulum)",
      category: "pillar",
      color: "#3B82F6",
      children: [
        {
          name: "Qur'anic Sciences\n(Ulum al-Qur'an)",
          category: "domain",
          children: [
            {
              name: "Extraction",
              category: "topic",
              children: [
                { name: "Hani 2024", category: "leaf", citation: "hani2024predicting" },
                { name: "Hamad et al. 2022", category: "leaf", citation: "hamad2022arabic" },
                { name: "Huda 2021", category: "leaf", citation: "huda2021arabic" }
              ]
            },
            {
              name: "Corpus Building",
              category: "topic",
              children: [
                { name: "Akra et al. 2025", category: "leaf", citation: "AHJ25" },
                { name: "Dukes & Habash 2010", category: "leaf", citation: "dukes2010morphological" }
              ]
            },
            {
              name: "Comparative",
              category: "topic",
              children: [
                { name: "Khan 2025", category: "leaf", citation: "khan2025computationally" },
                { name: "Peuriekeu 2021", category: "leaf", citation: "peuriekeu2021a" }
              ]
            }
          ]
        },
        {
          name: "Hadith Sciences\n(Ulum al-Hadith)",
          category: "domain",
          children: [
            {
              name: "Corpus Building",
              category: "topic",
              children: [
                { name: "Mghari et al. 2022", category: "leaf", citation: "mghari2022sanadset" },
                { name: "Altammami 2023", category: "leaf", citation: "altammami2023quranhadithdatasets" }
              ]
            },
            {
              name: "Extraction",
              category: "topic",
              children: [
                { name: "Mghari et al. 2022", category: "leaf", citation: "mghari2022sanadset" },
                { name: "Azmi et al. 2019", category: "leaf", citation: "Azmi2019" }
              ]
            }
          ]
        },
        {
          name: "Islamic Legal Theory\n(Usul al-Fiqh)",
          category: "domain",
          children: [
            {
              name: "Benchmarks",
              category: "topic",
              children: [
                { name: "Hijazi 2024", category: "leaf", citation: "hijazi2024arablegaleval" },
                { name: "Bahaj et al. 2025", category: "leaf", citation: "bahaj2025mizanqa" },
                { name: "Bouchekif et al. 2025", category: "leaf", citation: "bouchekif-etal-2025-qias" }
              ]
            },
            {
              name: "Reasoning Support",
              category: "topic",
              children: [
                { name: "Bouchekif et al. 2025", category: "leaf", citation: "bouchekif-etal-2025-qias" },
                { name: "Bouchekif 2025", category: "leaf", citation: "bouchekif2025assessing" }
              ]
            }
          ]
        },
        {
          name: "Islamic Jurisprudence\n(Fiqh)",
          category: "domain",
          children: [
            {
              name: "Benchmarks",
              category: "topic",
              children: [
                { name: "Aleid et al. 2025", category: "leaf", citation: "aleid2025hajj" },
                { name: "Bouchekif 2025", category: "leaf", citation: "bouchekif2025assessing" },
                { name: "Bouchekif et al. 2025", category: "leaf", citation: "bouchekif-etal-2025-qias" }
              ]
            },
            {
              name: "RAG and Evidence",
              category: "topic",
              children: [
                { name: "Mohammed et al. 2025", category: "leaf", citation: "mohammed2025aftina" },
                { name: "Benayed et al. 2025", category: "leaf", citation: "benayed2025comparative" },
                { name: "Omarov et al. 2025", category: "leaf", citation: "omarov2025zakatABM" }
              ]
            },
            {
              name: "Safety and Integrity",
              category: "topic",
              children: [
                { name: "Mohammed et al. 2025", category: "leaf", citation: "mohammed2025aftina" },
                { name: "Lahmar et al. 2025", category: "leaf", citation: "lahmar2025islamtrust" },
                { name: "Mushtaq 2025", category: "leaf", citation: "mushtaq2025can" }
              ]
            },
            {
              name: "Corpus Building",
              category: "topic",
              children: [
                { name: "Aleid et al. 2025", category: "leaf", citation: "aleid2025hajj" },
                { name: "Yousef 2025", category: "leaf", citation: "yousef2025islamicdata" }
              ]
            }
          ]
        },
        {
          name: "Theology\n(Ilm al-Kalam)",
          category: "domain",
          children: [
            {
              name: "Benchmarks",
              category: "topic",
              children: [
                { name: "PalmX 2025", category: "leaf", citation: "palmx2025" },
                { name: "Al-Smadi 2025", category: "leaf", citation: "al-smadi-2025-qu" },
                { name: "Atif et al. 2025", category: "leaf", citation: "atif2025sacred" }
              ]
            },
            {
              name: "Safety and Integrity",
              category: "topic",
              children: [
                { name: "Mushtaq 2025", category: "leaf", citation: "mushtaq2025can" },
                { name: "Atif et al. 2025", category: "leaf", citation: "atif2025sacred" },
                { name: "Lahmar et al. 2025", category: "leaf", citation: "lahmar2025islamtrust" }
              ]
            },
            {
              name: "Uncertainty",
              category: "topic",
              children: [
                { name: "Atif et al. 2025", category: "leaf", citation: "atif2025sacred" },
                { name: "Wen et al. 2025", category: "leaf", citation: "wen-etal-2025-know" }
              ]
            }
          ]
        },
        {
          name: "Sufism\n(Tasawwuf)",
          category: "domain",
          children: [
            {
              name: "Safety and Integrity",
              category: "topic",
              children: [
                { name: "Yudiono & Permadi 2025", category: "leaf", citation: "Yudiono_Permadi_2025" }
              ]
            },
            {
              name: "Extraction",
              category: "topic",
              children: [
                { name: "Peuriekeu 2021", category: "leaf", citation: "peuriekeu2021a" }
              ]
            }
          ]
        },
        {
          name: "History and Prophetic\nBiography (Sira)",
          category: "domain",
          children: [
            {
              name: "Benchmarks",
              category: "topic",
              children: [
                { name: "PalmX 2025", category: "leaf", citation: "palmx2025" },
                { name: "Kamaly 2025", category: "leaf", citation: "kamaly2025inclusiveNLP" }
              ]
            },
            {
              name: "Corpus Building",
              category: "topic",
              children: [
                { name: "Saleh 2020", category: "leaf", citation: "saleh2020shamela" },
                { name: "Alrabiah 2014", category: "leaf", citation: "alrabiah2014ksucca" }
              ]
            }
          ]
        }
      ]
    }
  ]
};

function createTaxonomyTree(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  // Set dimensions
  const margin = { top: 20, right: 120, bottom: 20, left: 120 };
  const width = Math.min(container.offsetWidth, 1400) - margin.left - margin.right;
  const height = 900 - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create tree layout
  const tree = d3.tree()
    .size([height, width])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

  // Create hierarchy
  const root = d3.hierarchy(taxonomyData);

  // Assign tree positions
  tree(root);

  // Color function based on category
  function getNodeColor(d) {
    if (d.data.category === 'pillar') return d.data.color || '#10B981';
    if (d.data.category === 'domain') return '#F9E1E1';
    if (d.data.category === 'topic') return '#FFFFFF';
    if (d.data.category === 'leaf') return '#E0E7FF';
    return '#F5C5C5';
  }

  function getStrokeColor(d) {
    if (d.data.category === 'pillar') return d.data.color || '#10B981';
    return '#9CA3AF';
  }

  // Draw links
  svg.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#CBD5E1")
    .attr("stroke-width", 1.5)
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x)
    );

  // Create node groups
  const nodes = svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", d => `node node-${d.data.category}`)
    .attr("transform", d => `translate(${d.y},${d.x})`);

  // Add rectangles for nodes
  nodes.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", d => {
      if (d.data.category === 'pillar') return -45;
      if (d.data.category === 'domain') return -55;
      if (d.data.category === 'topic') return -60;
      return -70;
    })
    .attr("y", d => {
      const lines = d.data.name.split('\n').length;
      return -10 * lines;
    })
    .attr("width", d => {
      if (d.data.category === 'pillar') return 90;
      if (d.data.category === 'domain') return 110;
      if (d.data.category === 'topic') return 120;
      return 140;
    })
    .attr("height", d => {
      const lines = d.data.name.split('\n').length;
      return 20 * lines + 4;
    })
    .attr("fill", d => getNodeColor(d))
    .attr("stroke", d => getStrokeColor(d))
    .attr("stroke-width", 1.5)
    .style("filter", "drop-shadow(1px 2px 2px rgba(0,0,0,0.1))")
    .style("cursor", d => {
      if (d.data.category === 'leaf') {
        const parentTopic = d.parent ? d.parent.data : null;
        return leafHasPapers(d.data.name, parentTopic) ? "pointer" : "not-allowed";
      }
      return "pointer";
    })
    .style("opacity", d => {
      if (d.data.category === 'leaf') {
        const parentTopic = d.parent ? d.parent.data : null;
        return leafHasPapers(d.data.name, parentTopic) ? 1 : 1;
      }
      return 1;
    })
    .on("mouseover", function(d) {
      if (d.data.category === 'leaf') {
        const parentTopic = d.parent ? d.parent.data : null;
        if (!leafHasPapers(d.data.name, parentTopic)) return;
      }
      d3.select(this)
        .transition()
        .duration(200)
        .attr("transform", "scale(1.05)")
        .style("filter", "drop-shadow(2px 4px 4px rgba(0,0,0,0.2))");
    })
    .on("mouseout", function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("transform", "scale(1)")
        .style("filter", "drop-shadow(1px 2px 2px rgba(0,0,0,0.1))");
    })
    .on("click", function(d) {
      if (d.data.category === 'leaf' && d.data.citation) {
        // Navigate to papers page with the citation filter
        window.open(`papers.html?paper=${d.data.citation}`, '_blank');
      } else if (d.data.category === 'topic') {
        // Navigate to papers page filtered by topic
        const domain = d.parent ? d.parent.data.name : '';
        window.open(`papers.html?topic=${encodeURIComponent(d.data.name)}&domain=${encodeURIComponent(domain)}`, '_blank');
      }
    });

  // Add text labels
  nodes.each(function(d) {
    const node = d3.select(this);
    const lines = d.data.name.split('\n');
    const lineHeight = 12;
    const startY = -((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      node.append("text")
        .attr("dy", startY + i * lineHeight + 4)
        .attr("text-anchor", "middle")
        .attr("font-size", d.data.category === 'pillar' ? "11px" : "10px")
        .attr("font-weight", d.data.category === 'pillar' ? "600" : "500")
        .attr("fill", d.data.category === 'pillar' ? "#FFFFFF" : "#374151")
        .style("pointer-events", "none")
        .text(line);
    });
  });

  // Add special styling for root node
  svg.select(".node")
    .select("rect")
    .attr("fill", "#F5C5C5")
    .attr("stroke", "#E5A0A0")
    .attr("x", -70)
    .attr("width", 140);
}

// Load papers data
function loadPapersData() {
    fetch('static/papers/papers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      papersData = data;
      console.log(`Loaded ${papersData.length} papers`);
      // Recreate tree after papers are loaded to update clickability
      if (document.getElementById('taxonomy-tree-container')) {
        createTaxonomyTree('taxonomy-tree-container');
      }
    })
    .catch(error => {
      console.error('Error loading papers data:', error);
    });
}

// Get all leaf names from a topic node
function getAllLeavesFromTopic(topicNode) {
  const leaves = [];
  if (topicNode && topicNode.children) {
    topicNode.children.forEach(child => {
      if (child.category === 'leaf') {
        leaves.push(child.name);
      }
    });
  }
  return leaves;
}

// Check if a leaf has any papers (direct or from parent topic)
function leafHasPapers(leafName, parentTopic) {
  if (!papersData || papersData.length === 0) return false;
  
  // Check for direct papers
  const directPapers = filterPapersByLeaf(leafName);
  if (directPapers.length > 0) return true;
  
  // Check for papers in parent topic
  if (parentTopic) {
    const allLeaves = getAllLeavesFromTopic(parentTopic);
    const topicPapers = filterPapersByLeaves(allLeaves);
    if (topicPapers.length > 0) return true;
  }
  
  return false;
}

// Filter papers by leaf name
function filterPapersByLeaf(leafName) {
  if (!papersData || papersData.length === 0) return [];
  
  return papersData.filter(paper => {
    if (!paper.leaf) return false;
    // Split leaf field by semicolons and check if any match
    const leafCategories = paper.leaf.split(';').map(l => l.trim());
    return leafCategories.includes(leafName);
  });
}

// Filter papers by multiple leaf names
function filterPapersByLeaves(leafNames) {
  if (!papersData || papersData.length === 0) return [];
  
  return papersData.filter(paper => {
    if (!paper.leaf) return false;
    const leafCategories = paper.leaf.split(';').map(l => l.trim());
    return leafNames.some(leafName => leafCategories.includes(leafName));
  });
}

// Show papers popup
function showPapersPopup(leafName, parentTopic) {
  let papers = filterPapersByLeaf(leafName);
  let titleSuffix = '';
  
  // If no papers found for this specific leaf, try other leaves in the same topic
  if (papers.length === 0 && parentTopic) {
    const allLeaves = getAllLeavesFromTopic(parentTopic);
    papers = filterPapersByLeaves(allLeaves);
    titleSuffix = ` (showing papers from ${parentTopic.name})`;
  }
  
  if (papers.length === 0) {
    alert(`No papers found for "${leafName}" or related topics`);
    return;
  }
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'papers-modal';
  modal.innerHTML = `
    <div class="papers-modal-content">
      <div class="papers-modal-header">
        <h2>${leafName}${titleSuffix}</h2>
        <span class="papers-modal-close">&times;</span>
      </div>
      <div class="papers-count">${papers.length} paper${papers.length !== 1 ? 's' : ''} found</div>
      <div class="papers-grid">
        ${papers.map(paper => `
          <div class="paper-card">
            <div class="paper-card-header">
              <h3 class="paper-title">${paper.title}</h3>
            </div>
            <div class="paper-card-body">
              <p class="paper-abstract">${paper.abstract}</p>
              <div class="paper-meta">
                <span class="paper-meta-item"><strong>Stream:</strong> ${paper.stream}</span>
                <span class="paper-meta-item"><strong>Domain:</strong> ${paper.domain}</span>
                <span class="paper-meta-item"><strong>Topic:</strong> ${paper.topic}</span>
              </div>
            </div>
            <div class="paper-card-footer">
              <a href="${paper.url}" target="_blank" class="paper-link">View Paper →</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close handlers
  const closeBtn = modal.querySelector('.papers-modal-close');
  closeBtn.onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  
  // Add escape key handler
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  loadPapersData();
  // Tree will be created after papers load
});

// Reinitialize on window resize
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if (document.getElementById('taxonomy-tree-container')) {
      createTaxonomyTree('taxonomy-tree-container');
    }
  }, 250);
});
