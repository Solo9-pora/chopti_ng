# Push to GitHub - 2 mins

1. Go to github.com → New Repository → Name: `chopti_ng` → Public → Create (don't init with README)

2. In your chopti folder terminal:
```bash
git init
git add .
git commit -m "Chopti v3 - landing + app + supabase + paystack"
git branch -M main
git remote add origin https://github.com/Solo9-pora/chopti_ng.git
git push -u origin main
```

3. One-click deploy:
- Replace YOUR_USERNAME in README deploy button, or just go to vercel.com/new
- Import `chopti` repo
- Add env vars from .env.local
- Deploy

Your repo URL for Vercel button: https://github.com/Solo9-pora/chopti_ng
