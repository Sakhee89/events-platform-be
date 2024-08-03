import { Request, Response, NextFunction } from "express";
import supabaseClient from "../config/supabaseConfig";

export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.status(403).json({ message: "Not authorised" });
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decodeValue = await supabaseClient.auth.getUser(token);

    if (decodeValue) {
      next();
      return;
    }

    res.status(403).json({ message: "Not authorised" });
    return;
  } catch (error) {
    console.log("error", error);

    if ((error as { code: string }).code === "auth/argument-error") {
      res.status(403).json({ message: "Not authorised" });
      return;
    }

    res.status(500).json({ message: "Internal Error" });
    return;
  }
};
