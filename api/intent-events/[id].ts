import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IntentEvent } from "../_lib/models/IntentEvent.js";
import { withDb, methodNotAllowed } from "../_lib/handler.js";

export default withDb(async (req: VercelRequest, res: VercelResponse, ctx) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: "invalid id" });
    return;
  }

  if (req.method === "DELETE") {
    const result = await IntentEvent.findOneAndDelete({
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

  methodNotAllowed(res, ["DELETE"]);
});
