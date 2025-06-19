import { Request, Response } from "express"
import { ListModel } from "../models/list.schema" //  Mongoose model
import { ItemModel } from "../models/item.schema" //  Mongoose model
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new list
export const createList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description = "" } = req.body

    if (!title) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "Title is required" })
      return
    }

    const list = await ListModel.create({ title, description })
    res.status(CREATED).json({ success: true, data: list })
  } catch (err: any) {
    res
      .status(BAD_REQUEST)
      .json({ success: false, error: err.message || "Failed to create list" })
  }
}

// Get all lists
export const getLists = async (_req: Request, res: Response): Promise<void> => {
  try {
    const lists = await ListModel.find().exec()
    res.status(OK).json({ success: true, data: lists })
  } catch (err: any) {
    res
      .status(BAD_REQUEST)
      .json({ success: false, error: err.message || "Failed to fetch lists" })
  }
}

// Get a single list by ID, including its items
export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const list = await ListModel.findById(id).exec()
    if (!list) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    const items = await ItemModel.find({ listId: id }).exec()
    res.status(OK).json({ success: true, data: { ...list.toObject(), items } })
  } catch (err: any) {
    res
      .status(BAD_REQUEST)
      .json({ success: false, error: err.message || "Failed to fetch list" })
  }
}

// Update an existing list
export const updateList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const updated = await ListModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).exec()

    if (!updated) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    res.status(OK).json({ success: true, data: updated })
  } catch (err: any) {
    res
      .status(BAD_REQUEST)
      .json({ success: false, error: err.message || "Failed to update list" })
  }
}

// Delete a list and all its items
export const deleteList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const deleted = await ListModel.findByIdAndDelete(id).exec()
    if (!deleted) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    await ItemModel.deleteMany({ listId: id }).exec()
    res.status(OK).json({ success: true, data: {} })
  } catch (err: any) {
    res
      .status(BAD_REQUEST)
      .json({ success: false, error: err.message || "Failed to delete list" })
  }
}
