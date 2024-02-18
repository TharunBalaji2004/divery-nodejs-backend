import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api.response';
import prisma from '../../utils/prisma';

export const AddProduct = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { name, description, category_id, expiry_date, perishable, damaged, damage_description } = req.body;

    if (!name || !category_id) {
        return res.status(400).json({
            success: false,
            message: "Product Name or Category cannot be empty",
        });
    }

    const category = await prisma.category.findUnique({
        where: {
            id: category_id
        }
    });

    if (!category) {
        return res.status(400).json({
            success: false,
            message: "Category does not exist",
        });
    }

    try {
        await prisma.products.create({
            data: {
                name, description, category_id, expiry_date, perishable, damaged, damage_description
            }
        });

        return res.status(200).json({
            success: true,
            message: `New Product: ${name} at category: ${category.name} added successfully`,
        });

    } catch(err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const UpdateProduct = async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = Number.parseInt(req.params.id);
    const { name, description, category_id, expiry_date, perishable, damaged, damage_description } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required",
        });
    }

    try {
        const product = await prisma.products.findUnique({
            where: {
                id: id
            },
            include: {
                category: true
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        const updateData: any = {};
        if (name !== undefined) {
            updateData.name = name;
        }
        if (description !== undefined) {
            updateData.description = description;
        }
        if (category_id !== undefined) {
            const category = await prisma.category.findUnique({
                where: {
                    id: category_id
                }
            });

            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: `Category with ID ${category_id} does not exist`,
                });
            }

            updateData.category_id = category_id;
        }
        if (expiry_date !== undefined) {
            updateData.expiry_data = expiry_date;
        }
        if (perishable !== undefined) {
            updateData.perishable = perishable;
        }
        if (damaged !== undefined) {
            updateData.damaged = damaged;
        }
        if (damage_description !== undefined) {
            updateData.damage_description = damage_description;
        }

        await prisma.products.update({
            where: { id: id },
            data: updateData
        });

        return res.status(200).json({
            success: true,
            message: `Product with ID ${id} updated successfully`,
        });

    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const DeleteProduct = async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = Number.parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required",
        });
    }

    try {
        const product = await prisma.products.findUnique({
            where: {
                id: id
            }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        await prisma.products.delete({
            where: { id: id }
        });

        return res.status(200).json({
            success: true,
            message: `Product with ID ${id} deleted successfully`,
        });

    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}
