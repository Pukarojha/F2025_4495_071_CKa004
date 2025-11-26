import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Image, ActivityIndicator } from "react-native";
import { signInWithRedirect, signIn, getCurrentUser } from "aws-amplify/auth";

import WDButton from "../../components/ui/WDButton";
import WDInput from "../../components/ui/WDInput";
import { colors, spacing, type, radius, shadows } from "../../theme/tokens";

const SUPPORTED_PROVIDERS = ["Google"];

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 1. AUTO-REDIRECT: Check if user is already here when screen loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        console.log("User session found on load, redirecting...");
        navigation.replace("Main");
      } catch (err) {
        // Not signed in, allow user to interact
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // --- SOCIAL LOGIN LOGIC (Google) ---
  const handleSocialLogin = async (provider) => {
    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      Alert.alert("Coming Soon", `${provider} login is currently under development.`);
      return;
    }
    try {
      // UPDATED: Forces consent screen to break auto-login loop
      await signInWithRedirect({ 
        provider,
        customProviderParameters: {
          prompt: "select_account consent" 
        }
      });
    } catch (error) {
      console.log("Social Login response:", error);
      // FIX: If already signed in, treat as success
      if (
        error.name === 'UserAlreadyAuthenticatedException' || 
        (error.message && error.message.includes('already a signed in user'))
      ) {
        navigation.replace("Main");
      } else {
        console.error("Social Login Error:", error);
      }
    }
  };

  // --- MANUAL LOGIN LOGIC (Email/Password) ---
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      
      if (isSignedIn) {
        navigation.replace("Main");
      } else {
        // Handle cases like "New Password Required"
        Alert.alert("Login Info", `Next Step: ${nextStep.signInStep}`);
      }
    } catch (error) {
      console.error("Sign In Error", error);
      // FIX: If already signed in, treat as success
      if (
        error.name === 'UserAlreadyAuthenticatedException' || 
        (error.message && error.message.includes('already a signed in user'))
      ) {
        navigation.replace("Main");
      } else {
        Alert.alert("Login Failed", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = email.includes("@") && email.includes(".");

  if (checkingAuth) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.h1}>Log in</Text>

      <WDInput
        label="Email address"
        placeholder="helloworld@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        showValidation={email.length > 0}
        isValid={isEmailValid}
        style={styles.inputField}
      />

      <WDInput
        label="Password"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        showPasswordToggle={true}
        style={styles.inputField}
      />

      <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </Pressable>

      <WDButton
        label={loading ? "Logging in..." : "Log in"}
        onPress={handleSignIn}
        style={styles.loginBtn}
        disabled={loading}
      />

      <Text style={styles.orText}>Or continue with</Text>

      <View style={styles.socialContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.googleBtn,
            pressed && styles.googleBtnPressed,
          ]}
          onPress={() => handleSocialLogin("Google")}
        >
          <Image 
            source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }}
            style={styles.googleIconImage}
          />
          <Text style={styles.googleBtnText}>Sign in with Google</Text>
        </Pressable>
      </View>

      <Text style={styles.signUpLink}>
        Don't have an account?{" "}
        <Text
          style={styles.signUpLinkBold}
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  h1: {
    ...type.h1,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  inputField: {
    marginBottom: spacing.md,
  },
  forgotPassword: {
    ...type.body,
    color: colors.primary,
    textAlign: "right",
    marginBottom: spacing.xxl,
    marginTop: spacing.sm,
  },
  loginBtn: {
    marginBottom: spacing.lg,
    ...shadows.main,
  },
  orText: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
    marginVertical: spacing.lg,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    height: 52, 
    width: "100%", 
    borderRadius: radius.md,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0", 
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  googleBtnPressed: {
    backgroundColor: "#F5F5F5", 
    elevation: 1,
  },
  googleIconImage: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain'
  },
  googleBtnText: {
    color: "#1F2937", 
    fontSize: 16,
    fontWeight: "600", 
    letterSpacing: 0.2,
  },
  signUpLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
  },
  signUpLinkBold: {
    fontWeight: "600",
    color: colors.text,
  },
});