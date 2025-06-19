// routes/CarMake.routes.ts
import { Router } from "express"
import {
  createCarMake,
  getAllCarMakes,
  getCarMakeById,
  updateCarMake,
  deleteCarMake,
} from "../controllers/CarMake.controller"

const makeRouter = Router()

makeRouter.route("/").get(getAllCarMakes).post(createCarMake)

makeRouter
  .route("/:id")
  .get(getCarMakeById)
  .put(updateCarMake)
  .delete(deleteCarMake)

export default makeRouter
