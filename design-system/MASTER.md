# Design System — Trò Chơi Hầu

## Stack
- Next.js 16 + React 19 + Tailwind v4 + shadcn/ui (base-nova)
- Font: **Be Vietnam Pro** (vietnamese subset) via `next/font/google`
- Icons: Lucide React (shadcn default)
- Theme: **Light only** (ưu tiên projector/big screen)

## Color Palette

### shadcn Semantic Colors
| Token (Tailwind class) | Role | Visual |
|------------------------|------|--------|
| `bg-primary` / `text-primary` | Brand violet | #7C3AED |
| `bg-primary-foreground` | Text on primary | white |
| `bg-secondary` | Light violet surface | #EDE9FE |
| `bg-muted` | Neutral surface | #F1F5F9 |
| `text-muted-foreground` | Subdued text | #64748B |
| `bg-accent` / `text-accent` | CTA orange | #F97316 |
| `bg-background` | Page background | #F8FAFC |
| `text-foreground` | Main text | #0F172A |
| `border-border` | Borders | #E2E8F0 |

### Role Colors (Custom)
| Class | Vai tro | Hex | Light BG |
|-------|---------|-----|----------|
| `bg-role-genz` | Gen Z | #7C3AED | `bg-role-genz-light` #EDE9FE |
| `bg-role-investor` | Nha dau tu | #D97706 | `bg-role-investor-light` #FEF3C7 |
| `bg-role-tourist` | Khach du lich | #0284C7 | `bg-role-tourist-light` #E0F2FE |

Foreground classes: `text-role-genz-foreground`, `text-role-investor-foreground`, `text-role-tourist-foreground` (all white).

### Game Utilities
| Class | Use |
|-------|-----|
| `bg-game-accent` | Primary CTA button | 
| `text-game-success` | Completed state |
| `shadow-glow-genz` | Glow effect for Gen Z card |
| `shadow-glow-investor` | Glow effect for Investor card |
| `shadow-glow-tourist` | Glow effect for Tourist card |

## Typography — Be Vietnam Pro

| Level | Class | Size | Weight |
|-------|-------|------|--------|
| Display | `text-[3.5rem] font-bold leading-[1.1]` | 56px | 700 |
| H1 | `text-4xl font-bold` | 36px | 700 |
| H2 | `text-2xl font-semibold` | 24px | 600 |
| H3 | `text-xl font-semibold` | 20px | 600 |
| Body | `text-lg` | 18px | 400 |
| Caption | `text-sm font-medium` | 14px | 500 |

Body text larger than normal (18px) for projector readability.

## Border Radius
Base `--radius: 0.75rem` (12px). Playful/rounded feel.
- `rounded-sm` = 7.2px
- `rounded-md` = 9.6px  
- `rounded-lg` = 12px
- `rounded-xl` = 16.8px
- `rounded-2xl` = 21.6px

## Shadows
Use shadcn defaults + custom glow utilities for role cards.

## Animation Tokens (for components)
| Duration | Use |
|----------|-----|
| 150ms | Hover, micro-interaction |
| 300ms | State transitions |
| 600ms | Card flip reveal |
| 1000ms | Dramatic reveal, drumroll |

Easing:
- Bounce: `cubic-bezier(0.34, 1.56, 0.64, 1)` — card flip, vui nhon
- Smooth: `cubic-bezier(0.4, 0, 0.2, 1)` — page transition

## 3D Card Flip Utilities
```
.perspective-1000  → perspective: 1000px
.preserve-3d       → transform-style: preserve-3d
.backface-hidden   → backface-visibility: hidden
.rotate-y-180      → transform: rotateY(180deg)
```

## Anti-patterns
- Do NOT use dark theme for projector use
- Do NOT use emojis as icons — use Lucide
- Do NOT use font sizes < 16px for content shown on projector
- Do NOT use low-contrast muted colors for important game info
