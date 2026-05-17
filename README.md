#  FitLife - Holisztikus Edzésnapló

A **FitLife** egy modern, Angular-alapú webalkalmazás, amely segít egyensúlyt teremteni a kemény súlyzós edzések és a léleknyugtató jóga között. Az alkalmazás célja, hogy a fizikai teljesítmény mellett a mentális állapotot is nyomon kövesse.

## Publikus URL: [https://fitlife-app-bfa9d.web.app](https://fitlife-app-bfa9d.web.app)

## Főbb funkciók 
- **Személyre szabott edzéstervek:** Saját tervek létrehozása, szerkesztése és törlése.
- **Mobile-first design:** Teljesen reszponzív felület, amely edzőtermi környezetben, mobilról is kényelmesen használható.
- **Tiszta architektúra:** Komponens-alapú felépítés, újrahasználható UI elemekkel (Shared components).

## Technológiai stack
- **Frontend:** Angular 19+
- **Stílus:** Modern CSS (Flexbox, Grid, CSS Variables)
- **Adatkezelés:** RxJS alapú reaktív DataService
- **Dokumentáció:** AI-alapú fejlesztési napló (AI Prompt Log)

## Mappaszerkezet

- `src/app/`: Itt találhatók a főbb nézetek és oldalak 
- `src/app/core/`: Az alkalmazás magvát képező rendszerszintű logika, mint az autentikációs védelmek (`guards/`) és a hálózati kéréseket kezelő `auth.interceptor.ts`.
- `src/app/shared/`: Újrahasználható elemek és közös logika:
  - `components/`: Közös UI elemek (pl. `navbar/`).
  - `models/`: TypeScript interfészek és adatmodellek.
  - `services/`: Az üzleti logikát és adatkezelést végző szolgáltatások.

##  Telepítés és Firebase Konfiguráció
1. **Klónozd a tárolót:** `git clone [repo-url]`
2. **Telepítsd a függőségeket:** `npm install --legacy-peer-deps`


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

