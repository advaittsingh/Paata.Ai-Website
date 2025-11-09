"use client";

import { useEffect, useRef, useState } from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
}

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements: HTMLElement[]) => Promise<void>;
      startup: {
        ready: () => void;
      };
      typesetClear: (elements: HTMLElement[]) => void;
    };
  }
}

export default function MathRenderer({ content, className = "" }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Function to preprocess content for better scientific expression handling
  const preprocessContent = (text: string): string => {
    // First, protect common contractions and possessives from scientific processing
    const protectedText = protectContractions(text);
    
    // Handle common scientific notation patterns
    let processed = protectedText
      // Convert scientific notation like 1.23e-4 to proper LaTeX
      .replace(/(\d+\.?\d*)\s*[eE]\s*([+-]?\d+)/g, '$1 \\times 10^{$2}')
      // Handle chemical formulas with proper spacing (only for actual chemical formulas)
      .replace(/\b([A-Z][a-z]?)(\d+)(?![a-z])/g, '$1_{$2}')
      // Handle subscripts in chemical formulas
      .replace(/\b([A-Z][a-z]?)([a-z])(\d+)(?![a-z])/g, '$1$2_{$3}')
      // Handle common physics symbols (only when they appear as standalone words)
      .replace(/\b(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|rho|sigma|tau|upsilon|phi|chi|psi|omega)\b(?![a-zA-Z])/g, '\\$1')
      // Handle common physics units (only when they appear as standalone units)
      .replace(/\b(m\/s|m\/s²|kg\/m³|N\/m²|J\/kg|W\/m²|A\/m|V\/m|T|F|H|Ω|Pa|J|W|N|C|V|A|K|mol|cd|Hz|Bq|Gy|Sv|kat)\b(?![a-zA-Z])/g, '\\text{$1}')
      // Handle fractions in text (only when they appear as mathematical expressions)
      .replace(/(\d+)\/(\d+)(?![a-zA-Z])/g, '\\frac{$1}{$2}')
      // Handle exponents in text (only in mathematical contexts)
      .replace(/([a-zA-Z])\^(\d+)/g, '$1^{$2}')
      // Handle subscripts in text (only in mathematical contexts)
      .replace(/([a-zA-Z])_(\d+)/g, '$1_{$2}');

    // Restore protected contractions
    processed = restoreContractions(processed);

    return processed;
  };

  // Function to protect contractions and possessives from scientific processing
  const protectContractions = (text: string): string => {
    return text
      // Protect common contractions
      .replace(/\b(let's|it's|that's|what's|who's|where's|when's|why's|how's|there's|here's|you're|we're|they're|I'm|you're|he's|she's|it's|we're|they're|I've|you've|we've|they've|I'll|you'll|he'll|she'll|it'll|we'll|they'll|I'd|you'd|he'd|she'd|it'd|we'd|they'd|I'm|you're|he's|she's|it's|we're|they're|isn't|aren't|wasn't|weren't|don't|doesn't|didn't|won't|wouldn't|couldn't|shouldn't|can't|couldn't|mustn't|shan't)\b/gi, (match) => {
        return `__CONTRACTION_${match.replace(/'/g, '_APOSTROPHE_')}__`;
      })
      // Protect possessives
      .replace(/\b([A-Z][a-z]+)'s\b/g, (match, name) => {
        return `__POSSESSIVE_${name}_APOSTROPHE_s__`;
      })
      // Protect other common apostrophe patterns
      .replace(/\b([a-z]+)'([a-z]+)\b/gi, (match, part1, part2) => {
        return `__APOSTROPHE_${part1}_APOSTROPHE_${part2}__`;
      });
  };

  // Function to restore protected contractions and possessives
  const restoreContractions = (text: string): string => {
    return text
      // Restore contractions
      .replace(/__CONTRACTION_([^_]+_APOSTROPHE_[^_]+)__/g, (match, content) => {
        return content.replace(/_APOSTROPHE_/g, "'");
      })
      // Restore possessives
      .replace(/__POSSESSIVE_([^_]+)_APOSTROPHE_s__/g, (match, name) => {
        return `${name}'s`;
      })
      // Restore other apostrophe patterns
      .replace(/__APOSTROPHE_([^_]+)_APOSTROPHE_([^_]+)__/g, (match, part1, part2) => {
        return `${part1}'${part2}`;
      });
  };

  useEffect(() => {
    if (containerRef.current && window.MathJax) {
      setIsRendering(true);
      
      // Clear previous content and typesetting
      if (containerRef.current) {
        window.MathJax.typesetClear([containerRef.current]);
      }
      
      // Preprocess content for better scientific expression handling
      const processedContent = preprocessContent(content);
      containerRef.current.innerHTML = processedContent;
      
      // Typeset the math expressions
      window.MathJax.typesetPromise([containerRef.current])
        .then(() => {
          setIsRendering(false);
        })
        .catch((err) => {
          console.error('MathJax typesetting error:', err);
          setIsRendering(false);
        });
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={`${className} ${isRendering ? 'opacity-50' : ''}`}
      style={{ minHeight: isRendering ? '20px' : 'auto' }}
    />
  );
}
