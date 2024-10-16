// File: src/server.ts
import express from 'express';
import path from 'path';
import { ConversationEngine } from './conversation-engine';
import { QuoteGenerator } from './quote-generator';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

const conversationEngine = new ConversationEngine();
const quoteGenerator = new QuoteGenerator();

// In src/server.ts, update the /api/chat endpoint

app.post('/api/chat', async (req, res) => {
  const userInput = req.body.message;
  const response = await conversationEngine.processUserInput(userInput);

  if (conversationEngine.isConversationComplete()) {
    const userInfo = conversationEngine.getUserInfo();
    const quote = quoteGenerator.generateQuote(userInfo);
    res.json({
      message: `Alright, ${userInfo.name}, I've got your quote ready! 🎉 
      Based on the information you provided about your ${userInfo.carYear} ${userInfo.carMake} ${userInfo.carModel}, 
      your age of ${userInfo.age}, and your ${userInfo.drivingExperience} years of driving experience, here's what I've calculated:

      🚗 Monthly premium: $${quote.monthlyPremium}
      💰 Annual premium: $${quote.annualPremium}
      🛡️ Coverage level: ${quote.coverageLevel}

      Here's a quick breakdown of how we arrived at this quote:
      - Your age and driving experience played a role in determining your risk factor.
      - The age of your car was taken into account.
      - We considered whether your car make is classified as a luxury brand.

      Remember, this is just an estimate. Many other factors can affect your actual premium, such as your driving record, 
      location, and specific coverage options you choose.

      Would you like to know more about the ${quote.coverageLevel} coverage, or do you have any questions about your quote?`,
      isComplete: true
    });
  } else {
    res.json({ message: response, isComplete: false });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});