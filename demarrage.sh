# pwd
cd /Users/sergederhy/Desktop/RFAntennaCalc
# metro :

cd /Users/sergederhy/dev/RFAntennaCalc && npx react-native start --reset-cache
# dans un autre terminal 
cd /Users/sergederhy/dev/RFAntennaCalc  && npx react-native run-ios 

# Nettoyer le dossier build:
cd ios
rm -rf build
pod install
cd ..
# Nettoie le cache Xcode 
rm -rf ~/Library/Developer/Xcode/DerivedData/* 

# Relancer:
npx react-native start --reset-cache
# Dans un autre terminal :
npx react-native run-ios

# Un autre process tourne sur 8081 ? 
lsof -i:8081 # ou lsof -ti:8081|xargs kill -9 


# Demarrage d'Xcode:
open ios/RFAntennaCalc.xcworkspace
# ATTENTION JAMAIS Si tu ouvres le .xcodeproj directement, Xcode ne verra pas les pods et tu auras des erreurs de compilation (bibliothèques manquantes).

