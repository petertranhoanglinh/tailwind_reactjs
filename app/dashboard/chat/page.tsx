// pages/chat.tsx
"use client";
import { useState } from 'react';
import ChatBox from '../../_components/ChatBox/ChatBox';

export default function ChatPage() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  if (!joined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h1 className="text-xl font-bold mb-4">Nhập tên của bạn</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Tên người dùng"
          />
          <button
            onClick={() => username.trim() && setJoined(true)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Tham gia chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ChatBox groupId="group1" currentUser={username} />
    </div>
  );
}