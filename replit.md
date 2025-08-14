# Overview

This is a full-stack web application built with React, Express, and PostgreSQL. The application appears to be a modern web platform featuring a contact form system with a professional landing page. It uses TypeScript throughout for type safety and follows modern development practices with a clean separation between client and server code.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured error handling and request logging
- **Middleware**: Custom logging middleware for API requests with response capture

## Database Design
- **Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Tables**: Users table for authentication and contacts table for form submissions
- **Data Validation**: Zod schemas shared between client and server for consistent validation

## Development Workflow
- **Build System**: Vite for frontend bundling with React plugin
- **Development Server**: Hot module replacement with Vite dev server
- **Production Build**: ESBuild for server bundling, Vite for client assets
- **Type Checking**: Strict TypeScript configuration with path mapping

## Project Structure
- **Monorepo Layout**: Client, server, and shared code in separate directories
- **Shared Types**: Common schemas and types in shared directory
- **Asset Management**: Centralized asset handling with Vite aliases
- **Environment Config**: Database URL and other environment variables

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database with connection pooling
- **Package Manager**: npm with lock file for reproducible builds

## Frontend Libraries
- **UI Framework**: Radix UI component primitives for accessibility
- **State Management**: TanStack Query for server state and caching
- **Form Validation**: Zod for runtime type checking and validation
- **Date Handling**: date-fns for date manipulation utilities
- **Icons**: Lucide React for consistent iconography

## Backend Libraries
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for request/response validation
- **WebSocket**: ws library for Neon database WebSocket connections

## Development Tools
- **Build Tools**: Vite with React plugin and Replit integration
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer