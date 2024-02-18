import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route";
import { validateToken } from "./utils/jwt.init";
import adminRouter from "./routes/admin.route";

const app: Express = express();
const port: number = 8000;

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/admin", validateToken, adminRouter);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json("DIVery Backend API")
})

app.get("*", (req: Request, res: Response) => {
  res.status(404).json("Invalid Route")
})

app.listen(port, async () => {
  console.log(`[server] Server listening at port: ${port}`);
});
