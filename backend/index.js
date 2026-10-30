/** @format */

const express = require("express");
const app = express();
const cors = require("cors");

const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

const PORT = 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conneted to MongoDB"))
  .catch((err) => console.log(`MongoDB connection error:`, err));

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

app.post("/generate", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("TEXT RECEIVED:", text);
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const prompt = `Generate 5 flashcards from the following text. 
Return ONLY a JSON array, no other text, in this exact format:
[{"question": "...", "answer": "..."}]

Text: ${text}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("AI RAW RESPONSE:", responseText);
    const flashcards = JSON.parse(responseText);

    const savedFlashcards = await Flashcard.insertMany(flashcards);

    res.json(savedFlashcards);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

app.get("/flashcards", async (req, res) => {
  // get all flashcards from DB and send them
  const flashcards = await Flashcard.find();
  res.json(flashcards);
});

app.delete("/flashcards/:id", async (req, res) => {
  // delete the flashcard with the matching _id, send confirmation
  const deleteFlashCards = await Flashcard.findByIdAndDelete(req.params.id);
  res.json(deleteFlashCards);
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
