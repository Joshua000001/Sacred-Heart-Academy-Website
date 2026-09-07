import React from 'react';

interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  customSizePx?: number;
  className?: string;
  showText?: boolean;
  textSubtitle?: string;
  layout?: 'horizontal' | 'vertical';
  theme?: 'dark' | 'light' | 'white';
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  customSizePx,
  className = '',
  showText = false,
  textSubtitle = 'Garchitorena, Camarines Sur',
  layout = 'horizontal',
  theme = 'light',
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
    custom: '',
  };

  const style = customSizePx
    ? {
        width: `${customSizePx}px`,
        height: `${customSizePx}px`,
      }
    : undefined;

  const logoElement = (
    <div
      id="school-official-logo"
      className={`
        relative
        shrink-0
        select-none
        ${size !== 'custom' ? sizeMap[size] : ''}
        ${className}
      `}
      style={style}
    >
      <img
        src="/sacred-heart-logo.png"
        alt="Sacred Heart Academy Official Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (!showText) {
    return logoElement;
  }

  const isDark = theme === 'dark';
  const isWhite = theme === 'white';

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-3
        ${
          layout === 'vertical'
            ? 'flex-col text-center'
            : 'flex-row text-left'
        }
      `}
    >
      {logoElement}

      <div className="flex flex-col">
        <span
          className={`
            font-seal
            font-bold
            tracking-tight
            text-base
            sm:text-lg
            leading-tight
            uppercase
            ${
              isWhite
                ? 'text-white'
                : isDark
                ? 'text-emerald-300'
                : 'text-emerald-950'
            }
          `}
        >
          Sacred Heart Academy
        </span>

        <span
          className={`
            text-xs
            font-medium
            tracking-wide
            ${
              isWhite
                ? 'text-emerald-200'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-500'
            }
          `}
        >
          {textSubtitle}
        </span>
      </div>
    </div>
  );
};