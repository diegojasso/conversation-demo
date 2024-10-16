// File: src/__tests__/quote-generator.test.ts
import { QuoteGenerator } from '../quote-generator';
import { UserInfo } from '../types';

describe('QuoteGenerator', () => {
  const quoteGenerator = new QuoteGenerator();

  it('generates a quote for a low-risk user', () => {
    const userInfo: UserInfo = {
      name: 'John Doe',
      age: 35,
      carMake: 'Toyota',
      carModel: 'Camry',
      carYear: 2020,
      drivingExperience: 15
    };

    const quote = quoteGenerator.generateQuote(userInfo);
    expect(quote.monthlyPremium).toBeLessThan(75);
    expect(quote.coverageLevel).toBe('Basic');
  });

  it('generates a quote for a high-risk user', () => {
    const userInfo: UserInfo = {
      name: 'Jane Doe',
      age: 20,
      carMake: 'Ferrari',
      carModel: '488',
      carYear: 2023,
      drivingExperience: 2
    };

    const quote = quoteGenerator.generateQuote(userInfo);
    expect(quote.monthlyPremium).toBeGreaterThan(150);
    expect(quote.coverageLevel).toBe('Premium');
  });
});