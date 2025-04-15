// src/pages/Chatbot.jsx
import { useState } from 'react';
import { askAI } from "./askAI";


function Chatbot({ reportText, final_result }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I can explain your lung health report. Ask me anything.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: input },
      { sender: 'bot', text: '...' }
    ]);

    const response = await askAI(input, reportText, final_result);

    setMessages(prev => [
      ...prev.slice(0, -1),
      { sender: 'bot', text: response }
    ]);

    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask about your report..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Chatbot;
