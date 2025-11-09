"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

/**
 * ChatGPT-style scientific renderer.
 * Supports auto-detection of math/chemistry/physics text.
 * Uses MathJax (as ChatGPT does) for LaTeX typesetting.
 */
interface ScientificRendererProps {
  content: string;
  className?: string;
  type?: 'chemistry' | 'physics' | 'math' | 'auto';
}

// MathJax is loaded globally in layout.tsx
// Type declaration matches the existing global declaration

export default function ScientificRenderer({
  content,
  className = "",
  type = 'auto',
}: ScientificRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  /** MathJax async render (same logic ChatGPT uses under the hood) */
  const renderMath = async (el: HTMLElement) => {
    if (!window.MathJax) return;
    try {
      if (window.MathJax.typesetClear) {
        window.MathJax.typesetClear([el]);
      }
      await window.MathJax.typesetPromise([el]);
    } catch (err) {
      console.warn("MathJax render error:", err);
    }
  };

  /** Core text transformation pipeline */
  const process = (input: string): string => {
    if (!input) return "";

    // 1️⃣ Sanitize HTML (ChatGPT sanitizes user text before MathJax)
    // Allow safe HTML (from markdown) but sanitize dangerous content
    let text = DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a', 'hr', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'class', 'style']
    });

    // 2️⃣ Auto-wrap LaTeX expressions (ChatGPT-style)
    // Match inline and display math (ChatGPT supports both)
    // Protect already-wrapped expressions first
    const protectedExpressions: Array<{ placeholder: string; original: string }> = [];
    let protectIndex = 0;

    // Protect \(...\) delimiters (already wrapped inline math)
    text = text.replace(/\\\([^)]+\\\)/g, (match) => {
      const placeholder = `__MATH_PROTECT_INLINE_${protectIndex}__`;
      protectedExpressions.push({ placeholder, original: match });
      protectIndex++;
      return placeholder;
    });

    // Protect \[...\] delimiters (already wrapped display math)
    text = text.replace(/\\\[[^\]]+\\\]/g, (match) => {
      const placeholder = `__MATH_PROTECT_DISPLAY_${protectIndex}__`;
      protectedExpressions.push({ placeholder, original: match });
      protectIndex++;
      return placeholder;
    });

    // Protect math inside HTML tags (don't process math inside code blocks, etc.)
    text = text.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, (match) => {
      const placeholder = `__HTML_PROTECT_${protectIndex}__`;
      protectedExpressions.push({ placeholder, original: match });
      protectIndex++;
      return placeholder;
    });

    text = text.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, (match) => {
      const placeholder = `__HTML_PROTECT_${protectIndex}__`;
      protectedExpressions.push({ placeholder, original: match });
      protectIndex++;
      return placeholder;
    });

    // Convert $$...$$ to \[...\] (display math)
    text = text.replace(/\$\$([^$]+)\$\$/g, (_, expr) => `\\[${expr.trim()}\\]`);

    // Convert $...$ to \(...\) (inline math)
    // Be careful not to match dollar signs in HTML attributes or URLs
    // Use word boundary approach instead of lookbehind (for compatibility)
    text = text.replace(/\$([^$\n<>&]+?)\$/g, (match, expr) => {
      // Don't wrap if it's inside an HTML tag or if it's too short (likely not math)
      if (expr.includes('<') || expr.includes('>') || expr.trim().length < 1) {
        return match;
      }
      // Don't wrap if it contains HTML entities or tags
      if (expr.includes('&') || expr.includes(';')) {
        return match;
      }
      return `\\(${expr.trim()}\\)`;
    });

    // Restore protected expressions
    protectedExpressions.forEach(({ placeholder, original }) => {
      text = text.replace(placeholder, original);
    });

    // 3️⃣ Chemistry / physics enhancements (only if type is chemistry/physics/auto)
    if (type === 'chemistry' || type === 'auto') {
      // Chemical formulas with proper subscripts
      text = text.replace(/\b([A-Z][a-z]?)(\d+)(?![a-z])/g, "$1_{$2}");
      // Handle complex chemical formulas
      text = text.replace(/\b([A-Z][a-z]?)([a-z])(\d+)(?![a-z])/g, "$1$2_{$3}");
      // Chemical equations
      text = text.replace(/([A-Z][a-z]?\d*[a-z]?\d*)\s*→\s*([A-Z][a-z]?\d*[a-z]?\d*)/g, '$1 \\rightarrow $2');
      text = text.replace(/([A-Z][a-z]?\d*[a-z]?\d*)\s*⇌\s*([A-Z][a-z]?\d*[a-z]?\d*)/g, '$1 \\rightleftharpoons $2');
    }

    // Temperature and common symbols
    text = text.replace(/°C/g, "^\\circ\\text{C}");
    text = text.replace(/°F/g, "^\\circ\\text{F}");
    text = text.replace(/→/g, "\\rightarrow");
    text = text.replace(/⇌/g, "\\rightleftharpoons");

    // 4️⃣ Greek letters and symbols (ChatGPT also autoconverts)
    const greekMap: Record<string, string> = {
      alpha: "\\alpha",
      beta: "\\beta",
      gamma: "\\gamma",
      delta: "\\delta",
      epsilon: "\\epsilon",
      zeta: "\\zeta",
      eta: "\\eta",
      theta: "\\theta",
      iota: "\\iota",
      kappa: "\\kappa",
      lambda: "\\lambda",
      mu: "\\mu",
      nu: "\\nu",
      xi: "\\xi",
      omicron: "\\omicron",
      rho: "\\rho",
      sigma: "\\sigma",
      tau: "\\tau",
      upsilon: "\\upsilon",
      phi: "\\phi",
      chi: "\\chi",
      psi: "\\psi",
      omega: "\\omega",
    };

    // Only replace Greek letters when they appear as standalone words (not in already-wrapped math)
    Object.keys(greekMap).forEach((k) => {
      const re = new RegExp(`\\b${k}\\b(?![^\\\\]*\\\\)`, "g");
      text = text.replace(re, greekMap[k]);
    });

    // 5️⃣ Physics-specific processing (only if type is physics/auto)
    if (type === 'physics' || type === 'auto') {
      // Handle derivatives (only in clear mathematical contexts)
      text = text.replace(/d([a-zA-Z])\/d([a-zA-Z])/g, '\\frac{d$1}{d$2}');
      text = text.replace(/∂([a-zA-Z])\/∂([a-zA-Z])/g, '\\frac{\\partial $1}{\\partial $2}');
      // Handle integrals
      text = text.replace(/∫/g, '\\int');
      // Handle summations
      text = text.replace(/Σ/g, '\\sum');
      // Handle products
      text = text.replace(/Π/g, '\\prod');
      // Handle limits
      text = text.replace(/\blim\b/g, '\\lim');
    }

    // 6️⃣ Math-specific symbols (only if type is math/auto)
    if (type === 'math' || type === 'auto') {
      text = text.replace(/±/g, '\\pm');
      text = text.replace(/×/g, '\\times');
      text = text.replace(/÷/g, '\\div');
      text = text.replace(/≤/g, '\\leq');
      text = text.replace(/≥/g, '\\geq');
      text = text.replace(/≠/g, '\\neq');
      text = text.replace(/≈/g, '\\approx');
      text = text.replace(/∞/g, '\\infty');
      text = text.replace(/√/g, '\\sqrt');
      text = text.replace(/∑/g, '\\sum');
      text = text.replace(/∏/g, '\\prod');
      text = text.replace(/∫/g, '\\int');
      text = text.replace(/∂/g, '\\partial');
      text = text.replace(/∇/g, '\\nabla');
      text = text.replace(/∈/g, '\\in');
      text = text.replace(/⊂/g, '\\subset');
      text = text.replace(/∪/g, '\\cup');
      text = text.replace(/∩/g, '\\cap');
      text = text.replace(/∅/g, '\\emptyset');
      text = text.replace(/∀/g, '\\forall');
      text = text.replace(/∃/g, '\\exists');
    }

    return text;
  };

  /** Effect: process + render */
  useEffect(() => {
    if (!ref.current) return;

    const processed = process(content);
    
    // Set innerHTML with processed content
    ref.current.innerHTML = processed;

    // Render math (deferred, just like ChatGPT)
    const timeout = setTimeout(() => {
      if (ref.current) {
        renderMath(ref.current);
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [content, type]);

  return (
    <div
      ref={ref}
      className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}
      style={{ 
        overflowWrap: "break-word", 
        lineHeight: 1.6,
        wordBreak: "break-word"
      }}
    />
  );
}
