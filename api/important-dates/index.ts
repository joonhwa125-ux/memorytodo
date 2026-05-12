import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ImportantDate } from "../_lib/models/ImportantDate.js";
import { withDb, methodNotAllowed } from "../_lib/handler.js";

export default withDb(async (req: VercelRequest, res: VercelResponse, ctx) => {
  if (req.method === "GET") {
    const filter: Record<string, unknown> = { userId: ctx.userId };
    if (typeof req.query.personId === "string") filter.personId = req.query.personId;

    const dates = await ImportantDate.find(filter).sort({ dateValue: 1 });
    res.status(200).json(dates);
    return;
  }

  if (req.method === "POST") {
    const { personId, label, dateValue } = req.body ?? {};
    if (!personId || !label || !dateValue) {
      res.status(400).json({ error: "personId, label, dateValue are required" });
      return;
    }
    const doc = await ImportantDate.create({
      userId: ctx.userId,
      personId,
      label: String(label).trim(),
      dateValue,
    });
    res.status(201).json(doc);
    return;
  }

  methodNotAllowed(res, ["GET", "POST"]);
});
