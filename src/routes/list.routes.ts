// src/routes/list.routes.ts
import { Router } from "express"
import {
  createList,
  getLists,
  getList,
  updateList,
  deleteList,
} from "../controllers/list.controller"

const router = Router()

// "/" endpoint:
//  GET  → list all lists
//  POST → create a new list
router
  .route("/")
  .get(getLists) // when GET /lists
  .post(createList) // when POST /lists

// "/:id" endpoint:
//  GET    → fetch one list (with its items)
//  PUT    → update a list
//  DELETE → remove a list (and its items)
router
  .route("/:id")
  .get(getList) // when GET /lists/:id
  .put(updateList) // when PUT /lists/:id
  .delete(deleteList) // when DELETE /lists/:id

export default router
