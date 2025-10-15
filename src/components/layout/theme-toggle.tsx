'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const iconStyle = 'size-8';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle between themes
  const handleToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-label="Toggle theme" />;
  }

  // Determine next theme
  const nextTheme =
    theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

  // Display icon for current theme
  const icon =
    nextTheme === 'dark' ? (
      <Moon className={iconStyle} />
    ) : nextTheme === 'light' ? (
      <Sun className={iconStyle} />
    ) : (
      <Monitor className={iconStyle} />
    );

  return (
    <Button
      variant="ghost"
      onClick={handleToggle}
      title={`Switch to ${nextTheme} theme`}
      aria-label={`Switch to ${nextTheme} theme`}
      className="h-fit py-2"
    >
      {icon}
    </Button>
  );
}
