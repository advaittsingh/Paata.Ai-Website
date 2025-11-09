import { NextRequest, NextResponse } from 'next/server';
import { performWebSearch } from '@/utils/webSearch';

/**
 * Test endpoint to verify Google Search API configuration
 * GET /api/test-google-search?query=test+query
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'artificial intelligence';

    // Check environment variables
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    const configStatus = {
      hasApiKey: !!apiKey,
      hasSearchEngineId: !!searchEngineId,
      apiKeyLength: apiKey?.length || 0,
      searchEngineIdLength: searchEngineId?.length || 0,
    };

    // If not configured, return status
    if (!apiKey || !searchEngineId) {
      return NextResponse.json({
        success: false,
        error: 'Google Search API not fully configured',
        configStatus,
        message: !apiKey 
          ? 'GOOGLE_SEARCH_API_KEY is missing'
          : 'GOOGLE_SEARCH_ENGINE_ID is missing',
        instructions: {
          apiKey: 'Add GOOGLE_SEARCH_API_KEY to your .env file',
          searchEngineId: 'Add GOOGLE_SEARCH_ENGINE_ID to your .env file. Get it from https://programmablesearchengine.google.com/controlpanel/create'
        }
      }, { status: 400 });
    }

    // Test the search
    console.log('🔍 Testing Google Search API with query:', query);
    const results = await performWebSearch(query);

    return NextResponse.json({
      success: true,
      configStatus,
      query,
      resultsCount: results.length,
      results: results.map((r, i) => ({
        index: i + 1,
        title: r.title,
        snippet: r.snippet.substring(0, 150) + '...',
        url: r.url,
      })),
      message: results.length > 0 
        ? `✅ Google Search API is working! Found ${results.length} results.`
        : '⚠️ API is configured but returned no results. Check your search query or API quota.'
    });

  } catch (error: any) {
    console.error('❌ Google Search API test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}



