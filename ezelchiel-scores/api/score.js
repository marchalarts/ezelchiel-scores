import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
  // ===== POST: score opslaan =====
  if (req.method === "POST") {
    try {
      const { naam, score } = req.body;

      await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties: {
          Naam: { title: [{ text: { content: naam } }] },
          Score: { number: score },
        },
      });

      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Notion error" });
    }
  }

  // ===== GET: top 10 leaderboard =====
  if (req.method === "GET") {
    try {
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
        sorts: [{ property: "Score", direction: "descending" }],
        page_size: 10,
      });

      const scores = response.results.map((page) => ({
        naam: page.properties.Naam.title[0]?.plain_text || "Speler",
        score: page.properties.Score.number || 0,
      }));

      return res.status(200).json(scores);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Notion error" });
    }
  }

  res.status(405).end();
}
