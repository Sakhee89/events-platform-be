import { Request, Response, NextFunction } from "express";
import admin from "../config/firebaseConfig";

class Middleware {
  decodeToken = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      res.status(403).json({ message: "Not authorised" });
      return;
    }
    const token = req.headers.authorization?.split(" ")[1];

    console.log("token:", token);

    try {
      const decodeValue = await admin.auth().verifyIdToken(token);

      if (decodeValue) {
        next();
        return;
      }

      return res.status(403).json({ message: "Not authorised" });
    } catch (error) {
      console.log("error", error);

      if ((error as { code: string }).code === "auth/argument-error") {
        return res.status(403).json({ message: "Not authorised" });
      }

      return res.status(500).json({ message: "Internal Error" });
    }
  };

  decodeTokenIsUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.headers.authorization) {
      res.status(403).json({ message: "Not authorised" });
      return;
    }
    const token = req.headers.authorization?.split(" ")[1];

    console.log("token:", token);

    try {
      const decodeValue = await admin.auth().verifyIdToken(token);

      if (decodeValue) {
        const { firebaseUid } = req.body;

        if (decodeValue.uid !== firebaseUid) {
          res.status(403).json({ message: "Not authorised" });
          return;
        }

        next();
        return;
      }

      return res.status(403).json({ message: "Not authorised" });
    } catch (error) {
      console.log("error", error);

      if ((error as { code: string }).code === "auth/argument-error") {
        return res.status(403).json({ message: "Not authorised" });
      }

      return res.status(500).json({ message: "Internal Error" });
    }
  };
}

export default new Middleware();
