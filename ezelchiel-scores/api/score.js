export default async function handler(req, res) {
  if (req.method === 'POST') {
    // existing POST logic (unchanged)
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    // Dummy top 10 response for now
    return res.status(200).json([
      { name: "Test", score: 42 }
    ]);
  }

  res.status(405).json({ error: "Method not allowed" });
}
