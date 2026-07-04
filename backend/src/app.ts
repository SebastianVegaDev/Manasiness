import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes.js"
import authRoutes from "./modules/auth/auth.routes.js";
import challengeRoutes from "./modules/challenges/challenges.routes.js";
import adminChallengeRoutes from "./modules/adminChallenges/adminChallenges.routes.js";
import adminTestCaseRoutes from "./modules/adminTestCases/adminTestCases.routes.js";
import submissionRoutes from "./modules/submissions/submissions.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/admin/challenges", adminChallengeRoutes);
app.use("/api/admin", adminTestCaseRoutes);
app.use("/api/submissions", submissionRoutes);

export default app;