// src/auth.js
import { Auth } from 'aws-amplify';

export async function signUpEmail(email, password) {
  return Auth.signUp({ username: email, password, attributes: { email } });
}
export async function confirmEmail(email, code) {
  return Auth.confirmSignUp(email, code);
}
export async function resendCode(email) {
  return Auth.resendSignUp(email);
}
export async function signInEmail(email, password) {
  return Auth.signIn(email, password);
}
export function signInWithGoogle() {
  return Auth.federatedSignIn({ provider: 'Google' });
}
export function signInWithFacebook() {
  return Auth.federatedSignIn({ provider: 'Facebook' });
}
export function signInWithApple() {
  return Auth.federatedSignIn({ provider: 'SignInWithApple' });
}
export async function signOutAll() {
  return Auth.signOut();
}
export function mapAuthError(e) {
  const m = e?.message || String(e);
  if (m.includes('UsernameExistsException')) return 'This email is already registered.';
  if (m.includes('UserNotFoundException')) return 'No account found for this email.';
  if (m.includes('NotAuthorizedException')) return 'Incorrect email or password.';
  if (m.includes('CodeMismatchException')) return 'Invalid verification code.';
  if (m.includes('ExpiredCodeException')) return 'Verification code expired.';
  if (m.includes('invalid_redirect_uri')) return 'Redirect URL mismatch (check Managed login URLs).';
  return m;
}
