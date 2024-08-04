import { Request, Response } from "express";
import mongoose from "mongoose";
import supabaseClient from "../config/supabaseConfig";
import { extractTokenFromAuthorization } from "../utils/extractTokenFromAuthorization";
import userSchema from "../models/userSchema";
import eventSchema from "../models/eventSchema";
import stripe from "../config/stripeConfig";

export const eventPayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const authToken = extractTokenFromAuthorization(req.headers.authorization!);
    const decodeValue = await supabaseClient.auth.getUser(authToken);
    const userId = decodeValue.data.user?.id;

    const user = await userSchema.findOne({
      uid: userId,
    });

    if (!user) {
      res.status(403).json({ msg: "User is not authorised" });
      return;
    }

    const _id = new mongoose.Types.ObjectId(id);
    const event = await eventSchema.findOne({
      _id,
    });

    if (!event) {
      res.status(404).json({ msg: "Event is not found" });
      return;
    }

    const eventPrice = event.price * 100;


    const paymentIntent = await stripe.paymentIntents.create({
      amount: eventPrice,
      currency: "GBP",
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
