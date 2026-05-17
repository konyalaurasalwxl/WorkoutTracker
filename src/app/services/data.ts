import { Injectable, inject } from '@angular/core';
import { WorkoutPlan, Exercise } from '../models/fitlife.models';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc,query,where} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private plans: WorkoutPlan[] = [
    { id: '1', userId: 'u1', name: 'Reggeli Jóga', exercises: ['Könnyed nyújtás ébredés után.'] },
    { id: '2', userId: 'u1', name: 'Erőnléti edzés', exercises: ['Súlyzós edzés haladóknak.'] }
  ];

  private exercises: Exercise[] = [
    { id: 'e1', name: 'Fekvőtámasz', type: 'weight', description: 'Mellizom erősítés.' },
    { id: 'e2', name: 'Lefelé néző kutya', type: 'yoga', description: 'Vádli és hát nyújtás.' }
  ];

  plans$ = new BehaviorSubject<WorkoutPlan[]>(this.plans);
  exercises$ = new BehaviorSubject<Exercise[]>(this.exercises);
  private dataSubs: Subscription[] = [];
  
  constructor() {
    this.authService.user$.subscribe((user: any) => { // Típus hozzáadva!
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.exercises$.next([]);
        this.plans$.next([]);
      }
    });
  }
  private loadUserData(uid: string) {
    const exRef = collection(this.firestore, 'exercises');
    const exQuery = query(exRef, where('userId', '==', uid));
    
    const exSub = collectionData(exQuery, { idField: 'id' }).subscribe(data => {
      this.exercises = data as Exercise[];
      this.exercises$.next([...this.exercises]);
    });
    this.dataSubs.push(exSub);

    const planRef = collection(this.firestore, 'plans');
    const planQuery = query(planRef, where('userId', '==', uid));

    const planSub = collectionData(planQuery, { idField: 'id' }).subscribe(data => {
      this.plans = data as WorkoutPlan[];
      this.plans$.next([...this.plans]);
    });
    this.dataSubs.push(planSub);
  }

  async addExercise(ex: Exercise) {
     this.authService.user$.subscribe(async (user: any) => { // Típus hozzáadva!
       if (user) {
         const { id, ...data } = ex;
         await addDoc(collection(this.firestore, 'exercises'), {
           ...data,
           userId: user.uid
         });
       }
     }).unsubscribe();
  }

  async addPlan(plan: WorkoutPlan) {
    this.authService.user$.subscribe(async user => {
      if (user) {
        try {
          const { id, ...data } = plan;
          await addDoc(collection(this.firestore, 'plans'), {
            ...data,
            userId: user.uid
          });
        } catch (e) { console.error(e); }
      }
    }).unsubscribe();
  }

  async updateExercise(updatedEx: Exercise) {
    const index = this.exercises.findIndex(e => e.id === updatedEx.id);
    if (index !== -1) {
      this.exercises[index] = { ...updatedEx };
      this.exercises$.next([...this.exercises]);
    }

    try {
      const { id, ...data } = updatedEx;
      if (id) await updateDoc(doc(this.firestore, `exercises/${id}`), data);
    } catch (e) { console.error("Firebase hiba", e); }
  }

  async deleteExercise(id: string) {
    this.exercises = this.exercises.filter(e => e.id !== id);
    this.exercises$.next([...this.exercises]);

    try {
      await deleteDoc(doc(this.firestore, `exercises/${id}`));
    } catch (e) { console.error("Firebase hiba", e); }
  }

  async deletePlan(id: string) {
    this.plans = this.plans.filter(p => p.id !== id);
    this.plans$.next([...this.plans]);
    try { await deleteDoc(doc(this.firestore, `plans/${id}`)); } catch (e) {}
  }
  async updatePlan(plan: WorkoutPlan): Promise<void> {
    const index = this.plans.findIndex(p => p.id === plan.id);
    if (index !== -1) {
      this.plans = [
        ...this.plans.slice(0, index),
        plan,
        ...this.plans.slice(index + 1)
      ];
      this.plans$.next(this.plans);
    }
  }
}