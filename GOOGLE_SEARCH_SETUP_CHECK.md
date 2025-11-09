# Google Search API Setup Verification

## Required Environment Variables

The Research Mode feature requires **TWO** environment variables:

1. **`GOOGLE_SEARCH_API_KEY`** - Your Google Custom Search API key
2. **`GOOGLE_SEARCH_ENGINE_ID`** - Your Custom Search Engine ID (also called CX)

## How to Check if It's Working

### 1. Check Your Environment Variables

Make sure both are in your `.env.local` file:

```bash
GOOGLE_SEARCH_API_KEY=your_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### 2. How Research Mode Works

1. **Enable Research Mode**: Toggle the "Research Mode" switch in the chat interface
2. **Ask a Question**: When Research Mode is ON, the AI will:
   - Search the web for relevant information
   - Gather up to 5 search results
   - Use that information to provide comprehensive answers

### 3. Testing Research Mode

1. Go to the main chat page (`/app`)
2. Toggle "Research Mode" ON (you'll see "Research Mode ON" when active)
3. Ask a question that would benefit from recent information, e.g.:
   - "What are the latest developments in quantum computing?"
   - "Explain the current state of climate change research"
   - "What are recent discoveries in neuroscience?"

### 4. Check Server Logs

When Research Mode is active, you should see these logs in your terminal:

```
🔍 Advanced reasoning mode: Gathering research data...
🔍 Performing web search for: [your question]
✅ Found X search results
📚 Research data gathered: Yes
```

If you see warnings like:
```
⚠️ GOOGLE_SEARCH_API_KEY not set in environment variables
⚠️ GOOGLE_SEARCH_ENGINE_ID not set in environment variables
```

Then the environment variables are not properly configured.

### 5. Common Issues

#### Issue: Research Mode doesn't search
**Solution**: 
- Check that both `GOOGLE_SEARCH_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID` are in `.env.local`
- Restart your development server after adding environment variables
- Check server logs for error messages

#### Issue: API returns 403 Forbidden
**Possible causes**:
- API key is invalid or restricted
- Search Engine ID is incorrect
- API quota exceeded (free tier: 100 searches/day)
- API key doesn't have Custom Search API enabled

#### Issue: API returns 400 Bad Request
**Possible causes**:
- Invalid API key format
- Invalid Search Engine ID format
- Missing required parameters

### 6. Getting Your API Credentials

1. **Get API Key**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create a new API key or use existing one
   - Enable "Custom Search API" for this key

2. **Get Search Engine ID**:
   - Go to: https://programmablesearchengine.google.com/
   - Create a new search engine or use existing one
   - In the control panel, find your "Search engine ID" (CX)

### 7. Verification Checklist

- [ ] `GOOGLE_SEARCH_API_KEY` is in `.env.local`
- [ ] `GOOGLE_SEARCH_ENGINE_ID` is in `.env.local`
- [ ] Development server has been restarted after adding variables
- [ ] Custom Search API is enabled in Google Cloud Console
- [ ] API key has proper permissions
- [ ] Search Engine ID is correct
- [ ] Research Mode toggle is ON when testing
- [ ] Server logs show search activity (not warnings)

### 8. Testing the Integration

You can test if the API is working by:

1. **In the app**: Enable Research Mode and ask a question
2. **Check server logs**: Look for search activity logs
3. **Check response**: The AI should reference web sources in Research Mode

If Research Mode is working, the AI response should:
- Include references to web sources
- Provide more comprehensive, up-to-date information
- Mention specific websites or sources when available



