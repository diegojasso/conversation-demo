// File: src/client/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Box, Typography, Input, Button, Sheet } from '@mui/joy';

interface Message {
  text: string;
  isUser: boolean;
}

const theme = extendTheme({
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const startConversation = async () => {
      setIsTyping(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });
      const data = await response.json();
      setIsTyping(false);
      setMessages([{ text: data.message, isUser: false }]);
    };
    startConversation();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      setIsTyping(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setIsTyping(false);
      setMessages(prev => [...prev, { text: data.message, isUser: false }]);
    }
  };

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: 2 
      }}>
        <Typography level="h4" component="h1" sx={{ mb: 2 }}>
          Friendly Car Insurance Quote Chatbot
        </Typography>
        <Sheet 
          variant="outlined" 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            mb: 2, 
            p: 2,
            borderRadius: 'md',
          }}
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Sheet 
                color={message.isUser ? 'primary' : 'neutral'}
                variant={message.isUser ? 'solid' : 'soft'}
                sx={{ 
                  p: 2, 
                  borderRadius: 'lg',
                  maxWidth: '70%',
                }}
              >
                <Typography>{message.text}</Typography>
              </Sheet>
            </Box>
          ))}
          {isTyping && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Sheet 
                color="neutral"
                variant="soft"
                sx={{ 
                  p: 2, 
                  borderRadius: 'lg',
                }}
              >
                <Typography>Typing...</Typography>
              </Sheet>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Sheet>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Input 
            fullWidth 
            placeholder="Type your message..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default App;