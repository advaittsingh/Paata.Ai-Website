// Language detection and response formatting utilities

export interface LanguageInfo {
  language: string;
  confidence: number;
  isExplicitlyRequested: boolean;
}

// Common language patterns and keywords
const languagePatterns = {
  // Hindi patterns
  hindi: [
    /हिंदी|hindi|hindi mein|hindi me|hindi language/i,
    /कृपया|please|answer in hindi|reply in hindi/i,
    /हिंदी में उत्तर|hindi mein uttar/i
  ],
  
  // Kannada patterns
  kannada: [
    /ಕನ್ನಡ|kannada|kannada mein|kannada me|kannada language/i,
    /ಕನ್ನಡದಲ್ಲಿ|kannadadalli|answer in kannada|reply in kannada/i,
    /ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರ|kannadadalli uttara/i
  ],
  
  // Tamil patterns
  tamil: [
    /தமிழ்|tamil|tamil language|tamil mein|tamil me/i,
    /தமிழில்|tamilil|answer in tamil|reply in tamil/i,
    /தமிழில் பதில்|tamilil pathil/i
  ],
  
  // Telugu patterns
  telugu: [
    /తెలుగు|telugu|telugu language|telugu mein|telugu me/i,
    /తెలుగులో|telugulo|answer in telugu|reply in telugu/i,
    /తెలుగులో సమాధానం|telugulo samadhanam/i
  ],
  
  // Bengali patterns
  bengali: [
    /বাংলা|bengali|bangla|bengali language|bengali mein|bengali me/i,
    /বাংলায়|banglay|answer in bengali|reply in bengali/i,
    /বাংলায় উত্তর|banglay uttor/i
  ],
  
  // Marathi patterns
  marathi: [
    /मराठी|marathi|marathi language|marathi mein|marathi me/i,
    /मराठीत|marathit|answer in marathi|reply in marathi/i,
    /मराठीत उत्तर|marathit uttar/i
  ],
  
  // Gujarati patterns
  gujarati: [
    /ગુજરાતી|gujarati|gujarati language|gujarati mein|gujarati me/i,
    /ગુજરાતીમાં|gujaratima|answer in gujarati|reply in gujarati/i,
    /ગુજરાતીમાં જવાબ|gujaratima javab/i
  ],
  
  // Punjabi patterns
  punjabi: [
    /ਪੰਜਾਬੀ|punjabi|punjabi language|punjabi mein|punjabi me/i,
    /ਪੰਜਾਬੀ ਵਿੱਚ|punjabi vich|answer in punjabi|reply in punjabi/i,
    /ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ|punjabi vich javab/i
  ],
  
  // Malayalam patterns
  malayalam: [
    /മലയാളം|malayalam|malayalam language|malayalam mein|malayalam me/i,
    /മലയാളത്തിൽ|malayalathil|answer in malayalam|reply in malayalam/i,
    /മലയാളത്തിൽ ഉത്തരം|malayalathil uttaram/i
  ],
  
  // Odia patterns
  odia: [
    /ଓଡ଼ିଆ|odia|oriya|odia language|odia mein|odia me/i,
    /ଓଡ଼ିଆରେ|odiar|answer in odia|reply in odia/i,
    /ଓଡ଼ିଆରେ ଉତ୍ତର|odiar uttar/i
  ],
  
  // Assamese patterns
  assamese: [
    /অসমীয়া|assamese|assamese language|assamese mein|assamese me/i,
    /অসমীয়াত|assamiat|answer in assamese|reply in assamese/i,
    /অসমীয়াত উত্তৰ|assamiat uttor/i
  ]
};

// Language codes mapping
const languageCodes: { [key: string]: string } = {
  hindi: 'hi',
  kannada: 'kn',
  tamil: 'ta',
  telugu: 'te',
  bengali: 'bn',
  marathi: 'mr',
  gujarati: 'gu',
  punjabi: 'pa',
  malayalam: 'ml',
  odia: 'or',
  assamese: 'as'
};

export function detectLanguage(message: string): LanguageInfo {
  const lowerMessage = message.toLowerCase();
  
  // First, check for explicit English requests (highest priority)
  const englishRequestPatterns = [
    /translate to english|translate in english|english translation|in english|answer in english|reply in english/i,
    /convert to english|convert in english|english version/i,
    /explain in english|describe in english/i
  ];
  
  for (const pattern of englishRequestPatterns) {
    if (pattern.test(lowerMessage)) {
      return {
        language: 'english',
        confidence: 0.95,
        isExplicitlyRequested: true
      };
    }
  }
  
  // Check for explicit language requests (other languages)
  for (const [language, patterns] of Object.entries(languagePatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerMessage)) {
        return {
          language: language,
          confidence: 0.9,
          isExplicitlyRequested: true
        };
      }
    }
  }
  
  // Check for non-English script detection (lower priority than explicit requests)
  const nonEnglishScripts = [
    /[\u0900-\u097F]/g, // Devanagari (Hindi, Marathi, etc.)
    /[\u0C80-\u0CFF]/g, // Kannada
    /[\u0B80-\u0BFF]/g, // Tamil
    /[\u0C00-\u0C7F]/g, // Telugu
    /[\u0980-\u09FF]/g, // Bengali
    /[\u0A80-\u0AFF]/g, // Gujarati
    /[\u0A00-\u0A7F]/g, // Punjabi
    /[\u0D00-\u0D7F]/g, // Malayalam
    /[\u0B00-\u0B7F]/g, // Odia
    /[\u0980-\u09FF]/g  // Assamese
  ];
  
  for (let i = 0; i < nonEnglishScripts.length; i++) {
    const script = nonEnglishScripts[i];
    if (script.test(message)) {
      const languages = ['hindi', 'kannada', 'tamil', 'telugu', 'bengali', 'marathi', 'gujarati', 'punjabi', 'malayalam', 'odia', 'assamese'];
      return {
        language: languages[i] || 'hindi',
        confidence: 0.7,
        isExplicitlyRequested: false
      };
    }
  }
  
  // Default to English
  return {
    language: 'english',
    confidence: 0.5,
    isExplicitlyRequested: false
  };
}

export function getLanguageCode(language: string): string {
  return languageCodes[language.toLowerCase()] || 'en';
}

export function formatLanguagePrompt(languageInfo: LanguageInfo, message: string): string {
  const { language, isExplicitlyRequested } = languageInfo;
  
  if (language === 'english') {
    if (isExplicitlyRequested) {
      return `\n\nIMPORTANT LANGUAGE INSTRUCTION: The student has explicitly requested the response in English. You MUST respond entirely in English. If the content contains text in other languages, provide the translation and explanation in English. Do not respond in any other language.`;
    }
    return '';
  }
  
  const languageNames = {
    hindi: 'Hindi',
    kannada: 'Kannada',
    tamil: 'Tamil',
    telugu: 'Telugu',
    bengali: 'Bengali',
    marathi: 'Marathi',
    gujarati: 'Gujarati',
    punjabi: 'Punjabi',
    malayalam: 'Malayalam',
    odia: 'Odia',
    assamese: 'Assamese'
  };
  
  const languageName = languageNames[language as keyof typeof languageNames] || language;
  
  if (isExplicitlyRequested) {
    return `\n\nIMPORTANT LANGUAGE INSTRUCTION: The student has explicitly requested the response in ${languageName}. You MUST respond entirely in ${languageName} without any English explanations, translations, or additional text. Do not mix languages. Provide the complete answer in ${languageName} only.`;
  } else {
    return `\n\nLANGUAGE PREFERENCE: The student's message appears to be in ${languageName}. Please respond in ${languageName} if appropriate, but you may include brief English explanations if needed for clarity.`;
  }
}

export function cleanMessageForLanguage(message: string, languageInfo: LanguageInfo): string {
  if (languageInfo.language === 'english') {
    return message;
  }
  
  // Remove language request phrases to get the actual question
  const languageRequestPatterns = [
    /(hindi|kannada|tamil|telugu|bengali|marathi|gujarati|punjabi|malayalam|odia|assamese)\s+(mein|me|language|in|में|मे|ভাষায়|ভাষা|ದಲ್ಲಿ|ಲಲ್ಲಿ|தமிழில்|తెలుగులో|বাংলায়|মারাঠিতে|ગુજરાતીમાં|ਪੰਜਾਬੀ ਵਿੱਚ|മലയാളത്തിൽ|ଓଡ଼ିଆରେ|অসমীয়াত)/gi,
    /(answer|reply|respond|उत्तर|जवाब|ಉತ್ತರ|பதில்|సమాధానం|উত্তর|उत्तर|જવાબ|ਜਵਾਬ|ഉത്തരം|ଉତ୍ତର|উত্তৰ)\s+(in|में|मे|ದಲ್ಲಿ|தமிழில்|తెలుగులో|বাংলায়|মারাঠিতে|ગુજરાતીમાં|ਪੰਜਾਬੀ ਵਿੱਚ|മലയാളത്തിൽ|ଓଡ଼ିଆରେ|অসমীয়াত)/gi,
    /(please|कृपया|ದಯವಿಟ್ಟು|தயவு செய்து|దయచేసి|অনুগ্রহ করে|कृपया|કૃપા કરીને|ਕਿਰਪਾ ਕਰਕੇ|ദയവായി|ଦୟାକରି|অনুগ্রহ কৰি)\s+(answer|reply|respond)/gi
  ];
  
  let cleanedMessage = message;
  for (const pattern of languageRequestPatterns) {
    cleanedMessage = cleanedMessage.replace(pattern, '').trim();
  }
  
  return cleanedMessage || message;
}

