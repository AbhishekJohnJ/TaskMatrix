import { useSelector, useDispatch } from 'react-redux';
import { setTheme as setThemeAction, toggleTheme as toggleThemeAction } from '../redux/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const setTheme = (newTheme) => {
    dispatch(setThemeAction(newTheme));
  };

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
};
