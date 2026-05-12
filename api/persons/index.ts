import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Person } from "../_lib/models/Person.js";
import { withDb, methodNotAllowed, DEFAULT_USER_ID } from "../_lib/handler.js";

export default withDb(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const persons = await Person.find({
      userId: DEFAULT_USER_ID,
      isActive: true,
    }).sort({ createdAt: 1 });
    res.status(200).json(persons);
    return;
  }

  if (req.method === "POST") {
    const { displayName } = req.body ?? {};
    if (!displayName || typeof displayName !== "string" || !displayName.trim()) {
      res.status(400).json({ error: "displayName is required" });
      return;
    }
    const created = await Person.create({
      userId: DEFAULT_USER_ID,
      displayName: displayName.trim(),
    });
    res.status(201).json(created);
    return;
  }

  methodNotAllowed(res, ["GET", "POST"]);
});
