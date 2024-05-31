import { app } from "../app";
import { PORT } from "../config";
import { connectDB } from "../db";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` 😋 Server is running at PORT::http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error(
      "DataBase is connected but unable to work with express::",
      err
    );
  });
