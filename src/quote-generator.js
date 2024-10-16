"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteGenerator = void 0;
class QuoteGenerator {
    generateQuote(userInfo) {
        // This is a very simplified quote calculation
        let baseRate = 50;
        let riskFactor = 1;
        // Adjust for age
        if (userInfo.age < 25)
            riskFactor *= 1.5;
        else if (userInfo.age > 65)
            riskFactor *= 1.3;
        // Adjust for driving experience
        riskFactor *= Math.max(0.5, 1 - userInfo.drivingExperience * 0.02);
        // Adjust for car age
        const carAge = new Date().getFullYear() - userInfo.carYear;
        if (carAge > 10)
            riskFactor *= 1.2;
        const monthlyPremium = baseRate * riskFactor;
        let coverageLevel = "Standard";
        if (monthlyPremium < 75)
            coverageLevel = "Basic";
        if (monthlyPremium > 150)
            coverageLevel = "Premium";
        return {
            monthlyPremium: Number(monthlyPremium.toFixed(2)),
            coverageLevel
        };
    }
}
exports.QuoteGenerator = QuoteGenerator;
