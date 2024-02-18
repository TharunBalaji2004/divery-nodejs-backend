import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api.response';
import prisma from '../../utils/prisma';

export const AddItem = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { inventory_id, product_id, quantity } = req.body;

    try {
        const inventory = await prisma.inventory.findUnique({ where: { id: inventory_id } });
        const product = await prisma.products.findUnique({ where: { id: product_id } });

        if (!inventory || !product) {
            return res.status(404).json({
                success: false,
                message: "Inventory or Product not found",
            });
        }

        await prisma.inventoryItems.create({
            data: {
                inventory_id,
                product_id,
                quantity
            }
        });

        return res.status(200).json({
            success: true,
            message: "Inventory item added successfully",
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const UpdateItem = async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = Number.parseInt(req.params.id);
    const { quantity } = req.body;

    try {
        const inventoryItem = await prisma.inventoryItems.findUnique({ where: { id } });

        if (!inventoryItem) {
            return res.status(404).json({
                success: false,
                message: "Inventory item not found",
            });
        }

        // Update the inventory item
        await prisma.inventoryItems.update({
            where: { id },
            data: { quantity }
        });

        return res.status(200).json({
            success: true,
            message: "Inventory item updated successfully",
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const DeleteItem = async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = Number.parseInt(req.params.id);

    try {
        const inventoryItem = await prisma.inventoryItems.findUnique({ where: { id } });

        if (!inventoryItem) {
            return res.status(404).json({
                success: false,
                message: "Inventory item not found",
            });
        }

        await prisma.inventoryItems.delete({ where: { id } });

        return res.status(200).json({
            success: true,
            message: "Inventory item deleted successfully",
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}
