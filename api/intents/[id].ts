import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Intent } from "../_lib/models/Intent";
import { withDb, methodNotAllowed, DEFAULT_USER_ID } from "../_lib/handler";

export default withDb(async (req: VercelRequest, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: "invalid id" });
    return;
  }

  if (req.method === "GET") {
    const intent = await Intent.findOne({ _id: id, userId: DEFAULT_USER_ID });
    if (!intent) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json(intent);
    return;
  }

  if (req.method === "PUT") {
    const updates: Record<string, unknown> = {};
    if (typeof req.body?.title === "string") updates.title = req.body.title.trim();
    if (typeof req.body?.why === "string") updates.why = req.body.why.trim();
    if (req.body?.why === null) updates.why = null;
    if (typeof req.body?.dueDate === "string" || req.body?.dueDate === null) {
      updates.dueDate = req.body.dueDate || null;
    }
    if (req.body?.intentType === "do" || req.body?.intentType === "avoid") {
      updates.intentType = req.body.intentType;
    }
    if (typeof req.body?.isArchived === "boolean") {
      updates.isArchived = req.body.isArchived;
    }
    const intent = await Intent.findOneAndUpdate(
      { _id: id, userId: DEFAULT_USER_ID },
      updates,
      { new: true }
    );
    if (!intent) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json(intent);
    return;
  }

  if (req.method === "DELETE") {
    const result = await Intent.findOneAndDelete({
      _id: id,
      userId: DEFAULT_USER_ID,
    });
    if (!result) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
});
