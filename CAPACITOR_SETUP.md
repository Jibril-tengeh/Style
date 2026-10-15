# Guide de compilation Capacitor & GitHub Actions pour YayText

Ce projet est configuré pour être compilé en application mobile native Android (et iOS) avec **Capacitor** et **GitHub Actions**.

---

## 1. Résolution des erreurs résolues pour GitHub Actions

1. **Erreur `Dependencies lock file is not found`** :
   - Corrigée dans le workflow : `cache: 'npm'` et `npm ci` ont été remplacés par `npm install --legacy-peer-deps`. Le build réussit désormais automatiquement sans exiger de fichier lock rigide.
2. **Version Java JDK 21** :
   - Le workflow a été mis à niveau de JDK 17 vers **JDK 21** (`java-version: '21'`), requis par les dernières versions de Gradle 8+ et Capacitor 7/8.

---

## 2. Compilation automatique via GitHub Actions (Recommandé)

Le fichier `.github/workflows/capacitor-build.yml` est prêt à l'emploi.

### Étapes pour obtenir votre fichier APK :
1. Poussez votre code sur votre dépôt GitHub (`git push origin main`).
2. Allez sur votre dépôt GitHub dans l'onglet **Actions**.
3. Cliquez sur le workflow **Build Capacitor Android App** (ou déclenchez-le avec **Run workflow**).
4. Une fois l'exécution terminée (en vert), téléchargez l'artefact **`yaytext-debug-apk`**.
5. Installez directement le fichier `.apk` sur votre téléphone Android !

---

## 3. Commandes utiles en local (si vous avez Node / Android Studio)

```bash
# Compiler le code Web
npm run build

# Synchroniser avec le projet Android natif
npm run cap:sync

# Ouvrir dans Android Studio
npm run cap:android
```
