import { TextStyleDefinition, ZalgoOptions, CategoryId, TransformOptions, AccentMode } from '../types';

// Map characters with full support for accented letters (é, è, ê, ë, à, â, ä, î, ï, ô, ö, ù, û, ü, ç, ñ, É, È, Ê, À, Ç, œ, æ)
export function mapWithAccents(
  text: string,
  charMapper: (ch: string, code: number) => string,
  accentMode: AccentMode = 'preserve'
): string {
  if (!text) return '';

  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
    let result = '';

    for (const { segment } of segmenter.segment(text)) {
      if (segment === ' ' || segment === '\n' || segment === '\t' || segment === '\r') {
        result += segment;
        continue;
      }

      // Handle French curly apostrophe
      if (segment === '’') {
        result += "'";
        continue;
      }

      // Handle French ligatures
      if (segment === 'œ') {
        result += charMapper('o', 111) + charMapper('e', 101);
        continue;
      }
      if (segment === 'Œ') {
        result += charMapper('O', 79) + charMapper('E', 69);
        continue;
      }
      if (segment === 'æ') {
        result += charMapper('a', 97) + charMapper('e', 101);
        continue;
      }
      if (segment === 'Æ') {
        result += charMapper('A', 65) + charMapper('E', 69);
        continue;
      }

      // Check if character is an accented Latin character
      const isAccented = /^[éèêëàâäîïôöùûüçñÉÈÊËÀÂÄÎÏÔÖÙÛÜÇÑ]$/.test(segment);

      if (isAccented) {
        if (accentMode === 'preserve') {
          // Keep the exact accented character visible and intact!
          result += segment;
          continue;
        }

        if (accentMode === 'combine') {
          // Decompose and attach combining diacritic
          const decomposed = segment.normalize('NFD');
          const baseChar = decomposed.charAt(0);
          const diacritics = decomposed.slice(1);
          const baseCode = baseChar.codePointAt(0) || 0;
          result += charMapper(baseChar, baseCode) + diacritics;
          continue;
        }

        if (accentMode === 'strip') {
          // Convert to base styled letter (e.g. é -> e -> 𝐞)
          const baseChar = segment.normalize('NFD').charAt(0);
          const baseCode = baseChar.codePointAt(0) || 0;
          result += charMapper(baseChar, baseCode);
          continue;
        }
      }

      // Standard non-accented character
      const code = segment.codePointAt(0) || 0;
      result += charMapper(segment, code);
    }
    return result;
  }

  // Fallback for environments without Intl.Segmenter
  let result = '';
  for (const ch of text) {
    if (ch === ' ' || ch === '\n' || ch === '\t') {
      result += ch;
      continue;
    }
    if (ch === '’') {
      result += "'";
      continue;
    }
    const isAccented = /^[éèêëàâäîïôöùûüçñÉÈÊËÀÂÄÎÏÔÖÙÛÜÇÑ]$/.test(ch);
    if (isAccented) {
      if (accentMode === 'preserve') {
        result += ch;
        continue;
      }
      if (accentMode === 'combine') {
        const decomposed = ch.normalize('NFD');
        const baseChar = decomposed.charAt(0);
        const diacritics = decomposed.slice(1);
        const baseCode = baseChar.codePointAt(0) || 0;
        result += charMapper(baseChar, baseCode) + diacritics;
        continue;
      }
      if (accentMode === 'strip') {
        const baseChar = ch.normalize('NFD').charAt(0);
        const baseCode = baseChar.codePointAt(0) || 0;
        result += charMapper(baseChar, baseCode);
        continue;
      }
    }
    const code = ch.codePointAt(0) || 0;
    result += charMapper(ch, code);
  }
  return result;
}

// Map from char to char via dictionary with accent decomposition
function dictMap(
  text: string,
  dict: Record<string, string>,
  accentMode: AccentMode = 'preserve'
): string {
  return mapWithAccents(
    text,
    (base) => dict[base] || dict[base.toLowerCase()] || base,
    accentMode
  );
}

// Mathematical alphanumeric symbols Unicode mapping helper with accented support
function mathAlpha(
  text: string,
  upperStart: number,
  lowerStart: number,
  digitStart?: number,
  exceptions: Record<string, number> = {},
  accentMode: AccentMode = 'preserve'
): string {
  return mapWithAccents(
    text,
    (ch, code) => {
      if (exceptions[ch]) {
        return String.fromCodePoint(exceptions[ch]);
      }
      // A-Z: 65 - 90
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(upperStart + (code - 65));
      }
      // a-z: 97 - 122
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(lowerStart + (code - 97));
      }
      // 0-9: 48 - 57
      if (digitStart !== undefined && code >= 48 && code <= 57) {
        return String.fromCodePoint(digitStart + (code - 48));
      }
      return ch;
    },
    accentMode
  );
}

// Combining diacritical marks adder (respects grapheme clusters so accents receive marks too)
function addCombiningMark(text: string, mark: string): string {
  const clean = text.replace(/’/g, "'");
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
    let res = '';
    for (const { segment } of segmenter.segment(clean)) {
      if (segment === ' ' || segment === '\n' || segment === '\t') {
        res += segment;
      } else {
        res += segment + mark;
      }
    }
    return res;
  }
  return clean
    .split('')
    .map(c => (c === ' ' || c === '\n' ? c : c + mark))
    .join('');
}

// Upside down map including French accented characters
const upsideDownMap: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
  j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I',
  J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ',
  S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9',
  '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', ',': "'", "'": ',', '"': '„', '!': '¡', '?': '¿',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '<': '>', '>': '<', '&': '⅋', '_': '‾',
  // French accented characters
  é: 'ǝ', è: 'ǝ', ê: 'ǝ', ë: 'ǝ', à: 'ɐ', â: 'ɐ', ä: 'ɐ',
  î: 'ᴉ', ï: 'ᴉ', ô: 'o', ö: 'o', ù: 'n', û: 'n', ü: 'n',
  ç: 'ɔ',
  É: 'Ǝ', È: 'Ǝ', Ê: 'Ǝ', Ë: 'Ǝ', À: '∀', Â: '∀', Ä: '∀',
  Î: 'I', Ï: 'I', Ô: 'O', Ö: 'O', Ù: '∩', Û: '∩', Ü: '∩',
  Ç: 'Ɔ',
};

// Mirror map
const mirrorMap: Record<string, string> = {
  a: 'ɒ', b: 'd', c: 'ɔ', d: 'b', e: 'ɘ', f: 'ɟ', g: 'ǫ', h: 'ʜ', i: 'i',
  j: 'į', k: 'ʞ', l: 'l', m: 'm', n: 'ᴎ', o: 'o', p: 'q', q: 'p', r: 'ɿ',
  s: 'ƨ', t: 'ƚ', u: 'u', v: 'v', w: 'w', x: 'x', y: 'ʏ', z: 'ƹ',
  A: 'A', B: 'ᙠ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'ꟻ', G: 'Ꭾ', H: 'H', I: 'I',
  J: 'Ⴑ', K: 'ʞ', L: '⅃', M: 'M', N: 'ᴎ', O: 'O', P: 'ꟼ', Q: 'Ọ', R: 'Я',
  S: 'Ƨ', T: 'T', U: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Z: 'Ƹ',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<',
  é: 'ɘ', è: 'ɘ', ê: 'ɘ', ë: 'ɘ', à: 'ɒ', â: 'ɒ', ç: 'ɔ',
  É: 'Ǝ', È: 'Ǝ', Ê: 'Ǝ', À: 'A', Ç: 'Ɔ',
};

// Small caps map
const smallCapsMap: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
  A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ', I: 'ɪ',
  J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ',
  S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ'
};

// Superscript map
const superscriptMap: Record<string, string> = {
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ',
  t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  A: 'ᴬ', B: 'ᴮ', D: 'ᴰ', E: 'ᴱ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ',
  L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
};

// Subscript map
const subscriptMap: Record<string, string> = {
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ',
  o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
};

// Greek lookalike map
const greekLookalikeMap: Record<string, string> = {
  A: 'Α', B: 'Β', C: 'Ϲ', D: 'Δ', E: 'Ε', F: 'Ϝ', G: 'Γ', H: 'Η', I: 'Ι',
  J: 'Ϳ', K: 'Κ', L: 'Λ', M: 'Μ', N: 'Ν', O: 'Ο', P: 'Ρ', Q: 'Ϙ', R: 'Я',
  S: 'Σ', T: 'Τ', U: 'Υ', V: 'Ѵ', W: 'Ω', X: 'Χ', Y: 'Ψ', Z: 'Ζ',
  a: 'α', b: 'β', c: 'ϲ', d: 'δ', e: 'ε', f: 'φ', g: 'γ', h: 'η', i: 'ι',
  j: 'ϳ', k: 'κ', l: 'λ', m: 'μ', n: 'ν', o: 'ο', p: 'ρ', q: 'ϙ', r: 'я',
  s: 'σ', t: 'τ', u: 'υ', v: 'ν', w: 'ω', x: 'χ', y: 'ψ', z: 'ζ'
};

// Cyrillic lookalike map
const cyrillicLookalikeMap: Record<string, string> = {
  A: 'А', B: 'В', C: 'С', D: 'Д', E: 'Е', F: 'Ғ', G: 'Ԍ', H: 'Н', I: 'І',
  J: 'Ј', K: 'К', L: 'Л', M: 'М', N: 'И', O: 'О', P: 'Р', Q: 'Ҩ', R: 'Я',
  S: 'Ѕ', T: 'Т', U: 'Ц', V: 'Ѵ', W: 'Ш', X: 'Х', Y: 'У', Z: 'Z',
  a: 'а', b: 'в', c: 'с', d: 'ԁ', e: 'е', f: 'ғ', g: 'д', h: 'һ', i: 'і',
  j: 'ј', k: 'к', l: 'л', m: 'м', n: 'п', o: 'о', p: 'р', q: 'ԛ', r: 'я',
  s: 'ѕ', t: 'т', u: 'ц', v: 'ѵ', w: 'ш', x: 'х', y: 'у', z: 'z'
};

// Rune lookalike map (Elder Futhark)
const runeMap: Record<string, string> = {
  A: 'ᚨ', B: 'ᛒ', C: 'ᚲ', D: 'ᛞ', E: 'ᛖ', F: 'ᚠ', G: 'ᚷ', H: 'ᚺ', I: 'ᛁ',
  J: 'ᛃ', K: 'ᚲ', L: 'ᛚ', M: 'ᛗ', N: 'ᚾ', O: 'ᛟ', P: 'ᛈ', Q: 'ᚴ', R: 'ᚱ',
  S: 'ᛋ', T: 'ᛏ', U: 'ᚢ', V: 'ᚹ', W: 'ᚹ', X: 'ᛪ', Y: 'ᛇ', Z: 'ᛉ',
  a: 'ᚨ', b: 'ᛒ', c: 'ᚲ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ', g: 'ᚷ', h: 'ᚺ', i: 'ᛁ',
  j: 'ᛃ', k: 'ᚲ', l: 'ᛚ', m: 'ᛗ', n: 'ᚾ', o: 'ᛟ', p: 'ᛈ', q: 'ᚴ', r: 'ᚱ',
  s: 'ᛋ', t: 'ᛏ', u: 'ᚢ', v: 'ᚹ', w: 'ᚹ', x: 'ᛪ', y: 'ᛇ', z: 'ᛉ'
};

// Leetspeak map
const leetMap: Record<string, string> = {
  a: '4', b: '8', e: '3', g: '9', i: '1', l: '1', o: '0', s: '5', t: '7', z: '2',
  A: '4', B: '8', E: '3', G: '9', I: '1', L: '1', O: '0', S: '5', T: '7', Z: '2'
};

// Morse map including standard French letters
const morseMap: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/',
  É: '..-..', È: '.-..-', Ê: '..-..', À: '.--.-', Â: '.--.-',
  Ç: '-.-..', Ô: '---.', Î: '..', Û: '..--',
};

// Zalgo Diacritical Marks
const zalgoUp = [
  '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310',
  '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343',
  '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350',
  '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d'
];

const zalgoMid = [
  '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327',
  '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e',
  '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361'
];

const zalgoDown = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f',
  '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c',
  '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339',
  '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d'
];

function getRandomZalgo(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateZalgo(text: string, options: ZalgoOptions = { up: true, mid: true, down: true, intensity: 5 }): string {
  let result = '';
  const count = Math.max(1, Math.min(15, options.intensity));

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ' || ch === '\n') {
      result += ch;
      continue;
    }
    result += ch;
    if (options.up) {
      for (let j = 0; j < count; j++) {
        result += getRandomZalgo(zalgoUp);
      }
    }
    if (options.mid) {
      for (let j = 0; j < Math.ceil(count / 2); j++) {
        result += getRandomZalgo(zalgoMid);
      }
    }
    if (options.down) {
      for (let j = 0; j < count; j++) {
        result += getRandomZalgo(zalgoDown);
      }
    }
  }
  return result;
}

// All YayText style definitions with complete accented support
export const ALL_TEXT_STYLES: TextStyleDefinition[] = [
  // BOLD & ITALIC
  {
    id: 'serif_bold',
    name: 'Bold (Serif)',
    nameFr: 'Gras (Serif)',
    category: 'bold_italic',
    popular: true,
    description: 'Classic bookish bold serif typography',
    descriptionFr: 'Typographie sérif grasse classique et élégante',
    transform: (t, opts) => mathAlpha(t, 0x1D400, 0x1D41A, 0x1D7CE, {}, opts?.accentMode)
  },
  {
    id: 'sans_bold',
    name: 'Bold (Sans-Serif)',
    nameFr: 'Gras (Sans-Serif)',
    category: 'bold_italic',
    popular: true,
    description: 'Clean modern sans-serif bold for social bios',
    descriptionFr: 'Gras moderne et épuré idéal pour bios et tweets',
    transform: (t, opts) => mathAlpha(t, 0x1D5D4, 0x1D5EE, 0x1D7EC, {}, opts?.accentMode)
  },
  {
    id: 'serif_italic',
    name: 'Italic (Serif)',
    nameFr: 'Italique (Serif)',
    category: 'bold_italic',
    popular: true,
    description: 'Classic slanted serif italic text',
    descriptionFr: 'Texte italique serif raffiné et penché',
    transform: (t, opts) =>
      mathAlpha(t, 0x1D434, 0x1D44E, undefined, {
        h: 0x210E // Planck constant
      }, opts?.accentMode)
  },
  {
    id: 'sans_italic',
    name: 'Italic (Sans-Serif)',
    nameFr: 'Italique (Sans-Serif)',
    category: 'bold_italic',
    popular: true,
    description: 'Contemporary slanted sans-serif',
    descriptionFr: 'Italique contemporain sans empattement',
    transform: (t, opts) => mathAlpha(t, 0x1D608, 0x1D622, undefined, {}, opts?.accentMode)
  },
  {
    id: 'serif_bold_italic',
    name: 'Bold Italic (Serif)',
    nameFr: 'Gras Italique (Serif)',
    category: 'bold_italic',
    popular: true,
    description: 'Heavy slanted serif headline text',
    descriptionFr: 'Titre fort et penché avec empattements',
    transform: (t, opts) => mathAlpha(t, 0x1D468, 0x1D482, undefined, {}, opts?.accentMode)
  },
  {
    id: 'sans_bold_italic',
    name: 'Bold Italic (Sans)',
    nameFr: 'Gras Italique (Sans)',
    category: 'bold_italic',
    popular: true,
    description: 'Dynamic dynamic slanted bold sans',
    descriptionFr: 'Gras penché dynamique et percutant',
    transform: (t, opts) => mathAlpha(t, 0x1D63C, 0x1D656, undefined, {}, opts?.accentMode)
  },

  // FANCY & CURSIVE
  {
    id: 'script_normal',
    name: 'Cursive / Script',
    nameFr: 'Écriture Cursive / Script',
    category: 'fancy_cursive',
    popular: true,
    description: 'Flowing handwritten calligraphy cursive',
    descriptionFr: 'Calligraphie manuscrite fluide et gracieuse',
    transform: (t, opts) =>
      mathAlpha(t, 0x1D49C, 0x1D4B6, undefined, {
        B: 0x212C,
        E: 0x2130,
        F: 0x2131,
        H: 0x210B,
        I: 0x2110,
        L: 0x2112,
        M: 0x2133,
        R: 0x211B,
        e: 0x212F,
        g: 0x210A,
        o: 0x2134
      }, opts?.accentMode)
  },
  {
    id: 'script_bold',
    name: 'Bold Cursive / Calligraphy',
    nameFr: 'Cursive Grasse / Calligraphie',
    category: 'fancy_cursive',
    popular: true,
    description: 'Rich flowing bold handwriting',
    descriptionFr: 'Écriture manuscrite grasse et majestueuse',
    transform: (t, opts) => mathAlpha(t, 0x1D4D0, 0x1D4EA, undefined, {}, opts?.accentMode)
  },
  {
    id: 'fraktur_normal',
    name: 'Fraktur / Gothic',
    nameFr: 'Gothique / Fraktur',
    category: 'fancy_cursive',
    popular: true,
    description: 'Medieval gothic German Fraktur text',
    descriptionFr: 'Texte médiéval gothique allemand Fraktur',
    transform: (t, opts) =>
      mathAlpha(t, 0x1D504, 0x1D51E, undefined, {
        C: 0x212D,
        H: 0x210C,
        I: 0x2111,
        R: 0x211C,
        Z: 0x2128
      }, opts?.accentMode)
  },
  {
    id: 'fraktur_bold',
    name: 'Bold Fraktur / Dark Gothic',
    nameFr: 'Gothique Gras / Dark Gothic',
    category: 'fancy_cursive',
    popular: true,
    description: 'Heavy bold medieval blackletter',
    descriptionFr: 'Caractères gothiques noirs très imposants',
    transform: (t, opts) => mathAlpha(t, 0x1D56C, 0x1D586, undefined, {}, opts?.accentMode)
  },
  {
    id: 'blackboard_bold',
    name: 'Double-Struck (Blackboard)',
    nameFr: 'Double Trait (Tableau Noir)',
    category: 'fancy_cursive',
    popular: true,
    description: 'Mathematical double-struck open face blackboard font',
    descriptionFr: 'Typographie mathématique ajourée à double trait',
    transform: (t, opts) =>
      mathAlpha(t, 0x1D538, 0x1D552, 0x1D7D8, {
        C: 0x2102,
        H: 0x210D,
        N: 0x2115,
        P: 0x2119,
        Q: 0x211A,
        R: 0x211D,
        Z: 0x2124
      }, opts?.accentMode)
  },
  {
    id: 'monospace',
    name: 'Monospace / Typewriter',
    nameFr: 'Machine à Écrire / Monospace',
    category: 'fancy_cursive',
    popular: true,
    description: 'Vintage monospace terminal typewriter font',
    descriptionFr: 'Police rétro de machine à écrire et code',
    transform: (t, opts) => mathAlpha(t, 0x1D670, 0x1D68A, 0x1D7F6, {}, opts?.accentMode)
  },

  // CIRCLED & SQUARED
  {
    id: 'bubble_white',
    name: 'Bubbles / Circled (White)',
    nameFr: 'Bulles Blanches / Cerclées',
    category: 'circled_squared',
    popular: true,
    description: 'Cute circled letters and digits',
    descriptionFr: 'Lettres et chiffres entourés de cercles blancs',
    transform: (t, opts) =>
      mapWithAccents(t, (ch, code) => {
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + (code - 97));
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + (code - 49));
        if (code === 48) return '⓪';
        return ch;
      }, opts?.accentMode)
  },
  {
    id: 'bubble_black',
    name: 'Inverted Bubbles (Black Circled)',
    nameFr: 'Bulles Noires Inversées',
    category: 'circled_squared',
    popular: true,
    description: 'High contrast solid black circled characters',
    descriptionFr: 'Cercles noirs pleins à contraste élevé',
    transform: (t, opts) =>
      mapWithAccents(t, (ch, code) => {
        const upper = ch.toUpperCase();
        const uCode = upper.codePointAt(0) || 0;
        if (uCode >= 65 && uCode <= 90) return String.fromCodePoint(0x1F150 + (uCode - 65));
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2776 + (code - 49));
        if (code === 48) return '⓿';
        return ch;
      }, opts?.accentMode)
  },
  {
    id: 'square_white',
    name: 'Squares (White)',
    nameFr: 'Carrés Blancs',
    category: 'circled_squared',
    description: 'Enclosed in clean white square frames',
    descriptionFr: 'Lettres encadrées dans des carrés blancs épurés',
    transform: (t, opts) =>
      mapWithAccents(t, (ch) => {
        const upper = ch.toUpperCase();
        const code = upper.codePointAt(0) || 0;
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + (code - 65));
        return ch;
      }, opts?.accentMode)
  },
  {
    id: 'square_black',
    name: 'Squares (Black / Red Emoji)',
    nameFr: 'Carrés Noirs / Blocs',
    category: 'circled_squared',
    description: 'Solid square blocks (renders as emoji badges on mobile)',
    descriptionFr: 'Blocs carrés pleins très visibles sur réseaux',
    transform: (t, opts) =>
      mapWithAccents(t, (ch) => {
        const upper = ch.toUpperCase();
        const code = upper.codePointAt(0) || 0;
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F170 + (code - 65));
        return ch;
      }, opts?.accentMode)
  },
  {
    id: 'parenthesized',
    name: 'Parenthesized',
    nameFr: 'Entre Parenthèses',
    category: 'circled_squared',
    description: 'Individual characters wrapped in neat curved parentheses',
    descriptionFr: 'Lettres et chiffres enveloppés de parenthèses délicates',
    transform: (t, opts) =>
      mapWithAccents(t, (ch, code) => {
        const lower = ch.toLowerCase();
        const lCode = lower.codePointAt(0) || 0;
        if (lCode >= 97 && lCode <= 122) return String.fromCodePoint(0x249C + (lCode - 97));
        if (code >= 49 && code <= 57) return String.fromCodePoint(0x2474 + (code - 49));
        return ch;
      }, opts?.accentMode)
  },

  // LINES & STRIKES
  {
    id: 'strike_single',
    name: 'Strikethrough (Single)',
    nameFr: 'Barré Simple',
    category: 'lines_strikes',
    popular: true,
    description: 'Classic line through middle of text for discounts & edits',
    descriptionFr: 'Ligne au centre pour annonces de réductions et soldes',
    transform: (t) => addCombiningMark(t, '\u0336')
  },
  {
    id: 'strike_double',
    name: 'Double Strikethrough',
    nameFr: 'Double Barré',
    category: 'lines_strikes',
    description: 'Two parallel strike lines crossing through each character',
    descriptionFr: 'Deux traits horizontaux barrant le texte',
    transform: (t) => addCombiningMark(t, '\u033F')
  },
  {
    id: 'slash_through',
    name: 'Slash Through',
    nameFr: 'Rayé Oblique',
    category: 'lines_strikes',
    description: 'Angled forward slash crossing each character',
    descriptionFr: 'Barre oblique rayant chaque lettre',
    transform: (t) => addCombiningMark(t, '\u0338')
  },
  {
    id: 'tilde_strike',
    name: 'Tilde Strike',
    nameFr: 'Tilde Barré',
    category: 'lines_strikes',
    description: 'Wavy tilde squiggle passing through letters',
    descriptionFr: 'Vague tilde traversant chaque caractère',
    transform: (t) => addCombiningMark(t, '\u0334')
  },
  {
    id: 'underline_single',
    name: 'Underline (Single)',
    nameFr: 'Souligné Simple',
    category: 'lines_strikes',
    popular: true,
    description: 'Continuous single bottom underline',
    descriptionFr: 'Ligne continue soulignant le bas des lettres',
    transform: (t) => addCombiningMark(t, '\u0332')
  },
  {
    id: 'underline_double',
    name: 'Underline (Double)',
    nameFr: 'Souligné Double',
    category: 'lines_strikes',
    description: 'Formal double bottom underline',
    descriptionFr: 'Double ligne soulignant le texte',
    transform: (t) => addCombiningMark(t, '\u0333')
  },
  {
    id: 'underline_dotted',
    name: 'Underline (Dotted)',
    nameFr: 'Souligné Pointillé',
    category: 'lines_strikes',
    description: 'Delicate pair of dots beneath every character',
    descriptionFr: 'Points délicats sous chaque lettre',
    transform: (t) => addCombiningMark(t, '\u0324')
  },
  {
    id: 'underline_wavy',
    name: 'Underline (Wavy / Squiggle)',
    nameFr: 'Souligné Ondulé',
    category: 'lines_strikes',
    description: 'Subtle wavy tilde underneath the letters',
    descriptionFr: 'Ondulation sous chaque caractère',
    transform: (t) => addCombiningMark(t, '\u0330')
  },
  {
    id: 'overline_single',
    name: 'Overline (Top Bar)',
    nameFr: 'Surligné (Ligne Supérieure)',
    category: 'lines_strikes',
    description: 'Solid straight line drawn over the top of characters',
    descriptionFr: 'Barre horizontale continue au-dessus des lettres',
    transform: (t) => addCombiningMark(t, '\u0305')
  },
  {
    id: 'arrows_below',
    name: 'Arrows Below',
    nameFr: 'Flèches en Dessous',
    category: 'lines_strikes',
    description: 'Tiny directional arrows underneath each letter',
    descriptionFr: 'Petites flèches directrices sous chaque caractère',
    transform: (t) => addCombiningMark(t, '\u034D')
  },
  {
    id: 'cross_below',
    name: 'Cross Below',
    nameFr: 'Croix en Dessous',
    category: 'lines_strikes',
    description: 'Subtle X cross marks beneath letters',
    descriptionFr: 'Croisillons décoratifs sous chaque caractère',
    transform: (t) => addCombiningMark(t, '\u0353')
  },

  // GLITCH & ZALGO
  {
    id: 'zalgo_curse',
    name: 'Zalgo / Glitch (Cursed Text)',
    nameFr: 'Zalgo / Glitch (Texte Maudit)',
    category: 'glitch_zalgo',
    popular: true,
    description: 'Creepy demonic glitch text that overflows bounds',
    descriptionFr: 'Texte glitché démoniaque et corrompu très populaire',
    transform: (t, opts) => generateZalgo(t, opts?.zalgo || { up: true, mid: true, down: true, intensity: 5 })
  },
  {
    id: 'zalgo_mini',
    name: 'Glitch Subtle (Mini Distortion)',
    nameFr: 'Glitch Subtil (Légère Distorsion)',
    category: 'glitch_zalgo',
    description: 'Subtle digital glitch noise with balanced overflow',
    descriptionFr: 'Léger effet de parasite numérique discret',
    transform: (t) => generateZalgo(t, { up: true, mid: false, down: false, intensity: 2 })
  },
  {
    id: 'zalgo_heavy',
    name: 'Glitch Chaos (Maximum Overload)',
    nameFr: 'Glitch Chaos (Surcharge Maximale)',
    category: 'glitch_zalgo',
    description: 'Extreme apocalyptic text corruption',
    descriptionFr: 'Corruption extrême avec cascade de symboles',
    transform: (t) => generateZalgo(t, { up: true, mid: true, down: true, intensity: 10 })
  },

  // AESTHETIC & VAPORWAVE
  {
    id: 'vaporwave_fullwidth',
    name: 'Vaporwave / Fullwidth',
    nameFr: 'Vaporwave / Pleine Largeur',
    category: 'aesthetic_vapor',
    popular: true,
    description: 'Wide aesthetic 90s anime Japanese fullwidth text',
    descriptionFr: 'Texte large esthétique style rétro 90s japonais',
    transform: (t, opts) =>
      mapWithAccents(t, (ch, code) => {
        if (code === 32) return '　'; // ideographic space
        if (code >= 33 && code <= 126) return String.fromCodePoint(0xFF00 + (code - 0x20));
        return ch;
      }, opts?.accentMode)
  },
  {
    id: 'aesthetic_spaced',
    name: 'Aesthetic Spaced',
    nameFr: 'Aesthetic Espacé',
    category: 'aesthetic_vapor',
    popular: true,
    description: 'Wide cinematic letter spacing (e.g. t  e  x  t)',
    descriptionFr: 'Espacement aéré et élégant entre chaque lettre',
    transform: (t) => {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(t)).map(s => s.segment).join('  ');
      }
      return t.split('').join('  ');
    }
  },
  {
    id: 'clapped_text',
    name: 'Clapped Text 👏',
    nameFr: 'Texte avec Applaudissements 👏',
    category: 'aesthetic_vapor',
    description: 'Places clap emojis between every word for emphasis',
    descriptionFr: 'Place des applaudissements 👏 entre chaque mot',
    transform: (t) => t.trim().split(/\s+/).join(' 👏 ')
  },
  {
    id: 'sparkle_spaced',
    name: 'Sparkle Spaced ✨',
    nameFr: 'Espacé Étoilé ✨',
    category: 'aesthetic_vapor',
    description: 'Subtle sparkles placed between words',
    descriptionFr: 'Étoiles scintillantes réparties entre les mots',
    transform: (t) => t.trim().split(/\s+/).join(' ✨ ')
  },
  {
    id: 'dot_spaced',
    name: 'Dot Spaced ・',
    nameFr: 'Espacé avec Points ・',
    category: 'aesthetic_vapor',
    description: 'Japanese middle dot separators',
    descriptionFr: 'Points médians japonais élégants',
    transform: (t) => {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(t)).map(s => s.segment).join('・');
      }
      return t.split('').join('・');
    }
  },

  // TINY & SCRIPTS
  {
    id: 'small_caps',
    name: 'Small Caps',
    nameFr: 'Petites Capitales',
    category: 'tiny_scripts',
    popular: true,
    description: 'Elegant miniature uppercase letters for classy headers',
    descriptionFr: 'Majuscules miniatures élégantes et soignées',
    transform: (t, opts) => dictMap(t, smallCapsMap, opts?.accentMode)
  },
  {
    id: 'superscript',
    name: 'Superscript (Tiny Top)',
    nameFr: 'Exposant (Minuscule Haut)',
    category: 'tiny_scripts',
    popular: true,
    description: 'Miniature floating text in upper position',
    descriptionFr: 'Texte miniature surélevé en exposant',
    transform: (t, opts) => dictMap(t, superscriptMap, opts?.accentMode)
  },
  {
    id: 'subscript',
    name: 'Subscript (Tiny Bottom)',
    nameFr: 'Indice (Minuscule Bas)',
    category: 'tiny_scripts',
    description: 'Miniature text aligned at the baseline',
    descriptionFr: 'Texte miniature abaissé en indice',
    transform: (t, opts) => dictMap(t, subscriptMap, opts?.accentMode)
  },

  // FUN & GEEK
  {
    id: 'upside_down',
    name: 'Upside Down / Turned (ʇxǝʇ)',
    nameFr: 'À l’Envers / Inversé (ʇxǝʇ)',
    category: 'fun_geek',
    popular: true,
    description: 'Flipped 180 degrees backwards for playful puzzles',
    descriptionFr: 'Texte retourné à 180 degrés et lu à l’envers',
    transform: (t) => {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(t))
          .map(s => s.segment)
          .reverse()
          .map((c) => upsideDownMap[c] || upsideDownMap[c.toLowerCase()] || c)
          .join('');
      }
      return t
        .split('')
        .reverse()
        .map((c) => upsideDownMap[c] || upsideDownMap[c.toLowerCase()] || c)
        .join('');
    }
  },
  {
    id: 'backwards_reverse',
    name: 'Reverse / Backwards (txet)',
    nameFr: 'Texte Rétrograde (txet)',
    category: 'fun_geek',
    description: 'Read from right to left in reverse order',
    descriptionFr: 'Ordre des lettres complètement inversé',
    transform: (t) => {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(t)).map(s => s.segment).reverse().join('');
      }
      return t.split('').reverse().join('');
    }
  },
  {
    id: 'mirror_text',
    name: 'Mirror Text (ƚxɘT)',
    nameFr: 'Texte Miroir (ƚxɘT)',
    category: 'fun_geek',
    description: 'Reflected letters as seen in a mirror',
    descriptionFr: 'Caractères réfléchis comme dans un miroir',
    transform: (t) => {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(t))
          .map(s => s.segment)
          .reverse()
          .map((c) => mirrorMap[c] || mirrorMap[c.toLowerCase()] || c)
          .join('');
      }
      return t
        .split('')
        .reverse()
        .map((c) => mirrorMap[c] || mirrorMap[c.toLowerCase()] || c)
        .join('');
    }
  },
  {
    id: 'leetspeak',
    name: 'Leetspeak (1337)',
    nameFr: 'Leetspeak (1337 / Hacker)',
    category: 'fun_geek',
    description: 'Gamer leet numeric character substitution',
    descriptionFr: 'Substitution classique de chiffres style gamer',
    transform: (t, opts) => dictMap(t, leetMap, opts?.accentMode)
  },
  {
    id: 'morse_code',
    name: 'Morse Code (· ··· -)',
    nameFr: 'Code Morse',
    category: 'fun_geek',
    description: 'International dots and dashes telegraph code',
    descriptionFr: 'Traduction télégraphique internationale en points et traits',
    transform: (t, opts) => {
      const mode = opts?.accentMode || 'compatible';
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('fr', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(t.toUpperCase()))
          .map((s) => {
            const ch = s.segment;
            if (morseMap[ch]) return morseMap[ch];
            if (mode === 'compatible') {
              const stripped = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              return morseMap[stripped] || stripped;
            }
            return morseMap[ch] || ch;
          })
          .join(' ');
      }
      return t
        .toUpperCase()
        .split('')
        .map((c) => morseMap[c] || c)
        .join(' ');
    }
  },
  {
    id: 'binary_code',
    name: 'Binary Code (01000001)',
    nameFr: 'Code Binaire',
    category: 'fun_geek',
    description: '8-bit binary representation of each character',
    descriptionFr: 'Représentation en octets binaires de 8 bits',
    transform: (t) =>
      t
        .split('')
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ')
  },
  {
    id: 'hex_code',
    name: 'Hexadecimal (48 65 78)',
    nameFr: 'Hexadécimal',
    category: 'fun_geek',
    description: 'Raw hexadecimal byte code representation',
    descriptionFr: 'Valeurs hexadécimales de chaque caractère',
    transform: (t) =>
      t
        .split('')
        .map((c) => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
        .join(' ')
  },
  {
    id: 'rune_lookalike',
    name: 'Runic Futhark (ᚱᚢᚾᛖᛋ)',
    nameFr: 'Runes Nordiques (Futhark)',
    category: 'fun_geek',
    description: 'Viking elder Futhark rune lookalikes',
    descriptionFr: 'Glyphes runiques inspirés de l’ancien Futhark',
    transform: (t, opts) => dictMap(t, runeMap, opts?.accentMode)
  },
  {
    id: 'greek_lookalike',
    name: 'Greek Alphabet Lookalike',
    nameFr: 'Sosie Grec',
    category: 'fun_geek',
    description: 'Replaces Latin letters with lookalike Greek characters',
    descriptionFr: 'Remplace les lettres latines par des caractères grecs',
    transform: (t, opts) => dictMap(t, greekLookalikeMap, opts?.accentMode)
  },
  {
    id: 'cyrillic_lookalike',
    name: 'Cyrillic Alphabet Lookalike',
    nameFr: 'Sosie Cyrillique',
    category: 'fun_geek',
    description: 'Replaces Latin letters with lookalike Cyrillic characters',
    descriptionFr: 'Remplace les lettres latines par des caractères cyrilliques',
    transform: (t, opts) => dictMap(t, cyrillicLookalikeMap, opts?.accentMode)
  },

  // DECORATIVE & BORDERS
  {
    id: 'wings_angel',
    name: 'Angel Wings ꧁༺ ༻꧂',
    nameFr: 'Ailes d’Ange ꧁༺ ༻꧂',
    category: 'decorative_borders',
    popular: true,
    description: 'Popular royal Thai ornamental wing borders',
    descriptionFr: 'Ornements royaux thaïlandais très populaires sur TikTok',
    transform: (t) => `꧁༺ ${t} ༻꧂`
  },
  {
    id: 'sparkle_stars',
    name: 'Sparkle Stars ✧･ﾟ: *✧ ✧*:･ﾟ✧',
    nameFr: 'Étoiles Étincelantes ✧･ﾟ: *✧',
    category: 'decorative_borders',
    popular: true,
    description: 'Cute anime sparkle glitter boundary',
    descriptionFr: 'Cadre scintillant féerique style manga',
    transform: (t) => `✧･ﾟ: *✧ ${t} ✧*:･ﾟ✧`
  },
  {
    id: 'shooting_star',
    name: 'Shooting Star ★彡 彡★',
    nameFr: 'Étoile Filante ★彡',
    category: 'decorative_borders',
    description: 'Shooting star trails flanking text',
    descriptionFr: 'Étoiles filantes encadrant le texte',
    transform: (t) => `★彡 ${t} 彡★`
  },
  {
    id: 'floral_bloom',
    name: 'Floral Bloom ✿.｡.:* *:.｡.✿',
    nameFr: 'Fleurie & Printanier ✿',
    category: 'decorative_borders',
    description: 'Delicate floral blossom embellishment',
    descriptionFr: 'Fleurs délicates et points pour bio Instagram',
    transform: (t) => `✿.｡.:* ${t} *:.｡.✿`
  },
  {
    id: 'hearts_flanked',
    name: 'Love Hearts ♥*♡*♥',
    nameFr: 'Cœurs d’Amour ♥*♡*♥',
    category: 'decorative_borders',
    description: 'Sweet heart borders for messages and couples',
    descriptionFr: 'Cœurs romantiques parfaits pour messages d’amour',
    transform: (t) => `♥*♡*♥ ${t} ♥*♡*♥`
  },
  {
    id: 'ribbon_bow',
    name: 'Ribbon & Bow ୨୧ ୨୧',
    nameFr: 'Nœud & Ruban ୨୧',
    category: 'decorative_borders',
    popular: true,
    description: 'Coquette aesthetic soft ribbon bows',
    descriptionFr: 'Style coquette avec rubans et nœuds délicats',
    transform: (t) => `୨୧ ${t} ୨୧`
  },
  {
    id: 'japanese_brackets',
    name: 'Japanese Lenticular Brackets 【 】',
    nameFr: 'Crochets Japonais 【 】',
    category: 'decorative_borders',
    description: 'Bold Japanese black lenticular emphasis brackets',
    descriptionFr: 'Crochets noirs japonais pour titres accrocheurs',
    transform: (t) => `【 ${t} 】`
  },
  {
    id: 'corner_brackets',
    name: 'Japanese Corner Brackets 『 』',
    nameFr: 'Coins Japonais 『 』',
    category: 'decorative_borders',
    description: 'Traditional manga quote corner marks',
    descriptionFr: 'Guillemets d’angle traditionnels japonais',
    transform: (t) => `『 ${t} 』`
  },
  {
    id: 'vintage_swirl',
    name: 'Vintage Swirls ˙·٠•●♥ ♥●•٠·˙',
    nameFr: 'Rétro MSN ˙·٠•●♥',
    category: 'decorative_borders',
    description: 'Classic 2000s nostalgic MSN Messenger status border',
    descriptionFr: 'Ornement nostalgique rétro des statuts MSN',
    transform: (t) => `˙·٠•●♥ ${t} ♥●•٠·˙`
  },
  {
    id: 'audio_equalizer',
    name: 'Equalizer Bars ıllıllı ıllıllı',
    nameFr: 'Égaliseur Musical ıllıllı',
    category: 'decorative_borders',
    description: 'Sound frequency waveform indicator borders',
    descriptionFr: 'Ondes de volume sonore et rythme musical',
    transform: (t) => `ıllıllı ${t} ıllıllı`
  },
  {
    id: 'retro_shading',
    name: 'Retro 8-Bit Blocks ░▒▓█ █▓▒░',
    nameFr: 'Blocs 8-Bit Rétro ░▒▓█',
    category: 'decorative_borders',
    description: 'Textile gradient shading blocks from the BBS era',
    descriptionFr: 'Blocs de dégradé tramé époque BBS et ASCII art',
    transform: (t) => `░▒▓█ ${t} █▓▒░`
  },
  {
    id: 'swords_gamer',
    name: 'Warrior Swords ⚔️ ⚔️',
    nameFr: 'Épées de Guerrier ⚔️',
    category: 'decorative_borders',
    description: 'Gaming guild and clan battle sword borders',
    descriptionFr: 'Épées croisées pour clans de jeux et pseudos',
    transform: (t) => `⚔️ ${t} ⚔️`
  },
  {
    id: 'crown_royal',
    name: 'Royal Crown ♛ ♛',
    nameFr: 'Couronne Royale ♛',
    category: 'decorative_borders',
    description: 'Imperial chess queen/king crown symbols',
    descriptionFr: 'Symboles royaux de couronnes pour profils VIP',
    transform: (t) => `♛ ${t} ♛`
  }
];

export const CATEGORIES: { id: CategoryId; labelEn: string; labelFr: string }[] = [
  { id: 'all', labelEn: 'All Styles', labelFr: 'Tous les Styles' },
  { id: 'popular', labelEn: 'Popular', labelFr: 'Populaires' },
  { id: 'bold_italic', labelEn: 'Bold & Italic', labelFr: 'Gras & Italique' },
  { id: 'fancy_cursive', labelEn: 'Fancy & Gothic', labelFr: 'Cursif & Gothique' },
  { id: 'circled_squared', labelEn: 'Circled & Boxed', labelFr: 'Cerclés & Carrés' },
  { id: 'lines_strikes', labelEn: 'Crossed & Underlined', labelFr: 'Barré & Souligné' },
  { id: 'glitch_zalgo', labelEn: 'Glitch & Zalgo', labelFr: 'Glitch & Zalgo' },
  { id: 'aesthetic_vapor', labelEn: 'Aesthetic & Vapor', labelFr: 'Aesthetic & Vapor' },
  { id: 'tiny_scripts', labelEn: 'Tiny & Sub/Super', labelFr: 'Petits & Exposants' },
  { id: 'fun_geek', labelEn: 'Fun & Ciphers', labelFr: 'Fun & Codes' },
  { id: 'decorative_borders', labelEn: 'Decorative Borders', labelFr: 'Cadres Décoratifs' },
];
