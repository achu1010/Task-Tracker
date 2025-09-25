# Android SDK Setup Guide

To run the app locally, you need to install Android Studio and set up the Android SDK:

## Steps:

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Run the installer and follow the setup wizard

2. **Set Environment Variables**
   - Add to your system environment variables:
   ```
   ANDROID_HOME=C:\Users\{YourUsername}\AppData\Local\Android\Sdk
   ANDROID_SDK_ROOT=C:\Users\{YourUsername}\AppData\Local\Android\Sdk
   ```
   
3. **Add to PATH**
   - Add these to your PATH environment variable:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

4. **Restart your terminal** after setting environment variables

5. **Test ADB**
   ```powershell
   adb version
   ```

## Alternative: Continue Using EAS Build

Since EAS Build works perfectly and builds in the cloud, you can continue using it without needing local Android SDK setup.