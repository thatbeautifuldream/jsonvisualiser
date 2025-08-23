'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const themes = [
    {
        key: 'light',
        icon: Sun,
        label: 'Light theme',
    },
    {
        key: 'dark',
        icon: Moon,
        label: 'Dark theme',
    },
];

type TThemeSwitcherProps = {
    value?: 'light' | 'dark';
    onChange?: (theme: 'light' | 'dark') => void;
    defaultValue?: 'light' | 'dark';
    className?: string;
};

export const ThemeSwitcher = ({
    value,
    onChange,
    defaultValue = 'dark',
    className,
}: TThemeSwitcherProps) => {
    const { theme: currentTheme, setTheme } = useTheme();
    const [theme, setInternalTheme] = useControllableState({
        defaultProp: defaultValue,
        prop: value || (currentTheme as 'light' | 'dark'),
        onChange: (newTheme) => {
            setTheme(newTheme);
            onChange?.(newTheme);
        },
    });
    const [mounted, setMounted] = useState(false);

    const handleThemeClick = useCallback(
        (themeKey: 'light' | 'dark') => {
            setInternalTheme(themeKey);
        },
        [setInternalTheme]
    );

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            className={cn(
                'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
                className
            )}
        >
            {themes.map(({ key, icon: Icon, label }) => {
                const isActive = theme === key;
                return (
                    <button
                        aria-label={label}
                        className="relative h-6 w-6 rounded-full"
                        key={key}
                        onClick={() => handleThemeClick(key as 'light' | 'dark')}
                        type="button"
                    >
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-full bg-secondary"
                                layoutId="activeTheme"
                                transition={{ type: 'spring', duration: 0.5 }}
                            />
                        )}
                        <Icon
                            className={cn(
                                'relative z-10 m-auto h-4 w-4',
                                isActive ? 'text-foreground' : 'text-muted-foreground'
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}; 