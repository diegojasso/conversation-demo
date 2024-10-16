// File: src/conversation-engine.ts
import { UserInfo } from './types';

export class ConversationEngine {
  private currentStep: number = 0;
  private userInfo: Partial<UserInfo> = {};

  private steps = [
    { prompt: "Hi there! 👋 I'm here to help you get a great car insurance quote. To get started, could you tell me your name?", key: "name" },
    { prompt: "It's great to meet you, {name}! 😊 If you don't mind me asking, how old are you?", key: "age" },
    { prompt: "Thanks for sharing that, {name}. Now, let's talk about your car. What make is it?", key: "carMake" },
    { prompt: "A {carMake}, nice choice! 🚗 And what model is it?", key: "carModel" },
    { prompt: "Ah, a {carMake} {carModel}! Those are great cars. What year is it?", key: "carYear" },
    { prompt: "Got it! Last question, {name}: how many years of driving experience do you have?", key: "drivingExperience" }
  ];

  public async getCurrentPrompt(): Promise<string> {
    await this.simulateTyping();
    return this.replaceVariables(this.steps[this.currentStep].prompt);
  }

  public async processUserInput(input: string): Promise<string> {
    await this.simulateTyping();
    const currentStep = this.steps[this.currentStep];
    const key = currentStep.key as keyof UserInfo;

    if (this.validateInput(key, input)) {
      this.userInfo[key] = this.parseInput(key, input);
      this.currentStep++;

      if (this.isConversationComplete()) {
        return this.replaceVariables("Great! Thanks so much for all that information, {name}. I've got everything I need to generate a quote for you. Just give me a moment while I crunch the numbers... 🧮");
      } else {
        return this.replaceVariables(this.steps[this.currentStep].prompt);
      }
    } else {
      return this.replaceVariables("I'm sorry, but I didn't quite catch that. Could you please try again? " + this.steps[this.currentStep].prompt);
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

  private replaceVariables(text: string): string {
    return text.replace(/{(\w+)}/g, (match, key) => {
      return this.userInfo[key as keyof UserInfo]?.toString() || match;
    });
  }

  private async simulateTyping(): Promise<void> {
    const typingSpeed = Math.floor(Math.random() * (100 - 50 + 1) + 50); // Random speed between 50-100 ms per character
    const messageLength = this.steps[this.currentStep].prompt.length;
    const typingTime = typingSpeed * messageLength;
    
    return new Promise(resolve => setTimeout(resolve, typingTime));
  }
}