document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const exportBtn = document.getElementById('exportBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const selectedCountSpan = document.getElementById('selectedCount');
    const topicInput = document.getElementById('topic');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const apiConfigSection = document.getElementById('apiConfigSection');
    const apiKeyInput = document.getElementById('apiKey');
    const openaiConfig = document.getElementById('openaiConfig');
    const modelOptionsContainer = document.getElementById('modelOptions');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');

    let currentKeywords = {};

    // Initialize OpenAI model options from config
    function initializeModelOptions() {
        CONFIG.openai.models.forEach(model => {
            const label = document.createElement('label');
            label.className = 'flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer';
            label.innerHTML = `
                <input type="radio" name="openaiModel" value="${model.id}" class="mr-3" ${model.id === CONFIG.openai.defaultModel ? 'checked' : ''}>
                <div>
                    <span class="font-medium">${model.name}</span>
                    <p class="text-sm text-gray-500 mt-1">${model.description}</p>
                </div>
            `;
            modelOptionsContainer.appendChild(label);
        });
    }

    initializeModelOptions();

    // API selection handling
    document.querySelectorAll('input[name="api"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const apiConfigSection = document.getElementById('apiConfigSection');
            const openaiConfig = document.getElementById('openaiConfig');
            
            if (e.target.value === 'openai') {
                apiConfigSection.classList.remove('hidden');
                openaiConfig.style.display = 'block';
            } else {
                apiConfigSection.classList.add('hidden');
                openaiConfig.style.display = 'none';
            }
        });
    });

    // Toggle API key visibility
    document.getElementById('toggleApiKey').addEventListener('click', () => {
        const apiKeyInput = document.getElementById('apiKey');
        apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
        errorModal.classList.add('flex');
    }

    async function generateWithOpenAI(topic, apiKey, model) {
        const prompt = `Generate a comprehensive list of SEO keywords for the topic "${topic}". Include different types:
        1. Informational Keywords (how-to, what-is, etc.)
        2. Commercial Keywords (best, top, review, etc.)
        3. Transactional Keywords (buy, purchase, etc.)
        4. Navigational Keywords
        5. Short Tail Keywords
        6. Long Tail Keywords
        7. Exact Match Keywords
        8. Broad Match Keywords
        9. Phrase Match Keywords
        10. Primary Keywords
        11. Secondary Keywords
        12. Competitor Keywords
        13. Customer-Centric Keywords

        Format the response as a JSON object with these categories as keys and arrays of keywords as values.`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{
                        role: "user",
                        content: prompt
                    }],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('OpenAI API request failed');
            }

            const data = await response.json();
            const keywords = JSON.parse(data.choices[0].message.content);
            return keywords;
        } catch (error) {
            throw new Error('Failed to generate keywords with OpenAI: ' + error.message);
        }
    }

    const keywordTypes = {
        informational: {
            title: 'Informational Keywords',
            prefixes: ['how to', 'what is', 'why', 'guide to', 'tutorial', 'tips for', 'best practices', 'learn', 'understanding'],
            suffixes: ['guide', 'tutorial', 'examples', 'tips', 'basics', 'strategies', 'information', 'explained', 'definition']
        },
        commercial: {
            title: 'Commercial Keywords',
            prefixes: ['best', 'top', 'review', 'compare', 'vs', 'alternative to', 'professional', 'premium'],
            suffixes: ['review', 'comparison', 'alternatives', 'vs competition', 'pricing', 'services', 'solutions', 'provider']
        },
        transactional: {
            title: 'Transactional Keywords',
            prefixes: ['buy', 'purchase', 'order', 'shop', 'deal on', 'discount', 'cheap', 'affordable'],
            suffixes: ['for sale', 'discount', 'pricing', 'cost', 'deals', 'cheap', 'price', 'subscription', 'packages']
        },
        navigational: {
            title: 'Navigational Keywords',
            prefixes: ['login', 'sign up', 'download', 'contact', 'access', 'join'],
            suffixes: ['login', 'account', 'support', 'customer service', 'portal', 'platform', 'website', 'app']
        },
        shortTail: {
            title: 'Short Tail Keywords',
            prefixes: ['best', 'top', 'free', 'online'],
            suffixes: ['app', 'tool', 'software', 'service', 'guide']
        },
        longTail: {
            title: 'Long Tail Keywords',
            prefixes: ['best way to', 'how do I', 'what is the best', 'where can I find', 'step by step guide to'],
            suffixes: ['near me', 'in 2024', 'for beginners', 'step by step', 'with examples', 'for small business']
        },
        exactMatch: {
            title: 'Exact Match Keywords',
            prefixes: [''],
            suffixes: ['', 'software', 'service', 'tool', 'platform', 'system']
        },
        broadMatch: {
            title: 'Broad Match Keywords',
            prefixes: ['online', 'digital', 'modern', 'advanced', 'smart'],
            suffixes: ['solutions', 'management', 'system', 'tools', 'techniques']
        },
        phraseMatch: {
            title: 'Phrase Match Keywords',
            prefixes: ['best', 'professional', 'advanced', 'complete'],
            suffixes: ['services', 'solutions', 'guide', 'course', 'training']
        },
        primary: {
            title: 'Primary Keywords',
            prefixes: ['', 'best', 'top', 'professional'],
            suffixes: ['', 'service', 'solution', 'platform']
        },
        secondary: {
            title: 'Secondary Keywords',
            prefixes: ['affordable', 'reliable', 'trusted', 'certified'],
            suffixes: ['provider', 'company', 'agency', 'expert']
        },
        competitor: {
            title: "Competitor's Keywords",
            prefixes: ['alternative to', 'better than', 'vs', 'compare'],
            suffixes: ['alternative', 'competitor', 'comparison', 'vs']
        }
    };

    function generateKeywordsFromTemplate(topic) {
        const keywords = {};
        
        // Generate different types of keywords
        for (const [type, data] of Object.entries(keywordTypes)) {
            keywords[type] = [];
            
            // Generate with prefixes
            data.prefixes.forEach(prefix => {
                if (prefix) {
                    keywords[type].push(`${prefix} ${topic}`);
                }
            });
            
            // Generate with suffixes
            data.suffixes.forEach(suffix => {
                if (suffix) {
                    keywords[type].push(`${topic} ${suffix}`);
                }
            });

            // Add the base topic for exact match
            if (type === 'exactMatch') {
                keywords[type].unshift(topic);
            }
        }

        // Add seed keywords
        keywords.seed = {
            title: 'Seed Keywords',
            keywords: [
                topic,
                topic.toLowerCase(),
                topic.split(' ').join('-'),
                `${topic}s`,
                `${topic} online`,
                `${topic} service`,
                `${topic} platform`,
                `${topic} software`
            ]
        };

        // Add customer-centric keywords
        keywords.customerCentric = {
            title: 'Customer Centric Keywords',
            keywords: [
                `affordable ${topic}`,
                `professional ${topic}`,
                `${topic} for small business`,
                `${topic} for enterprises`,
                `${topic} for startups`,
                `${topic} for beginners`,
                `${topic} for professionals`,
                `custom ${topic}`,
                `${topic} consultation`,
                `${topic} expert`,
                `${topic} specialist`
            ]
        };

        return keywords;
    }

    async function generateKeywords() {
        const topic = document.getElementById('topic').value.trim();
        if (!topic) {
            showError('Please enter a topic');
            return;
        }

        const selectedApi = document.querySelector('input[name="api"]:checked').value;
        
        if (selectedApi === 'openai') {
            const apiKey = document.getElementById('apiKey').value.trim();
            if (!apiKey) {
                showError('Please enter your OpenAI API key');
                return;
            }
            const selectedModel = document.querySelector('input[name="openaiModel"]:checked').value;
            return await generateWithOpenAI(topic, apiKey, selectedModel);
        } else {
            return generateKeywordsFromTemplate(topic);
        }
    }

    function displayResults(keywords) {
        currentKeywords = keywords; // Store keywords for export
        const resultsContainer = document.querySelector('#results .grid');
        resultsContainer.innerHTML = '';

        for (const [type, data] of Object.entries(keywords)) {
            const card = document.createElement('div');
            card.className = 'keyword-card bg-white rounded-lg shadow-lg p-6 animate-fade-in';
            
            const title = data.title || keywordTypes[type]?.title || type.split(/(?=[A-Z])/).join(' ');
            const keywordList = Array.isArray(data) ? data : data.keywords || [];
            
            card.innerHTML = `
                <h3 class="text-lg font-semibold text-indigo-600 mb-4">${title}</h3>
                <ul class="space-y-2">
                    ${keywordList.map(keyword => `
                        <li class="keyword-item p-2 rounded hover:bg-gray-50 flex justify-between items-center" data-keyword="${keyword}">
                            <div class="checkbox"></div>
                            <span class="flex-grow">${keyword}</span>
                            <span class="text-gray-400 text-sm ml-2">${keyword.split(' ').length} words</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            
            resultsContainer.appendChild(card);
        }

        // Add click handlers for keyword selection
        document.querySelectorAll('.keyword-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                updateSelectedCount();
            });
        });

        updateSelectedCount();
    }

    function updateSelectedCount() {
        const selectedCount = document.querySelectorAll('.keyword-item.selected').length;
        selectedCountSpan.textContent = `${selectedCount} keywords selected`;
    }

    function exportToExcel(keywords) {
        const wb = XLSX.utils.book_new();
        const wsData = [];
        const selectedKeywords = document.querySelectorAll('.keyword-item.selected');
        const keywordsByCategory = {};

        // Group selected keywords by their categories
        selectedKeywords.forEach(item => {
            const keyword = item.dataset.keyword;
            let found = false;

            // Find which category this keyword belongs to
            for (const [type, data] of Object.entries(keywords)) {
                const keywordList = Array.isArray(data) ? data : data.keywords || [];
                if (keywordList.includes(keyword)) {
                    if (!keywordsByCategory[type]) {
                        keywordsByCategory[type] = {
                            title: data.title || keywordTypes[type]?.title || type,
                            keywords: []
                        };
                    }
                    keywordsByCategory[type].keywords.push(keyword);
                    found = true;
                    break;
                }
            }
        });

        // Create worksheet data with categorized keywords
        for (const [type, data] of Object.entries(keywordsByCategory)) {
            if (data.keywords.length > 0) {
                wsData.push([data.title]); // Category title
                data.keywords.forEach(keyword => {
                    wsData.push([keyword]);
                });
                wsData.push([]); // Empty row between categories
            }
        }

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Keywords");
        XLSX.writeFile(wb, `${topicInput.value.trim()}_keywords.xlsx`);
    }

    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        if (!topic) return;

        loadingDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');

        setTimeout(() => {
            generateKeywords().then(keywords => {
                displayResults(keywords);
                
                loadingDiv.classList.add('hidden');
                resultsDiv.classList.remove('hidden');
                exportBtn.onclick = () => exportToExcel(currentKeywords);
            });
        }, 1000);
    });

    // Select/Deselect all functionality
    selectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.keyword-item').forEach(item => {
            item.classList.add('selected');
        });
        updateSelectedCount();
    });

    deselectAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.keyword-item').forEach(item => {
            item.classList.remove('selected');
        });
        updateSelectedCount();
    });

    // Enable generate on Enter key
    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
});
