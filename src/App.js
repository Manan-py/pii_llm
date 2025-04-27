import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    // Create initial chat if no chats exist
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length]); // Added chats.length as dependency

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRedact();
    }
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    setMessages([]);
  };

  const handleRedact = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      type: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Simulate processing (replace with actual API call later)
    setTimeout(() => {
      const redactedText = inputText; // Replace with actual redaction logic
      const botMessage = {
        id: Date.now() + 1,
        text: redactedText,
        type: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);

      // Update chat history
      if (currentChat) {
        const updatedChat = {
          ...currentChat,
          messages: [...messages, userMessage, botMessage],
          title: inputText.slice(0, 30) + (inputText.length > 30 ? '...' : '')
        };
        setChats(prev => prev.map(chat => 
          chat.id === currentChat.id ? updatedChat : chat
        ));
      }
    }, 1000);
  };

  const handleFileUpload = (e) => {
    // TODO: Implement file upload logic
    console.log('File upload clicked');
  };

  const handleWebLink = () => {
    // TODO: Implement web link input logic
    console.log('Web link clicked');
  };

  const handleDocument = () => {
    // TODO: Implement document input logic
    console.log('Document clicked');
  };

  // Handler for login/signup button
  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Handler for logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Remove token from storage if used
    localStorage.removeItem('token');
  };

  // Handler for successful login/signup
  const handleAuthSuccess = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowAuthModal(false);
    if (token) localStorage.setItem('token', token);
  };

  return (
    <div className="App">
      <header className={`App-header ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="header-content">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="header-title">
            <h1>PIIGuard</h1>
            <p>AI-Powered Personal Information Protection</p>
          </div>
          <div className="header-auth-buttons">
            {!isAuthenticated ? (
              <>
                <button className="auth-btn" onClick={() => handleAuthClick('login')}>Login</button>
                <button className="auth-btn" onClick={() => handleAuthClick('signup')}>Sign Up</button>
              </>
            ) : (
              <div className="profile-dropdown">
                <button className="profile-btn">{user?.name || 'Profile'}</button>
                <div className="profile-dropdown-content">
                  <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="App-main">
        {/* Hamburger button always visible when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            className="sidebar-hamburger sidebar-hamburger-floating"
            onClick={toggleSidebar}
            title="Open sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        )}
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <button className="new-chat-button" onClick={createNewChat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Chat
            </button>
            {isSidebarOpen && (
              <button className="sidebar-hamburger" onClick={toggleSidebar} title="Close sidebar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            )}
          </div>
          <div className="chat-history">
            {chats.filter(chat => chat.title !== 'New Chat').map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${currentChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentChat(chat);
                  setMessages(chat.messages);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div className="chat-item-content">
                  {chat.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="chat-container">
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <h2>Welcome to PIIGuard</h2>
                  <p>Paste or type any text containing personal information, and I'll help you redact it securely.</p>
                  <div className="example-text">
                    <p>Try something like:</p>
                    <p>"My email is john.doe@example.com and my phone number is (555) 123-4567"</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-type">{message.type === 'user' ? 'You' : 'PIIGuard'}</span>
                        <span className="message-time">{message.timestamp}</span>
                      </div>
                      <div className="message-text">{message.text}</div>
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="message bot">
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-type">PIIGuard</span>
                      <span className="message-time">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="processing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
              <div className="input-buttons">
                <button className="input-button" onClick={handleFileUpload} title="Upload File">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </button>
                <button className="input-button" onClick={handleWebLink} title="Add Web Link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
                <button className="input-button" onClick={handleDocument} title="Add Document">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </button>
              </div>
              <div className="input-wrapper">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Message PIIGuard..."
                  className="text-area"
                  rows="1"
                />
                <button 
                  onClick={handleRedact} 
                  className="redact-button"
                  disabled={!inputText.trim() || isProcessing}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <p>© 2024 PIIGuard - Protecting Your Privacy</p>
          <div className="footer-links">
            <button className="footer-link">Privacy Policy</button>
            <button className="footer-link">Terms of Service</button>
            <button className="footer-link">About</button>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

// Placeholder for AuthModal component
function AuthModal({ mode, onClose, onSuccess }) {
  // Will implement in next step
  return (
    <div className="auth-modal-backdrop">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>×</button>
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        {/* Form will go here */}
      </div>
    </div>
  );
}

export default App;
