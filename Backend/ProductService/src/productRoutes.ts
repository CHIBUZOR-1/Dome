// Backend/ProductService/src/productRoutes.ts
import express from 'express';
const productRouter = express.Router();
import { verifyToken, isAdminz } from "@shared/Tokens";