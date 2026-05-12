import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Intent } from "../_lib/models/Intent.js";
import { withDb, methodNotAllowed } from "../_lib/handler.js";

export default withDb(async (req: VercelRequest, res: VercelResponse, ctx) => {
  if (req.method === "GET") {
    const filter: Record<string, unknown> = { userId: ctx.userId };
    if (typeof req.query.personId === "string") filter.personId = req.query.personId;
    if (req.query.includeArchived !== "true") filter.isArchived = false;

    const intents = await Intent.find(filter).sort({ createdAt: -1 });
    res.status(200).json(intents);
    return;
  }

  if (req.method === "POST") {
    const { personId, intentType, title, why, dueDate } = req.body ?? {};
    if (!personId || !intentType || !title) {
      res.status(400).json({ error: "personId, intentType, title are required" });
      return;
    }
    if (intentType !== "do" && intentType !== "avoid") {
      res.status(400).json({ error: 'intentType must be "do" or "avoid"' });
      return;
    }
    const intent = await Intent.create({
      userId: ctx.userId,
      personId,
      intentType,
      title: String(title).trim(),
      why: why ? String(why).trim() : null,
      dueDate: dueDate || null,
    });
    res.status(201).json(intent);
    return;
  }

  methodNotAllowed(res, ["GET", "POST"]);
});
