import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi!" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    const res = await axios.post("/api/chat", { messages: [...messages, userMsg] });
    setMessages(prev => [...prev, res.data]);
  };

  return (
    <div>
      <div>{messages.map((m,i) => <p key={i}><b>{m.role}:</b> {m.content}</p>)}</div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
