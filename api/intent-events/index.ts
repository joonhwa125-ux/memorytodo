import type { VercelRequest, VercelResponse } from "@vercel/node";
import { IntentEvent } from "../_lib/models/IntentEvent";
import { withDb, methodNotAllowed, DEFAULT_USER_ID } from "../_lib/handler";

const VALID_QUADRANTS = ["aligned", "procrastinated", "relapsed", "resisted"] as const;

export default withDb(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "GET") {
    const filter: Record<string, unknown> = { userId: DEFAULT_USER_ID };
    if (typeof req.query.personId === "string") filter.personId = req.query.personId;
    if (typeof req.query.since === "string") {
      const since = new Date(req.query.since);
      if (!isNaN(since.getTime())) filter.recordedAt = { $gte: since };
    }
    const events = await IntentEvent.find(filter).sort({ recordedAt: -1 });
    res.status(200).json(events);
    return;
  }

  if (req.method === "POST") {
    const { personId, intentId, quadrant, triggerNote, sessionType } =
      req.body ?? {};
    if (!personId || !quadrant) {
      res.status(400).json({ error: "personId, quadrant are required" });
      return;
    }
    if (!VALID_QUADRANTS.includes(quadrant)) {
      res.status(400).json({
        error: `quadrant must be one of ${VALID_QUADRANTS.join(", ")}`,
      });
      return;
    }
    const ev = await IntentEvent.create({
      userId: DEFAULT_USER_ID,
      personId,
      intentId: intentId || null,
      quadrant,
      triggerNote: triggerNote || null,
      sessionType: sessionType || "realtime",
      recordedAt: new Date(),
    });
    res.status(201).json(ev);
    return;
  }

  methodNotAllowed(res, ["GET", "POST"]);
});
