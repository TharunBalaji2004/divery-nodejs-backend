import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api.response';
import prisma from '../../utils/prisma';

export const createInventory = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { name, warehouse_id } = req.body;

    if (!name || !warehouse_id) {
        return res.status(400).json({
            success: false,
            message: "Warehouse ID or Inventory name cannot be empty",
        })
    }

    const warehouse = await prisma.warehouse.findUnique({
        where: {
            id: Number.parseInt(warehouse_id)
        }
    })

    if (!warehouse) {
        return res.status(400).json({
            success: false,
            message: `Warehouse ID: ${warehouse_id} doest not exists`,
        })
    }

    try {
        await prisma.inventory.create({
            data: {
                name: name,
                warehouse_id: warehouse_id
            }
        })

        return res.status(200).json({
            success: true,
            message: `Inventory Name: ${name} at Warehouse: ${warehouse.name} created successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const updateInventory = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { id, name, warehouse_id } = req.body;

    if (!id || (!name && !warehouse_id)) {
        return res.status(400).json({
            success: false,
            message: "Inventory ID and at least one of name or warehouse ID are required",
        });
    }

    try {
        const inventory = await prisma.inventory.findUnique({
            where: {
                id: Number.parseInt(id)
            },
            include: {
                warehouse: true
            }
        });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found",
            })
        }

        const updateData: { name?: string; warehouse_id?: number } = {};
        if (name !== undefined) {
            updateData.name = name;
        }
        if (warehouse_id !== undefined) {
            const warehouse = await prisma.warehouse.findUnique({
                where: {
                    id: Number.parseInt(warehouse_id)
                }
            });

            if (!warehouse) {
                return res.status(400).json({
                    success: false,
                    message: `Warehouse ID: ${warehouse_id} does not exist`,
                });
            }

            updateData.warehouse_id = Number.parseInt(warehouse_id);
        }

        await prisma.inventory.update({
            where: { id: Number.parseInt(id) },
            data: updateData
        });

        return res.status(200).json({
            success: true,
            message: `Inventory with ID ${id} updated successfully`,
        });

    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const deleteInventory = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Inventory ID is required",
        });
    }

    try {
        const inventory = await prisma.inventory.findUnique({
            where: {
                id: Number.parseInt(id)
            }
        });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found",
            })
        }

        await prisma.inventory.delete({
            where: { id: Number.parseInt(id) }
        });

        return res.status(200).json({
            success: true,
            message: `Inventory with ID ${id} deleted successfully`,
        });

    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}
