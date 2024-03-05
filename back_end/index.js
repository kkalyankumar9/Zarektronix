const express = require("express");

const { connection } = require("./db");
const { userRoutes } = require("./routes/userRoutes");


const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());


app.use("/users", userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("DB connected");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
