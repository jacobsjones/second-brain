import { createNote } from './storage';

// Seed data for initial app load
export const seedData = [
  {
    section: 'Ideas',
    title: 'UK Director Research',
    content: `# UK Director: What You Should Know

## Your Situation
- **Role:** Director of brother's UK Ltd company (recruitment firm)
- **Brother:** Moving to Dubai, remains shareholder
- **You:** Director with bank access, **NO equity**

## The Bottom Line
**High-risk, low-reward position.** You can be held **personally liable** for company debts even without owning shares. You get all the duties and risks, none of the ownership benefits.

## Your 7 Legal Duties (Companies Act 2006)

| Duty | What It Means |
|------|---------------|
| **Act within powers** | Follow company rules; don't overstep |
| **Promote company success** | Act for the COMPANY, not your brother |
| **Exercise independent judgment** | Think for yourself; don't just follow orders |
| **Exercise reasonable care** | Meet standards of a competent director |
| **Avoid conflicts** | Declare any interests; no secret benefits |
| **No third-party benefits** | No bribes, gifts, or side deals |
| **Declare interests** | Tell the board about any personal stakes |

**Key Point:** These duties are to the COMPANY, not to your brother as shareholder.

## Personal Liability Risks (Even Without Shares)

### 1. Wrongful Trading
If the company goes bust and you kept trading when you should have stopped → **personal contribution to debts required**

### 2. Fraudulent Trading  
If you knowingly carried on business to defraud creditors → **unlimited liability + up to 10 years prison**

### 3. HMRC Liabilities
If National Insurance or PAYE unpaid → **Personal Liability Notice** can make you personally pay

### 4. Personal Guarantees
If you personally guaranteed any company debts (common for bank loans) → **your house/assets at risk**

## Bank Access = Big Responsibility

As a bank signatory, you have:
- **Fiduciary duties** over company funds
- **Money laundering liability** if suspicious transactions go through
- **Personal liability** for payments made after the "insolvency point of no return"

## Tax Disadvantage

Without shares:
- Only salary income (higher tax)
- Can't receive dividends (lower tax)
- Must pay NICs on all income
- No flexibility to optimize

## Family Business Conflicts

The director-shareholder split creates tension around:
- **Compensation** — He wants dividends (tax efficient), you need salary (tax heavy)
- **Information** — Who gets what info?
- **Control** — Who makes final decisions?
- **Exit** — What if you want out?

## Dubai-UK Structure Risks

If your brother manages from Dubai:
- **Dual tax residency risk**
- **Exit charges** if company deemed UAE-resident
- **Documentation burden** to prove UK-based decision-making

## Red Flags to Watch For

🚩 HMRC arrears or late filings
🚩 Unexplained transactions or missing records  
🚩 Being excluded from key decisions
🚩 No Director & Officer (D&O) insurance
🚩 Brother acting as "shadow director" from Dubai
🚩 Pressure to sign documents without reading

## Protective Measures

Before accepting:
1. **Shareholders' Agreement** — Defines roles, decision rights, exit terms
2. **Director's Service Contract** — Salary, duties, notice period
3. **D&O Insurance** — Covers legal costs if sued as director
4. **Regular Financial Updates** — Monthly accounts, not just annual
5. **Independent Accountant** — Someone YOU trust reviewing books
6. **No Personal Guarantees** — Don't sign them if possible

## Questions to Ask Your Brother

1. "Why am I becoming director instead of just an employee?"
2. "What happens if we disagree on company decisions?"
3. "What's my compensation package and how is it set?"
4. "What insurance covers me if something goes wrong?"
5. "How do I exit this role if I want to?"

## Summary

**Your position:** All the risk, none of the ownership.

**Not saying no** — just saying: Get it in writing. Know what you're signing up for.

#research #legal #director #family-business #uk-company #advice`,
  },

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
