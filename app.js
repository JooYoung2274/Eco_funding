import express from "express";
import "express-async-errors";
import { connect } from "./schemas/index.js";
import router from "./router/index.js";
// import { connectDB } from "./model/database.js";
import cors from "cors";
const port = 3000;
const app = express();
// const corsOptions = {
//   origin: "Eco_funding domain",
//   optionsSuccessStatus: 200,
// };

// test
app.use(express.json());
app.use("/api", router);
app.use(express.static("uploads"));
app.use(cors()); // 빈칸으로 두면 모든 요청 허용

import swaggerUi from "swagger-ui-express";

// import swaggerFile from "./swagger-output.json";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerFile = require("./configuration/swagger-output.json");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

connect();
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
