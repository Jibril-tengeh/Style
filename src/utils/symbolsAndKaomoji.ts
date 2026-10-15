export interface KaomojiItem {
  id: string;
  nameEn: string;
  nameFr: string;
  category: 'mood' | 'action' | 'animals' | 'faces';
  text: string;
}

export interface SymbolCategory {
  nameEn: string;
  nameFr: string;
  symbols: string[];
}

export const KAOMOJI_COLLECTION: KaomojiItem[] = [
  // MOOD & CUTE
  { id: 'shrug', nameEn: 'Shrug', nameFr: 'Haussement d’épaules', category: 'action', text: '¯\\_(ツ)_/¯' },
  { id: 'lenny', nameEn: 'Lenny Face', nameFr: 'Visage Lenny', category: 'faces', text: '( ͡° ͜ʖ ͡°)' },
  { id: 'table_flip', nameEn: 'Table Flip', nameFr: 'Renverser la table', category: 'action', text: '(╯°□°)╯︵ ┻━┻' },
  { id: 'put_table', nameEn: 'Put Table Back', nameFr: 'Remettre la table', category: 'action', text: '┬─┬ノ( º _ ºノ)' },
  { id: 'sparkle_joy', nameEn: 'Sparkle Joy', nameFr: 'Joie étincelante', category: 'mood', text: '(◕‿◕✿)' },
  { id: 'love_eyes', nameEn: 'Love Eyes', nameFr: 'Yeux d’amour', category: 'mood', text: '(｡♥‿♥｡)' },
  { id: 'big_hug', nameEn: 'Big Hug', nameFr: 'Gros câlin', category: 'action', text: '(づ｡◕‿‿◕｡)づ' },
  { id: 'cool_sunglasses', nameEn: 'Deal With It', nameFr: 'Lunettes de soleil', category: 'mood', text: '(⌐■_■)' },
  { id: 'put_on_shades', nameEn: 'Putting Shades On', nameFr: 'Met ses lunettes', category: 'action', text: '( •_•) ( •_•)>⌐■-■ (⌐■_■)' },
  { id: 'crying', nameEn: 'Crying Rivers', nameFr: 'Pleurant à chaudes larmes', category: 'mood', text: '(ಥ﹏ಥ)' },
  { id: 'disapproval', nameEn: 'Look of Disapproval', nameFr: 'Regard réprobateur', category: 'faces', text: '(ಠ_ಠ)' },
  { id: 'confused', nameEn: 'Confused / Sweat', nameFr: 'Gêné / Confus', category: 'mood', text: '(・_・;)' },
  { id: 'cute_blush', nameEn: 'Cute Blush', nameFr: 'Mignon & Timide', category: 'mood', text: '(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)' },
  { id: 'happy_hands', nameEn: 'Yaaay / Cheers', nameFr: 'Youpi / Hourra', category: 'mood', text: '＼(＾▽＾)／' },
  { id: 'flexing', nameEn: 'Muscle Flex', nameFr: 'Biceps / Puissant', category: 'action', text: 'ᕙ(⇀‸↼‶)ᕗ' },
  { id: 'pointing_gun', nameEn: 'Finger Gun', nameFr: 'Doigt pistolet', category: 'action', text: '(☞ﾟヮﾟ)☞' },
  { id: 'peace_sign', nameEn: 'Peace Sign', nameFr: 'Signe de paix', category: 'action', text: '(^_^)v' },
  { id: 'sleeping', nameEn: 'Sleeping / Snoozing', nameFr: 'Dormir', category: 'mood', text: '(＿ ＿*) Z z z' },
  { id: 'cat_meow', nameEn: 'Cat Face', nameFr: 'Chat mignon', category: 'animals', text: '(=^･ω･^=)' },
  { id: 'bear_wave', nameEn: 'Teddy Bear', nameFr: 'Ourson', category: 'animals', text: 'ʕ •ᴥ• ʔ' },
  { id: 'bunny_ears', nameEn: 'Little Bunny', nameFr: 'Petit lapin', category: 'animals', text: '(ᐢ • ˕ • ᐢ)' },
  { id: 'doggy', nameEn: 'Puppy Dog', nameFr: 'Chiot mignon', category: 'animals', text: '∪･ω･∪' },
  { id: 'sparkly_uwu', nameEn: 'Sparkly UwU', nameFr: 'UwU étoilé', category: 'faces', text: '( ˘ ³˘)♥' },
  { id: 'evil_smile', nameEn: 'Evil Grin', nameFr: 'Sourire malicieux', category: 'mood', text: '(｀∀´)Ψ' }
];

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    nameEn: 'Stars & Sparkles',
    nameFr: 'Étoiles & Étincelles',
    symbols: ['★', '☆', '✦', '✧', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⋆', '✵', '✹', '✸', '✷', '✶', '★彡', '彡★']
  },
  {
    nameEn: 'Hearts & Love',
    nameFr: 'Cœurs & Amour',
    symbols: ['❤', '❥', '♡', '♥', '❣', '❦', '❧', 'ღ', 'დ', '💓', '💕', '💖', '💗', '💘', '💙', '💜', '🖤', '🤍', '🤎']
  },
  {
    nameEn: 'Arrows & Pointers',
    nameFr: 'Flèches & Pointeurs',
    symbols: ['➔', '➜', '➞', '➛', '➢', '➤', '➥', '➦', '➧', '➨', '➩', '➪', '➫', '➬', '➭', '➮', '➯', '➱', '➲', '➳', '➴', '➵', '➶', '➷', '➸', '➹', '➺', '➻', '➼', '➽', '←', '→', '↑', '↓', '↔', '↕', '⇄', '⇅', '⇆']
  },
  {
    nameEn: 'Aesthetic Borders & Ornaments',
    nameFr: 'Bordures & Ornements',
    symbols: ['꧁', '༺', '༻', '꧂', '୨୧', '✿', '❀', '❁', '❂', '❃', '⚜', '♛', '♚', '⚔️', '༒', '☬', '⚕', '☽', '☾', '☀', '☁', '⚡', '❆', '❅', '❄']
  },
  {
    nameEn: 'Brackets & Frames',
    nameFr: 'Crochets & Parenthèses',
    symbols: ['【', '】', '『', '』', '「', '」', '〔', '〕', '《', '》', '〈', '〉', '〘', '〙', '〖', '〗', '〚', '〛', '«', '»', '‹', '›', '⟦', '⟧']
  },
  {
    nameEn: 'Lines, Blocks & Geometric',
    nameFr: 'Lignes & Blocs Géométriques',
    symbols: ['░', '▒', '▓', '█', '▌', '▀', '▄', '■', '□', '▲', '△', '▼', '▽', '◆', '◇', '◈', '◉', '◊', '○', '●', '◐', '◑', '◒', '◓', '▪', '▫', '▬', '▭']
  },
  {
    nameEn: 'Music & Audio',
    nameFr: 'Musique & Audio',
    symbols: ['♪', '♫', '♩', '♬', '♭', '♮', '♯', '𝄞', '𝄢', 'ıllıllı', '●───', '◄◄', '►', '►►', '❚❚']
  },
  {
    nameEn: 'Math & Currency',
    nameFr: 'Devises & Mathématiques',
    symbols: ['$', '€', '£', '¥', '₿', '¢', '₹', '₽', '₩', '₺', '∞', '±', '≠', '≈', '≤', '≥', '×', '÷', '√', 'π', '∑', '∆', '‰', '№', '℅', '°', '℃', '℉']
  }
];
