import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ImportantDate } from "../_lib/models/ImportantDate.js";
import { withDb, methodNotAllowed } from "../_lib/handler.js";

export default withDb(async (req: VercelRequest, res: VercelResponse, ctx) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: "invalid id" });
    return;
  }

  if (req.method === "PUT") {
    const updates: Record<string, unknown> = {};
    if (typeof req.body?.label === "string") updates.label = req.body.label.trim();
    if (typeof req.body?.dateValue === "string") updates.dateValue = req.body.dateValue;

    const doc = await ImportantDate.findOneAndUpdate(
      { _id: id, userId: ctx.userId },
      updates,
      { new: true }
    );
    if (!doc) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json(doc);
    return;
  }

  if (req.method === "DELETE") {
    const result = await ImportantDate.findOneAndDelete({
      _id: id,
      userId: ctx.userId,
    });
    if (!result) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  methodNotAllowed(res, ["PUT", "DELETE"]);
});
