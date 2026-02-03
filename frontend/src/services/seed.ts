import { createNote } from './storage';

// Seed data for initial app load
export const seedData = [
  {
    section: 'Ideas',
    title: 'AI Voice Coach',
    content: `# AI Voice Coach

An AI-powered voice coaching app that helps users improve their speaking skills.

## Features
- Real-time feedback on pacing, tone, and clarity
- Practice with famous speeches
- Personalized exercises based on voice analysis
- Progress tracking over time

## Tech Stack
- React Native for cross-platform mobile app
- WebRTC for audio processing
- OpenAI Whisper for transcription
- Custom ML model for voice analysis

## Related
- [[Voice Coach App]] - The actual implementation project
- #ai #voice #mobile #startup`,
  },
  {
    section: 'Ideas',
    title: 'Smart Vending Business',
    content: `# Smart Vending Business

Modern vending machines with smart features and healthy options.

## Concept
- IoT-enabled machines with real-time inventory
- Mobile app for pre-ordering
- Health-focused snacks and meals
- Dynamic pricing based on demand

## Locations to Target
- Gyms and fitness centers
- Office buildings
- University campuses
- Hospitals

## Investment Needed
- Initial: $50K for 5 machines
- Monthly: $2K per machine (restocking + maintenance)

## Revenue Projection
- $1,500-$3,000 per machine monthly
- Break-even: 12-18 months

#vending #business #iot #health`,
  },
  {
    section: 'Ideas',
    title: 'Startup Ideas',
    content: `# Startup Ideas Collection

A collection of potential startup ideas to explore.

## B2B SaaS
- Automated compliance checking for fintech
- AI-powered customer support training
- Carbon footprint tracking for supply chains

## Consumer Apps
- Personal finance gamification
- Micro-learning platform for skills
- AI travel planner with local experiences

## Hardware/IoT
- Smart home energy optimizer
- Portable air quality monitor
- Pet health tracking collar

## Criteria for Selection
1. Market size > $1B
2. Clear monetization path
3. Defensible technology
4. Can launch MVP in 3 months

#startup #ideas #entrepreneurship`,
  },
  {
    section: 'Projects',
    title: 'Voice Coach App',
    content: `# Voice Coach App

The actual implementation of the AI voice coaching concept.

## Current Status
- [x] Market research complete
- [x] Tech stack decided
- [ ] MVP in development
- [ ] Beta testing planned

## Architecture
\`\`\`
Frontend: React Native + Expo
Backend: Node.js + Express
ML Pipeline: Python + FastAPI
Database: PostgreSQL + Redis
\`\`\`

## Features for MVP
1. Audio recording and playback
2. Basic pitch/tone analysis
3. Speech-to-text for transcript
4. Simple progress dashboard

## Next Steps
- Set up development environment
- Create wireframes
- Build audio recording prototype

## Links
- [[AI Voice Coach]] - Original idea
- GitHub: github.com/user/voice-coach

#project #voice #ai #mobile #mvp`,
  },
  {
    section: 'Trading',
    title: 'Gold Trading Strategy',
    content: `# Gold Trading Strategy

A systematic approach to trading gold (XAU/USD).

## Strategy Overview
Trend-following strategy using moving averages and RSI.

## Entry Rules
**Long Entry:**
- Price above 200 EMA
- 50 EMA crosses above 200 EMA
- RSI > 50 but < 70

**Short Entry:**
- Price below 200 EMA
- 50 EMA crosses below 200 EMA
- RSI < 50 but > 30

## Risk Management
- Risk per trade: 1% of account
- Stop loss: ATR(14) * 2
- Take profit: 1:2 risk/reward minimum
- Max 3 open positions

## Backtest Results (2020-2024)
- Win rate: 52%
- Profit factor: 1.8
- Max drawdown: 12%
- Annual return: 24%

## News to Watch
- FOMC announcements
- NFP releases
- CPI data
- Geopolitical events

#trading #gold #forex #strategy #risk-management`,
  },
  {
    section: 'Articles',
    title: 'DeFi Derivatives',
    content: `# DeFi Derivatives: The Next Frontier

An analysis of decentralized derivatives protocols.

## Introduction
Derivatives represent the largest segment of traditional finance, yet DeFi derivatives are still in early stages.

## Protocol Comparison

| Protocol | Type | TVL | Pros | Cons |
|----------|------|-----|------|------|
| dYdX | Perpetuals | $500M | Fast, low fees | Centralized orderbook |
| GMX | Perpetuals | $400M | Real yield | Limited assets |
| Synthetix | Synthetic assets | $300M | Deep liquidity | Complex staking |
| Aevo | Options | $100M | Professional | Lower liquidity |

## Key Innovations
1. **On-chain oracles** - Pyth, Chainlink for price feeds
2. **Intent-based trading** - RFQ models for large orders
3. **Cross-margining** - Portfolio margin across protocols

## Challenges
- Liquidity fragmentation
- Regulatory uncertainty
- Oracle risks
- User experience complexity

## Outlook
DeFi derivatives could capture 10% of traditional volumes by 2030 if UX and liquidity improve.

#defi #derivatives #crypto #finance #research`,
  },
  {
    section: 'Journal',
    title: 'January 2025',
    content: `# January 2025

Monthly reflection and goals for the new year.

## Key Achievements
- Launched Voice Coach MVP beta
- Read 4 books on AI/ML
- Started daily meditation practice
- Reached 10K followers on Twitter

## Challenges Faced
- Struggled with work-life balance
- Gold trading strategy underperformed in choppy markets
- Delayed launch of smart vending project

## Lessons Learned
1. Ship early, iterate fast - perfectionism kills momentum
2. Health is foundational - skipped workouts, felt the impact
3. Saying no is as important as saying yes

## February Goals
- [ ] Get 100 beta users for Voice Coach
- [ ] Finish reading "The Beginning of Infinity"
- [ ] Launch vending machine pilot
- [ ] Resume 4x/week gym schedule
- [ ] Write 2 technical blog posts

## Gratitude
- Supportive team and co-founders
- Healthy family
- Access to incredible learning resources
- Financial stability to take risks

#journal #monthly-review #goals #personal-growth`,
  },
];

// Check if data needs to be seeded
export const shouldSeed = (): boolean => {
  const existing = localStorage.getItem('second-brain-notes');
  return !existing || JSON.parse(existing).length === 0;
};

// Seed the database with initial data
export const seedDatabase = (): void => {
  if (!shouldSeed()) return;
  
  for (const item of seedData) {
    createNote(item.section, item.title, item.content);
  }
  
  console.log('Database seeded with initial data');
};
