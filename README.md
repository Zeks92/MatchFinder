# ⚽ MatchFinder 🏀

MatchFinder is a modern, real-time sports scheduling application that helps users find upcoming matches for their favorite sports. Built with **Next.js 15**, it provides a seamless 4-step wizard experience to filter matches by sport, country, and competition.



## 🚀 Live Demo
**Check out the live app here:** https://promatchfinder.vercel.app/

## ✨ Features

* **4-Step Wizard Workflow:** Intuitive navigation from sport selection to final match results.
* **Real-time Data:** Fetches live schedules from Sportradar API.
* **Smart Cascading Filters:** Selecting a country automatically narrows down available leagues, preventing "No Results" scenarios.
* **Timezone Aware:** Automatically filters out finished matches and adjusts start times to the user's local timezone.
* **Responsive UI:** Fully optimized for desktop and mobile using **Material UI (MUI)**.
* **Performance Optimized:** Implements server-side API routing and smart caching to stay within API rate limits.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **UI Library:** Material UI (MUI)
* **State Management:** React Context API + useReducer
* **API Client:** Axios
* **Data Source:** Sportradar API (Soccer v4 & Basketball v2)

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/matchfinder.git](https://github.com/your-username/matchfinder.git)
    cd matchfinder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Sportradar API key:
    ```env
    SPORTRADAR_API_KEY=your_actual_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧠 Technical Highlights

### Smart Filtering Logic
The app uses a **Top-Down Cascading Filter** on Step 3. When a user selects a category (Country), the system performs a lookup in the global match state to dynamically update available competitions (Leagues). If a selected league no longer matches the selected countries, it is automatically cleared to maintain data integrity.

### API Route Handling
The backend (`/api/schedule`) is designed to handle different Sportradar versions (Soccer v4 schedules vs. Basketball v2 summaries) through a unified configuration model, ensuring the frontend always receives a consistent data structure.