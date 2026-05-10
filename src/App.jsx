import { useState, useCallback } from 'react';
import UploadScreen from './components/UploadScreen';
import SelectScreen from './components/SelectScreen';
import ChatView     from './components/ChatView';
import { parseWhatsAppChat, getSenders, detectDateFormat } from './utils/parser';

export default function App() {
  const [step,      setStep]      = useState('upload');   // 'upload' | 'select' | 'view'
  const [messages,  setMessages]  = useState([]);
  const [senders,   setSenders]   = useState([]);
  const [myName,    setMyName]    = useState('');
  const [chatTitle, setChatTitle] = useState('Chat');
  const [dateFmt,   setDateFmt]   = useState('DD/MM');

  const handleFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseWhatsAppChat(e.target.result);
      setMessages(parsed);
      setSenders(getSenders(parsed));
      setDateFmt(detectDateFormat(parsed));
      setChatTitle(
        file.name
          .replace(/^WhatsApp Chat with /i, '')
          .replace(/\.(txt|zip)$/i, '')
          .trim() || 'WhatsApp Chat'
      );
      setStep('select');
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  const handleSelect = useCallback((name) => {
    setMyName(name);
    setStep('view');
  }, []);

  if (step === 'upload') return (
    <UploadScreen onFile={handleFile} />
  );

  if (step === 'select') return (
    <SelectScreen
      messages={messages}
      senders={senders}
      onSelect={handleSelect}
      onBack={() => setStep('upload')}
    />
  );

  return (
    <ChatView
      messages={messages}
      senders={senders}
      myName={myName}
      chatTitle={chatTitle}
      dateFmt={dateFmt}
      onBack={() => setStep('select')}
      onNewChat={() => setStep('upload')}
    />
  );
}
