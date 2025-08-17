#!/usr/bin/env node

/**
 * React Native CLI Setup Script
 * Script ini digunakan untuk setup React Native development environment
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up React Native development environment...\n");

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

if (majorVersion < 18) {
  console.error("❌ Node.js version 18 or higher is required");
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if npm is available
try {
  const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error("❌ npm is not available");
  process.exit(1);
}

// Install React Native CLI globally
console.log("\n📦 Installing React Native CLI globally...");
try {
  execSync("npm install -g @react-native-community/cli", { stdio: "inherit" });
  console.log("✅ React Native CLI installed successfully");
} catch (error) {
  console.error("❌ Failed to install React Native CLI");
  console.error(error.message);
  process.exit(1);
}

// Check if Android SDK is available (for Android development)
console.log("\n🔍 Checking Android development environment...");
try {
  const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (androidHome) {
    console.log(`✅ Android SDK found at: ${androidHome}`);

    // Check if adb is available
    const adbPath = path.join(androidHome, "platform-tools", "adb");
    if (fs.existsSync(adbPath)) {
      console.log("✅ Android Debug Bridge (adb) is available");
    } else {
      console.log("⚠️  Android Debug Bridge (adb) not found");
    }
  } else {
    console.log(
      "⚠️  Android SDK not found. Set ANDROID_HOME environment variable",
    );
  }
} catch (error) {
  console.log("⚠️  Could not check Android environment");
}

// Check if Xcode is available (for iOS development)
console.log("\n🔍 Checking iOS development environment...");
try {
  if (process.platform === "darwin") {
    const xcodePath = "/Applications/Xcode.app";
    if (fs.existsSync(xcodePath)) {
      console.log("✅ Xcode found");

      // Check Xcode command line tools
      try {
        execSync("xcode-select --print-path", { stdio: "pipe" });
        console.log("✅ Xcode command line tools are available");
      } catch (error) {
        console.log("⚠️  Xcode command line tools not installed");
        console.log("   Run: sudo xcode-select --install");
      }
    } else {
      console.log("⚠️  Xcode not found. Install from App Store");
    }
  } else {
    console.log("ℹ️  iOS development is only available on macOS");
  }
} catch (error) {
  console.log("⚠️  Could not check iOS environment");
}

console.log("\n🎉 Setup completed!");
console.log("\nNext steps:");
console.log("1. Create a new React Native project:");
console.log("   npx react-native@latest init MyApp");
console.log("\n2. Navigate to project directory:");
console.log("   cd MyApp");
console.log("\n3. Run on Android:");
console.log("   npx react-native run-android");
console.log("\n4. Run on iOS (macOS only):");
console.log("   npx react-native run-ios");
console.log("\nHappy coding! 🚀");
