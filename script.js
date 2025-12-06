document.addEventListener('DOMContentLoaded', () => {

    // State
    let availableArticles = [];
    const defaultTone = 'news';

    // Nodes
    const topicInput = document.getElementById('topicInput');
    const trendingBtn = document.getElementById('trendingBtn');
    const contextInput = document.getElementById('contextInput');
    const fetchNewsBtn = document.getElementById('fetchNewsBtn');
    const countrySelect = document.getElementById('countrySelect');
    const generateBtn = document.getElementById('generateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const loader = document.getElementById('loader');

    // Templates Database
    const templates = {
        twitter: {
            professional: [
                "Excited to share some thoughts on {topic}. Key takeaway: consistency is key. 🚀 #Leadership #Growth #{topic}",
                "Exploring the impact of {topic} on today's market. The results are promising. 📈 What are your thoughts? #{topic} #Business",
                "Just published a deep dive into {topic}. It's time to rethink our strategies. 💡 #{topic} #Innovation"
            ],
            news: [
                "{context}\n\n#{topic} #News",
                "📰 {context}\n\n#{topic}",
                "{context}\n\nThoughts? #{topic}"
            ],
            witty: [
                "They say money can't buy happiness, but have you tried {topic}? 😏 #LifeHacks #{topic}",
                "Me vs {topic}: The ultimate showdown. Spoiler: {topic} wins every time. 🏳️ #{topic} #WeekendVibes",
                "Current mood: 50% caffeine, 50% {topic}. ☕ #{topic} #Relatable"
            ],
            inspirational: [
                "Believe in the power of {topic}. It starts with a single step. ✨ #{topic} #Motivation",
                "{topic} isn't just a goal, it's a journey. Embrace it. 🌟 #{topic} #Inspiration",
                "The future belongs to those who understand {topic}. Dream big. 🚀 #{topic} #Future"
            ],
            educational: [
                "Did you know? {topic} can increase productivity by 20%. Here's how: 🧵 👇 #{topic} #Edu",
                "3 Quick Tips for mastering {topic}: 1. Start small 2. Be consistent 3. Analyze results. 📊 #{topic} #Tips",
                "Demystifying {topic}: It's simpler than you think. Let's break it down. 🧠 #{topic} #Learning"
            ],
            entertainment: [
                "{context}\n\n🎬 #{topic} #Entertainment",
                "🍿 {context}\n\n#{topic} #Fun",
                "{context}\n\nThis is wild! 😂 #{topic}"
            ]
        },
        linkedin: {
            professional: [
                "I've been reflecting on the importance of {topic} in our industry. It's clear that adapting to this shift is crucial for long-term success. \n\nHow is your organization handling {topic}? Let's discuss in the comments. \n\n#{topic} #ProfessionalDevelopment #IndustryTrends",
                "Thrilled to announce our latest initiative focusing on {topic}. We believe this will be a game-changer for our clients and the ecosystem at large. \n\nProud of the team for making this happen! 👏 \n\n#{topic} #Innovation #TeamWork"
            ],
            news: [
                "{context}\n\nThoughts on this? #{topic}",
                "Interesting: {context}\n\n#{topic}",
                "{context}\n\nWhat's your take? #{topic}"
            ],
            witty: [
                "Unpopular opinion: {topic} is the new coffee. You can't function without it. ☕ \n\nOkay, maybe that's a stretch, but it's close. \n\nWho agrees? 👇 \n\n#{topic} #WorkLife #Humor",
                "My face when someone mentions {topic} in a meeting: 🤩 \n\nSerious question though, are we underestimating the power of {topic}? \n\n#{topic} #CorporateLife #MondayMotivation"
            ],
            inspirational: [
                "\"The only way to do great work is to love what you do.\" - Steve Jobs. \n\nThis quote reminds me of my journey with {topic}. It hasn't always been easy, but it's always been worth it. \n\nKeep pushing boundaries. 💪 \n\n#{topic} #Mindset #Success",
                "Success isn't accidental. It's built on pillars like {topic}. \n\nWhen we focus on {topic}, we open doors we didn't even know existed. \n\nWhat doors are you opening today? 🚪 \n\n#{topic} #Growth #Motivation"
            ],
            educational: [
                "Let's talk about {topic}. \n\nHere are 5 reasons why it should be on your radar in 2025: \n1️⃣ Efficiency \n2️⃣ Scalability \n3️⃣ Cost-savings \n4️⃣ Employee satisfaction \n5️⃣ Future-proofing \n\nWhich one matters most to you? \n\n#{topic} #KnowledgeShare #Education"
            ],
            entertainment: [
                "{context}\n\nInteresting! #{topic}",
                "{context}\n\n#{topic} #Entertainment"
            ]
        },
        instagram: {
            professional: [
                "Behind the scenes working on {topic}. 🏢 \n.\n.\n.\n#{topic} #WorkMode #Hustle #OfficeLife",
                "POV: Mastering {topic}. 💼 \n.\n.\n.\n#{topic} #CareerGoals #Business #Success"
            ],
            news: [
                "{context} 📰\n.\n.\n.\n#{topic} #News",
                "{context}\n.\n.\n.\n#{topic} #Update"
            ],
            witty: [
                "If {topic} was a person, we'd be best friends. 👯‍♀️ \n.\n.\n.\n#{topic} #Bestie #Vibe #Funny",
                "Trying to handle {topic} like... 🙃 \n.\n.\n.\n#{topic} #Mood #DailyGrind #InstaDaily"
            ],
            inspirational: [
                "Dream it. Believe it. Build it. {topic}. ✨ \n.\n.\n.\n#{topic} #Inspo #DreamBig #Aesthetic",
                "Your vibe attracts your tribe. Let's talk {topic}. 🌸 \n.\n.\n.\n#{topic} #GoodVibes #Positivity #Wellness"
            ],
            educational: [
                "Notes on {topic} 📝 \nSwipe to learn more! 👉 \n.\n.\n.\n#{topic} #Learn #StudyGram #Tips"
            ],
            entertainment: [
                "{context} 🎬\n.\n.\n.\n#{topic} #Entertainment #Viral",
                "{context}\n.\n.\n.\n#{topic} #Fun #Trending"
            ]
        },
        facebook: {
            professional: [
                "We are continuously improving our {topic} strategies to better serve our community. Thank you for your support! #{topic} #Community",
                "Great discussion today about {topic}. It's amazing to see how much progress we've made. #{topic} #Update"
            ],
            news: [
                "{context}\n\nWhat do you think? #{topic}",
                "{context}\n\n#{topic}"
            ],
            witty: [
                "Just a friendly reminder that {topic} is basically magic. 🪄 Who's with me? #{topic}",
                "If you love {topic}, raise your hand! 🙋‍♂️ If not... we need to talk. 😂 #{topic}"
            ],
            inspirational: [
                "Start your day with a little {topic} and good things will follow. ☀️ Happy Monday everyone! #{topic} #Positivity",
                "Never underestimate the impact of {topic} on your life. Small changes, big results. ❤️ #{topic}"
            ],
            educational: [
                "Here's what you need to know about {topic}. Knowledge is power! 📖 #{topic} #Learn"
            ],
            entertainment: [
                "{context}\n\nWhat a story! 🎭 #{topic}",
                "{context}\n\n#{topic} #Entertainment"
            ]
        }
    };

    function getRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function cleanHeadline(title) {
        if (!title) return '';
        const parts = title.split(' - ');
        if (parts.length > 1) {
            parts.pop();
            return parts.join(' - ').trim();
        }
        return title.trim();
    }

    function extractSource(title) {
        if (!title) return '';
        const parts = title.split(' - ');
        if (parts.length > 1) {
            return parts[parts.length - 1].trim();
        }
        return '';
    }

    async function fetchNews(topic) {
        if (!topic) return null;

        try {
            const country = countrySelect.value;
            const url = `/api/news?topic=${encodeURIComponent(topic)}&country=${country}`;
            const response = await fetch(url);
            const data = await response.json();

            console.log('Local API Response:', data);

            if (data.status === 'ok' && data.articles && data.articles.length > 0) {
                availableArticles = data.articles;
                return data.articles[0].title;
            } else {
                console.warn('News Check:', data);
                availableArticles = [];
                return null;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    function generatePost(platform, tone, topic, context) {
        const platformTemplates = templates[platform] || templates['twitter'];

        let toneTemplates;
        if (context && context.length > 0) {
            if (platformTemplates['news'] && platformTemplates['news'].length > 0) {
                toneTemplates = platformTemplates['news'];
            } else {
                toneTemplates = ["{context}\n\n#{topic} #News"];
            }
        } else {
            toneTemplates = platformTemplates[tone] || platformTemplates['educational'];
        }

        let template = getRandom(toneTemplates);
        let finalPost = template.replace(/{topic}/g, topic);
        if (context) {
            finalPost = finalPost.replace(/{context}/g, context);
        }

        return finalPost;
    }

    fetchNewsBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        if (!topic) {
            alert('Please enter a topic to search for news! 🗞️');
            return;
        }

        const originalIcon = fetchNewsBtn.innerHTML;
        fetchNewsBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;margin:0;"></div>';
        fetchNewsBtn.disabled = true;

        const newsHeadline = await fetchNews(topic);

        if (newsHeadline) {
            contextInput.value = cleanHeadline(newsHeadline);
            fetchNewsBtn.style.color = '#4ade80';
        } else {
            alert('No recent news found for this topic.');
        }

        fetchNewsBtn.innerHTML = originalIcon;
        fetchNewsBtn.disabled = false;
        setTimeout(() => fetchNewsBtn.style.color = '', 2000);
    });

    generateBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        let context = contextInput.value.trim();
        const selectedPlatforms = Array.from(document.querySelectorAll('.platform-toggles input:checked'))
            .map(input => input.value);

        if (!topic) {
            alert('Please enter a topic first! ✨');
            return;
        }

        if (selectedPlatforms.length === 0) {
            alert('Please select at least one platform! 📱');
            return;
        }

        if (!context && availableArticles.length === 0) {
            generateBtn.innerHTML = '<span>Scanning News...</span> <i class="fa-solid fa-satellite-dish"></i>';
            try {
                const fetchedHeadline = await fetchNews(topic);
                if (fetchedHeadline) {
                    context = cleanHeadline(fetchedHeadline);
                    contextInput.value = context;
                }
            } catch (e) {
                console.error("Auto-fetch failed", e);
            }
            generateBtn.innerHTML = '<span>Generate Posts</span> <i class="fa-solid fa-wand-magic-sparkles"></i>';
        }

        generateBtn.disabled = true;
        loader.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        resultsSection.innerHTML = '';

        setTimeout(() => {
            loader.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            generateBtn.disabled = false;

            selectedPlatforms.forEach(platform => {
                const content = generatePost(platform, defaultTone, topic, context);
                createCard(platform, content, 0);
            });
        }, 1500);
    });

    function createCard(platform, content, articleIndex) {
        const card = document.createElement('div');
        card.className = `result-card glass-panel platform-${platform}`;

        card.dataset.platform = platform;
        card.dataset.index = articleIndex;
        card.dataset.topic = topicInput.value.trim();
        card.dataset.tone = defaultTone;

        // Store URL in dataset if available
        if (availableArticles && availableArticles[articleIndex] && availableArticles[articleIndex].url) {
            card.dataset.newsUrl = availableArticles[articleIndex].url;
        }

        let iconClass = '';
        switch (platform) {
            case 'twitter': iconClass = 'fa-brands fa-x-twitter'; break;
            case 'linkedin': iconClass = 'fa-brands fa-linkedin-in'; break;
            case 'instagram': iconClass = 'fa-brands fa-instagram'; break;
            case 'facebook': iconClass = 'fa-brands fa-facebook-f'; break;
        }

        let navControls = '';
        if (availableArticles && availableArticles.length > 1) {
            navControls = `
                <div class="nav-controls">
                    <button class="nav-btn" onclick="changeNews(this, -1)" title="Previous News">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="nav-btn" onclick="changeNews(this, 1)" title="Next News">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            `;
        }

        let timestampHTML = '';
        if (availableArticles && availableArticles[articleIndex]) {
            const article = availableArticles[articleIndex];
            const source = extractSource(article.title);

            if (article.pubDate) {
                const date = new Date(article.pubDate);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const sourceText = source ? ` • <a href="${article.url}" target="_blank" class="news-source-link">${source}</a>` : '';
                timestampHTML = `<div class="news-timestamp" data-exclude-copy="true"><i class="fa-regular fa-clock"></i> ${formattedDate}${sourceText}</div>`;
            }
        }

        const currentTone = defaultTone;

        // Add news URL to content if available
        let finalContent = content;
        if (card.dataset.newsUrl) {
            finalContent = content + '\n\n🔗 ' + card.dataset.newsUrl;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="header-left" style="display:flex;align-items:center;gap:0.75rem;">
                    <div class="platform-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <h3>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
                </div>
                ${navControls}
            </div>
            <div class="card-content">${finalContent}</div>
            ${timestampHTML}
            <div class="card-tone-selector">
                <label>Vibe:</label>
                <div class="tone-emoji-buttons">
                    <button class="tone-emoji-btn ${currentTone === 'professional' ? 'active' : ''}" data-tone="professional" onclick="changeTone(this, 'professional')" title="Professional">👔</button>
                    <button class="tone-emoji-btn ${currentTone === 'witty' ? 'active' : ''}" data-tone="witty" onclick="changeTone(this, 'witty')" title="Witty">🤪</button>
                    <button class="tone-emoji-btn ${currentTone === 'news' ? 'active' : ''}" data-tone="news" onclick="changeTone(this, 'news')" title="News">📰</button>
                    <button class="tone-emoji-btn ${currentTone === 'educational' ? 'active' : ''}" data-tone="educational" onclick="changeTone(this, 'educational')" title="Educational">📚</button>
                    <button class="tone-emoji-btn ${currentTone === 'inspirational' ? 'active' : ''}" data-tone="inspirational" onclick="changeTone(this, 'inspirational')" title="Inspirational">✨</button>
                    <button class="tone-emoji-btn ${currentTone === 'entertainment' ? 'active' : ''}" data-tone="entertainment" onclick="changeTone(this, 'entertainment')" title="Entertainment">🎬</button>
                </div>
            </div>
            <div class="card-actions">
                <button class="action-btn post-btn" onclick="postContent(this, '${platform}')">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>Post</span>
                </button>
                <button class="action-btn copy-btn" onclick="copyToClipboard(this)">
                    <i class="fa-regular fa-copy"></i>
                    <span>Copy</span>
                </button>
            </div>
        `;

        resultsSection.appendChild(card);
    }

    window.changeNews = function (btn, direction) {
        const card = btn.closest('.result-card');
        const platform = card.dataset.platform;
        const topic = card.dataset.topic;
        const tone = card.dataset.tone;
        let currentIndex = parseInt(card.dataset.index);

        if (availableArticles.length === 0) return;

        let newIndex = currentIndex + direction;
        if (newIndex >= availableArticles.length) newIndex = 0;
        if (newIndex < 0) newIndex = availableArticles.length - 1;

        const newArticle = availableArticles[newIndex];
        const newContext = cleanHeadline(newArticle.title);

        // Update stored URL in card dataset
        if (newArticle.url) {
            card.dataset.newsUrl = newArticle.url;
        }

        const newContent = generatePost(platform, tone, topic, newContext);
        const finalContent = newContent + '\n\n🔗 ' + newArticle.url;

        const contentDiv = card.querySelector('.card-content');
        contentDiv.style.opacity = '0';
        setTimeout(() => {
            contentDiv.innerText = finalContent;
            contentDiv.style.opacity = '1';
        }, 200);

        const timestampDiv = card.querySelector('.news-timestamp');
        if (timestampDiv && newArticle.pubDate) {
            const date = new Date(newArticle.pubDate);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const source = extractSource(newArticle.title);
            const sourceText = source ? ` • <a href="${newArticle.url}" target="_blank" class="news-source-link">${source}</a>` : '';
            timestampDiv.innerHTML = `<i class="fa-regular fa-clock"></i> ${formattedDate}${sourceText}`;
        }

        card.dataset.index = newIndex;
    }

    window.changeTone = function (button, newTone) {
        const card = button.closest('.result-card');
        const platform = card.dataset.platform;
        const topic = card.dataset.topic;
        const currentIndex = parseInt(card.dataset.index);

        card.dataset.tone = newTone;

        const allButtons = card.querySelectorAll('.tone-emoji-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        let context = '';
        if (availableArticles && availableArticles[currentIndex]) {
            context = cleanHeadline(availableArticles[currentIndex].title);
        }

        const newContent = generatePost(platform, newTone, topic, context);

        // Add URL to content from card dataset
        let finalContent = newContent;
        if (card.dataset.newsUrl) {
            finalContent = newContent + '\n\n🔗 ' + card.dataset.newsUrl;
        }

        const contentDiv = card.querySelector('.card-content');
        contentDiv.style.opacity = '0';
        setTimeout(() => {
            contentDiv.innerText = finalContent;
            contentDiv.style.opacity = '1';
        }, 200);
    }

    window.postContent = async function (btn, platform) {
        const card = btn.closest('.result-card');
        const content = card.querySelector('.card-content').innerText;

        try {
            await navigator.clipboard.writeText(content);
        } catch (err) {
            console.error('Copy failed', err);
        }

        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Opened!</span>`;
        setTimeout(() => btn.innerHTML = originalHTML, 3000);

        let url = '';
        const encodedText = encodeURIComponent(content);

        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/feed/`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/`;
                break;
            case 'instagram':
                url = `https://www.instagram.com/`;
                break;
            default:
                url = `https://${platform}.com`;
        }

        if (url) window.open(url, '_blank');
    }

    window.copyToClipboard = function (btn) {
        const card = btn.closest('.result-card');
        const content = card.querySelector('.card-content').innerText;

        navigator.clipboard.writeText(content).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied!</span>`;
            setTimeout(() => btn.innerHTML = originalHTML, 2000);
        });
    }

    trendingBtn.addEventListener('click', async () => {
        const country = countrySelect.value || 'us';

        const originalIcon = trendingBtn.innerHTML;
        trendingBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;margin:0;"></div>';
        trendingBtn.disabled = true;

        try {
            const response = await fetch(`/api/trending?country=${country}`);
            const data = await response.json();

            if (data.status === 'ok' && data.articles && data.articles.length > 0) {
                const randomArticle = getRandom(data.articles);
                topicInput.value = cleanHeadline(randomArticle.title);

                trendingBtn.style.color = '#ff6b6b';
            } else {
                alert('No trending topics found.');
            }
        } catch (error) {
            console.error('Trending error:', error);
            alert('Failed to fetch trending topics.');
        }

        trendingBtn.innerHTML = originalIcon;
        trendingBtn.disabled = false;
        setTimeout(() => trendingBtn.style.color = '', 2000);
    });

    const suggestionsList = document.getElementById('suggestionsList');
    let debounceTimer;

    topicInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);

        contextInput.value = '';
        availableArticles = [];

        if (query.length < 2) {
            suggestionsList.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(async () => {
            console.log(`[Script] Requesting suggestions for "${query}"`);
            try {
                const response = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
                const suggestions = await response.json();
                console.log(`[Script] Got suggestions:`, suggestions);

                if (suggestions.length > 0) {
                    renderSuggestions(suggestions);
                } else {
                    suggestionsList.classList.add('hidden');
                }
            } catch (error) {
                console.error('Suggest error:', error);
            }
        }, 300);
    });

    function renderSuggestions(suggestions) {
        suggestionsList.innerHTML = suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('');
        suggestionsList.classList.remove('hidden');
    }

    suggestionsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            topicInput.value = e.target.innerText;
            suggestionsList.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (!topicInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.classList.add('hidden');
        }
    });

});
