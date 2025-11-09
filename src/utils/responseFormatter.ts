// Utility function to format AI responses with better structure and readability

export interface FormattedResponse {
  text: string;
  hasCode: boolean;
  hasLists: boolean;
  hasHeaders: boolean;
}

export function formatAIResponse(text: string): FormattedResponse {
  let formattedText = text;
  let hasCode = false;
  let hasLists = false;
  let hasHeaders = false;

  // Detect code blocks
  if (formattedText.includes('```') || formattedText.includes('`')) {
    hasCode = true;
  }

  // Detect lists
  if (formattedText.includes('\n- ') || formattedText.includes('\n* ') || formattedText.includes('\n1. ')) {
    hasLists = true;
  }

  // Detect headers
  if (formattedText.includes('\n# ') || formattedText.includes('\n## ') || formattedText.includes('\n### ')) {
    hasHeaders = true;
  }

  // Format the text with better structure
  // Step 1: Convert bold text first (before other processing)
  formattedText = formattedText.replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');
  
  // Step 2: Add line breaks after bold headings that end with colon (like "Problem 1:" or "Solution:")
  // This ensures proper spacing between sections
  formattedText = formattedText.replace(/(<strong[^>]*>.*?:<\/strong>)([^<\n\s])/g, '$1<br>$2');
  
  // Also add line breaks between consecutive bold sections (e.g., "Problem 1:" followed by "Solution:")
  formattedText = formattedText.replace(/(<\/strong>)(<strong[^>]*>)/g, '$1<br>$2');
  
  // Step 3: Handle lists properly
  const lines = formattedText.split('\n');
  const processedLines: string[] = [];
  let inBulletList = false;
  let inNumberedList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check for bullet points (including • character)
    if (/^[-*•]\s+/.test(trimmedLine)) {
      if (!inBulletList) {
        if (inNumberedList) {
          processedLines.push('</ol>');
          inNumberedList = false;
        }
        processedLines.push('<ul class="list-disc list-inside mb-3 space-y-1 ml-4">');
        inBulletList = true;
      }
      const content = trimmedLine.replace(/^[-*•]\s+/, '');
      processedLines.push(`<li class="text-gray-700 mb-1">${content}</li>`);
    }
    // Check for numbered lists
    else if (/^\d+\.\s+/.test(trimmedLine)) {
      if (!inNumberedList) {
        if (inBulletList) {
          processedLines.push('</ul>');
          inBulletList = false;
        }
        processedLines.push('<ol class="list-decimal list-inside mb-3 space-y-1 ml-4">');
        inNumberedList = true;
      }
      const content = trimmedLine.replace(/^\d+\.\s+/, '');
      processedLines.push(`<li class="text-gray-700 mb-1">${content}</li>`);
    }
    // Regular line
    else {
      if (inBulletList) {
        processedLines.push('</ul>');
        inBulletList = false;
      }
      if (inNumberedList) {
        processedLines.push('</ol>');
        inNumberedList = false;
      }
      if (trimmedLine) {
        processedLines.push(line);
      } else if (i > 0 && i < lines.length - 1) {
        // Only add <br> for empty lines that aren't at the start/end
        processedLines.push('<br>');
      }
    }
  }
  
  // Close any open lists
  if (inBulletList) {
    processedLines.push('</ul>');
  }
  if (inNumberedList) {
    processedLines.push('</ol>');
  }
  
  formattedText = processedLines.join('\n');
  
  // Step 4: Apply other formatting
  formattedText = formattedText
    // Convert markdown headers to HTML
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mb-2 mt-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 mb-3 mt-5">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-800 mb-4 mt-6">$1</h1>')
    
    // Convert italic text (but avoid matching inside HTML tags)
    .replace(/(?<!<[^>]*)\*([^*\n<]+?)\*(?!>)/g, '<em class="italic text-gray-700">$1</em>')
    
    // Convert code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-3 overflow-x-auto"><code class="text-sm font-mono text-gray-800">$1</code></pre>')
    
    // Convert inline code
    .replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">$1</code>')
    
    // Convert double line breaks to proper paragraph spacing
    .replace(/\n\n+/g, '<br><br>')
    
    // Convert single line breaks to <br> (but not inside lists or headers)
    .replace(/(?<!<\/[ulol]>\n)(?<!<\/h[1-3]>\n)\n(?!<[ulol])/g, '<br>');
  
  // Step 5: Wrap content in paragraphs for better structure
  // Split by double breaks or list boundaries
  const sections = formattedText.split(/(<br><br>|<\/ul>|<\/ol>|<\/h[1-3]>)/);
  const wrappedSections: string[] = [];
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!section.trim()) {
      wrappedSections.push(section);
      continue;
    }
    
    // Don't wrap if it's already an HTML tag or list
    if (/^<[hulop]/.test(section.trim()) || /<\/[hulop]/.test(section.trim())) {
      wrappedSections.push(section);
    } else if (section.trim() && !section.trim().startsWith('<')) {
      // Wrap plain text in paragraphs
      wrappedSections.push(`<p class="mb-3 text-gray-700">${section}</p>`);
    } else {
      wrappedSections.push(section);
    }
  }
  
  formattedText = wrappedSections.join('');
  
  // Clean up any double wrapping or empty paragraphs
  formattedText = formattedText
    .replace(/<p[^>]*><p[^>]*>/g, '<p class="mb-3 text-gray-700">')
    .replace(/<\/p><\/p>/g, '</p>')
    .replace(/<p[^>]*><\/p>/g, '')
    .replace(/<p[^>]*><br><\/p>/g, '');

  return {
    text: formattedText,
    hasCode,
    hasLists,
    hasHeaders
  };
}

export function getResponseIcon(hasCode: boolean, hasLists: boolean, hasHeaders: boolean): string {
  if (hasCode) return 'fa-solid fa-code';
  if (hasLists) return 'fa-solid fa-list-ul';
  if (hasHeaders) return 'fa-solid fa-heading';
  return 'fa-solid fa-robot';
}

export function getResponseColor(hasCode: boolean, hasLists: boolean, hasHeaders: boolean): string {
  if (hasCode) return 'border-l-4 border-blue-500 bg-blue-50';
  if (hasLists) return 'border-l-4 border-green-500 bg-green-50';
  if (hasHeaders) return 'border-l-4 border-purple-500 bg-purple-50';
  return 'border-l-4 border-[#612A74] bg-gray-50';
}

