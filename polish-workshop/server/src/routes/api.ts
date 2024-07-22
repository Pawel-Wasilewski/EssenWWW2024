import { Router } from "express";
import flashcards from "./flashcards.js";
import quiz from "./quiz.js";

function api() {
  const api = Router()
  api.use('/flashcards', flashcards())
  api.use('/quiz', quiz())
}

export default api