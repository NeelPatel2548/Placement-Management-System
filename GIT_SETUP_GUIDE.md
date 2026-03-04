# Git Setup Guide — Placement Management System

This document records every step taken to link the PMS project to GitHub.

---

## Repository
**URL:** https://github.com/NeelPatel2548/Placement-Management-System.git

---

## Steps Performed

### 1. Initialize Git Repository
```bash
cd e:\PMS
git init
```
> Output: `Initialized empty Git repository in E:/PMS/.git/`

### 2. Add Remote Origin
```bash
git remote add origin https://github.com/NeelPatel2548/Placement-Management-System.git
```

### 3. Create `.gitignore`
Created `Project/.gitignore` to exclude:
- `node_modules/`
- `dist/`
- `.env` files
- Log files

### 4. Stage All Files
```bash
git add .
```

### 5. Create Initial Commit
```bash
git commit -m "feat: initial PMS homepage with React, Tailwind CSS, and Framer Motion"
```

### 6. Rename Branch to `main`
```bash
git branch -M main
```

### 7. Push to GitHub
```bash
git push -u origin main
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `error: src refspec main does not match any` | No commits exist yet | Run `git add .` and `git commit` before pushing |
| `fatal: remote origin already exists` | Remote was already added | Use `git remote set-url origin <url>` instead |

---

*Document created: 2026-03-04*
