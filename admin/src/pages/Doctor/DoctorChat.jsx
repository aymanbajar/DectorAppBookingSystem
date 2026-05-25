import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorChat() {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/chats`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setChats(data.chats);
        if (!selectedChat && data.chats[0]) setSelectedChat(data.chats[0]);
      } else {
        toast.error("Sohbetler alınamadı");
      }
    } catch (error) {
      console.log(error);
      toast.error("Sohbetler alınamadı");
    }
  };

  const fetchChat = async (userId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/chat/${userId}`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) setSelectedChat(data.chat);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Sohbet yüklenemedi");
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!text.trim() || !selectedChat) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/chat/${selectedChat.userId}`,
        { text },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        setSelectedChat(data.chat);
        setText("");
        fetchChats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Mesaj gönderilemedi");
    }
  };

  useEffect(() => {
    if (!dToken) return;
    fetchChats();
    const timer = setInterval(() => {
      fetchChats();
      if (selectedChat?.userId) fetchChat(selectedChat.userId);
    }, 5000);
    return () => clearInterval(timer);
  }, [dToken, selectedChat?.userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages?.length]);

  return (
    <section className="admin-page">
      <h1 className="admin-title">Hasta Mesajları</h1>
      <div className="grid min-h-[72vh] gap-4 lg:grid-cols-[320px_1fr]">
        <div className="admin-card overflow-hidden">
          <div className="border-b border-slate-200 p-4 font-bold text-slate-950">Sohbetler</div>
          <div className="max-h-[66vh] overflow-y-auto">
            {chats.length ? chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => fetchChat(chat.userId)}
                className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${selectedChat?._id === chat._id ? "bg-cyan-50" : ""}`}
              >
                <img className="h-11 w-11 rounded-full object-cover" src={chat.userData.image} alt={chat.userData.name} />
                <div className="min-w-0">
                  <p className="font-bold text-slate-950">{chat.userData.name}</p>
                  <p className="truncate text-sm text-slate-500">{chat.lastMessage || "Henüz mesaj yok"}</p>
                </div>
              </button>
            )) : (
              <p className="p-5 text-sm text-slate-500">Henüz sohbet yok.</p>
            )}
          </div>
        </div>

        <div className="admin-card flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <div className="flex items-center gap-3 border-b border-slate-200 p-4">
                <img className="h-11 w-11 rounded-full object-cover" src={selectedChat.userData.image} alt={selectedChat.userData.name} />
                <div>
                  <p className="font-bold text-slate-950">{selectedChat.userData.name}</p>
                  <p className="text-sm text-slate-500">{selectedChat.userData.email}</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
                {selectedChat.messages.map((message) => (
                  <div key={message._id} className={`flex ${message.senderType === "doctor" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.senderType === "doctor" ? "bg-cyan-700 text-white" : "bg-white text-slate-700"}`}>
                      <p>{message.text}</p>
                      <p className={`mt-1 text-[11px] ${message.senderType === "doctor" ? "text-cyan-100" : "text-slate-400"}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={sendMessage} className="flex gap-3 border-t border-slate-200 p-4">
                <input value={text} onChange={(event) => setText(event.target.value)} className="admin-input" placeholder="Mesajınızı yazın..." />
                <button className="admin-button px-6">Gönder</button>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center text-slate-500">
              <p>Bir sohbet seçin.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
