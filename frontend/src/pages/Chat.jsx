import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function Chat() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const fetchChat = async () => {
    if (!token) return navigate("/login");
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/chat/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setChat(data.chat);
      } else {
        toast.error(data.message);
        navigate("/my-appointments");
      }
    } catch (error) {
      console.log(error);
      toast.error("Sohbet yüklenemedi");
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/chat/${docId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setChat(data.chat);
        setText("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Mesaj gönderilemedi");
    }
  };

  useEffect(() => {
    fetchChat();
    const timer = setInterval(fetchChat, 5000);
    return () => clearInterval(timer);
  }, [docId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages?.length]);

  return (
    <section className="py-10">
      <div className="surface-card mx-auto flex min-h-[70vh] max-w-4xl flex-col overflow-hidden">
        <div className="flex items-center gap-4 border-b border-slate-200 p-4">
          <button onClick={() => navigate("/my-appointments")} className="btn-secondary px-4 py-2">
            Geri
          </button>
          {chat?.docData && (
            <>
              <img className="h-12 w-12 rounded-full object-cover" src={chat.docData.image} alt={chat.docData.name} />
              <div>
                <h1 className="font-bold text-slate-950">{chat.docData.name}</h1>
                <p className="text-sm text-slate-500">{chat.docData.speciality}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
          {chat?.messages?.length ? chat.messages.map((message) => (
            <div key={message._id} className={`flex ${message.senderType === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${message.senderType === "user" ? "bg-cyan-700 text-white" : "bg-white text-slate-700"}`}>
                <p>{message.text}</p>
                <p className={`mt-1 text-[11px] ${message.senderType === "user" ? "text-cyan-100" : "text-slate-400"}`}>
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )) : (
            <div className="grid h-full place-items-center text-center text-slate-500">
              <p>Henüz mesaj yok. Doktorunuza ilk mesajı yazabilirsiniz.</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-3 border-t border-slate-200 p-4">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="form-input"
            placeholder="Mesajınızı yazın..."
          />
          <button className="btn-primary px-6">Gönder</button>
        </form>
      </div>
    </section>
  );
}
