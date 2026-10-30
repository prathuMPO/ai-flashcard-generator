<!-- @format -->

# AI Flashcard Generator

A full-stack web application that uses AI to automatically generate study flashcards from any text. Paste in an article, notes, or any study material, and the app creates question-and-answer flashcards you can study and manage.

## Features

- **AI-powered generation** — paste any text and generate flashcards automatically using Google Gemini
- **Study mode** — click a card to flip and reveal the answer
- **Persistent storage** — flashcards are saved to a database and persist across sessions
- **Delete cards** — remove flashcards you no longer need
- **Error handling** — graceful handling when the AI service is busy

## Tech Stack

**Frontend:** React (Vite), CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB (Mongoose)  
**AI:** Google Gemini API

## How It Works

1. User pastes text into the app
2. The frontend sends the text to the backend API
3. The backend calls the Google Gemini API with a prompt to generate flashcards
4. The AI returns question/answer pairs as JSON
5. The flashcards are saved to MongoDB and returned to the frontend
6. The user can study (flip) and delete the generated flashcards

## Running Locally

**Backend:**
cd backend
npm install
npm start

Create a `.env` file in the `backend` folder with:

MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

**Frontend:**

cd frontend
npm install
npm run dev

The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173`.
