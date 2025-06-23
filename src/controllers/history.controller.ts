// src/controllers/history.controller.ts
import { Request, Response, NextFunction } from "express"
import {
  parseHistoryParams,
  getHistoryCount,
  getHistoryEntries,
} from "../service/history.service"
import { OK } from "../utils/http-status"

// Extend Express Request to include authenticated user with string ID
interface AuthenticatedRequest extends Request {
  user?: { _id: string }
}

export const getHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawUserId = req.user?._id

    if (req.query.count === "true") {
      const { userId } = parseHistoryParams({}, rawUserId)
      const total = await getHistoryCount(userId)
      res.status(OK).json({ total })
      return
    }

    const params = parseHistoryParams(req.query as any, rawUserId)
    const entries = await getHistoryEntries(params)
    res.status(OK).json(entries)
  } catch (err) {
    next(err)
  }
}
