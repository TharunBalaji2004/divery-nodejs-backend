import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/api.response';
import prisma from '../../utils/prisma';

export const CreateDelivery = async (req: Request, res: Response<ApiResponse<null>>) => {
    const { agent_id, product_id, delivery_date, priority, customer_name, customer_phno, delivery_status } = req.body;

    try {
        const agent = await prisma.deliveryAgent.findUnique({ where: { id: agent_id } });
        const product = await prisma.products.findUnique({ where: { id: product_id } });

        if (!agent || !product) {
            return res.status(404).json({
                success: false,
                message: "Agent or Product not found",
            });
        }

        await prisma.delivery.create({
            data: {
                agent_id,
                product_id,
                delivery_date,
                priority,
                customer_name,
                customer_phno,
                delivery_status
            }
        });

        return res.status(200).json({
            success: true,
            message: "Delivery created successfully",
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const UpdateDelivery = async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = Number.parseInt(req.params.id);
    const { delivery_date, priority, customer_name, customer_phno, delivery_status } = req.body;

    try {
        const delivery = await prisma.delivery.findUnique({ where: { id } });

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found",
            });
        }

        await prisma.delivery.update({
            where: { id },
            data: {
                delivery_date,
                priority,
                customer_name,
                customer_phno,
                delivery_status
            }
        });

        return res.status(200).json({
            success: true,
            message: "Delivery updated successfully",
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}

export const DeleteDelivery = async (req: Request, res: Response<ApiResponse<null>>) => {
    const id = Number.parseInt(req.params.id);

    try {
        const delivery = await prisma.delivery.findUnique({ where: { id } });

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found",
            });
        }

        await prisma.delivery.delete({ where: { id } });

        return res.status(200).json({
            success: true,
            message: "Delivery deleted successfully",
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Error occurred: " + err.message
        });
    }
}
