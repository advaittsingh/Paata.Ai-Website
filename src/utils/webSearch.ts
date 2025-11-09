/**
 * Web Search Utility for Advanced Reasoning Mode
 * Performs web searches and gathers comprehensive information using Google Custom Search API
 */

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

/**
 * Perform a web search using Google Custom Search API
 * Requires GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID in environment variables
 */
export async function performWebSearch(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  // If API key or engine ID not configured, return empty results
  if (!apiKey || !searchEngineId) {
    console.log('🔍 Web search requested but API not configured:', query);
    if (!apiKey) {
      console.warn('⚠️ GOOGLE_SEARCH_API_KEY not set in environment variables');
      console.warn('   Get it from: https://console.cloud.google.com/apis/credentials');
    }
    if (!searchEngineId) {
      console.warn('⚠️ GOOGLE_SEARCH_ENGINE_ID not set in environment variables');
      console.warn('   Get it from: https://programmablesearchengine.google.com/');
      console.warn('   You need to create a Custom Search Engine and get the Search Engine ID (CX)');
    }
    return [];
  }
  
  try {
    console.log('🔍 Performing web search for:', query);
    console.log('✅ Google Search API configured');
    console.log('🔑 API Key configured:', !!apiKey);
    console.log('🔑 Search Engine ID configured:', !!searchEngineId);
    
    // Google Custom Search JSON API endpoint
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('❌ Google Search API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      // Try to parse error JSON for better error messages
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          console.error('API Error:', errorData.error.message || errorData.error);
          if (errorData.error.message?.includes('invalid API key')) {
            console.error('⚠️ Invalid API key. Please check GOOGLE_SEARCH_API_KEY in your .env file.');
          }
          if (errorData.error.message?.includes('invalid cx')) {
            console.error('⚠️ Invalid Search Engine ID. Please check GOOGLE_SEARCH_ENGINE_ID in your .env file.');
          }
        }
      } catch (e) {
        // Error text is not JSON, use as-is
      }
      
      return [];
    }
    
    const data = await response.json();
    
    // Check for API errors in response
    if (data.error) {
      console.error('❌ Google Search API returned error:', data.error);
      return [];
    }
    
    // Parse Google Custom Search results
    if (data.items && Array.isArray(data.items)) {
      const results: SearchResult[] = data.items.map((item: any) => ({
        title: item.title || 'No title',
        snippet: item.snippet || item.htmlSnippet?.replace(/<[^>]*>/g, '') || 'No description',
        url: item.link || '#',
      }));
      
      console.log(`✅ Found ${results.length} search results`);
      return results;
    }
    
    // Check if search information is available
    if (data.searchInformation) {
      console.log('ℹ️ Search completed:', {
        totalResults: data.searchInformation.totalResults,
        searchTime: data.searchInformation.searchTime
      });
    }
    
    console.log('⚠️ No search results found in response');
    return [];
  } catch (error: any) {
    console.error('❌ Web search error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return [];
  }
}

/**
 * Get comprehensive research data from web searches
 * This function performs multiple searches and aggregates results
 */
export async function gatherResearchData(query: string, maxResults: number = 5): Promise<string> {
  try {
    const searchResults = await performWebSearch(query);
    
    if (searchResults.length === 0) {
      return '';
    }
    
    // Format search results as research context
    let researchContext = '\n\n[WEB RESEARCH - Recent Information]\n';
    researchContext += 'I have gathered the following information from web sources:\n\n';
    
    searchResults.slice(0, maxResults).forEach((result, index) => {
      researchContext += `${index + 1}. **${result.title}**\n`;
      researchContext += `   ${result.snippet}\n`;
      researchContext += `   Source: ${result.url}\n\n`;
    });
    
    researchContext += '\nUse this information to provide a comprehensive, well-researched answer.';
    
    return researchContext;
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}
