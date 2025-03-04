import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("homePage.ejs", {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
};


let getAboutPage = (req, res) => {
    return res.render("test/aboutme.ejs");
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {

    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("Post CRUD from server", {
        dataTable: data
    });
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers();
    console.log("Data from controller: ----------------");
    console.log(data);
    console.log("Data from controller: ----------------");
    return res.render("displayCRUD.ejs", {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        //Check user data not found

        //let userData
        return res.render("editCRUD.ejs", {
            user: userData
        });
    } else {
        return res.send("User not found!");
    }

}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD

}