import express from "express";
import homeController from "../controllers/homeController";


let route = express.Router();

let initWebRoutes = (app) => {
    route.get("/", homeController.getHomePage);
    route.get("/aboutme", homeController.getAboutPage);
    route.get("/crud", homeController.getCRUD);
    route.post("/post-crud", homeController.postCRUD);
    route.get("/get-crud", homeController.displayGetCRUD);

    return app.use("/", route);
}

module.exports = initWebRoutes;