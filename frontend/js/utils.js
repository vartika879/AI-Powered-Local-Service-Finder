// Helper: show/hide loading
function showLoading(show) {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (show) loadingOverlay.classList.remove('hidden');
  else loadingOverlay.classList.add('hidden');
}

function getCategoryIcon(cat) {
  const map = { restaurant:'🍽️', electrician:'⚡', plumber:'🔧', tutor:'📚', mechanic:'🚗' };
  return map[cat?.toLowerCase()] || '🔍';
}

function escapeHtml(str) { 
  if(!str) return ''; 
  return str.replace(/[&<>]/g, function(m){
    if(m==='&') return '&amp;'; 
    if(m==='<') return '&lt;'; 
    if(m==='>') return '&gt;'; 
    return m;
  }); 
}

// Helper: render service cards
function renderResults(services, source = 'database') {
  const resultsContainer = document.getElementById('resultsContainer');
  const resultBadge = document.getElementById('resultBadge');
  const aiNote = document.getElementById('aiNote');
  
  if (!services || services.length === 0) {
    resultsContainer.innerHTML = `
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <i class="fas fa-face-frown text-3xl text-amber-400 mb-2"></i>
        <p class="text-gray-700 font-medium">No results found locally.</p>
        <p class="text-sm text-gray-500 mt-1">Trying AI / web suggestions...</p>
      </div>
    `;
    resultBadge.innerText = '0 results';
    return false;
  }
  
  let cardsHtml = '';
  services.forEach(service => {
    const ratingStars = '★'.repeat(Math.floor(service.rating || 4)) + '☆'.repeat(5 - Math.floor(service.rating || 4));
    const categoryIcon = getCategoryIcon(service.category);
    cardsHtml += `
      <div class="card-hover bg-white rounded-xl border border-gray-200 p-5 shadow-sm transition">
        <div class="flex flex-wrap justify-between items-start gap-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">${categoryIcon}</div>
            <div>
              <h3 class="font-bold text-lg text-gray-800">${escapeHtml(service.name)}</h3>
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-0.5">
                <span><i class="fas fa-tag mr-1"></i>${escapeHtml(service.category)}</span>
                <span><i class="fas fa-star text-yellow-400 mr-1"></i>${service.rating || '4.0'} ${ratingStars}</span>
                ${service.price ? `<span><i class="fas fa-rupee-sign mr-1"></i>${service.price}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="text-right text-sm">
            <div class="text-gray-700"><i class="fas fa-phone-alt text-green-500 mr-1"></i>${service.phone || '+91 99888 77777'}</div>
            <div class="text-gray-500 text-xs mt-1"><i class="fas fa-map-pin mr-1"></i>${escapeHtml(service.address || 'Lucknow, UP')}</div>
          </div>
        </div>
      </div>
    `;
  });
  resultsContainer.innerHTML = cardsHtml;
  const sourceText = source === 'database' ? '📀 Local DB' : (source === 'ai_suggestion' ? '🤖 AI Suggestion' : '🌐 Real-time Web');
  resultBadge.innerHTML = `${services.length} found · ${sourceText}`;
  return true;
}