# SALA Theme System Documentation

This app uses a centralized theme system based on React Context and design tokens. All colors, spacing, and typography are managed globally.

## How to Extend the Theme

### 1. Adding New Color Tokens
To add a new semantic color token:
1. Open `src/theme/colors.ts`.
2. Add the token to `lightColors` (the source of truth).
3. Add the corresponding dark mode value to `darkColors`.
4. The `Colors` type will automatically pick up the change.

### 2. Using the Theme in Components
Do **not** import `colors` or `theme` directly from their files. Instead, use the `useTheme` hook:

```tsx
import { useTheme } from '../theme';

const MyComponent = () => {
  const { colors, spacing, textStyles, isDark } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.textPrimary }}>Hello World</Text>
    </View>
  );
};
```

### 3. Theme Persistence
The Theme is persisted locally using `AsyncStorage`. When the app starts, the `ThemeProvider` loads the saved preference. If no preference is found, it defaults to the system theme using the `useColorScheme` hook from React Native.

## Developer Rules
- **No hardcoded colors**: Always use `colors.TOKEN_NAME`.
- **Prefer semantic tokens**: Use `colors.surface` for cards, not `colors.white`.
- **Accessibility**: Ensure new dark mode tokens maintain sufficient contrast for readability.
