import Chat from "../models/aichatModel.js";
import ActivityLog from "../models/activityLogModel.js";

export const createChatSession = async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    try {
      await ActivityLog.create({
        user: chat.user,
        action: "chat_start",
        metadata: { sessionId: chat.sessionId }
      });
    } catch {}
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const appendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, content, type } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    chat.messages.push({ sender, content, type });
    await chat.save();
    try {
      await ActivityLog.create({
        user: chat.user,
        action: "chat_message",
        metadata: { chatId, sender, type }
      });
    } catch {}
    res.json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getChatBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chat = await Chat.findOne({ sessionId, user: req.query.userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


