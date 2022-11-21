import express from "express";
import res from "express/lib/response";

import chatbotController from "../controllers/chatbotController";

const router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", chatbotController.getHomePage);

    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);


    return app.use("/", router);
}

module.exports = initWebRoutes;