
export type AppStep = 'ONBOARDING' | 'SCAN' | 'SKINCARE_QUESTIONS' | 'JAWLINE_QUESTIONS' | 'ANALYZING' | 'RESULTS' | 'PRODUCT_SUGGESTIONS';

export interface ScanResult {
  imageData: string;
}

export interface SkincareAnswers {
  afterWashFeel: string;
  breakoutFreq: string;
  sensitivity: string;
  darkSpots: string;
  washCount: string;
  sunscreen: string;
  budget: string;
}

export interface JawlineAnswers {
  symmetryPerception: string;
  chewSide: string;
  jawlineType: string;
  posture: string;
  sleepPosition: string;
}

export interface AnalysisData {
  skincare: {
    skinType: string;
    amRoutine: string[];
    pmRoutine: string[];
    categories: string[];
    avoid: string[];
    summary: string;
  };
  jawline: {
    faceShape: string;
    assessment: string;
    asymmetryNote: string;
    exercises: { name: string; reps: string; instructions: string }[];
    habits: string[];
  };
}
