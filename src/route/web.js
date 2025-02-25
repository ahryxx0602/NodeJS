import express from "express";
import homeController from "../controllers/homeController";


let route = express.Router();

let initWebRoutes = (app) => {
    route.get("/", homeController.getHomePage);
    route.get("/aboutme", homeController.getAboutPage);

    return app.use("/", route);
}

module.exports = initWebRoutes;