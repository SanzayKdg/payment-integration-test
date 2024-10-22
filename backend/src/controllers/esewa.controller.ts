import axios from "axios";
import crypto from "crypto";
import { ESEWA } from "../constant";

const getEsewaPaymentHash = async ({ amount, transaction_uuid }) => {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA.product_code}`;

    const secretKey = ESEWA.secret_key;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    return {
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const verifyEsewaPayment = async (encodedData: any) => {
  try {
    // decoding base64 code received from esewa
    let decoded_data: any = atob(encodedData);
    decoded_data = await JSON.parse(decoded_data);
    // let headerList = {
    //   Accept: "application/json",
    //   "Content-Type": "application/json",
    // };

    const data = `transaction_code=${decoded_data.transaction_code},status=${decoded_data.status},total_amount=${decoded_data.total_amount},transaction_uuid=${decoded_data.transaction_uuid},product_code=${ESEWA.product_code},signed_field_names=${decoded_data.signed_field_names}`;

    const secret_key = ESEWA.secret_key;

    const hash = crypto
      .createHmac("sha256", secret_key)
      .update(data)
      .digest("base64");

    console.log("hash", hash);
    console.log("decoded_data signature", decoded_data.signature);

    // let reqOptions = {
    //   url: `${ESEWA.gateway_url}/api/epay/transaction/status/?product_code=${ESEWA.product_code}&total_amount=${decoded_data.total_amount}&transaction_uuid=${decoded_data.transaction_uuid}`,
    //   method: "GET",
    //   header: headerList,
    // };

    if (hash !== decoded_data.signature) {
      throw { message: "Invalid signature", decoded_data };
    }

    const response: any = await axios.get(
      `${ESEWA.gateway_url}/api/epay/transaction/status/?product_code=${ESEWA.product_code}&total_amount=${decoded_data.total_amount}&transaction_uuid=${decoded_data.transaction_uuid}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decoded_data.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decoded_data.total_amount)
    ) {
      throw { message: "Invalid payment", decoded_data };
    }

    return { response: response.data, decoded_data };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { getEsewaPaymentHash, verifyEsewaPayment };
