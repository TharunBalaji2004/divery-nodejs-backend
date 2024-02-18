import express, { Router } from "express";
import { createCategory, deleteCategory, updateCategory } from "../controllers/inventory/category.controller";
import { createWarehouse, deleteWarehouse, updateWarehouse } from "../controllers/inventory/warehouse.controller";
import { createInventory, deleteInventory, updateInventory } from "../controllers/inventory/inventory.controller";
import { AddProduct, DeleteProduct, UpdateProduct } from "../controllers/inventory/products.controller";
import { AddItem, DeleteItem, UpdateItem } from "../controllers/inventory/items.controller";
import { CreateDelivery, DeleteDelivery, UpdateDelivery } from "../controllers/delivery/delivery.controller";

const adminRouter: Router = express.Router();

adminRouter.post("/category/create", createCategory);
adminRouter.patch("/category/update", updateCategory);
adminRouter.delete("/category/delete", deleteCategory);

adminRouter.post("/warehouse/create", createWarehouse);
adminRouter.patch("/warehouse/update", updateWarehouse);
adminRouter.delete("/warehouse/delete", deleteWarehouse);

adminRouter.post("/inventory/create", createInventory);
adminRouter.patch("/inventory/update", updateInventory);
adminRouter.delete("/inventory/delete", deleteInventory);

adminRouter.post("/items/create", AddItem);
adminRouter.patch("/items/update/:id", UpdateItem);
adminRouter.delete("/items/delete/:id", DeleteItem);

adminRouter.post("/products/create", AddProduct);
adminRouter.patch("/products/update/:id", UpdateProduct);
adminRouter.delete("/products/delete/:id", DeleteProduct);

adminRouter.post("/delivery/create", CreateDelivery);
adminRouter.patch("/delivery/update/:id", UpdateDelivery);
adminRouter.delete("/delivery/delete/:id", DeleteDelivery);

export default adminRouter;