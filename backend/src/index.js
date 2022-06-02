const express = require("express");
var bodyParser = require("body-parser");
const { connectMongoDB } = require("./db/connect");
const cors = require("cors");

const AuthRoute = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const main = async () => {
  const app = express();
  const port = process.env.PORT || "4000";
  connectMongoDB();
  app.use(cors({}));
  app.use(express.json());

  app.get("/", function (req, res) {
    res.send("Server is up and running");
  });

  app.use("/api/auth", AuthRoute);
  app.use("/api/upload", uploadRoute);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.json({ extended: false }));

  app.listen(port, () => {
    console.log("Server Running at port", port);
  });
};

main();
