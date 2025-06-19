// src/controllers/CarMake.controller.ts
import { Request, Response } from "express"
import { CarMakeModel } from "../models/CarMake.schema" //  Mongoose model
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new car make
export const createCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country, brand } = req.body
    if (!country || !brand) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "Country and brand are required" })
      return
    }

    const carMake = await CarMakeModel.create({ country, brand })
    res.status(CREATED).json({ success: true, data: carMake })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to create car make",
    })
  }
}

// Get all car makes
export const getAllCarMakes = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const makes = await CarMakeModel.find().exec()
    res.status(OK).json({ success: true, data: makes })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch car makes",
    })
  }
}

// Get a single car make by ID
export const getCarMakeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const make = await CarMakeModel.findById(id).exec()
    if (!make) {
      res.status(NOT_FOUND).json({ success: false, error: "CarMake not found" })
      return
    }
    res.status(OK).json({ success: true, data: make })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch car make",
    })
  }
}

// Update a car make
export const updateCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const updated = await CarMakeModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).exec()

    if (!updated) {
      res.status(NOT_FOUND).json({ success: false, error: "CarMake not found" })
      return
    }
    res.status(OK).json({ success: true, data: updated })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to update car make",
    })
  }
}

// Delete a car make
export const deleteCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const deleted = await CarMakeModel.findByIdAndDelete(id).exec()
    if (!deleted) {
      res.status(NOT_FOUND).json({ success: false, error: "CarMake not found" })
      return
    }
    res.status(OK).json({ success: true, data: {} })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to delete car make",
    })
  }
}
