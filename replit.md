# Overview

Anvesh Chat Bot is a secure conversational AI assistant built as a full-stack web application with Replit authentication. The system provides multiple AI-powered capabilities including natural language chat, code assistance, real-time news integration, and document creation. The application features user login/signup via Replit Auth, a modern chat interface with custom branding and logo, React frontend and Express backend, designed to handle various AI interactions through a unified conversational experience with user-specific data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## January 2025 - Rebranding and Authentication Implementation
- **Complete Rebranding**: Changed from "AnveshAI" to "Anvesh Chat Bot" with custom logo integration
- **Custom Logo**: Integrated user-provided chat bot logo (blue robot icon) across all UI components
- **Authentication System**: Implemented full Replit Auth with OpenID Connect for secure user login/signup
- **User Management**: Added user profile management with database persistence
- **Route Protection**: All conversation and message endpoints now require authentication
- **Landing Page**: Created beautiful landing page for logged-out users showcasing features
- **Database Integration**: Migrated from in-memory storage to PostgreSQL with user-specific data isolation

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming, Inter and JetBrains Mono fonts

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with conversation and message endpoints
- **Development**: Hot reload with Vite integration for development environment

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema**: Users, conversations, messages, and sessions tables with proper relations
- **User Data Isolation**: All conversations and messages are user-specific and protected

## Authentication and Authorization
- **Authentication System**: Replit Auth (OpenID Connect) for secure user login/signup
- **Session Management**: PostgreSQL-backed session storage with passport.js integration
- **User Management**: Complete user profile management with email, names, and profile images
- **Authorization**: Route-level protection for all conversation and message endpoints
- **Security**: JWT token refresh, secure cookie sessions, and user data isolation

## Chat System Design
- **Message Flow**: Real-time conversation handling with persistent storage
- **AI Integration**: OpenAI GPT-4o for chat responses with configurable parameters
- **Special Commands**: Slash commands for specific features (/image for image generation)
- **Message Types**: Support for text, code blocks, images, and news articles

## AI Capabilities Integration
- **Text Generation**: Free rule-based conversational AI with intelligent code assistance
- **Image Generation**: Guidance to free alternatives (Stable Diffusion, Hugging Face, etc.)
- **Code Analysis**: Built-in code analysis with language-specific insights and recommendations
- **News Integration**: Real-time news fetching via free RSS feeds from major outlets (CNN, Reuters, TechCrunch)

## Component Architecture
- **Modular Design**: Reusable UI components with consistent styling
- **Chat Components**: Specialized chat interface components (ChatMessage, ChatInput, CodeBlock)
- **Code Highlighting**: Syntax highlighting with copy functionality using react-syntax-highlighter
- **Responsive Design**: Mobile-first approach with responsive layouts

# External Dependencies

## Core AI Services  
- **Free AI Services**: Rule-based conversational AI with intelligent coding assistance
- **RSS News Feeds**: Real-time news from CNN, Reuters, TechCrunch, and other major outlets

## Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations

## Frontend Libraries
- **Radix UI**: Headless UI components for accessibility and functionality
- **TanStack Query**: Server state management and caching
- **React Markdown**: Markdown rendering with syntax highlighting support
- **Wouter**: Lightweight routing solution

## Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Development environment optimization with cartographer and runtime error overlay