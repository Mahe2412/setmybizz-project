---
description: How to save and restore project checkpoints
---

# Project Checkpoint Workflow

This workflow is established to ensure project state is preserved and can be restored if files are lost or corrupted.

## 💾 Saving a Checkpoint
To save the current state of the project, follow these steps:
1. Identify the current date (YYYY-MM-DD).
2. Run the following command to backup the source code:
   ```powershell
   robocopy . .checkpoints\YYYY-MM-DD /E /XD node_modules .next out .checkpoints .git .agent /R:1 /W:1
   ```
3. Update `.checkpoints/history.json` with a summary of the work done up to this point.

## 🔄 Restoring a Checkpoint
If the project becomes corrupted or you need to revert to a previous state:
1. Locate the desired date in the `.checkpoints` directory.
2. Run the following command to restore the files (careful: this will overwrite current files):
   ```powershell
   robocopy .checkpoints\YYYY-MM-DD . /E /XD .checkpoints .agent /R:1 /W:1
   ```
3. Re-install dependencies if necessary: `npm install`.

## 📅 Schedule
- A mandatory checkpoint must be saved every **2 days**.
- A manual checkpoint should be saved after major UI refinements or feature additions.

## 📝 Checkpoint Log
| Date | Summary |
|------|---------|
| 2026-02-12 | Initial checkpoint after Dashboard Refinement and Onboarding UI polish. |
