// components/ChatBox.tsx
import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

interface ChatMessage {
  id?: string;
  content: string;
  sender: string;
  groupId: string;
  timestamp?: Date;
}

interface ChatBoxProps {
  groupId: string;
  currentUser: string;
}

export default function ChatBox({ groupId, currentUser }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Kết nối WebSocket
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.current?.subscribe(
          `/topic/group.${groupId}`,
          (message: IMessage) => {
            const newMsg: ChatMessage = JSON.parse(message.body);
            setMessages(prev => [...prev, newMsg]);
          }
        );
      },
    });
    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [groupId]);

  // Tự động cuộn xuống tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && stompClient.current) {
      const chatMessage: ChatMessage = {
        sender: currentUser,
        content: newMessage,
        groupId: groupId,
      };

      stompClient.current.publish({
        destination: `/app/chat.send/${groupId}`,
        body: JSON.stringify(chatMessage),
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-96 w-96 border rounded-lg bg-gray-50 shadow-lg">
      {/* Header */}
      <div className="p-3 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-semibold">Nhóm: {groupId}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === currentUser ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg ${
                msg.sender === currentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {msg.content}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {msg.sender} • {msg.timestamp?.toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tin nhắn..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}