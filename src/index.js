import express from "express";
import bodyParser from "body-parser";

import viewEngine from "./configs/viewEngine";
import initWebRouter from "./routes/web";

require("dotenv").config();

const app = express();

viewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRouter(app);

const port = process.env.PORT || 8000


app.listen(port, () => {
    console.log("jsfklsjfkls " + port);
})