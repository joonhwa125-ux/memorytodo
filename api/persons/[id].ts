import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Person } from "../_lib/models/Person.js";
import { withDb, methodNotAllowed } from "../_lib/handler.js";

export default withDb(async (req: VercelRequest, res: VercelResponse, ctx) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: "invalid id" });
    return;
  }

  if (req.method === "GET") {
    const person = await Person.findOne({ _id: id, userId: ctx.userId });
    if (!person) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json(person);
    return;
  }

  if (req.method === "PUT") {
    const updates: Record<string, unknown> = {};
    if (typeof req.body?.displayName === "string") {
      updates.displayName = req.body.displayName.trim();
    }
    const person = await Person.findOneAndUpdate(
      { _id: id, userId: ctx.userId },
      updates,
      { new: true }
    );
    if (!person) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json(person);
    return;
  }

  if (req.method === "DELETE") {
    const person = await Person.findOneAndUpdate(
      { _id: id, userId: ctx.userId },
      { isActive: false },
      { new: true }
    );
    if (!person) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
});
