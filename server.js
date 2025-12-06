require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Parser = require('rss-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;
const parser = new Parser();

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

app.get('/api/news', async (req, res) => {
    const { topic, country } = req.query;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    // Map for Google News params: { geo: 'GL', hl: 'Language-GL', ceid: 'GL:Language' }
    const countryConfig = {
        'in': { gl: 'IN', hl: 'en-IN', ceid: 'IN:en' },
        'us': { gl: 'US', hl: 'en-US', ceid: 'US:en' },
        'gb': { gl: 'GB', hl: 'en-GB', ceid: 'GB:en' },
        'ca': { gl: 'CA', hl: 'en-CA', ceid: 'CA:en' }
    };

    try {
        let feedUrl;

        // Handle Special "Kerala" Region
        if (country === 'kerala') {
            const query = `${topic} Kerala`;
            console.log(`[Server] Searching Google News for: ${query}`);
            feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        }
        // Handle Standard Countries
        else if (country && countryConfig[country]) {
            const config = countryConfig[country];
            console.log(`[Server] Searching Google News for: ${topic} in ${config.gl}`);
            feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=${config.hl}&gl=${config.gl}&ceid=${config.ceid}`;
        }
        // Global Fallback
        else {
            console.log(`[Server] Searching Google News for: ${topic} (Global)`);
            feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
        }

        console.log(`[Server] Fetching Feed: ${feedUrl}`);
        const feed = await parser.parseURL(feedUrl);

        console.log(`[Server] Items Found: ${feed.items.length}`);

        // Format to match old API structure expected by frontend
        const articles = feed.items.map(item => ({
            title: item.title,
            source: { name: item.creator || 'Google News' },
            url: item.link,
            pubDate: item.pubDate
        }));

        if (articles.length > 0) {
            console.log(`[Server] First Article: ${articles[0].title}`);
        }

        res.json({
            status: 'ok',
            totalResults: articles.length,
            articles: articles
        });

    } catch (error) {
        console.error('RSS Error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch news',
            details: error.message
        });
    }
});

// Endpoint: Get Trending Topics (Top Headlines)
app.get('/api/trending', async (req, res) => {
    const { country } = req.query;

    // Map for Google News params (reuse existing map logic or simplify)
    const countryConfig = {
        'in': { gl: 'IN', hl: 'en-IN', ceid: 'IN:en' },
        'kerala': { gl: 'IN', hl: 'en-IN', ceid: 'IN:en' }, // Kerala trends = India trends (Google doesn't verify sub-region trends via RSS easily without query)
        'us': { gl: 'US', hl: 'en-US', ceid: 'US:en' },
        'gb': { gl: 'GB', hl: 'en-GB', ceid: 'GB:en' },
        'ca': { gl: 'CA', hl: 'en-CA', ceid: 'CA:en' }
    };

    // Default to US if not found or empty
    const config = countryConfig[country] || countryConfig['us'];

    try {
        const feedUrl = `https://news.google.com/rss?hl=${config.hl}&gl=${config.gl}&ceid=${config.ceid}`;
        console.log(`[Server] Fetching Trending Feed: ${feedUrl}`);

        const feed = await parser.parseURL(feedUrl);

        const articles = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate
        }));

        res.json({
            status: 'ok',
            totalResults: articles.length,
            articles: articles
        });
    } catch (error) {
        console.error('Trending RSS Error:', error);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});

// Suppress favicon 404 logs
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Endpoint: Get Suggestions (Google Suggest Proxy)
app.get('/api/suggest', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    try {
        const url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`;
        const response = await axios.get(url);
        // Google returns: ["query", ["sugg1", "sugg2"], ...]
        const suggestions = response.data[1] || [];
        res.json(suggestions);
    } catch (error) {
        console.error('Suggest Error:', error);
        res.json([]); // Fail gracefully
    }
});

// URL Shortening endpoint
app.get('/api/shorten', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Using TinyURL API (free, no API key needed)
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        res.json({ shortUrl: response.data });
    } catch (error) {
        console.error('Shorten Error:', error);
        // Fallback to original URL if shortening fails
        res.json({ shortUrl: url });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
