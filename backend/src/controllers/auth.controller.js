// import { db } from "../libs/db.js";

const register = async (req, res) => {
    // const { name, email, password } = req.body;
    res.status(200).json({
        success: true,
        message: "hi",
    });

    // if (!name || !email || !password) {
    //     res.status(400).json({
    //         success: false,
    //         message: "All fields are required",
    //     });
    // }
};

export { register };
