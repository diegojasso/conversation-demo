// File: src/quote-generator.ts
import { UserInfo, QuoteResult } from './types';

export class QuoteGenerator {
  public generateQuote(userInfo: UserInfo): QuoteResult {
    let baseRate = 500; // Annual base rate
    let riskFactor = 1;

    // Adjust for age
    if (userInfo.age < 25) riskFactor *= 1.3;
    else if (userInfo.age > 65) riskFactor *= 1.2;
    else riskFactor *= 0.9;

    // Adjust for driving experience
    const experienceFactor = Math.max(0.7, 1 - (userInfo.drivingExperience * 0.02));
    riskFactor *= experienceFactor;

    // Adjust for car age
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - userInfo.carYear;
    if (carAge > 10) riskFactor *= 1.1;
    else if (carAge < 3) riskFactor *= 1.2;

    // Adjust for car make (simplified)
    const luxuryBrands = ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Tesla'];
    if (luxuryBrands.includes(userInfo.carMake)) {
      riskFactor *= 1.2;
    }

    const annualPremium = baseRate * riskFactor;
    const monthlyPremium = annualPremium / 12;

    let coverageLevel = "Standard";
    if (monthlyPremium < 50) coverageLevel = "Basic";
    if (monthlyPremium > 100) coverageLevel = "Premium";

    return {
      monthlyPremium: Number(monthlyPremium.toFixed(2)),
      annualPremium: Number(annualPremium.toFixed(2)),
      coverageLevel
    };
  }
}