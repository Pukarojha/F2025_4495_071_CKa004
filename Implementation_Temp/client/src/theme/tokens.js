export const colors = {
  // Background colors
  bg: "#F8F9FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F5F5",

  // Primary colors (from Figma)
  primary: "#20B2AA",
  primaryVariant: "#4DDDD7",
  secondaryVariant: "#B3E5FC",

  // Text colors
  text: "#000000",
  textSecondary: "#6B7280",
  muted: "#9CA3AF",

  // UI colors
  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",

  // Additional colors from Figma
  lightGreen: "#A3D977",
  lightBlue: "#87CEEB",
  yellow: "#F4D03F",
  purple: "#B19CD9",
  darkGray: "#374151",

  // Logo colors
  logoBlue: "#20B2AA",
  logoGold: "#D4A574",

  // Chip and component colors
  chip: "#F0F0F0",
  chipActive: "#E0F7FA"
};

export const severityColors = {
  Extreme: "#DC2626",
  Severe: "#EA580C",
  Moderate: "#F59E0B",
  Minor: "#10B981",
  Unknown: "#64748B"
};

export const radius = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 };
export const spacing = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24, xxl: 32 };

export const type = {
  // Roboto Font Family (from Figma)
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "700", fontFamily: "Roboto" },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "700", fontFamily: "Roboto" },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "600", fontFamily: "Roboto" },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400", fontFamily: "Roboto" },
  bodyMedium: { fontSize: 15, lineHeight: 20, fontWeight: "500", fontFamily: "Roboto" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400", fontFamily: "Roboto" },
  small: { fontSize: 10, lineHeight: 14, fontWeight: "400", fontFamily: "Roboto" },

  // Button text styles
  buttonLabel: { fontSize: 16, lineHeight: 20, fontWeight: "600", fontFamily: "Roboto" },

  // Logo text style
  logo: { fontSize: 36, lineHeight: 40, fontWeight: "700", fontFamily: "Roboto" }
};

// Shadow styles from Figma
export const shadows = {
  main: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  additional: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10
  },
  upperSheet: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10
  },
  floatingAction: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 15
  }
};
