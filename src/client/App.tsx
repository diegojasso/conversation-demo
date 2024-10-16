// File: src/client/App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Box, Typography, Input, Button, Sheet, IconButton, Avatar } from '@mui/joy';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { keyframes } from '@emotion/react';

interface Message {
  text: string;
  isUser: boolean;
  id: number;
}

const popIn = keyframes`
  0% {
    transform: scale(0.8) translateY(10px);
    opacity: 0;
  }
  70% {
    transform: scale(1.1) translateY(-5px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
`;

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

const STORAGE_KEY = 'carInsuranceChat';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = localStorage.getItem(STORAGE_KEY);
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [lastMessageId, setLastMessageId] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const startConversation = useCallback(async () => {
    if (messages.length === 0) {
      setIsTyping(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });
      const data = await response.json();
      setIsTyping(false);
      const newId = lastMessageId + 1;
      setLastMessageId(newId);
      setMessages([{ text: data.message, isUser: false, id: newId }]);
    }
  }, [messages, lastMessageId]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  const handleSend = async () => {
    if (input.trim()) {
      const newUserMessageId = lastMessageId + 1;
      const newMessages = [...messages, { text: input, isUser: true, id: newUserMessageId }];
      setLastMessageId(newUserMessageId);
      setMessages(newMessages);
      setInput('');
      setIsTyping(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      setIsTyping(false);
      const newBotMessageId = newUserMessageId + 1;
      setLastMessageId(newBotMessageId);
      setMessages([...newMessages, { text: data.message, isUser: false, id: newBotMessageId }]);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setLastMessageId(0);
    localStorage.removeItem(STORAGE_KEY);
    startConversation();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        setShowReset(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderMessage = (message: Message) => (
    <Box 
      key={message.id} 
      sx={{ 
        display: 'flex', 
        justifyContent: message.isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        mb: 2,
      }}
    >
      {!message.isUser && (
        <Avatar
          alt="Assistant"
          src="./src/assets/avatar.png"  // Replace with actual path to assistant's avatar
          sx={{ 
            mr: 1, 
            width: 32, 
            height: 32,
            animation: `${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
          }}
        />
      )}
      <Sheet 
        color={message.isUser ? 'primary' : 'neutral'}
        variant="soft"
        sx={{ 
          p: 2, 
          borderRadius: 'lg',
          maxWidth: 'calc(70% - 40px)',  // Adjusted to account for avatar width
          animation: `${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
          transformOrigin: message.isUser ? 'bottom right' : 'bottom left',
        }}
      >
        <Typography>
          {message.text}
        </Typography>
      </Sheet>
      {message.isUser && <Box sx={{ width: 32, height: 32, ml: 1 }} />}
    </Box>
  );

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
        <Typography level="h4" component="h1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          Friendly Car Insurance Quote Chatbot
          {showReset && (
            <IconButton 
              onClick={handleReset} 
              size="sm" 
              sx={{ ml: 2 }}
              title="Reset conversation"
            >
              <RefreshRoundedIcon />
            </IconButton>
          )}
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
          {messages.map(renderMessage)}
          {isTyping && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-end',
                mb: 2,
              }}
            >
              <Avatar
                alt="Assistant"
                src="./src/assets/avatar.png"  // Replace with actual path to assistant's avatar
                sx={{ 
                  mr: 1, 
                  width: 32, 
                  height: 32,
                  animation: `${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
                }}
              />
              <Sheet 
                color="neutral"
                variant="soft"
                sx={{ 
                  p: 2, 
                  borderRadius: 'lg',
                  animation: `${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
                  transformOrigin: 'bottom left',
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