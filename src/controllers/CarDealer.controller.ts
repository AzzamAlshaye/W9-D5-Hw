// src/controllers/CarDealer.controller.ts
import { Request, Response } from "express"
import { CarDealerModel } from "../models/CarDealer.schema" //  Mongoose model
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new dealer
export const createCarDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, city } = req.body
    if (!name || !email || !city) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "Name, email, and city are required" })
      return
    }

    const dealer = await CarDealerModel.create({ name, email, city })
    res.status(CREATED).json({ success: true, data: dealer })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to create dealer",
    })
  }
}

// Get all dealers
export const getAllCarDealers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const dealers = await CarDealerModel.find().exec()
    res.status(OK).json({ success: true, data: dealers })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch dealers",
    })
  }
}

// Get one dealer by ID
export const getCarDealerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const dealer = await CarDealerModel.findById(id).exec()

    if (!dealer) {
      res.status(NOT_FOUND).json({ success: false, error: "Dealer not found" })
      return
    }

    res.status(OK).json({ success: true, data: dealer })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch dealer",
    })
  }
}

// Update a dealer
export const updateCarDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const updated = await CarDealerModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).exec()

    if (!updated) {
      res.status(NOT_FOUND).json({ success: false, error: "Dealer not found" })
      return
    }

    res.status(OK).json({ success: true, data: updated })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to update dealer",
    })
  }
}

// Delete a dealer
export const deleteCarDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const deleted = await CarDealerModel.findByIdAndDelete(id).exec()

    if (!deleted) {
      res.status(NOT_FOUND).json({ success: false, error: "Dealer not found" })
      return
    }

    res.status(OK).json({ success: true, data: {} })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to delete dealer",
    })
  }
}
