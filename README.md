# 🌌 Pay&Plag — Content Intelligence SaaS (Supabase Edition)

Pay&Plag is a premium SaaS platform for **Plagiarism Detection**, **AI Content Detection**, and **AI Paraphrasing**. 

---

## 🚀 Execution Guide

### 1. Supabase Database Setup (Required Once)
Before running the app, go to your **Supabase SQL Editor** and run the schema found at the bottom of this file to create the necessary tables.

---

### 2. Frontend Execution (Next.js)

Due to the `&` character in the folder name, standard `npm run dev` might fail on Windows. Follow these steps:

1.  **Install Dependencies** (First time only):
    ```powershell
    $env:npm_config_ignore_scripts="true"; npm install --legacy-peer-deps
    ```
2.  **Run Development Server**:
    ```powershell
    node node_modules/next/dist/bin/next dev
    ```
3.  **Access App**: Open [http://localhost:3000](http://localhost:3000)

---

### 3. Backend Execution (FastAPI)

To avoid "command not found" errors, always run uvicorn via the python module flag `-m`.

1.  **Navigate and Setup Venv** (First time only):
    ```powershell
    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    ```
2.  **Install Dependencies**:
    ```powershell
    pip install fastapi uvicorn pydantic transformers torch scipy scikit-learn python-dotenv anthropic
    ```
3.  **Run Server**:
    ```powershell
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    *(Note: Using `python -m uvicorn` ensures the command is found even if your PATH is not updated.)*

---

## 🛠️ Common Fixes

### "uvicorn : The term 'uvicorn' is not recognized"
This happens when Python's script folder isn't in your Windows PATH. 
**Fix**: Use `python -m uvicorn main:app` instead of just `uvicorn main:app`.

### "supabaseKey is required"
This means your `.env.local` keys are missing or the server-side key is being called in a client component.
**Fix**: Ensure your `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

---

## 📜 SQL Schema (Paste in Supabase SQL Editor)

```sql
-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders table
create table orders (
  id text primary key,
  user_id uuid references auth.users,
  tool_type text not null,
  amount integer not null,
  currency text default 'INR',
  status text default 'pending',
  payment_id text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Tokens table
create table tokens (
  token uuid primary key default gen_random_uuid(),
  order_id text references orders(id),
  user_id uuid references auth.users,
  tool_type text not null,
  used boolean default false,
  used_at timestamp with time zone,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Results table
create table results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  tool_type text not null,
  status text not null,
  score float,
  result_json jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table results enable row level security;

-- Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can view own results" on results for select using (auth.uid() = user_id);
```
