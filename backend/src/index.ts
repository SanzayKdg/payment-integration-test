import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { PORT } from "./constant";
import dataSource from "./dataSource";
import Payments from "./routes/payment.routes";
// import { createItems } from "./seeders/seeders";
import path from "path";
const app = express();

// DB CONNECTION
dataSource
  .initialize()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

// SEEDERS
// async function createProducts() {
//   await dataSource.initialize();
//   await createItems(10);
// }
// createProducts();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Server is up & running",
  });
});

app.get("/test", function (req, res) {
  // res.sendFile(__dirname + "/src/index.html");

  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use("/api/payments", Payments);

app.listen(PORT, () => {
  console.log(`server is running on localhost://${PORT}`);
});
