import { DefaultTheme, useTheme as useThemePaper } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  // Specify custom property
  colors: {
    ...DefaultTheme.colors,
    primary: "#653B9C",
    onPrimary: "#F1F1F1",
    background: "#11131F",
    surface: "#1D1F31",
    onSurface: "#F1F1F1",
    onSurfaceVariant: "#525A67",
    backdrop: "#525A6780",
    surfaceDisabled: "#525A67",
    onSurfaceDisabled: "#A7A7A8",
    warning: "#FFE380",
    success: '#79F2C0'
  },
  sizes: {
    xs: 4,
    s: 8,
    m: 16,
    xm: 20,
    l: 32,
    xl: 45,
    xxl: 64,
  },
};

export type AppTheme = typeof theme;

export const useTheme = () => useThemePaper<typeof theme>();
