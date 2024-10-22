import axios from "axios";
import { KHALTI } from "../constant";

// function to verify khalti payment
const verifyKhaltiPayment = async (pidx: any) => {
  const bodyContent = JSON.stringify({ pidx });

  try {
    const { data } = await axios.post(
      `${KHALTI.gateway_uri}/epayment/lookup/`,
      bodyContent,
      {
        headers: {
          Authorization: `Key ${KHALTI.secret_key}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    console.log(`Error while verifying khalti payment: ${err}`);
    throw err;
  }
};

// function to initiate khalti payment
const initiateKhaltiPayment = async (details: any) => {
  const bodyContent = JSON.stringify(details);

  try {
    const { data } = await axios.post(
      `${KHALTI.gateway_uri}/epayment/initiate/`,
      bodyContent,
      {
        headers: {
          Authorization: `Key ${KHALTI.secret_key}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    console.log(`Error while initiating khalti payment: ${err}`);
    throw err;
  }
};

export { initiateKhaltiPayment, verifyKhaltiPayment };
