// src/controllers/Item.controller.ts
import { Request, Response } from "express"
import { ItemModel } from "../models/item.schema" //  Mongoose model
import { ListModel } from "../models/list.schema" //  Mongoose model
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new item in a specific list
export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId } = req.params
    const { title, description = "", completed = false } = req.body

    if (!title) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "Title is required" })
      return
    }

    // Verify the list exists
    const list = await ListModel.findById(listId).exec()
    if (!list) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    // Create the item
    const item = await ItemModel.create({
      listId,
      title,
      description,
      completed,
    })
    res.status(CREATED).json({ success: true, data: item })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to create item",
    })
  }
}

// Get all items for a specific list
export const getListItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId } = req.params

    // Verify the list exists
    const list = await ListModel.findById(listId).exec()
    if (!list) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    // Fetch items
    const items = await ItemModel.find({ listId }).exec()
    res.status(OK).json({ success: true, data: items })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch items",
    })
  }
}

// Get one specific item by its ID within a list
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params

    // Verify the list exists
    const list = await ListModel.findById(listId).exec()
    if (!list) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    // Fetch the item
    const item = await ItemModel.findById(id).exec()
    if (!item || item.listId.toString() !== listId) {
      res
        .status(NOT_FOUND)
        .json({ success: false, error: "Item not found in this list" })
      return
    }

    res.status(OK).json({ success: true, data: item })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch item",
    })
  }
}

// Update an existing item
export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId, id } = req.params

    // Verify the list exists
    const list = await ListModel.findById(listId).exec()
    if (!list) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    // Update the item
    const updated = await ItemModel.findOneAndUpdate(
      { _id: id, listId },
      req.body,
      { new: true, runValidators: true }
    ).exec()

    if (!updated) {
      res
        .status(NOT_FOUND)
        .json({ success: false, error: "Item not found in this list" })
      return
    }

    res.status(OK).json({ success: true, data: updated })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to update item",
    })
  }
}

// Delete an item
export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId, id } = req.params

    // Verify the list exists
    const list = await ListModel.findById(listId).exec()
    if (!list) {
      res.status(NOT_FOUND).json({ success: false, error: "List not found" })
      return
    }

    // Delete the item
    const deleted = await ItemModel.findOneAndDelete({ _id: id, listId }).exec()
    if (!deleted) {
      res
        .status(NOT_FOUND)
        .json({ success: false, error: "Item not found in this list" })
      return
    }

    res.status(OK).json({ success: true, data: {} })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to delete item",
    })
  }
}
