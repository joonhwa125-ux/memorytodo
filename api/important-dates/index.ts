import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ImportantDate } from "../_lib/models/ImportantDate";
import { withDb, methodNotAllowed, DEFAULT_USER_ID } from "../_lib/handler";

export default withDb(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const filter: Record<string, unknown> = { userId: DEFAULT_USER_ID };
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
      userId: DEFAULT_USER_ID,
      personId,
      label: String(label).trim(),
      dateValue,
    });
    res.status(201).json(doc);
    return;
  }

  methodNotAllowed(res, ["GET", "POST"]);
});
