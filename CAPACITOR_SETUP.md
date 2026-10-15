# Guide de compilation Capacitor & GitHub Actions pour YayText

Ce projet est configuré pour être compilé en application mobile native Android (et iOS) avec **Capacitor** et **GitHub Actions**.

---

## 1. Compilation automatique via GitHub Actions (Sans Android Studio sur votre PC)

Un workflow d'intégration continue est déjà prêt dans `.github/workflows/capacitor-build.yml`.

### Étapes pour obtenir votre fichier APK :
1. Poussez votre code sur votre dépôt GitHub (`git push origin main`).
2. Allez sur votre dépôt GitHub dans l'onglet **Actions**.
3. Cliquez sur le workflow **Build Capacitor Android App** (ou déclenchez-le manuellement avec **Run workflow**).
4. Une fois la compilation terminée, téléchargez l'artefact **`yaytext-debug-apk`** contenant votre fichier `app-debug.apk`.
5. Installez directement le fichier `.apk` sur votre téléphone Android !

---

## 2. Commandes utiles en local (si vous avez Android Studio ou Node installé)

```bash
# 1. Compiler le code Web
npm run build

# 2. Initialiser la plateforme Android (première fois uniquement)
npx cap add android

# 3. Synchroniser les assets avec le projet natif
npm run cap:sync

# 4. Ouvrir le projet dans Android Studio pour tester sur émulateur ou appareil
npm run cap:android
```

---

## 3. Configuration de l'application (`capacitor.config.ts`)

- **`appId`** : `com.yaytext.unicodefonts` (identifiant unique de votre paquet)
- **`appName`** : `YayText` (nom affiché sur l'écran d'accueil du téléphone)
- **`webDir`** : `dist` (dossier de sortie de Vite)
- **`server.androidScheme`** : `https` (permet le support sécurisé moderne des WebViews)
- **Safe Area Insets** : Déjà pris en compte dans le code CSS pour respecter l'encoche et la barre d'état Android/iOS.
