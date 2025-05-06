import { db } from "../libs/db.js";

const register = async (req, res) => {
    // get data
    // validate data
    // save data to database

    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(200).json({
            sucess: false,
            message: "This is not working well for now",
        });
    }

    //validation done
};

export { register, login, logout };
