"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// File: src/server.ts
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const conversation_engine_1 = require("./conversation-engine");
const quote_generator_1 = require("./quote-generator");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const conversationEngine = new conversation_engine_1.ConversationEngine();
const quoteGenerator = new quote_generator_1.QuoteGenerator();
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
app.post('/chat', (req, res) => {
    const userInput = req.body.message;
    const response = conversationEngine.processUserInput(userInput);
    if (conversationEngine.isConversationComplete()) {
        const userInfo = conversationEngine.getUserInfo();
        const quote = quoteGenerator.generateQuote(userInfo);
        res.json({
            message: `Based on the information provided, your estimated monthly premium is $${quote.monthlyPremium} for ${quote.coverageLevel} coverage.`,
            isComplete: true
        });
    }
    else {
        res.json({ message: response, isComplete: false });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
