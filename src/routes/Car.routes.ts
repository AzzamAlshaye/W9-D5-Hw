// src/routes/Car.routes.ts
import { Router } from "express"
import {
  createCar,
  getAllCars,
  getCarsByDealer,
  getCarsByCarMake,
  getCarById,
  updateCar,
  deleteCar,
} from "../controllers/Car.controller"

// Top-level car router
const carRouter = Router()
carRouter.route("/").get(getAllCars).post(createCar)
carRouter.route("/:id").get(getCarById).put(updateCar).delete(deleteCar)

// Nested under /api/dealers/:dealerId/cars
const dealerCarsRouter = Router({ mergeParams: true })
dealerCarsRouter.route("/").get(getCarsByDealer).post(createCar)
// For nested GET by ID, use just car ID
dealerCarsRouter.route("/:id").get(getCarById).put(updateCar).delete(deleteCar)

// Nested under /api/carmakes/:carMakeId/cars
const makeCarsRouter = Router({ mergeParams: true })
makeCarsRouter.route("/").get(getCarsByCarMake).post(createCar)
// For nested GET by ID, use just car ID
makeCarsRouter.route("/:id").get(getCarById).put(updateCar).delete(deleteCar)

// Combined nested under /api/dealers/:dealerId/carmakes/:carMakeId/cars
const dealerMakeCarsRouter = Router({ mergeParams: true })
dealerMakeCarsRouter
  .route("/")
  .get(getAllCars) // could filter but for GET all nested, you may use getAllCars or a custom handler
  .post(createCar)
// For GET/PUT/DELETE by ID, only ID matters
dealerMakeCarsRouter
  .route("/:id")
  .get(getCarById)
  .put(updateCar)
  .delete(deleteCar)

export { carRouter, dealerCarsRouter, makeCarsRouter, dealerMakeCarsRouter }
