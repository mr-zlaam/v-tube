import { Document, Schema } from "mongoose";

export interface SubscriptionModelTypes extends Document {
  subscriber: Schema.Types.ObjectId;
  channel: Schema.Types.ObjectId;
}
