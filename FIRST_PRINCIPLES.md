# First Principles Thinking - User Preference

**Documented**: 2026-03-26
**Context**: AI Token Price Comparison Project

## User's Core Requirement

> "I would like you to keep 'First Principles Thinking', rather than only do whatever I request as a robot"

## What This Means

### DON'T:
- Blindly implement features just because they were requested
- Build UI elements that don't actually function
- Create "placeholder" features that give false expectations
- Add complexity without validating the underlying capability

### DO:
- Question whether a requested feature is actually implementable
- Ask: "What infrastructure is needed for this to work?"
- Challenge assumptions about capabilities
- Propose alternatives when the direct request isn't feasible
- Explain limitations BEFORE building, not after

## Case Study: Email Subscription Button

### What Happened:
- User requested: "Add a subscribe price change button with email collection"
- I built: A working UI with modal, form validation, and localStorage
- Reality: I have NO capability to send emails - no SMTP server, no backend, no email service

### What Should Have Happened:
- I should have asked: "How would emails actually be sent?"
- I should have explained: "I can collect emails but cannot send them without external email service"
- I should have proposed: "Alternative: Browser notifications, or QoderWork channel alerts instead"

### The Problem:
- Built a feature that creates false expectations
- Wasted effort on non-functional UI
- User discovers limitation after implementation

## First Principles Questions to Ask:

1. **Capability**: "Do I actually have the tools/infrastructure to make this work?"
2. **End-to-end**: "Can this feature complete its full workflow?"
3. **Sustainability**: "Will this keep working without manual intervention?"
4. **Value**: "Does this actually solve the user's problem, or just look good?"
5. **Alternatives**: "Is there a simpler way to achieve the same goal?"

## Application to This Project:

### Email Subscription:
- ❌ Requested: Email subscription with proactive notifications
- ❌ Reality: Cannot send emails
- ✅ Alternative: QoderWork channel notifications (which I CAN do)

### GitHub Pages:
- ✅ Requested: Deploy to GitHub Pages
- ✅ Reality: Doable, but requires proper authentication
- ✅ First Principles: Explain manual steps since automated push isn't working

### Real-time Updates:
- ✅ Requested: Real-time price comparison
- ✅ Reality: HTML loads price-data.js dynamically - this WORKS
- ✅ First Principles: Validate the data flow actually functions

## Handover Note:

**For future sessions**: Always validate capabilities before building. User prefers being told "I can't do that, but here's what I CAN do" over building non-functional features.

---
**Last Updated**: 2026-03-26
**Status**: Active principle for all future work
