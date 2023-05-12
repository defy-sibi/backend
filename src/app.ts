import express, { Express } from "express";
import apiRoutes from "./routes/api";


const app: Express = express();
const port = 3000;

// Middlewares
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
