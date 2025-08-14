import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";

const contactRequestSchema = insertContactSchema.extend({
  recaptcha: z.string().min(1, "reCAPTCHA verification required"),
  phone: z.string().optional().refine((phone) => {
    if (!phone || phone.trim() === "") return true; // Optional field
    // Basic phone validation - allows digits, spaces, dashes, parentheses
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 7;
  }, "Please enter a valid phone number"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get reCAPTCHA configuration
  app.get("/api/config/recaptcha", (req, res) => {
    res.json({
      siteKey: process.env.CAPTCHA_SITE_KEY || null
    });
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const validatedData = contactRequestSchema.parse(req.body);
      
      // Verify reCAPTCHA with Google's API
      const recaptchaSecret = process.env.CAPTCHA_SECRET;
      if (!recaptchaSecret) {
        console.warn("CAPTCHA_SECRET not configured, skipping reCAPTCHA verification");
      } else {
        try {
          const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              secret: recaptchaSecret,
              response: validatedData.recaptcha,
              remoteip: req.ip || req.connection.remoteAddress || ''
            })
          });

          const recaptchaResult = await recaptchaResponse.json();
          
          if (!recaptchaResult.success) {
            console.error("reCAPTCHA verification failed:", recaptchaResult['error-codes']);
            return res.status(400).json({ 
              success: false, 
              message: "reCAPTCHA verification failed. Please try again." 
            });
          }
        } catch (error) {
          console.error("reCAPTCHA verification error:", error);
          return res.status(500).json({ 
            success: false, 
            message: "Verification service unavailable. Please try again later." 
          });
        }
      }

      // Remove recaptcha from data before storing
      const { recaptcha, ...contactData } = validatedData;

      // Save to database
      const contact = await storage.createContact(contactData);

      res.json({
        success: true,
        message: "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
        id: contact.id
      });
    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Please check your form data and try again.",
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again or contact us directly."
      });
    }
  });

  // Get all contacts (admin endpoint)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
