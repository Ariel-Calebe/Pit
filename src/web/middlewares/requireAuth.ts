import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../../config/firebaseAdmin";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : "";
    if (!token) return res.status(401).json({ error: "missing_token" });
    const decoded = await adminAuth.verifyIdToken(token);
    (req as any).uid = decoded.uid;
    next();
  } catch (e: any) {
    return res.status(401).json({ error: e?.code || "invalid_token" });
  }
}
