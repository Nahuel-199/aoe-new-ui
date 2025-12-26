# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce application for AOE Indumentaria built with Next.js 15, TypeScript, MongoDB, and Chakra UI. The application supports both customer-facing shopping features and an admin panel for managing products, orders, categories, and custom orders.

## Common Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Production build with Turbopack
npm start            # Start production server
```

Note: There are no test or linting commands configured in this project.

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and API routes
  - `src/app/admin/` - Admin panel routes (protected by middleware)
  - `src/app/api/auth/` - NextAuth.js authentication endpoints
  - `src/app/products/`, `/cart/`, `/mis-pedidos/` - Customer-facing pages

- `src/_components/` - React components organized by feature
  - `admin/` - Admin panel components (products, orders, categories, subcategories, custom orders)
  - `home/` - Homepage components (navbar, footer, banners, sliders)
  - `products/` - Product display and filtering components
  - `cart/`, `orders/` - Shopping cart and order management

- `src/lib/` - Core utilities and server actions
  - `db.ts` - MongoDB client setup with connection pooling
  - `cloudinary.ts` - Cloudinary configuration for image uploads
  - `actions/` - Server actions for each resource (products, orders, categories, etc.)

- `src/models/` - Mongoose/MongoDB data models
- `src/types/` - TypeScript type definitions
- `src/context/` - React Context providers (e.g., CartContext)
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions (Cloudinary upload/delete, size chart URLs)
- `src/components/ui/` - Chakra UI wrapper components

### Key Technologies

- **Next.js 15** with App Router and Server Components
- **TypeScript** with path aliases (`@/*` maps to `src/*`)
- **Authentication**: NextAuth.js v5 (beta) with Google OAuth
  - MongoDB adapter for session storage
  - JWT strategy with role-based access (admin/user)
  - Middleware protects `/admin/*` and `/dashboard/*` routes
- **Database**: MongoDB via native driver and Mongoose
  - Connection reused in development via global caching
  - Database name: `test` (configured in `src/lib/db.ts`)
- **Styling**: Chakra UI v3 with Emotion
- **Image Management**: Cloudinary for product images
- **State Management**: React Context for cart (persisted to localStorage)

### Authentication Flow

1. Google OAuth configured in `src/auth.ts`
2. Admin emails defined in environment variables (`USER_ADMIN_EMAIL`, `USER_ADMIN_EMAIL2`, `USER_ADMIN_EMAIL3`)
3. JWT callback assigns role ('admin' or 'user') and stores in database
4. Session callback exposes `user.role` and `user.id` to client
5. Middleware (`src/middleware.ts`) protects admin routes
6. Use `getCurrentUser()` or `getCurrentUserId()` from `src/lib/actions/auth-wrapper.ts` in server actions

### Data Models

Products use a variant-based structure:
- Each Product has multiple Variants (different types/styles)
- Each Variant has a color, price, offer pricing, and multiple images
- Each Variant has multiple Sizes with individual stock tracking
- Categories and Subcategories are separate collections referenced by ID

### Server Actions Pattern

All data mutations use Next.js Server Actions located in `src/lib/actions/`:
- `product.actions.ts` - CRUD for products
- `order.actions.ts` - Order management
- `category.actions.ts`, `subcategory.actions.ts` - Category management
- `customOrder.action.ts` - Custom order handling
- `notification.actions.ts` - User notifications
- `user.actions.ts` - User management

Server actions use `"use server"` directive and are called directly from client components.

### Environment Variables Required

```
MONGODB_URI                    # MongoDB connection string
CLOUDINARY_API_KEY             # Cloudinary API key
CLOUDINARY_API_SECRET          # Cloudinary API secret
NEXT_PUBLIC_CLOUD_UPDATE_PRESET # Cloudinary upload preset
NEXT_PUBLIC_CLOUD_NAME         # Cloudinary cloud name
NEXT_PUBLIC_CLOUD_API          # Cloudinary upload API URL
AUTH_GOOGLE_ID                 # Google OAuth client ID
AUTH_GOOGLE_SECRET             # Google OAuth client secret
AUTH_SECRET                    # NextAuth secret for JWT signing
AUTH_TRUST_HOST                # Set to true for production
AUTH_URL                       # Application URL
NEXTAUTH_URL                   # NextAuth URL (same as AUTH_URL)
USER_ADMIN_EMAIL               # Primary admin email
USER_ADMIN_EMAIL2              # Secondary admin email (optional)
USER_ADMIN_EMAIL3              # Tertiary admin email (optional)
MANUAL_USER_ID                 # Manual user ID for custom orders
```

### Image Upload Workflow

1. Client-side upload to Cloudinary via `uploadCloudinary()` util
2. Returns image ID and URL
3. Store in product variants as `{ id: string, url: string }`
4. Use `deleteCloudinary()` when removing images

### Cart Implementation

Shopping cart uses React Context (`src/context/CartContext.tsx`):
- Stored in localStorage for persistence
- Cart items identified by `productId + variant.type + variant.size + variant.color`
- Functions: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`
- Access via `useCart()` hook in client components
