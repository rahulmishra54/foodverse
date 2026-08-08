import userModel from "../models/user.models.js";
import jwt from "jsonwebtoken";

async function authUserMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) {
        return res.status(401).json({
            message: "Please login first",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        req.user = user;
        req.foodPartner = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}

async function optionalAuthUserMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = req.cookies?.token || tokenFromHeader;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (user) {
            req.user = user;
            req.foodPartner = user;
        }
    } catch (err) {
        // ignore invalid token and continue as guest
    }

    next();
}

export { authUserMiddleware, optionalAuthUserMiddleware };