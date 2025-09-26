## Finance Tracker
- Track expenses, set budgets, and see a monthly report with insights.

### Live
- https://finance-tracker-five-dusky.vercel.app/

### Test Login
- Email: user@example.com
- Password: Abc@123

### Run (Frontend)
```bash
npm install
echo "VITE_SUPABASE_URL=https://<project-ref>.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=<anon-public-key>" >> .env.local
npm run dev
# http://localhost:5173
```

### Supabase (Backend)
- In Supabase SQL editor, run the files in `supabase/migrations/` (creates `expenses`, `budgets`, and `monthly_reports` with RLS).
- Auth → URL config: add `http://localhost:5173` to Site/Redirect URLs and CORS.

### Python Service (Optional)
- Local CLI:
  ```bash
  python3 scripts/expense_suggestions.py path/to/expenses.json
  ```
- Minimal API:
  ```bash
  cd python_service
  pip3 install -r requirements.txt
  python3 app.py  # http://localhost:8000/health
  # POST /analyze with { "expenses": [...] }
  ```

### Extras
- Monthly report computed client-side from current expenses/budgets.

