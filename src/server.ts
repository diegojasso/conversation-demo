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

app.post('/chat', async (req, res) => {
  const userInput = req.body.message;
  const response = await conversationEngine.processUserInput(userInput);

  if (conversationEngine.isConversationComplete()) {
    const userInfo = conversationEngine.getUserInfo();
    const quote = quoteGenerator.generateQuote(userInfo);
    res.json({
      message: `Alright, I've got your quote ready, ${userInfo.name}! 🎉 Based on the information you provided, your estimated monthly premium is $${quote.monthlyPremium} for ${quote.coverageLevel} coverage. This takes into account your age, driving experience, and the details of your ${userInfo.carYear} ${userInfo.carMake} ${userInfo.carModel}. How does that sound? If you have any questions about the quote or would like to explore other options, just let me know!`,
      isComplete: true
    });
  } else {
    res.json({ message: response, isComplete: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});