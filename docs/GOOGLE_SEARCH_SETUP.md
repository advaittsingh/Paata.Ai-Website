# 🔍 Google Custom Search API Setup Guide

## Overview
Research Mode now uses Google Custom Search API to provide real-time web search results for comprehensive, up-to-date answers.

## ✅ What's Already Done
- ✅ API key provided: `AIzaSyC9qPhrRXVCvV2MdkvHHyqr0FkNVJkjxDU`
- ✅ Code implementation complete
- ✅ Integration with Research Mode

## 📋 What You Need to Do

### Step 1: Create a Custom Search Engine

1. Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/controlpanel/create)
2. Click **"Add"** or **"Create a search engine"**
3. Configure your search engine:
   - **Sites to search**: Enter `*` to search the entire web, or specific domains
   - **Name**: Give it a name (e.g., "PAATA.AI Research")
   - **Language**: Select your preferred language
4. Click **"Create"**
5. Click **"Control Panel"** for your new search engine
6. Copy the **Search Engine ID** (it looks like: `1234567890abcdef:abcdefghijkl`)

### Step 2: Enable Custom Search API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Library**
4. Search for **"Custom Search API"**
5. Click **"Enable"**

### Step 3: Add to Environment Variables

Add these to your `.env` or `.env.local` file:

```env
# Google Custom Search API
GOOGLE_SEARCH_API_KEY=AIzaSyC9qPhrRXVCvV2MdkvHHyqr0FkNVJkjxDU
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id-here
```

Replace `your-search-engine-id-here` with the ID you copied in Step 1.

### Step 4: Restart Your Dev Server

```bash
npm run dev
```

## 🧪 Testing

1. Open the chat interface
2. Toggle **Research Mode** ON
3. Ask a question that requires current information (e.g., "What are the latest developments in AI?")
4. The AI should now provide answers with web research data

## 📊 API Quotas

Google Custom Search API provides:
- **Free tier**: 100 searches per day
- **Paid tier**: $5 per 1,000 queries (after free tier)

**Note**: The free tier is sufficient for development and testing. For production, consider:
- Monitoring usage
- Implementing caching for common queries
- Upgrading if needed

## 🔧 Troubleshooting

### "No search results found"
- Check that `GOOGLE_SEARCH_ENGINE_ID` is set correctly
- Verify the Search Engine ID in Google Programmable Search Engine dashboard
- Ensure Custom Search API is enabled in Google Cloud Console

### "API error"
- Verify `GOOGLE_SEARCH_API_KEY` is correct
- Check API key restrictions in Google Cloud Console
- Ensure billing is enabled (required for Custom Search API)

### Research Mode still not working
- Check browser console for errors
- Verify environment variables are loaded (restart dev server)
- Check server logs for API errors

## ✅ Verification

Once set up, you should see in server logs:
- `🔍 Performing web search for: [your query]`
- `✅ Found X search results`

If you see warnings about missing API keys, check your `.env` file.

---

**Research Mode is now fully functional with real-time web search!** 🎉
