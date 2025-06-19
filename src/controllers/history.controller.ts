// src/controllers/history.controller.ts

import { Request, Response, NextFunction } from "express"
import { HistoryCollection } from "../models/history.model"
import { AppError } from "../utils/error"
import { OK, BAD_REQUEST } from "../utils/http-status"

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit, skip, sort, count } = req.query

    // If ?count=true, just return the total
    if (count === "true") {
      const total = await HistoryCollection.countDocuments()
      res.status(OK).json({ total })
      return
    }

    // Parse pagination & sorting
    const l = limit ? parseInt(limit as string, 10) : 10
    const s = skip ? parseInt(skip as string, 10) : 0
    const sortBy = (sort as string) || "-requestedAt"

    if (isNaN(l) || isNaN(s)) {
      throw new AppError("limit and skip must be valid numbers", BAD_REQUEST)
    }

    // Fetch the entries
    const entries = await HistoryCollection.find().sort(sortBy).skip(s).limit(l)

    res.status(OK).json(entries)
  } catch (err) {
    next(err)
  }
}
