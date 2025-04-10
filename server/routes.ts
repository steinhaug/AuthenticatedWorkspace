// Updated for GitHub sync
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import * as schema from "@shared/schema";
import { resetPasswordSchema, updatePasswordSchema } from "@shared/schema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { hashPassword } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = await resetPasswordSchema.parseAsync(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      await storage.updateUser(user.id, {
        resetToken: token,
        resetTokenExpiry: expiry,
      });

      // In a real app, send email here
      // For now just return the token
      res.json({ message: "Password reset email sent", token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, password } = await updatePasswordSchema.parseAsync(req.body);
      
      // Search for user with the given reset token
      const users = await db.select().from(schema.users).where(eq(schema.users.resetToken, token));
      const user = users[0];

      if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      await storage.updateUser(user.id, {
        password: await hashPassword(password),
        resetToken: null,
        resetTokenExpiry: null,
      });

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/profile/avatar", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const avatarUrl = req.body.avatarUrl;
      if (!avatarUrl) {
        return res.status(400).json({ message: "Avatar URL is required" });
      }

      const updatedUser = await storage.updateUser(req.user!.id, {
        avatarUrl,
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update avatar" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

