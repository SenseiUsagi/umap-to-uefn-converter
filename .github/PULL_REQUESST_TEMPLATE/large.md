---
name: "⚖️ Pull Request – large refactor"
about: “Significant changes like Bun migrations, refactors, or restructuring”
labels: refactor
---

## 🧱 Overview

- What was refactored (modules, routes, UI components)?
- Why was this change needed (performance, Bun upgrade, Dark Mode support)?

---

## 🚀 Architecture/Structure Changes

- Before → After folder/component structure
- Deprecated or new API routes, shared types
- ⚠️ Impact: Which user workflows are affected?

---

## 🔬 Testing Strategy

- Manual test plan (e.g. use old `.json`, convert, validate in UEFN)
- Automated tests added or updated (Jest, Playwright etc.)

---

## 🛠 Dependency & Tooling Highlights

- Bun, TS, Tailwind versions changed
- Add migration notes (e.g. "bun.lockb updated", "Dockerfile now includes Bun environment")

---

## 👁️ Visual / UX Changes

*(Screenshots or GIFs preferred)*  
Before / After UI comparison

---

## ❓ Checklist

- [ ] CI: `npm run test`, `bun lint & build` pass  
- [ ] Documented breaking changes / migration path  
- [ ] All flows (conversion, settings tab, dark mode) tested

---

## 🔗 Related Issues

Closes #123, Ref #456  
Related feature-request (optional)
