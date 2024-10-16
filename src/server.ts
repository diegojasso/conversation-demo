// File: src/server.ts
import express from 'express';
import path from 'path';
import { ConversationEngine } from './conversation-engine';
import { QuoteGenerator } from './quote-generator';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const conversationEngine = new ConversationEngine();
const quoteGenerator = new QuoteGenerator();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  } else {
    res.json({ message: response, isComplete: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});