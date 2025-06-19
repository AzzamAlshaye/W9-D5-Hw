// src/controllers/Car.controller.ts
import { Request, Response } from "express"
import { CarModel } from "../models/Car.schema"
import { CarDealerModel } from "../models/CarDealer.schema"
import { CarMakeModel } from "../models/CarMake.schema"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new car
export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const dealerId = req.body.dealerId ?? req.params.dealerId
    const carMakeId = req.body.carMakeId ?? req.params.carMakeId
    const { name, price, year, color, wheelsCount } = req.body

    // Validate required fields
    if (
      !dealerId ||
      !carMakeId ||
      !name ||
      price == null ||
      year == null ||
      !color ||
      wheelsCount == null
    ) {
      res.status(BAD_REQUEST).json({
        success: false,
        error:
          "dealerId, carMakeId, name, price, year, color, and wheelsCount are all required",
      })
      return
    }

    // Verify referenced Dealer exists
    if (!(await CarDealerModel.exists({ _id: dealerId }))) {
      res.status(NOT_FOUND).json({
        success: false,
        error: `No dealer found with id ${dealerId}`,
      })
      return
    }

    // Verify referenced CarMake exists
    if (!(await CarMakeModel.exists({ _id: carMakeId }))) {
      res.status(NOT_FOUND).json({
        success: false,
        error: `No car make found with id ${carMakeId}`,
      })
      return
    }

    // All good — create the car
    const car = await CarModel.create({
      dealerId,
      carMakeId,
      name,
      price,
      year,
      color,
      wheelsCount,
    })

    res.status(CREATED).json({ success: true, data: car })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to create car",
    })
  }
}

// Get all cars
export const getAllCars = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const cars = await CarModel.find().exec()
    res.status(OK).json({ success: true, data: cars })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch cars",
    })
  }
}

// Get cars by dealer ID
export const getCarsByDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { dealerId } = req.params
    if (!dealerId) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "dealerId parameter is required" })
      return
    }

    const cars = await CarModel.find({ dealerId }).exec()
    if (cars.length === 0) {
      res.status(NOT_FOUND).json({
        success: false,
        error: `No cars found for dealerId ${dealerId}`,
      })
      return
    }

    res.status(OK).json({ success: true, data: cars })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch cars by dealer",
    })
  }
}

// Get cars by carMake ID
export const getCarsByCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { carMakeId } = req.params
    if (!carMakeId) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "carMakeId parameter is required" })
      return
    }

    const cars = await CarModel.find({ carMakeId }).exec()
    if (cars.length === 0) {
      res.status(NOT_FOUND).json({
        success: false,
        error: `No cars found for carMakeId ${carMakeId}`,
      })
      return
    }

    res.status(OK).json({ success: true, data: cars })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch cars by car make",
    })
  }
}

// Get a single car by ID
export const getCarById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const car = await CarModel.findById(id).exec()
    if (!car) {
      res.status(NOT_FOUND).json({ success: false, error: "Car not found" })
      return
    }
    res.status(OK).json({ success: true, data: car })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to fetch car",
    })
  }
}

// Update an existing car
export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updated = await CarModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).exec()

    if (!updated) {
      res.status(NOT_FOUND).json({ success: false, error: "Car not found" })
      return
    }

    res.status(OK).json({ success: true, data: updated })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to update car",
    })
  }
}

// Delete a car
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const deleted = await CarModel.findByIdAndDelete(id).exec()
    if (!deleted) {
      res.status(NOT_FOUND).json({ success: false, error: "Car not found" })
      return
    }
    res.status(OK).json({ success: true, data: {} })
  } catch (err: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: err.message || "Failed to delete car",
    })
  }
}
