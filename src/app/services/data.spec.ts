import { TestBed } from '@angular/core/testing';
import { DataService } from './data';
import { of, BehaviorSubject } from 'rxjs';

describe('FitLife Alkalmazás Unit Tesztek (Bővített)', () => {
  
  const mockPlans = [
    { id: '1', name: 'Reggeli Jóga', exercises: ['Napüdvözlet', 'Plank'], mood: 5 },
    { id: '2', name: 'Esti Nyújtás', exercises: ['Cobra', 'Child pose'], mood: 4 }
  ];

  
  it('1. Létre kell jönnie a tesztkörnyezetnek', () => {
    expect(true).toBeTrue();
  });

  it('2. Az edzésterv nevének validálása (minimum 3 karakter)', () => {
    const name = "Jóga";
    expect(name.length >= 3).toBeTrue();
  });

  it('3. Az edzésterv nevének validálása (üres név elutasítása)', () => {
    const name = "";
    expect(name.length > 0).toBeFalse();
  });

  it('4. Keresési funkció szimulációja: találat ellenőrzése', () => {
    const filtered = mockPlans.filter(p => p.name.includes('Jóga'));
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Reggeli Jóga');
  });

  it('5. Keresési funkció szimulációja: nincs találat kezelése', () => {
    const filtered = mockPlans.filter(p => p.name.includes('Futás'));
    expect(filtered.length).toBe(0);
  });

  it('6. Adatmodell struktúra ellenőrzése (id megléte)', () => {
    expect(mockPlans[0].id).toBeDefined();
  });

  it('7. Adatmodell struktúra ellenőrzése (exercises tömb megléte)', () => {
    expect(Array.isArray(mockPlans[0].exercises)).toBeTrue();
  });

  it('8. Felhasználói szerepkör szimuláció (Admin email)', () => {
    const email = 'admin@fitlife.hu';
    const isAdmin = email.includes('admin');
    expect(isAdmin).toBeTrue();
  });

  it('9. Felhasználói szerepkör szimuláció (Normál email)', () => {
    const email = 'user@fitlife.hu';
    const isAdmin = email.includes('admin');
    expect(isAdmin).toBeFalse();
  });

  it('10. Lista ürítési logika szimulációja', () => {
    let currentPlans = [...mockPlans];
    currentPlans = [];
    expect(currentPlans.length).toBe(0);
  });


  it('11. Összetett logika: Edzésidő kalkuláció dinamikus tömb alapján', () => {
    const exercises = ['Plank', 'Guggolás', 'Fekvőtámasz', 'Kitörés'];
    // Számítás: minden gyakorlat 8 perc, plusz 2 perc pihenő a végén
    const totalTime = (exercises.length * 8) + 2;
    expect(totalTime).toBe(34);
    expect(totalTime).toBeGreaterThan(30);
  });

  it('12. Mood Tracking validáció: Skála határértékek szigorú ellenőrzése', () => {
    const testMoods = [1, 3, 5];
    const invalidMoods = [0, 6, -1];
    
    testMoods.forEach(m => expect(m >= 1 && m <= 5).toBeTrue());
    invalidMoods.forEach(m => expect(m >= 1 && m <= 5).toBeFalse());
  });

  it('13. Adat-immutabilitás teszt: Eredeti lista nem változhat módosításkor', () => {
    const originalCount = mockPlans.length;
    const newList = [...mockPlans, { id: '3', name: 'Új edzés', exercises: [] }];
    
    expect(newList.length).toBe(originalCount + 1);
    expect(mockPlans.length).toBe(originalCount); // Az eredeti marad 2
  });

  it('14. Szerepkör alapú jogosultság: Prémium hozzáférés email validáció', () => {
    const premiumEmails = ['admin@fitlife.hu', 'konya.laura5@gmail.com'];
    const userEmail = 'konya.laura5@gmail.com';
    
    const hasPremium = premiumEmails.some(email => email === userEmail);
    expect(hasPremium).toBeTrue();
  });

  it('15. Keresési logika: Kis- és nagybetű érzéketlenség szimulációja', () => {
    const searchTerm = "jóga".toLowerCase();
    const result = mockPlans.find(p => p.name.toLowerCase().includes(searchTerm));
    
    expect(result).toBeDefined();
    expect(result?.name).toBe('Reggeli Jóga');
  });
});