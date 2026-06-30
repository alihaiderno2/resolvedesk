import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})