import mongoose, { Schema } from "mongoose";
import { SubscriptionModelTypes } from "./subscription.types";

const subscriptionSchema = new Schema<SubscriptionModelTypes>(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //one who is subscirbing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //one whose channel has been subscribed.
      ref: "User",
    },
  },
  { timestamps: true }
);
export const Subscription = mongoose.model<SubscriptionModelTypes>(
  "Subscription",
  subscriptionSchema
);
