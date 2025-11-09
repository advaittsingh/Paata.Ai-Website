# Research Mode Setup Guide

## Current Status

✅ **GOOGLE_SEARCH_API_KEY**: Found in `.env` file  
❌ **GOOGLE_SEARCH_ENGINE_ID**: **MISSING** - This is required!

## What You Need

Research Mode requires **TWO** environment variables:

1. ✅ `GOOGLE_SEARCH_API_KEY` - You have this!
2. ❌ `GOOGLE_SEARCH_ENGINE_ID` - **You need to add this!**

## How to Get Your Search Engine ID

1. **Go to Google Custom Search Engine**:
   - Visit: https://programmablesearchengine.google.com/
   - Sign in with your Google account

2. **Create a New Search Engine** (or use existing):
   - Click "Add" or "Create a custom search engine"
   - Enter a name (e.g., "PAATA.AI Research")
   - For "Sites to search", you can:
     - Enter specific sites (e.g., `*.edu`, `*.org`)
     - Or leave blank to search the entire web
   - Click "Create"

3. **Get Your Search Engine ID**:
   - After creating, go to "Control Panel"
   - Find "Search engine ID" (also called "CX")
   - Copy this ID

4. **Add to Your `.env` File**:
   ```bash
   GOOGLE_SEARCH_API_KEY=your_existing_key
   GOOGLE_SEARCH_ENGINE_ID=your_new_search_engine_id_here
   ```

5. **Restart Your Development Server**:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

## How to Test Research Mode

1. **Start your dev server** (after adding the Search Engine ID)
2. **Go to the chat page** (`/app`)
3. **Toggle "Research Mode" ON** (the switch at the bottom of the chat)
4. **Ask a question** that would benefit from web research, e.g.:
   - "What are the latest developments in AI?"
   - "Explain recent discoveries in quantum physics"
   - "What is the current state of climate change research?"

5. **Check your server logs** - You should see:
   ```
   🔍 Advanced reasoning mode: Gathering research data...
   ✅ Google Search API configured
   🔍 Performing web search for: [your question]
   ✅ Found X search results
   📚 Research data gathered: Yes
   ```

## Troubleshooting

### If Research Mode doesn't work:

1. **Check both variables are set**:
   ```bash
   # In your .env file, you should have:
   GOOGLE_SEARCH_API_KEY=...
   GOOGLE_SEARCH_ENGINE_ID=...
   ```

2. **Check server logs** for warnings:
   - If you see "⚠️ GOOGLE_SEARCH_ENGINE_ID not set" → Add it to `.env`
   - If you see "⚠️ GOOGLE_SEARCH_API_KEY not set" → Check your `.env` file

3. **Restart the server** after adding environment variables

4. **Verify API is enabled**:
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Custom Search API"
   - Make sure it's enabled for your project

5. **Check API quota**:
   - Free tier: 100 searches per day
   - If exceeded, you'll get a 403 error

### Common Errors:

- **403 Forbidden**: API quota exceeded or API not enabled
- **400 Bad Request**: Invalid Search Engine ID format
- **No results**: Search Engine ID might be incorrect

## How Research Mode Works

When Research Mode is **ON**:
1. User asks a question
2. System searches Google for relevant information
3. Gathers up to 5 search results
4. AI uses this information to provide comprehensive, research-backed answers
5. Response includes references to web sources

When Research Mode is **OFF**:
- AI responds using only its training data (no web search)

## Next Steps

1. ✅ Add `GOOGLE_SEARCH_ENGINE_ID` to your `.env` file
2. ✅ Restart your development server
3. ✅ Test Research Mode with a question
4. ✅ Check server logs to confirm it's working

Once both variables are set, Research Mode should work perfectly! 🎉



