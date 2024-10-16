"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationEngine = void 0;
class ConversationEngine {
    constructor() {
        this.currentStep = 0;
        this.userInfo = {};
        this.steps = [
            { prompt: "What's your name?", key: "name" },
            { prompt: "How old are you?", key: "age" },
            { prompt: "What's the make of your car?", key: "carMake" },
            { prompt: "What's the model of your car?", key: "carModel" },
            { prompt: "What year is your car?", key: "carYear" },
            { prompt: "How many years of driving experience do you have?", key: "drivingExperience" }
        ];
    }
    getCurrentPrompt() {
        return this.steps[this.currentStep].prompt;
    }
    processUserInput(input) {
        const currentStep = this.steps[this.currentStep];
        const key = currentStep.key;
        if (this.validateInput(key, input)) {
            this.userInfo[key] = this.parseInput(key, input);
            this.currentStep++;
            if (this.isConversationComplete()) {
                return "Great! We have all the information we need. Generating your quote...";
            }
            else {
                return this.getCurrentPrompt();
            }
        }
        else {
            return "Invalid input. Please try again. " + this.getCurrentPrompt();
        }
    }
    validateInput(key, input) {
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
    parseInput(key, input) {
        switch (key) {
            case 'age':
            case 'carYear':
            case 'drivingExperience':
                return Number(input);
            default:
                return input.trim();
        }
    }
    isConversationComplete() {
        return this.currentStep >= this.steps.length;
    }
    getUserInfo() {
        return this.userInfo;
    }
}
exports.ConversationEngine = ConversationEngine;
