# Guide de compilation Capacitor & GitHub Actions pour YayText

Ce projet est configuré pour être compilé en application mobile native Android (et iOS) avec **Capacitor** et **GitHub Actions**.

---

## 1. Explication du correctif GitHub Actions

- **Erreur `sdkmanager failed with exit code 1` résolue** : L'action tierce `android-actions/setup-android@v3` provoquait un conflit avec le gestionnaire de SDK. Sur les serveurs GitHub Actions (`ubuntu-latest`), le **SDK Android officiel est déjà préinstallé nativement**. Cette étape redondante a donc été retirée.
- **Java JDK 21 (Temurin)** : Utilise Eclipse Temurin JDK 21, la distribution officielle recommandée pour les builds Gradle 8+ et Capacitor.
- **Node.js 22** : Utilise la version stable LTS pour éviter les avertissements de dépréciation.

---

## 2. Compilation automatique via GitHub Actions (Recommandé)

Le fichier `.github/workflows/capacitor-build.yml` est opérationnel.

### Pour lancer la compilation :
1. Poussez votre code sur GitHub (`git add .`, `git commit -m "Fix Android CI"`, `git push origin main`).
2. Ouvrez l'onglet **Actions** de votre dépôt GitHub.
3. Cliquez sur **Build Capacitor Android App** (ou utilisez **Run workflow**).
4. Une fois terminé avec succès (coche verte), téléchargez l'artefact **`yaytext-debug-apk`**.
5. Vous obtenez directement le fichier **`app-debug.apk`** prêt à être installé sur votre téléphone !

---

## 3. Commandes utiles en local (si vous avez Android Studio ou Node installé)

```bash
# 1. Compiler le code Web
npm run build

# 2. Synchroniser les assets avec le projet Android natif
npm run cap:sync

# 3. Ouvrir dans Android Studio
npm run cap:android
```
