import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  
  
  user$ = user(this.auth);

  async register(email: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async logout() {
    return signOut(this.auth);
  }
}