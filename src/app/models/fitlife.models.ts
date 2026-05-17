
export interface User {
  id: string;         
  username: string;
  email: string;
  passwordHash: string;
  favAudio: string;   
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: string[];        
  userId?: string;      
}

export type ExerciseType = 'weight' | 'yoga' | 'warmup';

export interface Exercise {
  id?: string;
  name: string;
  type: ExerciseType;
  description: string;
  fact?: string;
  userId?: string;    
}


export interface WorkoutSession {
  id: string;         
  userId: string;      
  planId?: string;     
  date: Date | number; 
  moodAfter: number;   
}
export interface PerformanceLog {
  id: string;        
  sessionId: string;  
  exerciseId: string;  
  weightKg?: number;   
  reps?: number;       
  holdTimeSec?: number;
}