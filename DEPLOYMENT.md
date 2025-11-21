# Guide de Déploiement RFAntennaCalc - App Store

Guide complet pour publier et mettre à jour l'application RFAntennaCalc sur l'Apple App Store.

**Développeur :** F4HYY  
**Bundle ID :** com.sergederhy.rfantennacalc  
**App Store Connect :** https://appstoreconnect.apple.com

---

## 📋 Informations importantes

### URLs de l'app
- **Support :** https://github.com/sderhy/RFAntennaCalc/blob/main/SUPPORT.md
- **Privacy Policy :** https://github.com/sderhy/RFAntennaCalc/blob/main/PRIVACY.md
- **GitHub Repo :** https://github.com/sderhy/RFAntennaCalc

### Identifiants
- **Bundle ID :** com.sergederhy.rfantennacalc
- **SKU :** rfantennacalc-001
- **Team :** Serge DERHY

---

## 🚀 Première publication (déjà faite ✅)

Cette section est pour référence uniquement.

### 1. Créer l'app dans App Store Connect
- My Apps → "+" → New App
- Bundle ID : com.sergederhy.rfantennacalc
- Primary Language : English (U.S.)

### 2. Remplir les métadonnées
- Catégorie : Utilities
- Description : (voir section "Textes marketing" ci-dessous)
- Keywords : ham radio,antenna,dipole,amateur radio,POTA,SOTA,VNA,HF,calculator
- Screenshots : 3-5 images (1284 × 2778px)

### 3. Upload via Xcode
- Product → Archive
- Distribute App → App Store Connect → Upload

---

## 🔄 Mise à jour de l'app (V1.1, V1.2, V2.0, etc.)

### Étape 1 : Modifier le code
```bash
# Faites vos modifications dans le code React Native
cd RFAntennaCalc
# ... modifications ...
```

### Étape 2 : Incrémenter la version dans Xcode

```bash
cd ios
open RFAntennaCalc.xcworkspace
```

Dans Xcode :
- Sélectionnez le projet → Target "RFAntennaCalc"
- Onglet **General**
- **Version** : Incrémentez (1.0 → 1.1 ou 2.0)
- **Build** : S'incrémente automatiquement (ou changez manuellement)

**Règles de versioning :**
- **Bug fixes mineurs :** 1.0.1, 1.0.2
- **Nouvelles fonctionnalités :** 1.1, 1.2
- **Changements majeurs :** 2.0, 3.0

### Étape 3 : Créer l'Archive

Dans Xcode :
1. Sélectionnez **"Any iOS Device (arm64)"** (pas un simulateur)
2. **Product → Clean Build Folder** (Cmd + Shift + K)
3. **Product → Archive**
4. Attendez la fin de la compilation

### Étape 4 : Distribuer l'Archive

Dans la fenêtre **Organizer** qui s'ouvre :
1. Sélectionnez l'archive la plus récente
2. **Distribute App**
3. Choisissez **App Store Connect**
4. **Upload**
5. Suivez l'assistant (laissez les options par défaut)
6. **Upload** final

⚠️ **Warning dSYM Hermes :** Normal ! Continuez malgré le warning.

### Étape 5 : Soumettre dans App Store Connect

1. Allez sur [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → **RFAntennaCalc**
3. Cliquez **"+ Version or Platform"** → **iOS**
4. Entrez le numéro de version (ex: 1.1)
5. **What's New in This Version** : Décrivez les changements (voir exemples ci-dessous)
6. Sélectionnez le nouveau **Build** (celui que vous venez d'uploader)
7. **Save**
8. **Submit for Review**

### Étape 6 : Informations de chiffrement

Si demandé, répondez :
- **"Aucun des algorithmes mentionnés ci‑dessus"** (l'app fonctionne offline)

### Étape 7 : Attendre l'approbation

- **Délai :** 24-48h généralement
- **Email de confirmation :** Vous recevrez un email à chaque changement de statut
- **Statuts :** En attente → En cours de vérification → Approuvée/Rejetée

---

## 📸 Screenshots (si besoin de nouvelles captures)

### Dimensions requises
- **iPhone 15 Pro Max :** 1284 × 2778px (portrait)

### Comment les prendre
1. Xcode → Ouvrez le simulateur **iPhone 15 Pro Max**
2. Lancez l'app
3. Naviguez vers l'écran à capturer
4. **Cmd + S** pour sauvegarder
5. Les images sont sur le Bureau

### Screenshots recommandés (3 minimum)
1. Écran d'accueil avec les 2 boutons
2. Antenna Adjuster en action
3. Dipole Calculator avec résultats

---

## 📝 Textes marketing (pour référence)

### Description (App Store)
```
RFAntennaCalc - Essential antenna calculation tools for radio amateurs.

Designed by F4HYY for field operations, POTA activations, and antenna tuning.

TWO ESSENTIAL TOOLS:

🔧 ANTENNA ADJUSTER
Quickly adjust your dipole or end-fed antenna length based on actual resonance measurements from your VNA or antenna analyzer. Perfect for field adjustments during POTA activations or outdoor operations.

📏 DIPOLE CALCULATOR
Calculate the optimal dipole length for any HF frequency. Takes velocity factor into account for accurate results.

FEATURES:
• Velocity factor compensation for precise calculations
• Results in meters
• Simple, fast interface designed for field use
• No internet connection required
• Works with any VNA or antenna analyzer

Perfect for:
• POTA and SOTA activations
• Field Day operations
• Antenna building and tuning
• QRP operations
• Emergency communications

Developed by F4HYY, a radio amateur for radio amateurs.

73!
```

### Exemples de "What's New" pour mises à jour

**Version 1.1 - Imperial Units Support**
```
- Added imperial units support (feet/inches)
- Toggle between metric and imperial in settings
- Bug fixes and performance improvements
```

**Version 1.2 - UI Improvements**
```
- Improved user interface
- Better input validation
- Added velocity factor presets for common wire types
- Minor bug fixes
```

**Version 2.0 - Major Update**
```
- New antenna types support (Yagi, Quad, etc.)
- Save your favorite calculations
- Dark mode support
- Complete UI redesign
```

---

## 🐛 Problèmes courants et solutions

### Warning dSYM Hermes
**Problème :** `The archive did not include a dSYM for the hermesvm.framework`  
**Solution :** C'est juste un warning. Cliquez sur "Validate App" puis "Upload" quand même. Ça passe !

### Bundle ID déjà utilisé
**Problème :** Le Bundle ID est déjà pris  
**Solution :** Utilisez `com.sergederhy.rfantennacalc` (celui configuré)

### Simulateur non sélectionné
**Problème :** "Select a destination" ou erreur d'archive  
**Solution :** Sélectionnez **"Any iOS Device (arm64)"** avant d'archiver

### Build ne s'affiche pas dans App Store Connect
**Problème :** Le build n'apparaît pas après upload  
**Solution :** 
1. Attendez 15-30 minutes (traitement Apple)
2. Vérifiez l'onglet **TestFlight** → iOS Builds
3. Statut "Processing" → normal, attendez

### Pod install échoue
**Problème :** Erreurs lors de `pod install`  
**Solution :**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

---

## 🧪 TestFlight (tests avant publication)

Pour tester une version avant de la soumettre publiquement :

### 1. Uploader la build (comme d'habitude)
- Product → Archive → Upload

### 2. Dans App Store Connect
- TestFlight → iOS Builds
- Sélectionnez la build
- Ajoutez des testeurs (internes ou externes)

### 3. Inviter des testeurs
- TestFlight → Testers → "+" 
- Entrez les emails
- Ils recevront une invitation TestFlight

**Limite :** 100 testeurs internes, 10,000 testeurs externes

---

## 📊 Après publication

### Suivre les statistiques
- App Store Connect → Analytics
- Téléchargements, crashes, reviews

### Répondre aux reviews
- App Store Connect → Ratings and Reviews
- Répondez aux utilisateurs (bon pour le référencement)

### Mettre à jour régulièrement
- Apple favorise les apps mises à jour régulièrement
- Aim : au moins 1 update tous les 2-3 mois

---

## 🔗 Liens utiles

- **App Store Connect :** https://appstoreconnect.apple.com
- **Apple Developer :** https://developer.apple.com/account
- **TestFlight :** https://appstoreconnect.apple.com (onglet TestFlight)
- **App Store Guidelines :** https://developer.apple.com/app-store/review/guidelines/
- **React Native iOS :** https://reactnative.dev/docs/running-on-device

---

## 💡 Tips & Astuces

### Avant chaque soumission
- [ ] Testez l'app sur un vrai device
- [ ] Vérifiez qu'il n'y a pas de crashs
- [ ] Vérifiez les screenshots sont à jour
- [ ] Relisez la description
- [ ] Incrémentez la version correctement

### Pour accélérer l'approbation
- Répondez rapidement si Apple demande des infos
- Soumettez en semaine (pas le week-end)
- Évitez les périodes de fêtes (Noël, etc.)

### Communication
- Partagez sur QRZ.com (F4HYY)
- Forums POTA/SOTA
- Groupes Facebook radioamateurs
- Reddit r/amateurradio

---

## 📞 Support

**Développeur :** F4HYY  
**Email :** sderhy@gmail.com  
**GitHub :** https://github.com/sderhy/RFAntennaCalc

---

**73 et bonne chance !** 📡

*Dernière mise à jour : Novembre 2025*
