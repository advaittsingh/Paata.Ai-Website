/**
 * Context Manager for Multi-Modal Chat Sessions
 * Handles switching between different contexts (text, image, voice) intelligently
 */

export interface ContextItem {
  id: string;
  type: 'text' | 'image' | 'voice';
  content: string;
  timestamp: Date;
  metadata?: {
    imageUrl?: string;
    extractedText?: string;
    confidence?: number;
    languages?: string[];
    engines?: string[];
  };
}

export interface ChatContext {
  sessionId: string;
  contexts: ContextItem[];
  currentContext?: string;
  contextHistory: string[];
  lastActivity: Date;
}

export class ContextManager {
  private contexts: Map<string, ChatContext> = new Map();

  /**
   * Initialize or get existing context for a session
   */
  getOrCreateContext(sessionId: string): ChatContext {
    if (!this.contexts.has(sessionId)) {
      this.contexts.set(sessionId, {
        sessionId,
        contexts: [],
        contextHistory: [],
        lastActivity: new Date()
      });
    }
    return this.contexts.get(sessionId)!;
  }

  /**
   * Add a new context item to the session
   */
  addContext(
    sessionId: string, 
    type: 'text' | 'image' | 'voice', 
    content: string, 
    metadata?: any
  ): ContextItem {
    const context = this.getOrCreateContext(sessionId);
    
    const contextItem: ContextItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      metadata
    };

    context.contexts.push(contextItem);
    context.currentContext = contextItem.id;
    context.lastActivity = new Date();

    return contextItem;
  }

  /**
   * Determine if new input relates to previous context
   */
  isContextRelated(sessionId: string, newContent: string, newType: string): boolean {
    const context = this.contexts.get(sessionId);
    if (!context || context.contexts.length === 0) return false;

    const recentContexts = context.contexts.slice(-3); // Check last 3 contexts
    
    for (const ctx of recentContexts) {
      // Check for keyword overlap
      const overlap = this.calculateContentOverlap(newContent, ctx.content);
      if (overlap > 0.3) return true;

      // Check for similar topics
      if (this.isSimilarTopic(newContent, ctx.content)) return true;

      // Check for continuation patterns
      if (this.isContinuation(newContent, ctx.content, newType, ctx.type)) return true;
    }

    return false;
  }

  /**
   * Get relevant context for AI response
   */
  getRelevantContext(sessionId: string, currentInput: string): {
    primaryContext: ContextItem[];
    relatedContexts: ContextItem[];
    contextSummary: string;
  } {
    const context = this.contexts.get(sessionId);
    if (!context) {
      return { primaryContext: [], relatedContexts: [], contextSummary: '' };
    }

    const recentContexts = context.contexts.slice(-5); // Last 5 contexts
    const relatedContexts: ContextItem[] = [];
    const primaryContext: ContextItem[] = [];

    // Find related contexts
    for (const ctx of recentContexts) {
      if (this.isContextRelated(sessionId, currentInput, ctx.type)) {
        relatedContexts.push(ctx);
      }
    }

    // Primary context is the most recent related context or current
    if (relatedContexts.length > 0) {
      primaryContext.push(relatedContexts[relatedContexts.length - 1]);
    } else if (recentContexts.length > 0) {
      primaryContext.push(recentContexts[recentContexts.length - 1]);
    }

    // Generate context summary
    const contextSummary = this.generateContextSummary(primaryContext, relatedContexts);

    return { primaryContext, relatedContexts, contextSummary };
  }

  /**
   * Calculate content overlap between two strings
   */
  private calculateContentOverlap(content1: string, content2: string): number {
    const words1 = content1.toLowerCase().split(/\s+/);
    const words2 = content2.toLowerCase().split(/\s+/);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set(Array.from(set1).filter(x => set2.has(x)));
    const union = new Set([...Array.from(set1), ...Array.from(set2)]);
    
    return intersection.size / union.size;
  }

  /**
   * Check if two contents are about similar topics
   */
  private isSimilarTopic(content1: string, content2: string): boolean {
    const topicKeywords = {
      math: ['solve', 'equation', 'problem', 'calculate', 'formula', 'algebra', 'geometry'],
      science: ['experiment', 'theory', 'hypothesis', 'physics', 'chemistry', 'biology'],
      language: ['translate', 'grammar', 'sentence', 'word', 'meaning', 'definition'],
      history: ['event', 'war', 'battle', 'ancient', 'historical', 'period'],
      geography: ['country', 'city', 'location', 'map', 'continent', 'ocean']
    };

    const content1Lower = content1.toLowerCase();
    const content2Lower = content2.toLowerCase();

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      const hasTopic1 = keywords.some(keyword => content1Lower.includes(keyword));
      const hasTopic2 = keywords.some(keyword => content2Lower.includes(keyword));
      
      if (hasTopic1 && hasTopic2) return true;
    }

    return false;
  }

  /**
   * Check if new input is a continuation of previous context
   */
  private isContinuation(newContent: string, prevContent: string, newType: string, prevType: string): boolean {
    const continuationPatterns = [
      // Question follow-ups
      { pattern: /^(and|also|what about|how about|can you|could you)/i, prevPattern: /\?$/ },
      // Image-related continuations
      { pattern: /^(in this image|from the picture|in the photo|what else)/i, prevType: 'image' },
      // Voice continuations
      { pattern: /^(as i said|like i mentioned|continuing from)/i, prevType: 'voice' },
      // Math problem continuations
      { pattern: /^(next step|then|after that|now|so)/i, prevPattern: /(solve|calculate|find)/i }
    ];

    for (const { pattern, prevPattern, prevType: requiredPrevType } of continuationPatterns) {
      if (pattern.test(newContent)) {
        if (prevPattern && prevPattern.test(prevContent)) return true;
        if (requiredPrevType && prevType === requiredPrevType) return true;
      }
    }

    return false;
  }

  /**
   * Generate a summary of the current context
   */
  private generateContextSummary(primaryContext: ContextItem[], relatedContexts: ContextItem[]): string {
    if (primaryContext.length === 0) return '';

    const primary = primaryContext[0];
    const summary = [`Current context: ${primary.type} input`];
    
    if (primary.metadata?.extractedText) {
      summary.push(`Image contains: ${primary.metadata.extractedText.substring(0, 100)}...`);
    } else {
      summary.push(`Content: ${primary.content.substring(0, 100)}...`);
    }

    if (relatedContexts.length > 1) {
      summary.push(`Related to ${relatedContexts.length - 1} previous contexts`);
    }

    return summary.join('. ');
  }

  /**
   * Get context switching suggestions
   */
  getContextSwitchingSuggestions(sessionId: string, currentInput: string): string[] {
    const context = this.contexts.get(sessionId);
    if (!context || context.contexts.length === 0) return [];

    const suggestions: string[] = [];
    const recentContexts = context.contexts.slice(-3);

    for (const ctx of recentContexts) {
      if (ctx.type === 'image' && ctx.metadata?.extractedText) {
        suggestions.push(`Continue with the image: "${ctx.metadata.extractedText.substring(0, 50)}..."`);
      } else if (ctx.type === 'text') {
        suggestions.push(`Continue with: "${ctx.content.substring(0, 50)}..."`);
      }
    }

    return suggestions.slice(0, 2); // Return top 2 suggestions
  }

  /**
   * Clear context for a session
   */
  clearContext(sessionId: string): void {
    this.contexts.delete(sessionId);
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string): {
    totalContexts: number;
    contextTypes: { [key: string]: number };
    lastActivity: Date | null;
  } {
    const context = this.contexts.get(sessionId);
    if (!context) {
      return { totalContexts: 0, contextTypes: {}, lastActivity: null };
    }

    const contextTypes = context.contexts.reduce((acc, ctx) => {
      acc[ctx.type] = (acc[ctx.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalContexts: context.contexts.length,
      contextTypes,
      lastActivity: context.lastActivity
    };
  }
}

// Export singleton instance
export const contextManager = new ContextManager();

