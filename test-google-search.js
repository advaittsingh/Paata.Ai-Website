/**
 * Test script to verify Google Search API integration
 * Run with: node test-google-search.js
 */

// Load environment variables (if using dotenv)
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

console.log('🔍 Google Search API Configuration Test\n');
console.log('=' .repeat(50));

if (!apiKey) {
  console.log('❌ GOOGLE_SEARCH_API_KEY: NOT SET');
  console.log('   Please add GOOGLE_SEARCH_API_KEY to your .env.local file');
} else {
  console.log('✅ GOOGLE_SEARCH_API_KEY: SET');
  console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
}

if (!searchEngineId) {
  console.log('❌ GOOGLE_SEARCH_ENGINE_ID: NOT SET');
  console.log('   Please add GOOGLE_SEARCH_ENGINE_ID to your .env.local file');
  console.log('   Get it from: https://programmablesearchengine.google.com/');
} else {
  console.log('✅ GOOGLE_SEARCH_ENGINE_ID: SET');
  console.log(`   ID: ${searchEngineId}`);
}

console.log('\n' + '='.repeat(50));

if (apiKey && searchEngineId) {
  console.log('\n🧪 Testing Google Search API...\n');
  
  const testQuery = 'quantum physics basics';
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(testQuery)}&num=3`;
  
  fetch(searchUrl)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.items && data.items.length > 0) {
        console.log('✅ Google Search API is working!');
        console.log(`   Found ${data.items.length} results for "${testQuery}"`);
        console.log('\n   Sample result:');
        console.log(`   Title: ${data.items[0].title}`);
        console.log(`   URL: ${data.items[0].link}`);
        console.log(`   Snippet: ${data.items[0].snippet?.substring(0, 100)}...`);
      } else {
        console.log('⚠️  API responded but no results found');
        console.log('   This might be normal for some queries');
      }
    })
    .catch(error => {
      console.log('❌ Google Search API test failed:');
      console.log(`   Error: ${error.message}`);
      if (error.message.includes('403')) {
        console.log('\n   Possible issues:');
        console.log('   - API key might be invalid or restricted');
        console.log('   - Search Engine ID might be incorrect');
        console.log('   - API quota might be exceeded');
      } else if (error.message.includes('400')) {
        console.log('\n   Possible issues:');
        console.log('   - Invalid API key format');
        console.log('   - Invalid Search Engine ID format');
      }
    });
} else {
  console.log('\n⚠️  Cannot test API - missing required environment variables');
  console.log('\n📝 Setup Instructions:');
  console.log('1. Get Google Search API Key:');
  console.log('   https://console.cloud.google.com/apis/credentials');
  console.log('2. Create a Custom Search Engine:');
  console.log('   https://programmablesearchengine.google.com/');
  console.log('3. Get your Search Engine ID from the control panel');
  console.log('4. Add both to .env.local:');
  console.log('   GOOGLE_SEARCH_API_KEY=your_api_key_here');
  console.log('   GOOGLE_SEARCH_ENGINE_ID=your_engine_id_here');
}




