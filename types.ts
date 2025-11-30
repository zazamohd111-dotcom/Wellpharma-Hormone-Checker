export interface Symptom {
  id: string;
  label: string;
  category: 'physical' | 'emotional' | 'energy';
}

export interface UserSymptom extends Symptom {
  severity: number; // 1-10
  duration: string;
}

export interface UserContext {
  age: string;
  periodStatus: string;
  hormoneTestHistory: string;
  currentTherapy: string;
}

export interface UserInfo {
  name: string;
  email: string;
  // Newsletter removed as requested
}

export interface AssessmentState {
  step: number;
  selectedSymptoms: string[]; // IDs only
  symptomDetails: Record<string, { severity: number; duration: string }>;
  context: UserContext;
  userInfo: UserInfo;
  result: string | null;
  isLoading: boolean;
  error: string | null;
}

export enum Step {
  WELCOME = 0,
  SYMPTOM_SELECTION = 1,
  SYMPTOM_DETAILS = 2,
  CONTEXT = 3,
  EMAIL = 4,
  RESULTS = 5,
}