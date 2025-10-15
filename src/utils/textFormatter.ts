/**
 * Converts markdown-style formatting to HTML
 * Handles **bold**, *italic*, and bullet points
 */

export function formatTextWithHTML(text: string): string {
  if (!text) return '';
  
  // Convert **text** to <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert bullet points (lines starting with * or -) to HTML lists
  formattedText = convertBulletPoints(formattedText);
  
  // Convert *text* to <em>text</em> (italic) - but only if not part of a bullet
  formattedText = formattedText.replace(/(?<!^|\n)\*([^*\n]+)\*(?!\s*$)/g, '<em>$1</em>');
  
  // Convert line breaks to <br> tags
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
}

/**
 * Converts asterisk-based bullet points to HTML unordered lists
 */
function convertBulletPoints(text: string): string {
  // Split text into lines
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line starts with bullet point (* or -)
    if (/^\s*[\*-]\s+/.test(line)) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      
      // Extract the content after the bullet
      const content = line.replace(/^\s*[\*-]\s+/, '');
      result.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line);
    }
  }
  
  // Close list if we're still in one
  if (inList) {
    result.push('</ul>');
  }
  
  return result.join('\n');
}

/**
 * Checks if text contains HTML tags
 */
export function containsHTML(text: string): boolean {
  return /<[^>]*>/g.test(text);
}
