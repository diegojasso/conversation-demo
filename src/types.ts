// File: src/types.ts
export interface UserInfo {
    name: string;
    age: number;
    carMake: string;
    carModel: string;
    carYear: number;
    drivingExperience: number;
  }
  
  export interface QuoteResult {
    monthlyPremium: number;
    annualPremium: number;
    coverageLevel: string;
  }