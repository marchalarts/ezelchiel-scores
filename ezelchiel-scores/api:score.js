import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  // Alleen POST toestaan
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { naam, score } = req.body;

    // Simpele checks (anti-rotzooi)
    if (!naam || typeof naam !== "string") {
      return res.status(400).json({ error: "naam ontbreekt" });
    }
    if (typeof score !== "number") {
      return res.status(400).json({ error: "score moet een nummer zijn" });
    }

    // Schrijf naar Notion
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Naam: { title: [{ text: { content: naam } }] },
        Score: { number: score },
        Datum: { date: { start: new Date().toISOString() } } // optioneel; alleen als je die kolom maakt
      }
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Notion error" });
  }
}
