import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Image, ActivityIndicator } from "react-native";
<<<<<<< HEAD
import { signInWithRedirect, signUp, confirmSignUp, getCurrentUser } from "aws-amplify/auth";
=======
import { signInWithRedirect, signUp, confirmSignUp } from "aws-amplify/auth";
>>>>>>> 57e3e5076277ac8086914aec926a2c996648387f

import WDButton from "../../components/ui/WDButton";
import WDInput from "../../components/ui/WDInput";
import { colors, spacing, type, radius, shadows } from "../../theme/tokens";

const SUPPORTED_PROVIDERS = ["Google"];

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
<<<<<<< HEAD
=======
  // Verification State
>>>>>>> 57e3e5076277ac8086914aec926a2c996648387f
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  // --- SOCIAL LOGIN LOGIC ---
  const handleSocialLogin = async (provider) => {
    // SAFETY CHECK
    try {
      await getCurrentUser();
      navigation.replace("Main");
      return;
    } catch (err) {}

    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      Alert.alert("Coming Soon", `${provider} login is currently under development.`);
      return;
    }
    try {
      await signInWithRedirect({ provider });
    } catch (error) {
      if (error.name === 'UserAlreadyAuthenticatedException') {
        navigation.replace("Main");
      } else {
        Alert.alert("Login Failed", error.message);
      }
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
          autoSignIn: true,
        },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setPendingVerification(true);
        Alert.alert("Verify Email", `We sent a code to ${email}`);
      } else if (nextStep.signUpStep === 'DONE') {
        navigation.replace("Main");
      }
    } catch (error) {
      if (error.name === 'UserAlreadyAuthenticatedException') {
        navigation.replace("Main");
      } else {
        Alert.alert("Sign Up Failed", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    setLoading(true);
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      Alert.alert("Success", "Account verified! Please log in.");
      navigation.replace("SignIn");
    } catch (error) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- MANUAL SIGN UP LOGIC ---
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
          autoSignIn: true,
        },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setPendingVerification(true);
        Alert.alert("Verify Email", `We sent a code to ${email}`);
      } else if (nextStep.signUpStep === 'DONE') {
        navigation.replace("Main");
      }
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- VERIFICATION LOGIC ---
  const handleVerification = async () => {
    setLoading(true);
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      Alert.alert("Success", "Account verified! Please log in.");
      navigation.replace("SignIn");
    } catch (error) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
<<<<<<< HEAD

  if (pendingVerification) {
    return (
      <View style={styles.root}>
        <Text style={styles.h1}>Verify Email</Text>
        <Text style={styles.orText}>Enter the code sent to {email}</Text>
        <WDInput label="Code" placeholder="123456" value={verificationCode} onChangeText={setVerificationCode} keyboardType="number-pad" style={styles.inputField} />
        <WDButton label={loading ? "Verifying..." : "Confirm"} onPress={handleVerification} style={styles.signUpBtn} disabled={loading} />
        <Pressable onPress={() => setPendingVerification(false)}><Text style={styles.loginLinkBold}>Go Back</Text></Pressable>
      </View>
    );
  }
=======
>>>>>>> 57e3e5076277ac8086914aec926a2c996648387f

  // --- RENDER VERIFICATION SCREEN IF PENDING ---
  if (pendingVerification) {
    return (
      <View style={styles.root}>
        <Text style={styles.h1}>Verify Email</Text>
        <Text style={styles.orText}>Enter the code sent to {email}</Text>
        
        <WDInput
          label="Confirmation Code"
          placeholder="123456"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          style={styles.inputField}
        />
        
        <WDButton
          label={loading ? "Verifying..." : "Confirm"}
          onPress={handleVerification}
          style={styles.signUpBtn}
          disabled={loading}
        />
        
        <Pressable onPress={() => setPendingVerification(false)}>
          <Text style={styles.loginLinkBold}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // --- RENDER SIGN UP SCREEN ---
  return (
    <View style={styles.root}>
      <Text style={styles.h1}>Sign up</Text>
<<<<<<< HEAD
      <WDInput label="Email" placeholder="example@gmail.com" value={email} onChangeText={setEmail} keyboardType="email-address" showValidation={email.length > 0} isValid={isEmailValid} style={styles.inputField} />
      <WDInput label="Create a password" placeholder="must be 8 characters" value={password} onChangeText={setPassword} secureTextEntry={true} showPasswordToggle={true} showValidation={password.length > 0} isValid={isPasswordValid} style={styles.inputField} />
      <WDInput label="Confirm password" placeholder="repeat password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} showPasswordToggle={true} showValidation={confirmPassword.length > 0} isValid={doPasswordsMatch} style={styles.inputField} />
      <WDButton label={loading ? "Creating Account..." : "Sign up"} onPress={handleSignUp} style={styles.signUpBtn} disabled={loading} />
      <Text style={styles.orText}>Or Register with</Text>
=======

      <WDInput
        label="Email"
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        showValidation={email.length > 0}
        isValid={isEmailValid}
        style={styles.inputField}
      />

      <WDInput
        label="Create a password"
        placeholder="must be 8 characters"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        showPasswordToggle={true}
        showValidation={password.length > 0}
        isValid={isPasswordValid}
        style={styles.inputField}
      />

      <WDInput
        label="Confirm password"
        placeholder="repeat password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        showPasswordToggle={true}
        showValidation={confirmPassword.length > 0}
        isValid={doPasswordsMatch}
        style={styles.inputField}
      />

      <WDButton
        label={loading ? "Creating Account..." : "Sign up"}
        onPress={handleSignUp}
        style={styles.signUpBtn}
        disabled={loading}
      />

      <Text style={styles.orText}>Or Register with</Text>

>>>>>>> 57e3e5076277ac8086914aec926a2c996648387f
      <View style={styles.socialContainer}>
        <Pressable style={({ pressed }) => [styles.googleBtn, pressed && styles.googleBtnPressed]} onPress={() => handleSocialLogin("Google")}>
          <Image source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} style={styles.googleIconImage} />
          <Text style={styles.googleBtnText}>Sign up with Google</Text>
        </Pressable>
      </View>
      <Text style={styles.loginLink}>Already have an account? <Text style={styles.loginLinkBold} onPress={() => navigation.navigate("SignIn")}>Log in</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  root: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: spacing.xxl },
  h1: { ...type.h1, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.xxl },
  inputField: { marginBottom: spacing.md },
  signUpBtn: { marginTop: spacing.lg, marginBottom: spacing.lg, ...shadows.main },
  orText: { ...type.body, color: colors.muted, textAlign: "center", marginVertical: spacing.lg },
  socialContainer: { flexDirection: "row", justifyContent: "center", marginBottom: spacing.xxl },
  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg, height: 52, width: "100%", borderRadius: radius.md, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E0E0E0", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  googleBtnPressed: { backgroundColor: "#F5F5F5", elevation: 1 },
  googleIconImage: { width: 20, height: 20, marginRight: 12, resizeMode: "contain" },
  googleBtnText: { color: "#1F2937", fontSize: 16, fontWeight: "600", letterSpacing: 0.2 },
  loginLink: { ...type.body, color: colors.muted, textAlign: "center" },
  loginLinkBold: { fontWeight: "600", color: colors.text }
=======
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
  signUpBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.main,
  },
  orText: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
    marginVertical: spacing.lg,
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
    resizeMode: "contain",
  },
  googleBtnText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  loginLink: {
    ...type.body,
    color: colors.muted,
    textAlign: "center",
  },
  loginLinkBold: {
    fontWeight: "600",
    color: colors.text,
  },
>>>>>>> 57e3e5076277ac8086914aec926a2c996648387f
});