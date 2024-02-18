import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api.response';
import prisma from '../../utils/prisma';


export const createCategory = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Category name cannot be empty",
        })
    }

    try {
        const category = await prisma.category.findUnique({
            where: {
                name: name
            }
        });

        if (category) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            })
        }

        await prisma.category.create({
            data: {
                name: name
            }
        })

        return res.status(200).json({
            success: true,
            message: `Category: ${name} created successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const updateCategory = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({
            success: false,
            message: "Category ID and name are required",
        });
    }

    try {
        const category = await prisma.category.findUnique({
            where: {
                id: id
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        await prisma.category.update({
            where: { id: id },
            data: {
                name: name
            }
        });

        return res.status(200).json({
            success: true,
            message: `Category with ID ${id} updated successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const deleteCategory = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Category ID is required",
        });
    }

    try {
        const category = await prisma.category.findUnique({
            where: {
                id: id
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        await prisma.category.delete({
            where: { id: id }
        });

        return res.status(200).json({
            success: true,
            message: `Category with ID ${id} deleted successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}
