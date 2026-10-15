import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yaytext.unicodefonts',
  appName: 'YayText',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
