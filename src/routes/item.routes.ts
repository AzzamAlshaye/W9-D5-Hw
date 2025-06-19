// src/routes/item.routes.ts
import { Router } from "express"
import {
  createItem,
  getListItems,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/item.controller"

// mergeParams: true lets us access listId from parent router
const router = Router({ mergeParams: true })

// "/" endpoint under a specific list:
//  GET  → list all items for that list
//  POST → add a new item to that list
router
  .route("/")
  .get(getListItems) // when GET /lists/:listId/items
  .post(createItem) // when POST /lists/:listId/items

// "/:id" endpoint for items in a list:
//  GET    → fetch one item
//  PUT    → update an item
//  DELETE → remove an item
router
  .route("/:id")
  .get(getItem) // when GET /lists/:listId/items/:id
  .put(updateItem) // when PUT /lists/:listId/items/:id
  .delete(deleteItem) // when DELETE /lists/:listId/items/:id

export default router
