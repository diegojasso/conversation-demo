// File: src/conversation-engine.ts
import { UserInfo } from './types';

export class ConversationEngine {
  private currentStep: number = 0;
  private userInfo: Partial<UserInfo> = {};

  private steps = [
    { prompt: "What's your name?", key: "name" },
    { prompt: "How old are you?", key: "age" },
    { prompt: "What's the make of your car?", key: "carMake" },
    { prompt: "What's the model of your car?", key: "carModel" },
    { prompt: "What year is your car?", key: "carYear" },
    { prompt: "How many years of driving experience do you have?", key: "drivingExperience" }
  ];

  public getCurrentPrompt(): string {
    return this.steps[this.currentStep].prompt;
  }

  public processUserInput(input: string): string {
    const currentStep = this.steps[this.currentStep];
    const key = currentStep.key as keyof UserInfo;

    if (this.validateInput(key, input)) {
      this.userInfo[key] = this.parseInput(key, input);
      this.currentStep++;

      if (this.isConversationComplete()) {
        return "Great! We have all the information we need. Generating your quote...";
      } else {
        return this.getCurrentPrompt();
      }
    } else {
      return "Invalid input. Please try again. " + this.getCurrentPrompt();
    }
  }

  private validateInput(key: keyof UserInfo, input: string): boolean {
    switch (key) {
      case 'name':
        return input.trim().length > 0;
      case 'age':
      case 'carYear':
      case 'drivingExperience':
        return !isNaN(Number(input)) && Number(input) > 0;
      case 'carMake':
      case 'carModel':
        return input.trim().length > 0;
      default:
        return false;
    }
  }

  private parseInput(key: keyof UserInfo, input: string): any {
    switch (key) {
      case 'age':
      case 'carYear':
      case 'drivingExperience':
        return Number(input);
      default:
        return input.trim();
    }
  }

  public isConversationComplete(): boolean {
    return this.currentStep >= this.steps.length;
  }

  public getUserInfo(): UserInfo {
    return this.userInfo as UserInfo;
  }
}