import express from "express";

import chatbotController from "../controllers/chatbotController";

const router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", chatbotController.getHomePage);

    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);

    router.post("/train-chat-bot", chatbotController.trainChatbot);

    router.get("/setup-profile", chatbotController.setupProfile);

    router.get("/score-table/:senderID", chatbotController.handleScoreTable);
    router.post("/score-table", chatbotController.handlePostScoreTable);

    return app.use("/", router);
}

module.exports = initWebRoutes;