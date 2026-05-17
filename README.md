#  FitLife - Holisztikus Edzésnapló

A **FitLife** egy modern, Angular-alapú webalkalmazás, amely segít egyensúlyt teremteni a kemény súlyzós edzések és a léleknyugtató jóga között. Az alkalmazás célja, hogy a fizikai teljesítmény mellett a mentális állapotot is nyomon kövesse.

## Publikus URL: [https://fitlife-app-bfa9d.web.app](https://fitlife-app-bfa9d.web.app)

## Főbb funkciók 
- **Személyre szabott edzéstervek:** Saját tervek létrehozása, szerkesztése és törlése.
- **Holisztikus szemlélet:** Edzés utáni hangulat rögzítése (mood tracking).
- **Mobile-first design:** Teljesen reszponzív felület, amely edzőtermi környezetben, mobilról is kényelmesen használható.
- **Tiszta architektúra:** Komponens-alapú felépítés, újrahasználható UI elemekkel (Shared components).

## Technológiai stack
- **Frontend:** Angular 19+
- **Stílus:** Modern CSS (Flexbox, Grid, CSS Variables)
- **Adatkezelés:** RxJS alapú reaktív DataService
- **Dokumentáció:** AI-alapú fejlesztési napló (AI Prompt Log)

##  Mappaszerkezet
A projekt a tiszta kód elveit követi:
- `/src/app/pages`: Az alkalmazás fő nézetei (Dashboard, Plans stb.)
- `/src/app/components/shared`: Újrahasználható UI komponensek (Gombok, kártyák)
- `/src/app/models`: TypeScript interfészek az adatmodellhez
- `/src/app/services`: Üzleti logika és adatkezelés

##  Telepítés és Firebase Konfiguráció
1. **Klónozd a tárolót:** `git clone [repo-url]`
2. **Telepítsd a függőségeket:** `npm install --legacy-peer-deps`
3. **Környezeti változók beállítása:** Hozd létre az `src/environments/environment.ts` fájlt a Firebase konzolból kapott `firebaseConfig` adatokkal.
4. **Adatbázis inicializálás:** Az alkalmazás első futtatásakor automatikus migráció történik.
Az alkalmazás első futtatásakor a DataService ellenőrzi a Firestore adatbázist. Amennyiben az üres, automatikusan feltölti az alapértelmezett edzéstervekkel (migráció).

##   Build és Deploy (Publikálás)
A projekt élesítése (deploy) a következő folyamatot követi:
**Produkciós build generálása:**
ng build
**Fájlok előkészítése:**
Az Angular által generált fájlokat (melyek a dist/fitlife/browser/ mappában jönnek létre) másold át a gyökérkönyvtárban található public/ mappába.
**Feltöltés a Firebase-re:**
npx firebase deploy --only hosting

##  Tesztelés
Az alkalmazás minőségbiztosítását Unit és E2E tesztek segítik:
**Unit tesztek:** Az üzleti logika és a validációk ellenőrzésére.
ng test
**E2E tesztek:** A felhasználói folyamatok (pl. bejelentkezés) szimulálására (Cypress/Playwright fájlok a repóban találhatók).
