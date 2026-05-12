import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IntentEvent } from "../_lib/models/IntentEvent";
import { withDb, methodNotAllowed, DEFAULT_USER_ID } from "../_lib/handler";

export default withDb(async (req: VercelRequest, res: VercelResponse) => {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(400).json({ error: "invalid id" });
    return;
  }

  if (req.method === "DELETE") {
    const result = await IntentEvent.findOneAndDelete({
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

  methodNotAllowed(res, ["DELETE"]);
});
