// File: src/conversation-engine.ts
import { UserInfo } from './types';

export class ConversationEngine {
  private userInfo: Partial<UserInfo> = {};
  private currentStep: string = 'greeting';

  private conversationFlow: { [key: string]: (input: string) => string } = {
    greeting: () => "Hi there! 👋 I'm your friendly neighborhood insurance chat assistant. Instead of bombarding you with a long list of questions, let's have a quick chat about you and your car. What's your first name?",

    name: (input: string) => {
      this.userInfo.name = input.trim();
      return `Great to meet you, ${this.userInfo.name}! 😊 Now, let's talk about your car. Can you tell me the make, model, and year? For example, "2018 Honda Civic".`;
    },

    carInfo: (input: string) => {
      const carInfo = this.extractCarInfo(input);
      if (carInfo) {
        this.userInfo = { ...this.userInfo, ...carInfo };
        return `Ah, a ${this.userInfo.carYear} ${this.userInfo.carMake} ${this.userInfo.carModel}. Excellent choice! 🚗 Now, ${this.userInfo.name}, if you don't mind me asking, how old are you?`;
      } else {
        return "I didn't quite catch that. Could you please provide the year, make, and model of your car? For example, '2018 Honda Civic'.";
      }
    },

    age: (input: string) => {
      const age = parseInt(input);
      if (!isNaN(age) && age > 0) {
        this.userInfo.age = age;
        return `${age}, got it! You're in your prime! 🌟 Last question: How many years have you been driving? If you're a new driver, just say '0'.`;
      } else {
        return "I'm sorry, I didn't catch that. Could you please provide your age as a number?";
      }
    },

    experience: (input: string) => {
      const experience = parseInt(input);
      if (!isNaN(experience) && experience >= 0) {
        this.userInfo.drivingExperience = experience;
        return `${experience} years of driving experience, fantastic! 🚦 Thanks for chatting with me, ${this.userInfo.name}. I've got all the info I need to get you a quote. Ready to see it?`;
      } else {
        return "I didn't quite get that. Can you please enter the number of years you've been driving? If you're a new driver, enter '0'.";
      }
    },

    complete: () => "Great! I'm crunching the numbers now. Your personalized quote will be ready in a jiffy! 🧮✨"
  };

  public async processUserInput(input: string): Promise<string> {
    await this.simulateTyping();
    
    const response = this.conversationFlow[this.currentStep](input);
    this.moveToNextStep();
    
    return response;
  }

  private moveToNextStep() {
    const flowOrder = ['greeting', 'name', 'carInfo', 'age', 'experience', 'complete'];
    const currentIndex = flowOrder.indexOf(this.currentStep);
    this.currentStep = flowOrder[currentIndex + 1] || 'complete';
  }

  private extractCarInfo(input: string): Partial<UserInfo> | null {
    const carRegex = /(\d{4})\s+(\w+)\s+(\w+)/;
    const match = input.match(carRegex);
    if (match) {
      return {
        carYear: parseInt(match[1]),
        carMake: match[2],
        carModel: match[3]
      };
    }
    return null;
  }

  private async simulateTyping(): Promise<void> {
    const typingSpeed = Math.floor(Math.random() * (100 - 50 + 1) + 10);
    const messageLength = 100; // Assume an average message length
    const typingTime = typingSpeed * messageLength;
    
    return new Promise(resolve => setTimeout(resolve, typingTime));
  }

  public isConversationComplete(): boolean {
    return this.currentStep === 'complete';
  }

  public getUserInfo(): UserInfo {
    return this.userInfo as UserInfo;
  }
}