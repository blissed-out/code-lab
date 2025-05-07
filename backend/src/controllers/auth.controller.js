import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHanlder.js";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/index.js";
import ApiResponse from "../utils/api-response.js";

const register = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        const data = {
            email: existingUser.email,
        };

        return res
            .status(401)
            .json(new ApiResponse(401, data, "User already registered"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: Role.USER,
        },
    });

    const token = jwt.sign(newUser.id, process.env.JWT_SECRET_KEY, {
        algorithm: "RS256",
    });

    res.cookie("token", token);



    const data = {
        name: newUser.name,,
        email: newUser.email,
    };

    res.status(200).json(
        new ApiResponse(200, data, "user registered successfully")
    );

});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
});

const logout = (req, res) => {};

export { register, login, logout };
