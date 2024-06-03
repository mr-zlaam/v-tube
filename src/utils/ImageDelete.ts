import { unlinkSync } from "node:fs";

export const DeleteImageFromLocalServer = (localFilePath: string) => {
  try {
    return localFilePath.trim() !== "" && unlinkSync(localFilePath);
  } catch (error: any) {
    console.log(error.message);
    throw {
      status: 500,
      message: "Unable to delete files from local server!!",
    };
  }
};
