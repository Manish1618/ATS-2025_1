# 🎮 TokenRewards – Gamified Tokenized Rewards System

A gamified rewards platform where users complete tasks/challenges to earn blockchain-based tokens.  
These tokens can be redeemed for rewards, tracked in a wallet, and displayed via a student-friendly dashboard.  

Built with **React + TypeScript + TailwindCSS**, **Supabase** for auth/data, and ready for **Ethereum/Polygon blockchain integration**.

---

## ✨ Features
- 🔐 **Authentication** – Signup & Login with Supabase auth  
- 👤 **User Profiles** – Auto-created profile with starting tokens, level, XP  
- 📊 **Dashboard** – Personalized stats, streaks, and achievements  
- ✅ **Task Center** – Complete tasks to earn tokens & XP  
- 🛒 **Reward Store** – Redeem tokens for rewards (with rarity levels)  
- 👛 **Wallet Overview** – Track balance, earned/spent history  
- 🏆 **Gamification** – Levels, streaks, badges, and tokenized incentives  
- 🔗 **Blockchain Ready** – Designed to integrate with ERC-20/ERC-721 contracts on Ethereum/Polygon  

---

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Vite, TailwindCSS  
- **UI Icons:** [lucide-react](https://lucide.dev)  
- **State/Auth:** React Context + Supabase Auth  
- **Database:** Supabase (Postgres) – easily replaceable with MySQL backend  
- **Blockchain (Future):** Solidity smart contracts (ERC-20 Reward Token, ERC-721 Badges), Hardhat, Ethers.js  
- **Deployment:** Vercel / Netlify (frontend), Supabase hosted backend (or Node.js + MySQL alternative)  

---

## ⚙ Setup & Installation

### 1. Clone the repository
bash
git clone https://github.com/your-username/ATS-2025_1.git
cd ATS-2025_1
`

### 2. Install dependencies

bash
npm install


### 3. Configure environment variables

Create a `.env` file in the project root:

env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key


🔑 Get these from your Supabase Dashboard → **Project Settings → API**.

### 4. Run development server

bash
npm run dev


Default runs at: **[http://localhost:5173](http://localhost:5173)**

### 5. Build for production

bash
npm run build
npm run preview


---

## 🗄 Database Schema (Supabase)

The app expects these tables:

* **user\_profiles**

  * `id` (uuid, PK)
  * `email`
  * `username`
  * `token_balance` (int, default 100)
  * `level`
  * `experience_points`

* **tasks**

  * `id` (uuid, PK)
  * `title`, `description`, `difficulty`, `token_reward`, `category`, `created_at`

* **user\_tasks**

  * `id` (uuid, PK)
  * `user_id` (FK → user\_profiles.id)
  * `task_id` (FK → tasks.id)
  * `completed_at`
  * `tokens_earned`

* **rewards**

  * `id` (uuid, PK)
  * `name`, `description`, `rarity`, `category`, `token_cost`, `is_available`, `image_url`

* **transactions**

  * `id` (uuid, PK)
  * `user_id`
  * `type` (`earned` | `spent` | `exchanged`)
  * `amount`
  * `description`
  * `created_at`

---

## 🔗 Blockchain Integration (Planned)

1. Deploy **ERC-20 Reward Token** (e.g., `EduToken`) on Polygon Mumbai or Ethereum Sepolia testnet.
2. Backend mints tokens via smart contract when tasks are completed.
3. Frontend wallet integration with **MetaMask** (via Ethers.js).
4. Rewards can optionally be NFTs (ERC-721/1155 badges).

---

## 🚀 Roadmap

* [ ] Replace Supabase with Node.js + MySQL backend option
* [ ] Add MetaMask wallet connect button
* [ ] Integrate ERC-20 reward token contract
* [ ] Enable token redemption → on-chain burn
* [ ] Add NFT badges for achievements
* [ ] Deploy frontend on Vercel/Netlify

---

## 🤝 Contributing

PRs are welcome! For major changes, please open an issue first to discuss.

---

## 📜 License

MIT License © 2025 TokenRewards Hackathon Team



---

👉 Do you want me to also create a **.env.example file** (so you can commit that safely to GitHub without keys), or just keep the .env instructions inside the README?
```
