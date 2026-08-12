// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const historyListDiv = document.getElementById('historyList');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultBadge = document.getElementById('resultBadge');
const aiNote = document.getElementById('aiNote');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const quickBtns = document.querySelectorAll('.quick-btn');

// fetch search from backend
async function performSearch(query) {
  if (!query.trim()) {
    resultsContainer.innerHTML = `<div class="bg-gray-50 p-8 text-center text-gray-400 rounded-xl"><i class="fas fa-info-circle"></i> Please enter a service or category</div>`;
    return;
  }
  showLoading(true);
  aiNote.classList.add('hidden');
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    showLoading(false);
    
    if (response.ok) {
      // data: { results: [], source: 'database' or 'groq' or 'serper', aiFallbackMessage? }
      const services = data.results || [];
      const source = data.source || 'database';
      const rendered = renderResults(services, source);
      
      if (!rendered && services.length === 0) {
        // special fallback message from AI maybe
        if (data.aiNote) {
          aiNote.innerHTML = `<div class="bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-200 text-sm"><i class="fas fa-robot mr-2"></i> ${escapeHtml(data.aiNote)}</div>`;
          aiNote.classList.remove('hidden');
        } else {
          aiNote.innerHTML = `<div class="bg-gray-50 p-3 rounded-lg text-gray-600 text-sm"><i class="fas fa-globe"></i> No results found. Try 'restaurant in hazratganj' or 'electrician near me'</div>`;
          aiNote.classList.remove('hidden');
        }
      } else {
        // if we have results but came from groq/serper, show note
        if (source === 'groq' || source === 'serper') {
          aiNote.innerHTML = `<div class="bg-indigo-50 p-3 rounded-lg text-indigo-700 text-sm border border-indigo-100"><i class="fas fa-magic mr-1"></i> AI enhanced results: ${data.message || 'Showing real-time suggestions'}</div>`;
          aiNote.classList.remove('hidden');
        } else {
          aiNote.classList.add('hidden');
        }
      }
      // refresh history after any search (backend already stored)
      await loadHistory();
    } else {
      // error handling
      resultsContainer.innerHTML = `<div class="bg-red-50 p-6 rounded-xl text-red-600"><i class="fas fa-exclamation-triangle"></i> ${data.error || 'Server error. Check backend.'}</div>`;
    }
  } catch (err) {
    showLoading(false);
    resultsContainer.innerHTML = `<div class="bg-red-50 p-6 rounded-xl text-red-600"><i class="fas fa-plug"></i> Cannot connect to backend. Make sure server runs on port 5000.</div>`;
    console.error(err);
  }
}

// Load search history from backend
async function loadHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/history`);
    const data = await res.json();
    if (data.history && data.history.length) {
      let html = '';
      data.history.slice().reverse().forEach(item => {
        html += `<div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-sm hover:bg-gray-100 transition group">
                    <button class="history-item text-left flex-1 text-gray-700 font-medium truncate" data-query="${escapeHtml(item.query)}">🔍 ${escapeHtml(item.query.length > 35 ? item.query.slice(0,32)+'...' : item.query)}</button>
                    <span class="text-xs text-gray-400">${new Date(item.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                  </div>`;
      });
      historyListDiv.innerHTML = html;
      // attach click events to each history button
      document.querySelectorAll('.history-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const q = btn.getAttribute('data-query');
          if(q) {
            searchInput.value = q;
            performSearch(q);
          }
        });
      });
    } else {
      historyListDiv.innerHTML = `<div class="text-gray-400 text-sm italic text-center py-4">No recent searches</div>`;
    }
  } catch(err) {
    historyListDiv.innerHTML = `<div class="text-red-400 text-xs">History unavailable (backend off?)</div>`;
  }
}

async function clearHistory() {
  try {
    await fetch(`${API_BASE_URL}/history`, { method: 'DELETE' });
    await loadHistory();
  } catch(e) { console.warn(e); }
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if(q) performSearch(q);
  else resultsContainer.innerHTML = `<div class="bg-yellow-50 p-4 rounded-xl text-yellow-700">Please type something (e.g., restaurant, plumber).</div>`;
});

searchInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') searchBtn.click();
});

clearHistoryBtn.addEventListener('click', clearHistory);

quickBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.getAttribute('data-quick');
    const queryMap = { restaurant:'best restaurant in Lucknow', electrician:'electrician near aliganj', plumber:'plumber in hazratganj', tutor:'home tutor gomtinagar', mechanic:'car mechanic lucknow' };
    const queryText = queryMap[cat] || cat;
    searchInput.value = queryText;
    performSearch(queryText);
  });
});

// initial load history
loadHistory();