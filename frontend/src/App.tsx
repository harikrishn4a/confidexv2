import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [privacyMessages, setPrivacyMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const privacyMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  useEffect(() => {
    scrollToBottom(privacyMessagesEndRef);
  }, [privacyMessages]);

  const runmodel = async (inputText: string) => {
    try {
      const response = await fetch('/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      // Show explanations from RAG, or fallback to verdict/entities
      if (data.explanations && data.explanations.length > 0) {
        return data.explanations.join(' ');
      } else if (data.verdict) {
        return `Verdict: ${data.verdict}`;
      } else if (data.entities) {
        return `Entities: ${JSON.stringify(data.entities)}`;
      } else {
        return 'No explanation returned.';
      }
    } catch (error) {
      console.error('Error calling privacy model:', error);
      return 'Privacy check failed. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    if (isRecording) {
      // Send to privacy AI instead
      setPrivacyMessages(prev => [...prev, userMessage]);
      setPrivacyLoading(true);
      
      try {
        const response = await runmodel(input);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setPrivacyMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Error processing your request through privacy AI.',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setPrivacyMessages(prev => [...prev, errorMessage]);
      } finally {
        setPrivacyLoading(false);
      }
    } else {
      // Normal ChatGPT-like behavior (simulated)
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Simulate response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'This is a simulated ChatGPT response. When recording is enabled, your inputs will be sent to the privacy AI instead.',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    }

    setInput('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'mr-96' : 'mr-0'}`}>
        {/* Header */}
        <div className="border-b border-gray-700 p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">ChatGPT</h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isRecording ? 'bg-red-600/20 text-red-400' : 'bg-gray-700 text-gray-300'
            }`}>
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="text-sm font-medium">
                {isRecording ? 'Privacy Monitoring Active' : 'Privacy Monitoring Off'}
              </span>
            </div>
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isRecording && (
            <div className="text-center text-gray-400 mt-20">
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p>Start typing your message or enable privacy monitoring to secure your inputs.</p>
            </div>
          )}
          
          {isRecording && messages.length === 0 && (
            <div className="text-center text-red-400 mt-20">
              <Shield size={48} className="mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Privacy Monitoring Active</h2>
              <p>Your inputs are now being sent to the privacy AI for security analysis.</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isRecording ? "Your input will be sent to Privacy AI..." : "Message ChatGPT..."}
              className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              disabled={isLoading || privacyLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || privacyLoading}
              className={`p-3 rounded-lg transition-colors ${
                input.trim() && !isLoading && !privacyLoading
                  ? isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-l-lg border-l border-t border-b border-gray-600 transition-colors"
        >
          {sidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Privacy Agent Sidebar */}
      <div className={`absolute right-0 top-0 h-full w-96 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="border-b border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-green-400" size={24} />
              <h2 className="text-lg font-semibold">Privacy Agent</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Privacy Status */}
          <div className={`p-4 border-b border-gray-700 ${
            isRecording ? 'bg-red-900/20' : 'bg-gray-700/50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
              <span className="font-medium">
                {isRecording ? 'Monitoring Active' : 'Monitoring Disabled'}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {isRecording 
                ? 'Inputs are being analyzed for sensitive information'
                : 'Click record to start privacy monitoring'
              }
            </p>
          </div>

          {/* Privacy Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {privacyMessages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <Shield size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-semibold mb-2">Privacy AI Ready</h3>
                <p className="text-sm">Enable monitoring to start analyzing your inputs for sensitive information.</p>
              </div>
            )}

            {privacyMessages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600/20 border border-blue-600/30' 
                    : 'bg-green-600/20 border border-green-600/30'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-300">
                      {message.sender === 'user' ? 'Input Analysis' : 'Privacy AI'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-100 whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {privacyLoading && (
              <div className="bg-green-600/20 border border-green-600/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-300">Privacy AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-gray-300 ml-2">Analyzing for sensitive content...</span>
                </div>
              </div>
            )}
            <div ref={privacyMessagesEndRef} />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;