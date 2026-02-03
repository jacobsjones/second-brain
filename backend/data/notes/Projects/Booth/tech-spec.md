---
id: booth-tech-spec
created: 2026-02-03T12:15:00Z
category: project
tags: [booth, tech-spec, architecture, database]
---

# Booth Technical Specification

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   Next.js    │  │   Next.js    │      │
│  │   (App)      │  │   (App)      │  │   (App)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐     ┌──────────────┐
            │  PostgreSQL  │     │   AWS S3     │
            │   (Neon)     │     │  (Images)    │
            └──────────────┘     └──────────────┘
                    │
                    ▼
            ┌──────────────┐
            │    Redis     │
            │   (Upstash)  │
            └──────────────┘
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router, Server Components)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand (client), React Query (server)
- **Maps**: Mapbox GL JS
- **Calendar**: react-big-calendar

### Backend
- **Runtime**: Node.js 20
- **API**: Next.js API Routes + tRPC
- **Auth**: NextAuth.js (Google OAuth, email)
- **Payments**: Stripe (Connect for marketplace)
- **Email**: Resend (transactional), Mailchimp (marketing)

### Database
- **Primary**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Cache**: Redis (Upstash)
- **Search**: Algolia (studio search)

### Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Storage**: AWS S3 (studio images)
- **Monitoring**: Vercel Analytics, Sentry

---

## Database Schema (Prisma)

```prisma
// User model (artists and studio owners)
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  image         String?
  role          UserRole  @default(ARTIST)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Artist profile
  artistProfile ArtistProfile?
  
  // Studio owner profile
  studioOwnerProfile StudioOwnerProfile?
  
  // Bookings
  bookingsAsArtist  Booking[] @relation("ArtistBookings")
  
  // Reviews
  reviewsGiven  Review[] @relation("Reviewer")
  reviewsReceived Review[] @relation("Reviewed")
  
  @@map("users")
}

enum UserRole {
  ARTIST
  STUDIO_OWNER
  ADMIN
}

// Artist-specific profile
model ArtistProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  
  genre       String[] // Hip-hop, Rock, Electronic, etc.
  bio         String?
  socialLinks Json?    // Instagram, Spotify, etc.
  
  @@map("artist_profiles")
}

// Studio owner-specific profile
model StudioOwnerProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  
  companyName String?
  taxId       String?
  payoutInfo  Json?    // Stripe Connect account
  
  @@map("studio_owner_profiles")
}

// Studio listing
model Studio {
  id              String   @id @default(uuid())
  ownerId         String
  owner           User     @relation(fields: [ownerId], references: [id])
  
  // Basic info
  name            String
  slug            String   @unique
  description     String   @db.Text
  images          String[] // S3 URLs
  
  // Location
  address         String
  city            String
  postcode        String
  latitude        Float
  longitude       Float
  
  // Details
  equipment       Json[]   // [{name: "Neumann U87", category: "Microphones"}]
  amenities       String[] // ["WiFi", "Parking", "Kitchen"]
  rules           String?  // House rules
  
  // Pricing
  hourlyRate      Int      // in pence (e.g., 5000 = £50)
  minimumBooking  Int      // minimum hours
  cleaningFee     Int      // optional
  
  // Settings
  instantBook     Boolean  @default(false)
  cancellationPolicy CancellationPolicy @default(FLEXIBLE)
  
  // Status
  isActive        Boolean  @default(true)
  isVerified      Boolean  @default(false)
  
  // Relations
  availability    AvailabilitySlot[]
  bookings        Booking[]
  reviews         Review[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([city])
  @@index([latitude, longitude])
  @@map("studios")
}

enum CancellationPolicy {
  FLEXIBLE      // Full refund 24h before
  MODERATE      // Full refund 5 days before
  STRICT        // 50% refund 7 days before
}

// Availability calendar
model AvailabilitySlot {
  id        String   @id @default(uuid())
  studioId  String
  studio    Studio   @relation(fields: [studioId], references: [id], onDelete: Cascade)
  
  startTime DateTime
  endTime   DateTime
  isBooked  Boolean  @default(false)
  
  @@index([studioId, startTime])
  @@map("availability_slots")
}

// Booking
model Booking {
  id              String        @id @default(uuid())
  
  studioId        String
  studio          Studio        @relation(fields: [studioId], references: [id])
  
  artistId        String
  artist          User          @relation("ArtistBookings", fields: [artistId], references: [id])
  
  // Times
  startTime       DateTime
  endTime         DateTime
  totalHours      Int
  
  // Pricing
  hourlyRate      Int           // snapshot at booking time
  subtotal        Int           // hourlyRate * totalHours
  cleaningFee     Int
  serviceFee      Int           // 15% platform fee
  totalAmount     Int
  
  // Payment
  stripePaymentIntentId String?
  paymentStatus   PaymentStatus @default(PENDING)
  
  // Status
  status          BookingStatus @default(PENDING)
  
  // Metadata
  notes           String?       // special requests
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@map("bookings")
}

enum BookingStatus {
  PENDING       // Awaiting studio owner approval
  CONFIRMED     // Paid and confirmed
  CANCELLED     // Cancelled by artist or owner
  COMPLETED     // Session completed
  DISPUTED      // Issue raised
}

enum PaymentStatus {
  PENDING
  HELD            // Stripe hold placed
  CAPTURED        // Payment taken
  REFUNDED        // Refunded
  PARTIALLY_REFUNDED
}

// Reviews
model Review {
  id        String   @id @default(uuid())
  
  bookingId String   @unique
  studioId  String
  studio    Studio   @relation(fields: [studioId], references: [id])
  
  reviewerId String
  reviewer   User     @relation("Reviewer", fields: [reviewerId], references: [id])
  
  reviewedId String
  reviewed   User     @relation("Reviewed", fields: [reviewedId], references: [id])
  
  rating    Int      // 1-5
  comment   String?
  
  createdAt DateTime @default(now())
  
  @@map("reviews")
}
```

---

## API Endpoints

### Studios
- `GET /api/studios` - List studios (with filters: location, price, equipment)
- `GET /api/studios/:id` - Get studio details
- `POST /api/studios` - Create studio (owner only)
- `PUT /api/studios/:id` - Update studio
- `DELETE /api/studios/:id` - Deactivate studio

### Availability
- `GET /api/studios/:id/availability` - Get available slots
- `POST /api/studios/:id/availability` - Add availability (owner)
- `DELETE /api/studios/:id/availability/:slotId` - Remove slot

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/confirm` - Confirm booking (owner)

### Payments
- `POST /api/payments/intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

---

## Key Technical Decisions

1. **Serverless First**: Vercel + Neon Serverless = pay-per-use, scales to zero
2. **Image Optimization**: Next.js Image component + S3 for storage
3. **Real-time Availability**: Redis for booking locks (prevent double-booking)
4. **Search**: Algolia for instant search, PostgreSQL for filtered queries
5. **Payments**: Stripe Connect (marketplace) for automatic payouts to studios

---

*Last updated: 2026-02-03*
