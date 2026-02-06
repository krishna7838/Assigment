import express from "express";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FarmLokal Backend Running 🚀");
});

app.use("/auth", authRoutes);

export default app;
