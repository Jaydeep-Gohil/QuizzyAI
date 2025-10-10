import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI(proccess.env.GEMINI_API_KEY);
