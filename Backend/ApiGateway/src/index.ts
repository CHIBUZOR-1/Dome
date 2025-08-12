// Backend/ApiGateway/src/index.ts
import express, { Application, Request, Response } from "express";
import path from "path";
import helmet from "helmet";
import morgan from 'morgan';
import cors from "cors";
import dotenv from 'dotenv';
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ===== Rate Limiting =====
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 1000, // limit each IP to 1000 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// ===== API Proxies to Microservices =====
// Example: /api/users → UserService
app.use(
  "/api/users",
  createProxyMiddleware({
    target: "http://localhost:5100", // UserService
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" }, 
  })
);

app.use(
  "/api/cart",
  createProxyMiddleware({
    target: process.env.CSERVICE, // CartService
    changeOrigin: true,
  })
);

app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.PSERVICE, // ProductService
    changeOrigin: true,
  })
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.OSERVICE, // OrderService
    changeOrigin: true,
  })
);

// ===== Serve Frontend =====
const frontendPath = path.join(__dirname, "../../../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

// ===== Start Gateway =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
