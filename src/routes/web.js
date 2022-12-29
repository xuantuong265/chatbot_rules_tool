import express from "express";

import chatbotController from "../controllers/chatbotController";

const router = express.Router();

const initWebRoutes = (app) => {
    router.get("/", chatbotController.getHomePage);

    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);

    router.get("/train-chat-bot", chatbotController.trainChatbot);
    router.get("/write-chat-bot", chatbotController.writeChatbot);

    router.get("/setup-profile", chatbotController.setupProfile);

    router.get("/score-table/:senderID", chatbotController.handleScoreTable);
    router.post("/score-table", chatbotController.handlePostScoreTable);

    router.get("/learn-rest/:senderID", chatbotController.handleLearnRest);
    router.post("/learn-rest", chatbotController.handlePostLearnRest);

    router.get("/subject-studing/:senderID", chatbotController.handleSubjectStuding);
    router.post("/subject-studing", chatbotController.handlePostSubjectStuding);

    router.get("/unlearned-subjects/:senderID", chatbotController.handleUnlearnedSubjects);
    router.post("/unlearned-subjects", chatbotController.handlePostUnlearnedSubjects);

    router.get("/debt-courses/:senderID", chatbotController.handleDebtCourses);
    router.post("/debt-courses", chatbotController.handlePostDebtCourses);

    router.get("/total-tuition-fee/:senderID", chatbotController.handleTotalTuitionFee);
    router.post("/total-tuition-fee", chatbotController.handlePostTotalTuitionFee);

    router.get("/unpaid-tuition-fees/:senderID", chatbotController.handleUnpaidTuitionFees);
    router.post("/unpaid-tuition-fees", chatbotController.handlePostUnpaidTuitionFees);

    router.get("/tuition-fee-paid/:senderID", chatbotController.handleTuitionFeePaid);
    router.post("/tuition-fee-paid", chatbotController.handlePostTuitionFeePaid);

    router.get("/unpaid-course-fees/:senderID", chatbotController.handleUnpaidCourseFees);
    router.post("/unpaid-course-fees", chatbotController.handlePostUnpaidCourseFees);

    router.get("/semester-fee/:senderID", chatbotController.handleFeesUnstudiedSemesters);
    router.post("/semester-fee", chatbotController.handlePostFeesUnstudiedSemesters);

    return app.use("/", router);
}

module.exports = initWebRoutes;