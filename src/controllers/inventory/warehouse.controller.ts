import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api.response';
import prisma from '../../utils/prisma';


export const createWarehouse = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).json({
            success: false,
            message: "Warehouse name or location cannot be empty",
        })
    }

    try {
        await prisma.warehouse.create({
            data: {
                name: name,
                location: location
            }
        })

        return res.status(200).json({
            success: true,
            message: `Warehouse: ${name} at ${location} created successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const updateWarehouse = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { id, name, location } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Warehouse ID are required",
        });
    }

    try {
        const warehouse = await prisma.warehouse.findUnique({
            where: {
                id: id
            }
        });

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found",
            })
        }

        const dataToUpdate: { name?: string; location?: string } = {};
        if (name !== undefined) {dataToUpdate.name = name;}
        if (location !== undefined) {dataToUpdate.location = location;}

        await prisma.warehouse.update({
            where: { id: id },
            data: dataToUpdate
        });

        return res.status(200).json({
            success: true,
            message: `Warehouse with ID ${id} updated successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const deleteWarehouse = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Warehouse ID is required",
        });
    }

    try {
        const warehouse = await prisma.warehouse.findUnique({
            where: {
                id: id
            }
        });

        if (!warehouse) {
            return res.status(404).json({
                success: false,
                message: "Warehouse not found",
            })
        }

        await prisma.warehouse.delete({
            where: { id: id }
        });

        return res.status(200).json({
            success: true,
            message: `Warehouse with ID ${id} deleted successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}
