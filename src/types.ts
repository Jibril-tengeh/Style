export type CategoryId =
  | 'all'
  | 'popular'
  | 'bold_italic'
  | 'fancy_cursive'
  | 'circled_squared'
  | 'lines_strikes'
  | 'glitch_zalgo'
  | 'aesthetic_vapor'
  | 'tiny_scripts'
  | 'fun_geek'
  | 'decorative_borders';

export type AccentMode = 'preserve' | 'combine' | 'strip';

export interface ZalgoOptions {
  up: boolean;
  mid: boolean;
  down: boolean;
  intensity: number; // 1 to 15
}

export interface TransformOptions {
  zalgo?: ZalgoOptions;
  accentMode?: AccentMode;
}

export interface TextStyleDefinition {
  id: string;
  name: string;
  nameFr: string;
  category: CategoryId;
  description: string;
  descriptionFr: string;
  popular?: boolean;
  transform: (text: string, options?: TransformOptions) => string;
}

export interface TextStats {
  characters: number;
  words: number;
  bytes: number;
  twitterRemaining: number;
}

export type SocialPlatform = 'twitter' | 'instagram' | 'whatsapp' | 'tiktok';
