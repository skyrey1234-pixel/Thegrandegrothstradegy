# Deployment Guide — Pitch Deck & GitHub Pages

This guide explains how to share the interactive pitch deck with The Grande owner and how to keep this repository up to date.

---

## Option 1: GitHub Pages (Recommended — Live URL)

GitHub Pages turns this repository into a live website so you can share a clean link.

### One-Time Setup

1. Go to your repository on GitHub: `https://github.com/skyrey1234-pixel/Thegrandegrothstradegy`
2. Click **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, choose:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

GitHub will show you a URL like:
```
https://skyrey1234-pixel.github.io/Thegrandegrothstradegy/
```

This URL:
- Loads `index.html` → automatically redirects to the pitch deck
- Can be shared directly with the venue owner
- Works on any device (desktop, phone, tablet)
- No login required to view

### Sharing the Pitch Deck

Once Pages is enabled, share this URL with The Grande owner before your meeting:
```
https://skyrey1234-pixel.github.io/Thegrandegrothstradegy/pitch-deck/the-grande-pitch-deck-updated.html
```

Or use the root URL which auto-redirects:
```
https://skyrey1234-pixel.github.io/Thegrandegrothstradegy/
```

---

## Option 2: Send the HTML File Directly

If you prefer not to use GitHub Pages, you can send the file directly:

1. Download `pitch-deck/the-grande-pitch-deck-updated.html` from this repo
2. Email or text it to the owner
3. They open it in any web browser — no internet required

This works for in-person presentations or when a live URL isn't needed.

---

## Option 3: Screen Share (In-Person or Zoom)

1. Download `pitch-deck/the-grande-pitch-deck-updated.html` to your laptop
2. Open it in Chrome or Safari
3. Navigate with arrow keys or on-screen buttons
4. Share your screen in Zoom, Google Meet, or present in person

---

## Updating the Pitch Deck

If you need to update the pitch deck (new numbers, new slides, etc.):

1. Edit `pitch-deck/the-grande-pitch-deck-updated.html` in a text editor
2. Commit and push the changes to GitHub
3. The live GitHub Pages URL will update within 1–2 minutes automatically

### Quick Git Commands
```bash
git add pitch-deck/the-grande-pitch-deck-updated.html
git commit -m "Update pitch deck - [brief description of change]"
git push
```

---

## Updating Strategy Documents

To update any `.md` files (STRATEGY, DELIVERABLES, etc.):

```bash
git add DELIVERABLES.md
git commit -m "Update deliverables - Month 2 checklist"
git push
```

---

## Repository URL Reference

| Resource | URL |
|----------|-----|
| Repository | https://github.com/skyrey1234-pixel/Thegrandegrothstradegy |
| Live pitch deck | https://skyrey1234-pixel.github.io/Thegrandegrothstradegy/pitch-deck/the-grande-pitch-deck-updated.html |
| GitHub Pages root | https://skyrey1234-pixel.github.io/Thegrandegrothstradegy/ |
| README (strategy overview) | https://github.com/skyrey1234-pixel/Thegrandegrothstradegy#readme |
| STRATEGY.md | https://github.com/skyrey1234-pixel/Thegrandegrothstradegy/blob/main/STRATEGY.md |
| DELIVERABLES.md | https://github.com/skyrey1234-pixel/Thegrandegrothstradegy/blob/main/DELIVERABLES.md |

---

## Troubleshooting

**GitHub Pages URL returns 404:**
- Wait 2–5 minutes after enabling Pages for the first time
- Make sure `index.html` exists in the root of the `main` branch

**Pitch deck HTML looks broken:**
- Open the file in Chrome or Firefox (not Safari or Edge)
- Make sure the file path is correct: `pitch-deck/the-grande-pitch-deck-updated.html`

**Can't push changes:**
- Run `git pull` first to sync with the remote
- Then retry `git push`
