import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

dotenv.config();

const mistralApiKey = process.env.MISTRAL_API_KEY;
const mistralApiUrl = 'https://api.mistral.ai/v1/chat/completions';

const app = express();
const port = 8081; 

app.use(express.json());

app.route("/ask").post(async (req, res) => {
  const question = req?.body?.question;
  if (!question) {
    res.status(400).send("No question provided");
    return;
  }

  try {
    const response = await axios.post(
      mistralApiUrl,
      {
        model: "mistral-tiny",
        messages: [{ role: "user", content: question }],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${mistralApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content;
    res.status(200).send(answer);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).send(error.response?.data?.error?.message || error.message);
  }
});

app.listen(port, () => {
  console.log(`Mistral service is running on port ${port}`);
});