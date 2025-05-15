# ✅ TODOs – Project Tasks & Improvements

## 🧩 Backend (FastAPI)

### 📌 Structure & Refactor
- [ ] Consider writing **custom pipes** (via `Depends`) for:
  - [ ] Request field transformation (e.g., trimming strings, default sanitization)
  - [ ] Header/token validation logic
  - [ ] Query parameter validation (e.g., limits, filters)
  - [ ] Role-based access or permission checks
---

## 🎨 Frontend 

### 🔧 Tooling & Dev Environment
- [ ] **Switch to `pnpm`** for better performance and monorepo support
  - [ ] Update `package-lock.json` to `.npmrc` and `pnpm-lock.yaml`


### 📦 Packages
- [ ] Audit dependencies and remove unused ones
- [ ] Upgrade to latest stable versions (with changelog checks)
---

## 📁 General / DevOps
- [ ] Add `architecture.md` to repo documentation
- [ ] Set up pre-commit hooks for linting and formatting
