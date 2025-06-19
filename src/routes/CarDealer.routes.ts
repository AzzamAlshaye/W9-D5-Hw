// routes/CarDealer.routes.ts
import { Router } from "express"
import {
  createCarDealer,
  getAllCarDealers,
  getCarDealerById,
  updateCarDealer,
  deleteCarDealer,
} from "../controllers/CarDealer.controller"

const dealerRouter = Router()

dealerRouter.route("/").get(getAllCarDealers).post(createCarDealer)

dealerRouter
  .route("/:id")
  .get(getCarDealerById)
  .put(updateCarDealer)
  .delete(deleteCarDealer)

export default dealerRouter
