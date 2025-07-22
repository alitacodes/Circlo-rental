import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

interface ChatWidgetProps {
  currentUser: string;
  otherUser: string;
  otherUserAvatar?: string;
  onBack?: () => void;
}

const MOCK_INITIAL_MESSAGES: Message[] = [
  { sender: "owner", text: "Hi! When would you like to pick up the item?", timestamp: Date.now() - 1000 * 60 * 60 },
  { sender: "renter", text: "Hello! Is it available this weekend?", timestamp: Date.now() - 1000 * 60 * 50 },
];

const MOCK_REPLIES = [
  "Yes, it's available!",
  "Sure, let me know your preferred time.",
  "I can deliver it if you want.",
  "Please return it on time.",
  "Thank you for choosing Circlo!"
];

const ChatWidget: React.FC<ChatWidgetProps> = ({ currentUser, otherUser, otherUserAvatar, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [replyIndex, setReplyIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: currentUser, text: input, timestamp: Date.now() },
    ]);
    setInput("");
    // Mock typing indicator and auto-reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: otherUser,
          text: MOCK_REPLIES[replyIndex % MOCK_REPLIES.length],
          timestamp: Date.now(),
        },
      ]);
      setReplyIndex(i => i + 1);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto border rounded-lg bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b bg-gray-50 sticky top-0 z-10">
        {onBack && (
          <button onClick={onBack} className="md:hidden p-2 mr-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {otherUserAvatar && (
          <img src={otherUserAvatar} alt={otherUser} className="w-9 h-9 rounded-full object-cover mr-3" />
        )}
        <span className="font-semibold text-gray-800 text-base">{otherUser}</span>
      </div>
      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-2 ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md text-sm shadow
                ${msg.sender === currentUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-200 text-gray-900 rounded-bl-md'}`}
            >
              {msg.text}
              <div className="text-xs text-gray-400 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex mb-2 justify-start">
            <div className="px-4 py-2 rounded-2xl max-w-xs md:max-w-md text-sm bg-gray-200 text-gray-900 rounded-bl-md shadow flex items-center gap-2">
              <span className="animate-pulse">{otherUser} is typing...</span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form onSubmit={handleSend} className="flex p-3 border-t bg-white sticky bottom-0 z-10">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-r-full font-semibold hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWidget; 