import express from "express";
import {
  complete_payment,
  completeEsewaPayment,
  initialize_payment,
} from "../controllers/payment.controller";

const router = express.Router();

router.route("/initiate-payment").post(initialize_payment);
router.route("/complete-khalti-payment").get(complete_payment);
router.route("/complete-payment").get(completeEsewaPayment);

export default router;
