const Service = require('../models/Service');
const History = require('../models/History');
const axios = require('axios');

// Helper: Detect category from query
function detectCategory(query) {
  const q = query.toLowerCase();
  if (q.includes('restaurant') || q.includes('food') || q.includes('dine')) return 'restaurant';
  if (q.includes('electrician') || q.includes('electrical') || q.includes('wire')) return 'electrician';
  if (q.includes('plumber') || q.includes('pipe') || q.includes('leak')) return 'plumber';
  if (q.includes('tutor') || q.includes('teacher') || q.includes('tuition')) return 'tutor';
  if (q.includes('mechanic') || q.includes('car repair') || q.includes('garage')) return 'mechanic';
  return null;
}

// Store search query in history
async function storeHistory(query) {
  try {
    await History.create({ query });
  } catch (err) { console.error("History save error:", err); }
}

// --- GROQ AI FALLBACK (structured suggestions) ---
async function getGroqSuggestions(query) {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) return null;
  
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that returns ONLY valid JSON array of Lucknow-based services. Each object has: name, category, rating (4.0-5.0), price (string), phone (string), address (string). Limit to 4 results.' },
        { role: 'user', content: `Suggest real local services for: ${query} in Lucknow. Return JSON array only.` }
      ],
      temperature: 0.7,
      max_tokens: 800
    }, {
      headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' }
    });
    
    let content = response.data.choices[0].message.content;
    // Extract JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions.map(s => ({ ...s, rating: s.rating || 4.2 }));
    }
    return null;
  } catch (err) {
    console.error("Groq API error:", err.message);
    return null;
  }
}

// --- SERPER API (real-time web search fallback) ---
async function getSerperResults(query) {
  const serperKey = process.env.SERPER_API_KEY;
  if (!serperKey) return null;
  
  try {
    const response = await axios.post('https://google.serper.dev/search', {
      q: `${query} in Lucknow India`,
      num: 5
    }, {
      headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' }
    });
    
    const organic = response.data.organic || [];
    if (organic.length === 0) return null;
    
    // Transform Serper results into our service format
    return organic.slice(0, 4).map((item, idx) => ({
      name: item.title.split(' - ')[0].slice(0, 40),
      category: detectCategory(query) || 'service',
      rating: 4.0 + (idx * 0.1),
      price: 'Contact for price',
      phone: '+91 99999 88888',
      address: item.snippet?.slice(0, 80) || 'Lucknow Area'
    }));
  } catch (err) {
    console.error("Serper API error:", err.message);
    return null;
  }
}

// Main search controller
exports.searchServices = async (req, res) => {
  try {
    let { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query required' });
    }
    q = q.trim();
    
    // 1. Store in history (async, don't wait)
    storeHistory(q);
    
    // 2. Search MongoDB (case-insensitive, partial match)
    const category = detectCategory(q);
    let dbQuery = { city: 'Lucknow' };
    if (category) {
      dbQuery.category = category;
    } else {
      // Search in name, category, address
      dbQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } }
      ];
    }
    
    let results = await Service.find(dbQuery).limit(8);
    
    //extra code 
    console.log("Database results found:",results.length);
    // 3. If DB has results -> return immediately
    if (results.length > 0) {
      return res.json({ results, source: 'database' });
    }
    
    // 4. DB empty -> try Groq AI
    let aiResults = await getGroqSuggestions(q);
    if (aiResults && aiResults.length > 0) {
      return res.json({
        results: aiResults,
        source: 'groq',
        message: 'AI generated suggestions based on your search.'
      });
    }
    
    // 5. Last fallback: Serper API (real web)
    let webResults = await getSerperResults(q);
    if (webResults && webResults.length > 0) {
      return res.json({
        results: webResults,
        source: 'serper',
        message: 'Real-time web results. Verify contact details.'
      });
    }
    
    // 6. Absolutely nothing
    return res.json({
      results: [],
      source: 'none',
      aiNote: `No results for "${q}". Try "restaurant in hazratganj" or "electrician near aliganj".`
    });
    
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get search history
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ timestamp: -1 }).limit(10);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Cannot fetch history' });
  }
};

// Clear history
exports.clearHistory = async (req, res) => {
  try {
    await History.deleteMany();
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Clear failed' });
  }
};