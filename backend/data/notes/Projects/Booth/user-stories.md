---
id: booth-user-stories
created: 2026-02-03T12:15:00Z
category: project
tags: [booth, user-stories, requirements]
---

# Booth User Stories

## Artist (Renter)

### Discovery
**As an** artist
**I want to** search for studios by location, price, and equipment
**So that** I can find the perfect space for my recording session

**Acceptance Criteria:**
- [ ] Map view with studio pins
- [ ] List view with filters (price range, equipment, amenities)
- [ ] Distance from my location
- [ ] Studio preview cards with photo, price, rating

---

### Booking
**As an** artist
**I want to** book a studio for a specific date and time
**So that** I can secure the space for my session

**Acceptance Criteria:**
- [ ] Calendar showing available slots
- [ ] Instant booking OR request to book
- [ ] Clear pricing breakdown (hourly rate + fees)
- [ ] Secure payment with Stripe
- [ ] Booking confirmation email

---

### Communication
**As an** artist
**I want to** message the studio owner before booking
**So that** I can ask about equipment or special requirements

**Acceptance Criteria:**
- [ ] In-app messaging system
- [ ] Email notifications for new messages
- [ ] Message history saved

---

### Post-Session
**As an** artist
**I want to** review the studio after my session
**So that** other artists know what to expect

**Acceptance Criteria:**
- [ ] Review prompt 24h after session
- [ ] 1-5 star rating
- [ ] Written review optional
- [ ] Photos in review (optional)

---

## Studio Owner (Host)

### Onboarding
**As a** studio owner
**I want to** create a listing for my studio
**So that** artists can find and book my space

**Acceptance Criteria:**
- [ ] Step-by-step listing creation
- [ ] Upload up to 10 photos
- [ ] Equipment checklist
- [ ] Set hourly rate and availability
- [ ] Connect Stripe account for payouts

---

### Calendar Management
**As a** studio owner
**I want to** set my availability
**So that** artists can only book when I'm open

**Acceptance Criteria:**
- [ ] Weekly recurring availability (e.g., Mon-Fri 9am-6pm)
- [ ] Block out specific dates (holidays, maintenance)
- [ ] Sync with Google Calendar (optional)
- [ ] Mobile-friendly calendar editing

---

### Booking Management
**As a** studio owner
**I want to** approve or decline booking requests
**So that** I control who uses my studio

**Acceptance Criteria:**
- [ ] Notification on new booking request
- [ ] Artist profile preview (ratings, history)
- [ ] One-click approve/decline
- [ ] Auto-approve option for instant booking

---

### Earnings
**As a** studio owner
**I want to** see my earnings and upcoming payouts
**So that** I can track my studio's performance

**Acceptance Criteria:**
- [ ] Dashboard with monthly earnings
- [ ] Payout history
- [ ] Upcoming bookings revenue forecast
- [ ] Tax document download (annual)

---

## Platform Admin

### Quality Control
**As an** admin
**I want to** verify new studio listings
**So that** we maintain quality standards

**Acceptance Criteria:**
- [ ] Review queue for new studios
- [ ] Verify photos match description
- [ ] Check equipment claims
- [ ] Approve/reject with feedback

---

### Dispute Resolution
**As an** admin
**I want to** handle booking disputes
**So that** both parties are treated fairly

**Acceptance Criteria:**
- [ ] Dispute ticket system
- [ ] View booking details and messages
- [ ] Issue partial/full refunds
- [ ] Suspend users if necessary

---

## User Journey Maps

### Artist Booking Flow
```
1. Search → 2. Filter → 3. View Studio → 4. Check Availability 
→ 5. Book → 6. Pay → 7. Confirmation → 8. Session → 9. Review
```

### Studio Owner Onboarding
```
1. Sign Up → 2. Create Listing → 3. Add Photos → 4. Set Pricing 
→ 5. Connect Stripe → 6. Set Availability → 7. Go Live → 8. First Booking
```

---

## Pain Points to Solve

### For Artists
- ❌ Current: Cold-calling studios, no price transparency
- ✅ Booth: Instant booking with clear pricing

- ❌ Current: No way to compare studios
- ✅ Booth: Reviews, photos, equipment lists

- ❌ Current: Paying deposits, no-shows lose money
- ✅ Booth: Secure payments, cancellation policies

### For Studio Owners
- ❌ Current: Empty slots, no marketing
- ✅ Booth: Passive income, marketing handled

- ❌ Current: Chasing payments
- ✅ Booth: Automatic payouts

- ❌ Current: No-show artists waste time
- ✅ Booth: Verified users, review system

---

*Last updated: 2026-02-03*
