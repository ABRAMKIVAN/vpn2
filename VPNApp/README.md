# SecureVPN - High-Performance VPN Application

![SecureVPN Logo](https://via.placeholder.com/200x80/007bff/ffffff?text=SecureVPN)

A beautiful, cross-platform VPN application built with React Native, featuring WireGuard, ShadowSocks, and VLESS protocols with maximum connection speed optimization.

## 🚀 Features

### Core VPN Features
- **Lightning Fast Connections**: Optimized for maximum speed with WireGuard protocol
- **Multiple Protocols**: WireGuard (default), ShadowSocks, VLESS+Reality
- **Global Server Network**: 8+ locations worldwide
- **Real-time Speed Monitoring**: Live download/upload speed display
- **Kill Switch Protection**: Automatic internet blocking if VPN disconnects
- **DNS Leak Protection**: Prevent DNS queries from leaking your location

### User Experience
- **Beautiful UI**: Clean, minimalist design with rounded elements and gradients
- **Dark/Light Mode**: Automatic theme switching with manual override
- **Smooth Animations**: Pulse button animation, fade effects, and status transitions
- **One-Click Connect**: Simple, intuitive connection interface
- **Server Selection**: Easy country-based server selection
- **Notification Center**: Real-time alerts for connection status and speed changes

### Advanced Features
- **Anonymous Login**: Supabase authentication (no email required for free tier)
- **Premium Features**: Ad-blocker, unlimited bandwidth (mock implementations)
- **Data Usage Tracking**: Monitor your VPN usage
- **Battery Optimization**: Power-saving modes
- **Mock Speed Tests**: Test your connection speeds

## 📱 Supported Platforms

- **iOS** (iOS 11.0+)
- **Android** (Android 6.0+)
- **Web** (React Native Web support)

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.1
- **Language**: TypeScript
- **State Management**: React Hooks + Context API
- **Styling**: Theme-based styling system
- **Animations**: React Native Reanimated
- **Storage**: AsyncStorage for theme persistence
- **Testing**: Jest + React Native Testing Library
- **Backend**: Mock API (Stage 1) → Real API (Stage 3)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For All Platforms
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### For iOS Development (macOS only)
- **Xcode** (version 14 or higher)
- **iOS Simulator** or physical iOS device
- **CocoaPods** (for iOS dependencies)

### For Android Development
- **Android Studio** (latest version)
- **Android SDK** (API level 23 or higher)
- **Java Development Kit (JDK)** 11 or higher
- **Android emulator** or physical Android device

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

Open your terminal and run:

```bash
# Clone the repository (if not already done)
git clone https://github.com/yourusername/securevpn.git
cd securevpn

# Install all dependencies
npm install
```

### Step 2: Start the Development Server

For **Android** development:
```bash
# Start the Metro bundler
npm start

# In another terminal, run on Android emulator/device
npm run android
```

For **iOS** development (macOS only):
```bash
# Start the Metro bundler
npm start

# In another terminal, run on iOS simulator
npm run ios
```

For **Web** development:
```bash
# Start the web version
npm run web
```

### Step 3: Test the App

The app will automatically load with:
- Mock VPN servers from 8 countries
- Simulated connection speeds up to 500 Mbps
- Beautiful animations and smooth transitions
- Dark/light theme toggle

## 🔧 Configuration

### Environment Setup

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure your settings** in `.env`:
   ```env
   # Supabase Configuration (for Stage 3)
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # VPN Server Configuration (for Stage 3)
   VPN_API_BASE_URL=https://your-vpn-api.com
   ```

### Theme Configuration

The app supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes for nighttime use
- **System**: Automatically follows your device setting

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Suite
```bash
npm test -- --testPathPattern=theme.test.ts
```

## 📱 Building for Production

### Android APK/AAB
```bash
# Build debug APK
npm run build:android:debug

# Build release APK
npm run build:android:release

# Build AAB (recommended for Google Play)
npm run build:android:bundle
```

### iOS App Store Build
```bash
# Build for iOS
npm run build:ios

# Archive for App Store submission
npm run build:ios:archive
```

## 🌐 Deployment

### Google Play Store
1. Generate signed AAB bundle
2. Upload to Google Play Console
3. Configure store listing
4. Publish to production

### Apple App Store
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Configure app metadata
4. Submit for review

## 🏗️ Project Structure

```
VPNApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ConnectionButton.tsx
│   │   ├── CountrySelector.tsx
│   │   ├── SpeedDisplay.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── ServerList.tsx
│   │   └── NotificationCenter.tsx
│   ├── contexts/            # React Context providers
│   │   └── ThemeContext.tsx
│   ├── screens/             # Main app screens
│   │   └── MainScreen.tsx
│   ├── services/            # API and business logic
│   │   ├── mockApi.ts
│   │   └── vpnService.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── theme.ts
│   │   └── server.ts
│   ├── utils/               # Utility functions
│   │   └── theme.ts
│   ├── constants/           # App constants
│   │   └── theme.ts
│   └── __tests__/           # Test files
├── android/                 # Android native code
├── ios/                     # iOS native code
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup file
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🔐 Security Features

- **No Logs Policy**: We don't store your connection logs
- **Kill Switch**: Prevents data leaks if VPN disconnects
- **DNS Protection**: Encrypts DNS queries
- **Protocol Obfuscation**: ShadowSocks and VLESS for censorship circumvention
- **Anonymous Authentication**: Optional Supabase auth without personal data

## 🚀 Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **Memoization**: Expensive calculations are cached
- **Optimized Animations**: 60fps animations using React Native Reanimated
- **Efficient State Management**: Minimal re-renders with proper hooks usage
- **Bundle Optimization**: Tree shaking and code splitting

## 🐛 Troubleshooting

### Common Issues

**Metro bundler won't start**
```bash
# Clear Metro cache
npm start --reset-cache
```

**Android build fails**
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
npm run android
```

**iOS build fails**
```bash
# Clean iOS build
cd ios && rm -rf build && cd ..
npm run ios
```

**Theme not persisting**
```bash
# Clear AsyncStorage
# In app: Settings > Clear Data (or reinstall)
```

### Debug Mode

Enable debug mode for detailed logging:
```bash
# Set environment variable
DEBUG=vpn:* npm start
```

## 📈 Development Roadmap

### Stage 1 ✅ (Current)
- Mock simulation with beautiful UI
- Theme system and animations
- Basic testing framework

### Stage 2 🔄 (Next)
- Bug fixes and UI refinements
- Performance optimizations
- Enhanced testing coverage

### Stage 3 🚀 (Future)
- Real VPN server integration
- Supabase authentication
- Production deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full API Docs](https://securevpn.dev/docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/securevpn/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/securevpn/discussions)
- **Email**: support@securevpn.dev

## 🙏 Acknowledgments

- React Native community for the amazing framework
- WireGuard for the fast, secure protocol
- All contributors and beta testers

---

**Made with ❤️ for privacy and speed**

*SecureVPN - Your gateway to a faster, safer internet.*