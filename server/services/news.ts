interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export async function fetchNews(category: string = "technology"): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY || process.env.NEWS_API_KEY_ENV_VAR || "default_key";
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=10&apiKey=${apiKey}`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid News API key. Please check your configuration.");
      } else if (response.status === 429) {
        throw new Error("News API rate limit exceeded. Please try again later.");
      }
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description || "",
      url: article.url,
      source: article.source?.name || "Unknown",
      publishedAt: article.publishedAt,
    })) || [];
  } catch (error: any) {
    console.error("News API error:", error);
    if (error.message.includes('API key') || error.message.includes('rate limit')) {
      throw error;
    }
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY || process.env.NEWS_API_KEY_ENV_VAR || "default_key";
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid News API key. Please check your configuration.");
      } else if (response.status === 429) {
        throw new Error("News API rate limit exceeded. Please try again later.");
      }
      throw new Error(`News API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description || "",
      url: article.url,
      source: article.source?.name || "Unknown",
      publishedAt: article.publishedAt,
    })) || [];
  } catch (error: any) {
    console.error("News search error:", error);
    if (error.message.includes('API key') || error.message.includes('rate limit')) {
      throw error;
    }
    throw new Error(`Failed to search news: ${error.message}`);
  }
}
