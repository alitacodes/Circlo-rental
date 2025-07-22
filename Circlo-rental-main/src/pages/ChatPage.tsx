import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Send, Search, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';

interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  itemTitle?: string;
  itemImage?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'booking';
}

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { threadId } = useParams<{ threadId: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in a real app, this would come from your backend
  const chatThreads: ChatThread[] = [
    {
      id: '1',
      participantName: 'Sarah Chen',
      participantAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastMessage: 'The camera is ready for pickup!',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      itemTitle: 'Canon EOS R5 Camera',
      itemImage: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '2',
      participantName: 'Marcus Johnson',
      participantAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastMessage: 'Thanks for the rental!',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      itemTitle: 'Vintage Leica M6',
      itemImage: 'https://images.pexels.com/photos/821651/pexels-photo-821651.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '3',
      participantName: 'Isabella Rodriguez',
      participantAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastMessage: 'Is the dress still available for next weekend?',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      itemTitle: 'Designer Evening Gown',
      itemImage: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: '2',
      senderName: 'Sarah Chen',
      content: 'Hi! I\'m interested in renting your Canon camera for this weekend.',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: '2',
      senderId: '1',
      senderName: 'John Doe',
      content: 'Great! It\'s available. The camera is in excellent condition and comes with all the accessories.',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Sarah Chen',
      content: 'Perfect! What time works best for pickup?',
      timestamp: '10:35 AM',
      type: 'text'
    },
    {
      id: '4',
      senderId: '1',
      senderName: 'John Doe',
      content: 'How about Saturday morning around 10 AM? I\'m in Manhattan.',
      timestamp: '10:37 AM',
      type: 'text'
    },
    {
      id: '5',
      senderId: '2',
      senderName: 'Sarah Chen',
      content: 'The camera is ready for pickup!',
      timestamp: '2 min ago',
      type: 'text'
    }
  ];

  const currentThread = chatThreads.find(thread => thread.id === threadId);
  const filteredThreads = chatThreads.filter(thread =>
    thread.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.itemTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, you would send this to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access chat</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Chat List Sidebar */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${threadId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Chat Threads */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 text-sm">Start renting items to connect with other users!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredThreads.map((thread) => (
                <Link
                  key={thread.id}
                  to={`/chat/${thread.id}`}
                  className={`block p-4 hover:bg-gray-50 transition-colors ${
                    threadId === thread.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={thread.participantAvatar}
                        alt={thread.participantName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {thread.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {thread.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {thread.participantName}
                        </h3>
                        <span className="text-xs text-gray-500">{thread.lastMessageTime}</span>
                      </div>
                      {thread.itemTitle && (
                        <div className="flex items-center space-x-2 mb-1">
                          <img
                            src={thread.itemImage}
                            alt={thread.itemTitle}
                            className="w-4 h-4 rounded object-cover"
                          />
                          <span className="text-xs text-gray-600 truncate">{thread.itemTitle}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 truncate">{thread.lastMessage}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {threadId && currentThread && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center px-6 py-4 border-b bg-white">
            <button
              onClick={() => window.history.back()}
              className="md:hidden p-2 mr-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={currentThread.participantAvatar}
              alt={currentThread.participantName}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{currentThread.participantName}</h2>
              {currentThread.itemTitle && (
                <div className="text-xs text-gray-500">{currentThread.itemTitle}</div>
              )}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
              <Video className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
              <MoreVertical className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <ChatWidget
              currentUser={user.name}
              otherUser={currentThread.participantName}
              otherUserAvatar={currentThread.participantAvatar}
              onBack={() => window.history.back()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;