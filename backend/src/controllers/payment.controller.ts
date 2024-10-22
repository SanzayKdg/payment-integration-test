import { NextFunction, Request, Response } from "express";
import { SERVER } from "../constant";
import dataSource from "../dataSource";
import { Items } from "../entities/item.entity";
import { Orders } from "../entities/order.entity";
import { Payments } from "../entities/payment.entity";
import { PaymentMethod, PaymentStatus } from "../types/order.types";
import { getEsewaPaymentHash, verifyEsewaPayment } from "./esewa.controller";
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} from "./khalti.controller";

const initialize_payment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, total_amount, website_url, payment_method } = req.body;

    // check if items exists

    await items.map(async ({ id }) => {
      const item = await dataSource.getRepository(Items).findOneBy({ id });

      if (!item) {
        return next(
          res.status(404).json({
            success: false,
            message: "Item not found or removed",
          })
        );
      }
    });

    // create an order
    const order = await dataSource.getRepository(Orders).save({
      items,
      payment_method,
      total_amount,
    });

    // remove this in production
    let payment = null;

    // initiate payment
    if (payment_method === PaymentMethod.khalti) {
      // initiate khalti payment
      payment = await initiateKhaltiPayment({
        amount: order.total_amount * 100,
        purchase_order_id: order.id,
        purchase_order_name: "Test",
        return_url: `${SERVER.backend}/api/payments/complete-khalti-payment`,
        website_url,
      });
    } else if (payment_method === PaymentMethod.esewa) {
      // initiate esewa payment
      payment = await getEsewaPaymentHash({
        amount: order.total_amount,
        transaction_uuid: order.id,
      });
    }

    res.status(201).json({
      success: true,
      //   remove this in production
      order,
      payment,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// complete Khalti payment
const complete_payment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      pidx,
      txnId,
      amount,
      mobile,
      purchase_order_id,
      order_name,
      transaction_id,
    } = req.query;

    // check if payment is completed and details are correct
    const paymentInfo: any = await verifyKhaltiPayment(pidx);
    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return next(
        res.status(404).json({
          success: false,
          message: "Incomplete information",
          paymentInfo,
        })
      );
    }

    // check if order exists
    const order = await dataSource.getRepository(Orders).findOne({
      where: {
        id: String(purchase_order_id),
        total_amount: Number(amount) / 100,
      },
    });

    if (!order) {
      return next(
        res.status(404).json({
          success: false,
          message: "Order not found.",
        })
      );
    }

    // create a new payment
    await dataSource.getRepository(Payments).save({
      pidx,
      transaction_id: String(transaction_id),
      items: order.items,
      amount: Number(amount) / 100,
      data_from_verification_req: paymentInfo,
      api_query_from_user: req.query,
      payment_gateway: PaymentMethod.khalti,
      payment_status: PaymentStatus.completed,
    });

    // updating the order
    order.payment_status = PaymentStatus.completed;
    await dataSource.getRepository(Orders).save(order);

    res.status(201).json({
      success: true,
      message: "Payment Successful",
      // remove it in production
      paymentInfo,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// complete Esewa payment
const completeEsewaPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data }: any = req.query;

    // verify payment with esewa
    const paymentInfo = await verifyEsewaPayment(data);

    // check if order exists
    const order = await dataSource.getRepository(Orders).findOne({
      where: {
        id: String(paymentInfo.response.transaction_uuid),
      },
    });

    if (!order) {
      return next(
        res.status(404).json({
          success: false,
          message: "Order not found.",
        })
      );
    }

    // create new payment
    await dataSource.getRepository(Payments).save({
      pidx: paymentInfo.decoded_data.transaction_code,
      transaction_id: paymentInfo.decoded_data.transaction_code,
      items: order.items,
      amount: Number(order.total_amount),
      data_from_verification_req: paymentInfo,
      api_query_from_user: req.query,
      payment_gateway: PaymentMethod.esewa,
      payment_status: PaymentStatus.completed,
    });

    // updating the order
    order.payment_status = PaymentStatus.completed;
    await dataSource.getRepository(Orders).save(order);

    res.status(201).json({
      success: true,
      message: "Payment Successful",
      // remove it in production
      paymentInfo,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export { complete_payment, completeEsewaPayment, initialize_payment };
