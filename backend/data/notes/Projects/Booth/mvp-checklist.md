---
id: booth-mvp-checklist
created: 2026-02-03T12:15:00Z
category: project
tags: [booth, mvp, checklist, launch]
---

# Booth MVP Launch Checklist

## Pre-Development

### Planning
- [ ] Finalize tech stack
- [ ] Set up project repository
- [ ] Create Figma wireframes
- [ ] Define API contracts

### Infrastructure
- [ ] Register domain (booth.studio / usebooth.com)
- [ ] Set up Vercel project
- [ ] Create Neon PostgreSQL database
- [ ] Set up AWS S3 bucket for images
- [ ] Configure Stripe account (test mode)
- [ ] Set up Resend (email)
- [ ] Create Google OAuth app

---

## Development Phase 1: Core

### Auth & User
- [ ] NextAuth.js setup (Google OAuth)
- [ ] User profile creation
- [ ] Artist vs Studio Owner role selection
- [ ] Protected routes middleware

### Studio Management
- [ ] Studio listing creation form
- [ ] Photo upload (multiple, reorder)
- [ ] Equipment checklist
- [ ] Pricing and availability settings
- [ ] Studio dashboard (owner view)

### Discovery
- [ ] Studio list page
- [ ] Map integration (Mapbox)
- [ ] Search and filters
- [ ] Studio detail page

---

## Development Phase 2: Booking

### Availability
- [ ] Calendar component
- [ ] Availability management (owner)
- [ ] Real-time availability check

### Booking Flow
- [ ] Booking request form
- [ ] Pricing calculator
- [ ] Stripe payment integration
- [ ] Booking confirmation page
- [ ] Booking confirmation email

### Notifications
- [ ] New booking request (email to owner)
- [ ] Booking confirmed (email to artist)
- [ ] Booking reminder (24h before)
- [ ] Post-session review request

---

## Development Phase 3: Polish

### UI/UX
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Mobile responsiveness check
- [ ] Dark mode (optional)

### Testing
- [ ] Unit tests (critical paths)
- [ ] E2E tests (booking flow)
- [ ] Cross-browser testing
- [ ] Mobile testing (iOS, Android)

### Content
- [ ] Write help articles
- [ ] Create FAQ page
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cancellation Policy explanation

---

## Pre-Launch

### Beta Testing
- [ ] Recruit 5-10 beta studios
- [ ] Recruit 10-20 beta artists
- [ ] Gather feedback
- [ ] Fix critical bugs

### Marketing Prep
- [ ] Create Instagram account
- [ ] Design launch graphics
- [ ] Write launch copy
- [ ] Prepare press kit

### Operations
- [ ] Set up support email
- [ ] Create dispute resolution process
- [ ] Define refund policy
- [ ] Prepare onboarding guide for studios

---

## Launch Day

### Soft Launch (Week 1)
- [ ] Invite-only to beta users
- [ ] Monitor error logs
- [ ] Respond to feedback within 2 hours
- [ ] Fix blocking issues immediately

### Public Launch (Week 2)
- [ ] Remove invite-only
- [ ] Post on Product Hunt
- [ ] Share on social media
- [ ] Email music schools/communities
- [ ] Reach out to music influencers

---

## Post-Launch (Month 1)

### Metrics to Track
- [ ] Daily active users
- [ ] Conversion rate (view → book)
- [ ] Average booking value
- [ ] Studio acquisition rate
- [ ] Support ticket volume
- [ ] Net Promoter Score

### Iteration
- [ ] Weekly team review
- [ ] Prioritize feature requests
- [ ] Plan Phase 2 features
- [ ] Reach out to top studios for testimonials

---

## Success Criteria for MVP

✅ **10+ studios listed**
✅ **5+ completed bookings**
✅ **0 critical bugs**
✅ **NPS > 7**
✅ **50+ waitlist signups for new cities**

---

## Estimated Timeline

| Phase | Duration | Completion |
|-------|----------|------------|
| Setup & Planning | 1 week | Week 1 |
| Core Development | 3 weeks | Week 4 |
| Booking & Polish | 2 weeks | Week 6 |
| Beta Testing | 1 week | Week 7 |
| **Public Launch** | **Week 8** | **✅** |

**Total: 2 months to launch**

---

*Last updated: 2026-02-03*
