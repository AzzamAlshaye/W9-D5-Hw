// src/services/history.service.ts
import { HistoryCollection, HistoryDocument } from "../models/history.model"
import { AppError } from "../utils/error"
import { BAD_REQUEST } from "../utils/http-status"
import { Types } from "mongoose"

export interface HistoryParams {
  limit?: string
  skip?: string
  sort?: string
  count?: string
}

export interface ParsedHistoryParams {
  limit: number
  skip: number
  sortBy: string
  userId: Types.ObjectId
}

export function parseHistoryParams(
  params: HistoryParams,
  rawUserId?: string
): ParsedHistoryParams {
  const l = params.limit ? parseInt(params.limit, 10) : 10
  const s = params.skip ? parseInt(params.skip, 10) : 0
  const sortBy = params.sort ?? "-requestedAt"

  if (isNaN(l) || isNaN(s)) {
    throw new AppError("limit and skip must be valid numbers", BAD_REQUEST)
  }
  if (!rawUserId || !Types.ObjectId.isValid(rawUserId)) {
    throw new AppError("Invalid or missing user id", BAD_REQUEST)
  }

  return { limit: l, skip: s, sortBy, userId: new Types.ObjectId(rawUserId) }
}

export async function getHistoryCount(userId: Types.ObjectId): Promise<number> {
  return HistoryCollection.countDocuments({ user: userId })
}

export async function getHistoryEntries(
  opts: ParsedHistoryParams
): Promise<HistoryDocument[]> {
  return HistoryCollection.find({ user: opts.userId })
    .sort(opts.sortBy)
    .skip(opts.skip)
    .limit(opts.limit)
    .exec()
}
