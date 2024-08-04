import { Request, Response, NextFunction } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.FRONT_END_URL
);

export const createToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;

    const response = await oauth2Client.getToken({
      code: credential,
    });
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
