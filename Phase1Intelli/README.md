# Smart Traffic Analyzer - Frontend

Smart Traffic Analyzer is a SaaS web application built with React and Vite. It allows users to register their websites, embed a tracking script, and monitor visitor traffic through an interactive dashboard.

## 🚀 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Navigation bar with dynamic links
│   ├── ProtectedRoute.jsx# Security wrapper for auth-only pages
│   └── TrafficChart.jsx # Analytics visualization using Chart.js
├── pages/               # Main view components (routes)
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # User login form
│   ├── Register.jsx     # User registration form
│   ├── Dashboard.jsx    # Analytics overview with charts
│   └── AddWebsite.jsx   # Form to add websites and get tracking scripts
├── services/            # Backend communication
│   └── api.js           # Axios instance with JWT interceptor
├── App.jsx              # Main routing and layout configuration
├── main.jsx             # React application entry point
└── index.css            # Global styles (Sky Blue theme)
```

## 📄 File Descriptions

### Components
- **`Navbar.jsx`**: Displays navigation links. It detects if a user is logged in by checking `localStorage` for a JWT and shows "Dashboard/Logout" or "Login/Register" accordingly.
- **`ProtectedRoute.jsx`**: A wrapper component that checks for a JWT. If no token is found, it redirects the user to the login page.
- **`TrafficChart.jsx`**: Uses `chart.js` and `react-chartjs-2` to render a line graph of website visits over time.

### Pages
- **`Home.jsx`**: The first page users see—a clean landing page introducing the service.
- **`Login.jsx` & `Register.jsx`**: Handle user authentication. On successful login, the JWT is stored in `localStorage`.
- **`Dashboard.jsx`**: Fetches and displays analytics data (total visits and hourly trends) for a selected website.
- **`AddWebsite.jsx`**: Allows users to input their website name and domain. It generates a unique `websiteId` and provides a `<script>` tag for tracking.

### Services
- **`api.js`**: Centralized Axios configuration. It automatically attaches the JWT from `localStorage` to every request header using an interceptor.

## 🔄 User Flow: Getting Started

Here is the typical path a new user takes:

1.  **Discovery**: User visits the **Home** page and clicks "Get Started".
2.  **Registration**: User fills out the **Register** form (Name, Email, Password).
3.  **Authentication**: User logs in via the **Login** page. A secure token is saved to their browser.
4.  **Onboarding**: User navigates to **Add Website**, enters their domain (e.g., `example.com`), and receives a tracking script.
5.  **Integration**: User copies the generated `<script>` tag into their website's code.
6.  **Monitoring**: Once visitors hit their site, the user can visit the **Dashboard** to see real-time charts of their traffic.

## 🛠️ Tech Stack
- **React (Vite)**
- **React Router DOM** (Routing)
- **Axios** (API requests)
- **Chart.js** (Data visualization)
- **CSS** (Custom sky-blue theme)
