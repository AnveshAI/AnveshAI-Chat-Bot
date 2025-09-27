// Free news service using RSS feeds and public APIs

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

// Free RSS news feeds
const RSS_FEEDS = {
  technology: [
    'https://feeds.feedburner.com/oreilly/radar',
    'https://www.techmeme.com/feed.xml',
    'https://rss.cnn.com/rss/edition.rss',
  ],
  business: [
    'https://feeds.reuters.com/reuters/businessNews',
    'https://rss.cnn.com/rss/money_latest.rss',
  ],
  sports: [
    'https://rss.espn.com/rss/news',
    'https://rss.cnn.com/rss/si_topstories.rss',
  ],
  science: [
    'https://feeds.feedburner.com/sciencedaily',
    'https://rss.cnn.com/rss/edition_space.rss',
  ]
};

async function parseRSSFeed(url: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const xmlText = await response.text();
    const articles: NewsArticle[] = [];
    
    // Simple XML parsing for RSS feeds
    const items = xmlText.match(/<item[\s\S]*?<\/item>/gi) || [];
    
    for (const item of items.slice(0, 5)) { // Limit to 5 articles per feed
      const title = extractXMLTag(item, 'title');
      const description = extractXMLTag(item, 'description') || extractXMLTag(item, 'summary');
      const link = extractXMLTag(item, 'link') || extractXMLTag(item, 'guid');
      const pubDate = extractXMLTag(item, 'pubDate') || extractXMLTag(item, 'published');
      
      if (title && link) {
        articles.push({
          title: cleanText(title),
          description: cleanText(description) || '',
          url: link.trim(),
          source: new URL(url).hostname.replace('www.', ''),
          publishedAt: pubDate || new Date().toISOString(),
        });
      }
    }
    
    return articles;
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error);
    return [];
  }
}

function extractXMLTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 'is');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function cleanText(text: string): string {
  if (!text) return '';
  
  // Remove HTML tags and decode entities
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\[.*?\]/g, '') // Remove [brackets]
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export async function fetchNews(category: string = "technology"): Promise<NewsArticle[]> {
  try {
    const feedUrls = RSS_FEEDS[category as keyof typeof RSS_FEEDS] || RSS_FEEDS.technology;
    const allArticles: NewsArticle[] = [];
    
    // Fetch from multiple RSS feeds
    const promises = feedUrls.map(url => parseRSSFeed(url));
    const results = await Promise.allSettled(promises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });
    
    // Sort by publication date (newest first)
    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Remove duplicates by title
    const uniqueArticles = allArticles.filter((article, index, arr) => 
      arr.findIndex(a => a.title.toLowerCase() === article.title.toLowerCase()) === index
    );
    
    return uniqueArticles.slice(0, 10); // Return top 10 articles
  } catch (error) {
    console.error("News fetch error:", error);
    
    // Fallback mock news if RSS fails
    return [
      {
        title: "Free News Service Active",
        description: "Using RSS feeds to fetch real-time news updates from multiple sources including tech, business, and science outlets.",
        url: "#",
        source: "AnveshAI",
        publishedAt: new Date().toISOString(),
      }
    ];
  }
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  try {
    // For free news search, we'll fetch from all categories and filter
    const categories = ['technology', 'business', 'science'];
    const allArticles: NewsArticle[] = [];
    
    for (const category of categories) {
      const articles = await fetchNews(category);
      allArticles.push(...articles);
    }
    
    // Simple search filtering
    const searchTerms = query.toLowerCase().split(' ');
    const filteredArticles = allArticles.filter(article => {
      const searchText = (article.title + ' ' + article.description).toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    });
    
    return filteredArticles.slice(0, 10);
  } catch (error) {
    console.error("News search error:", error);
    return [{
      title: `Search Results for "${query}"`,
      description: "News search is running on free RSS feeds. Results may be limited but are from real news sources.",
      url: "#",
      source: "AnveshAI Search",
      publishedAt: new Date().toISOString(),
    }];
  }
}