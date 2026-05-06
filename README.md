# SRK Coconut ERP - Mobile App (Source-App)

Welcome to the mobile application repository for the SRK Coconut ERP system. This application is built using **React Native** and **Expo**, designed to provide a premium, natively-compiled cross-platform experience (iOS and Android) while connecting to the existing Django backend.

## 🥥 About the Project

**SRK Coconut ERP** is a comprehensive Enterprise Resource Planning system specifically designed for coconut processing and inventory management. 

This mobile application serves as the on-the-go portal for the system, allowing users to:
- **Manage Inventory**: Track coconut stock balances in real-time across multiple physical locations (e.g., Store 1, Store 2).
- **Process GRNs (Goods Receipt Notes)**: Log incoming harvest loads quickly and efficiently directly from the field or warehouse floor.
- **Monitor Analytics**: View high-level dashboard summaries of daily operations, pending reviews, and total inventory movement.


## 📱 Technology Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Toolchain**: [Expo](https://expo.dev/)
- **Language**: TypeScript
- **Networking**: Axios (Connecting to Django REST APIs)
- **Design System**: Custom Premium Dark Theme

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your development machine:

1. **Node.js**: (Version 18 or newer recommended)
2. **Expo CLI**: Installed globally (`npm install -g expo-cli`) or simply use `npx`.
3. **Expo Go App**: Install this app on your physical iOS or Android device to test the application quickly. Alternatively, have an Android Emulator or iOS Simulator configured on your PC.

---

## 🚀 Getting Started

### 1. Installation

Navigate into the mobile app directory and install the required dependencies:

```bash
cd Source-App
npm install
```

### 2. Configure the Backend Connection

This mobile app communicates with the `Source-backend-django` APIs. Because mobile devices (and emulators) run on different network layers than your browser, you cannot use `localhost` directly when testing on a physical device.

Open `src/api/client.ts` and update the `API_BASE_URL`:

- **For Android Emulator**: Leave it as `http://10.0.2.2:8000/api` (this routes to your PC's localhost).
- **For Physical Devices**: Change it to your computer's local IP address (e.g., `http://192.168.1.5:8000/api`). Ensure your phone and PC are on the same WiFi network, and your Django server is running via `python manage.py runserver 0.0.0.0:8000`.

### 3. Running the App

Start the Expo development server:

```bash
npm run start
```

This will launch the Expo Metro Bundler in your terminal and open a dashboard in your web browser. 

* **To run on your phone**: Scan the generated QR code using the Expo Go app.
* **To run on an Emulator**: Press `a` in the terminal for Android, or `i` for iOS Simulator.

---

## 📁 Project Structure

```text
Source-App/
├── App.tsx                 # Main entry point of the application
├── app.json                # Expo configuration file
├── src/                    # Source code directory
│   ├── api/                # API clients and interceptors (Axios)
│   │   └── client.ts       # Django API connector
│   ├── components/         # Reusable UI components (Buttons, Inputs, etc.)
│   ├── navigation/         # React Navigation setup and route definitions
│   └── screens/            # Full-screen views (e.g., HomeScreen, Login)
│       └── HomeScreen.tsx  # Dashboard overview
└── tsconfig.json           # TypeScript configuration
```

---

## 🎨 Design Philosophy

This mobile app prioritizes a **premium aesthetic** and smooth user experience. 
- Uses modern dark-mode palettes (`#0F172A`, `#1E293B`).
- Avoids generic layouts in favor of dynamic cards, vibrant accents, and clean typography.
- Uses micro-animations and smooth page transitions (via React Native's native drivers).

---

## 🔒 Authentication (Upcoming)

Authentication will be handled via JWT (JSON Web Tokens) provided by the Django backend. Tokens will be stored securely on the device (e.g., using `AsyncStorage` or `expo-secure-store`) and automatically attached to API requests via Axios interceptors in `src/api/client.ts`.
