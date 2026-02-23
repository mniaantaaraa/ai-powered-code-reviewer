# New Features

## 1. Developer Analytics Dashboard

A comprehensive analytics dashboard that visualizes your code review metrics.

**Location:** `/analytics`

**Features:**
- Total reviews count
- Completed reviews with success rate
- Average risk score across all reviews
- Failed reviews count
- Reviews breakdown by repository with average risk scores
- Risk severity breakdown (Critical, High, Medium, Low)

**How to access:** Click "Analytics" in the sidebar navigation.

## 2. AI Chat on Reviews

Interactive chat interface to ask questions about completed code reviews.

**Location:** Appears on PR review pages after a review is completed

**Features:**
- Ask questions about specific review findings
- Get clarification on suggested fixes
- Understand risk scores and severity levels
- Conversational context maintained throughout the chat
- Powered by Groq's Llama 3.3 70B model

**How to use:**
1. Navigate to a pull request with a completed review
2. Scroll down to see the "Ask About This Review" chat interface
3. Type your question and press Enter or click Send
4. The AI will respond based on the review context

**Example questions:**
- "Why is this marked as a security issue?"
- "How can I fix the bug on line 42?"
- "What's the best way to improve the performance issue you mentioned?"
- "Can you explain the risk score?"

## Technical Implementation

### Backend (tRPC Routers)
- `src/server/api/routers/analytics.ts` - Analytics data aggregation
- `src/server/api/routers/chat.ts` - Chat message handling
- `src/server/services/ai.ts` - Extended with `chatAboutReview` function

### Frontend (React Components)
- `src/app/(dashboard)/analytics/page.tsx` - Analytics dashboard page
- `src/components/review-chat.tsx` - Chat interface component
- Updated PR review page to include chat component

### Database
No schema changes required - uses existing Review model data.
