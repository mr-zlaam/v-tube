import mongoose from "mongoose";
import { MONGO_URI } from "../config";
import { DB_NAME } from "../CONSTANTS";
export const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(`
                  *************************************************
                          Database connected successfully!!
                  *************************************************
    `);
    });
    await mongoose.connect(`${MONGO_URI}/${DB_NAME}` || "");
  } catch (error: any) {
    console.error(`Error While connecting to the database::${error.message}`);
    process.exit(1);
  }
};
