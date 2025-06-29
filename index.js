import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const LODGIFY_BASE_URL = 'https://api.lodgify.com/v2';

app.get('/properties', async (req, res) => {
  try {
    const response = await fetch(`${LODGIFY_BASE_URL}/properties`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.LODGIFY_API_KEY,
        'accept': 'application/json'
      }
    });

    // Falls Fehlerstatus (z. B. 401, 429 etc.)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Lodgify API-Fehler: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ error: 'Fehler von Lodgify', details: errorText });
    }

    const text = await response.text();

    try {
      const data = JSON.parse(text); // Nur wenn JSON gültig
      res.json(data);
    } catch (parseError) {
      console.error("❌ Antwort ist kein gültiges JSON:", text);
      res.status(502).json({ error: "Ungültige Antwort von Lodgify", raw: text });
    }

  } catch (error) {
    console.error('❌ Fehler bei Anfrage an Lodgify:', error);
    res.status(500).json({ error: 'Proxy Fehler' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy läuft auf Port ${PORT}`);
});
