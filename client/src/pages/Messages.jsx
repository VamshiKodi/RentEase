import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageCircle, Home as HomeIcon, Send, Inbox } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Loader';

const useQuery = () => new URLSearchParams(useLocation().search);

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const query = useQuery();

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const initialId = query.get('conversationId');
    if (initialId) {
      setSelectedId(initialId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingList(true);
        const res = await axios.get('/api/messages');
        setConversations(res.data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoadingList(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedConversation(null);
      return;
    }

    const fetchConversation = async () => {
      try {
        setLoadingConversation(true);
        const res = await axios.get(`/api/messages/${selectedId}`);
        setSelectedConversation(res.data.conversation || null);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoadingConversation(false);
      }
    };

    fetchConversation();
  }, [selectedId]);

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === id ? { ...conv, isUnread: false } : conv
      )
    );
    const params = new URLSearchParams(window.location.search);
    params.set('conversationId', id);
    navigate(`/messages?${params.toString()}`, { replace: true });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedId) return;

    try {
      const res = await axios.post(`/api/messages/${selectedId}/messages`, {
        text: messageText.trim(),
      });
      setSelectedConversation(res.data.conversation || null);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return <PageLoader text="Loading messages..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black bg-gradient-to-r from-slate-900 via-primary-700 to-luxury-700 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base font-medium">
              Chat directly between renters and owners about properties.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Conversation List */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-luxury border border-slate-200/60 h-[70vh] flex flex-col"
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Inbox className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-semibold text-slate-800">Conversations</span>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                {conversations.length} active
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingList ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 text-slate-500 text-sm">
                  <MessageCircle className="h-10 w-10 mb-3 text-slate-300" />
                  <p>No conversations yet.</p>
                  <p>Start by messaging an owner from a property page.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {conversations.map((conv) => {
                    const otherParticipant = (conv.participants || []).find(
                      (p) => p._id !== user.id && p._id !== user._id
                    );
                    const isActive = conv._id === selectedId;
                    const isUnread = conv.isUnread;
                    return (
                      <li key={conv._id}>
                        <button
                          onClick={() => handleSelectConversation(conv._id)}
                          className={`w-full text-left px-4 py-3 flex flex-col space-y-1 hover:bg-slate-50 transition-colors ${
                            isActive ? 'bg-primary-50/70' : isUnread ? 'bg-slate-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-luxury-600 text-white flex items-center justify-center text-xs font-bold">
                                {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-sm line-clamp-1 ${
                                  isUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-900'
                                }`}>
                                  {otherParticipant?.name || 'Conversation'}
                                </span>
                                <span className="text-xs text-slate-500 line-clamp-1">
                                  {conv.property?.title || 'Property discussion'}
                                </span>
                              </div>
                            </div>
                            {isUnread && (
                              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-primary-500" />
                            )}
                          </div>
                          {conv.lastMessage?.text && (
                            <p className={`text-xs line-clamp-2 ${
                              isUnread ? 'text-slate-800 font-medium' : 'text-slate-500'
                            }`}>
                              {conv.lastMessage.text}
                            </p>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Conversation Panel */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-luxury border border-slate-200/60 h-[70vh] flex flex-col"
          >
            {!selectedId ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 text-slate-500 text-sm">
                <HomeIcon className="h-10 w-10 mb-3 text-slate-300" />
                <p>Select a conversation on the left to start chatting.</p>
              </div>
            ) : loadingConversation && !selectedConversation ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Loading conversation...
              </div>
            ) : !selectedConversation ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Conversation not found.
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-500 to-luxury-600 text-white flex items-center justify-center text-sm font-bold">
                      {(() => {
                        const otherParticipant = (selectedConversation.participants || []).find(
                          (p) => p._id !== user.id && p._id !== user._id
                        );
                        return otherParticipant?.name?.charAt(0).toUpperCase() || 'U';
                      })()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {(() => {
                          const otherParticipant = (selectedConversation.participants || []).find(
                            (p) => p._id !== user.id && p._id !== user._id
                          );
                          return otherParticipant?.name || 'Conversation';
                        })()}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1">
                        {selectedConversation.property?.title}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/60">
                  {(selectedConversation.messages || []).map((msg) => {
                    const isMe = msg.sender?._id === user.id || msg.sender === user.id;
                    return (
                      <div
                        key={msg._id || msg.createdAt}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            isMe
                              ? 'bg-gradient-to-r from-primary-600 to-luxury-600 text-white rounded-br-none'
                              : 'bg-white text-slate-900 rounded-bl-none border border-slate-100'
                          }`}
                        >
                          {!isMe && (
                            <div className="text-[10px] font-semibold text-slate-500 mb-0.5">
                              {msg.sender?.name}
                            </div>
                          )}
                          <div>{msg.text}</div>
                          <div className={`mt-1 text-[10px] ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-slate-100 px-3 py-3 bg-white">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/70 focus:border-primary-500 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-luxury-600 hover:from-primary-700 hover:to-luxury-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
