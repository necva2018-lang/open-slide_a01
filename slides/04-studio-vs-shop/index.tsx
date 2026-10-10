import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  Step,
  Steps,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useState } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#f8f2f4', text: '#2d1b24', accent: '#7a2e4d' },
  fonts: {
    display: '"Noto Serif TC", "Source Han Serif TC", "PMingLiU", "Songti TC", serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#675058',
  line: '#e6d6dc',
  panel: '#f0e4e9',
  berry: '#a64710',
  dark: '#2b1621',
  darkText: '#f8f2f4',
  darkMuted: '#d9c2cc',
  gold: '#ebb86d',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-04-studio-vs-shop';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

const serif = 'var(--osd-font-display)';

/* ---------- 共用元件 ---------- */

const Footer = ({ dark }: { dark?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom: 40,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 24,
        color: dark ? C.darkMuted : C.muted,
      }}
    >
      <span>個人工作室 vs. 實體門市，該如何選擇？</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '看懂第一年', from: 6, to: 12 },
  { name: '被迫成長', from: 13, to: 16 },
  { name: '選擇與初心', from: 17, to: 20 },
  { name: '收尾', from: 21, to: 26 },
];

const ProgressBar = ({ dark }: { dark?: boolean }) => {
  const { current } = useSlidePageNumber();
  if (current === 1) return null;
  const active = CHAPTERS.findIndex((c) => current >= c.from && current <= c.to);
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        top: 28,
        display: 'flex',
        gap: 14,
      }}
    >
      {CHAPTERS.map((c, i) => {
        const len = c.to - c.from + 1;
        const fill = current > c.to ? 1 : current < c.from ? 0 : (current - c.from + 1) / len;
        const on = i === active;
        return (
          <div key={c.name} style={{ flex: len }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: on ? 700 : 400,
                color: on ? (dark ? C.gold : 'var(--osd-accent)') : dark ? C.darkMuted : C.muted,
                marginBottom: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {c.name}
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: dark ? 'rgba(255,255,255,0.22)' : C.line,
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: '100%',
                  borderRadius: 3,
                  background: dark ? C.gold : 'var(--osd-accent)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Slide = ({
  dark,
  center,
  children,
}: {
  dark?: boolean;
  center?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: dark ? C.dark : 'var(--osd-bg)',
      color: dark ? C.darkText : 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
      padding: '96px 140px 110px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: center ? 'center' : 'flex-start',
      WebkitFontSmoothing: 'antialiased',
    }}
  >
    <ProgressBar dark={dark} />
    {children}
    <Footer dark={dark} />
  </div>
);

const Eyebrow = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <div
    style={{
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: '0.12em',
      color: dark ? C.gold : 'var(--osd-accent)',
      marginBottom: 20,
    }}
  >
    {children}
  </div>
);

const H = ({
  children,
  size = 72,
  dark,
  style,
}: {
  children: ReactNode;
  size?: number;
  dark?: boolean;
  style?: CSSProperties;
}) => (
  <h2
    style={{
      fontFamily: serif,
      fontSize: size + 8,
      fontWeight: 700,
      lineHeight: 1.25,
      margin: 0,
      color: dark ? C.darkText : 'var(--osd-text)',
      ...style,
    }}
  >
    {children}
  </h2>
);

const Tag = ({ children = '延伸建議' }: { children?: ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      fontSize: 28,
      fontWeight: 700,
      color: 'var(--osd-accent)',
      border: '2px solid var(--osd-accent)',
      borderRadius: 999,
      padding: '2px 16px',
      marginLeft: 16,
      verticalAlign: 'middle',
      letterSpacing: '0.04em',
    }}
  >
    {children}
  </span>
);

const Note = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 30, color: C.muted, marginTop: 28 }}>{children}</div>
);

// 標題下方的內容區：吃掉剩餘高度並垂直置中，避免頁面下半部留白
const Body = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '32px 40px',
      ...style,
    }}
  >
    {children}
  </div>
);

const Row = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
    <div
      style={{
        flex: 'none',
        width: 88,
        height: 88,
        borderRadius: 999,
        background: 'var(--osd-accent)',
        color: C.darkText,
        fontFamily: serif,
        fontSize: 48,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div style={{ fontSize: 50, lineHeight: 1.45 }}>{children}</div>
  </div>
);


/* ---------- 共用頁面零件（所有簡報相同） ---------- */

const GroupBox = ({ tag, title, items }: { tag: string; title: string; items: string[] }) => (
  <div
    style={{
      flex: 1,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '44px 36px',
    }}
  >
    <div
      style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.1em' }}
    >
      {tag}
    </div>
    <div style={{ fontFamily: serif, fontSize: 64, fontWeight: 700, margin: '12px 0 28px' }}>
      {title}
    </div>
    {items.map((t) => (
      <div key={t} style={{ fontSize: 40, lineHeight: 1.6, whiteSpace: 'nowrap' }}>
        {t}
      </div>
    ))}
  </div>
);

const Chapter = ({ no, title, sub }: { no: string; title: string; sub: string }) => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
      <div
        style={{
          fontFamily: serif,
          fontSize: 300,
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--osd-accent)',
        }}
      >
        {no}
      </div>
      <div>
        <H size={112}>{title}</H>
        <div style={{ fontSize: 44, color: C.muted, marginTop: 24 }}>{sub}</div>
      </div>
    </div>
  </Slide>
);

const Summary = ({ label, line }: { label: string; line: string }) => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>
      {label}
    </div>
    <H size={104} dark style={{ marginTop: 28, lineHeight: 1.3 }}>
      {line}
    </H>
  </Slide>
);

const Q = ({ n, children }: { n: string; children: ReactNode }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '44px 40px' }}>
    <div style={{ fontFamily: serif, fontSize: 88, fontWeight: 700, color: 'var(--osd-accent)' }}>
      {n}
    </div>
    <div style={{ fontSize: 46, lineHeight: 1.4 }}>{children}</div>
  </Card>
);

const Col = ({ tag, title, body }: { tag: string; title: string; body: string }) => (
  <div
    style={{
      flex: 1,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '52px 40px',
    }}
  >
    <div
      style={{
        fontFamily: serif,
        fontSize: 44,
        fontWeight: 700,
        color: C.darkText,
        background: 'var(--osd-accent)',
        display: 'inline-block',
        padding: '4px 28px',
        borderRadius: 999,
      }}
    >
      {tag}
    </div>
    <div
      style={{
        fontFamily: serif,
        fontSize: 58,
        fontWeight: 700,
        margin: '32px 0 20px',
        lineHeight: 1.3,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 40, lineHeight: 1.6, color: C.muted, whiteSpace: 'pre-line' }}>
      {body}
    </div>
  </div>
);

const TRow = ({ who, how, last }: { who: string; how: string; last?: boolean }) => (
  <div
    style={{
      display: 'flex',
      gap: 48,
      padding: '28px 0',
      borderBottom: last ? 'none' : `2px solid ${C.line}`,
      fontSize: 42,
      lineHeight: 1.45,
    }}
  >
    <div style={{ flex: '0 0 480px', fontWeight: 700, color: 'var(--osd-accent)' }}>{who}</div>
    <div style={{ flex: 1 }}>{how}</div>
  </div>
);

// 翻牌卡：點一下，以 3D 旋轉翻到背面（需在播放模式 F 才點得動）
const FACE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  padding: '0 44px',
  borderRadius: 'var(--osd-radius)',
  fontSize: 44,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

const Flip = ({
  front,
  back,
  hint = '點一下看答案',
  h = 128,
}: {
  front: string;
  back: string;
  hint?: string;
  h?: number;
}) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      data-osd-interactive
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: 1400, cursor: 'pointer', height: h }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
        }}
      >
        <div style={{ ...FACE, background: C.panel }}>
          <div style={{ flex: 1, fontWeight: 700 }}>{front}</div>
          <div style={{ fontSize: 30, color: C.muted }}>{hint}</div>
        </div>
        <div
          style={{
            ...FACE,
            background: C.dark,
            color: C.darkText,
            transform: 'rotateX(180deg)',
          }}
        >
          <div style={{ flex: '0 0 640px', fontWeight: 700, fontSize: 40, lineHeight: 1.2 }}>{front}</div>
          <div style={{ color: C.gold, fontSize: 48 }}>→</div>
          <div style={{ flex: 1, fontSize: 38, lineHeight: 1.2 }}>{back}</div>
        </div>
      </div>
    </div>
  );
};

const Chip = ({ children, strong }: { children: ReactNode; strong?: boolean }) => (
  <div
    style={{
      background: strong ? C.dark : C.panel,
      color: strong ? C.darkText : 'var(--osd-text)',
      borderRadius: 999,
      padding: '14px 36px',
      fontSize: 42,
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const Arrow = () => <div style={{ fontSize: 44, color: 'var(--osd-accent)' }}>→</div>;

const Pair = ({
  tag,
  title,
  lines,
  tagExtra,
}: {
  tag: string;
  title: string;
  lines: ReactNode[];
  tagExtra?: boolean;
}) => (
  <Card style={{ flex: 1, padding: '44px 44px' }}>
    <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.08em' }}>
      {tag}
      {tagExtra ? <Tag /> : null}
    </div>
    <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, margin: '12px 0 24px', lineHeight: 1.3 }}>
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 40, lineHeight: 1.5 }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  </Card>
);

const Vote = ({ n, children }: { n: string; children: ReactNode }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '22px 40px' }}>
    <div style={{ fontFamily: serif, fontSize: 68, fontWeight: 700, color: 'var(--osd-accent)' }}>{n}</div>
    <div style={{ fontSize: 48 }}>{children}</div>
  </Card>
);

const T3 = ({
  a,
  b,
  c,
  head,
  warn,
  cols = '300px 1fr 1fr',
}: {
  a: string;
  b: string;
  c: string;
  head?: boolean;
  warn?: boolean;
  cols?: string;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: cols,
      gap: 32,
      padding: '18px 0',
      borderBottom: `2px solid ${C.line}`,
      fontSize: head ? 40 : 38,
      fontWeight: head ? 700 : 400,
      color: head ? 'var(--osd-accent)' : 'var(--osd-text)',
      lineHeight: 1.4,
    }}
  >
    <div style={{ fontWeight: 700, color: head ? 'var(--osd-accent)' : C.muted }}>{a}</div>
    <div>{b}</div>
    <div style={{ color: warn ? C.berry : undefined, fontWeight: warn ? 700 : head ? 700 : 400 }}>{c}</div>
  </div>
);


const ChgRow = ({ n, title, line }: { n: string; title: string; line: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 36,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '30px 44px',
    }}
  >
    <div
      style={{
        flex: 'none',
        width: 88,
        height: 88,
        borderRadius: 999,
        background: 'var(--osd-accent)',
        color: C.darkText,
        fontFamily: serif,
        fontSize: 50,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div>
      <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 700, lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{ fontSize: 38, lineHeight: 1.5, color: C.muted, marginTop: 6 }}>{line}</div>
    </div>
  </div>
);


const T2 = ({ a, b, head, warn }: { a: string; b: string; head?: boolean; warn?: boolean }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      gap: 32,
      padding: '22px 0',
      borderBottom: `2px solid ${C.line}`,
      fontSize: head ? 40 : 40,
      fontWeight: head ? 700 : 400,
      color: head ? 'var(--osd-accent)' : 'var(--osd-text)',
      lineHeight: 1.45,
    }}
  >
    <div style={{ fontWeight: 700, color: head ? 'var(--osd-accent)' : C.muted }}>{a}</div>
    <div style={{ color: warn ? C.berry : undefined, fontWeight: warn ? 700 : undefined }}>{b}</div>
  </div>
);


/* ---------- 04 專用小元件 ---------- */

const SLICES = ['var(--osd-accent)', C.berry, C.gold, C.muted, C.dark, C.darkMuted, C.line];
const SLICE_TEXT = [C.darkText, C.darkText, C.dark, C.darkText, C.darkText, C.dark, C.dark];

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
};

const Pie = ({ data, size }: { data: { label: string; pct: number }[]; size: number }) => {
  const r = size / 2 - 4;
  const c = size / 2;
  let acc = -Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {data.map((d, i) => {
        const a0 = acc;
        const a1 = acc + (d.pct / 100) * Math.PI * 2;
        acc = a1;
        const mid = (a0 + a1) / 2;
        return (
          <g key={d.label}>
            <path d={arc(c, c, r, a0, a1)} fill={SLICES[i]} stroke={C.panel} strokeWidth="4" />
            {d.pct >= 10 ? (
              <text
                x={c + r * 0.62 * Math.cos(mid)}
                y={c + r * 0.62 * Math.sin(mid) + 11}
                textAnchor="middle"
                fontSize="32"
                fontWeight="700"
                fill={SLICE_TEXT[i]}
              >
                {d.pct}%
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

const PieBlock = ({
  title,
  data,
}: {
  title: string;
  data: { label: string; pct: number }[];
}) => (
  <Card style={{ flex: 1, padding: '32px 36px' }}>
    <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, marginBottom: 20 }}>{title}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <Pie data={data} size={300} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 34, lineHeight: 1.3 }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap' }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: SLICES[i], border: `2px solid ${C.muted}` }} />
            {d.label} {d.pct}%
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const Skill = ({ name, score }: { name: string; score: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 38 }}>
    <div style={{ flex: '0 0 190px' }}>{name}</div>
    <div style={{ flex: 1, height: 28, borderRadius: 14, background: C.line }}>
      <div
        style={{
          width: `${score * 10}%`,
          height: '100%',
          borderRadius: 14,
          background: score >= 8 ? 'var(--osd-accent)' : score >= 5 ? C.muted : C.darkMuted,
        }}
      />
    </div>
    <div style={{ flex: '0 0 50px', textAlign: 'right', fontFamily: serif, fontWeight: 700 }}>{score}</div>
  </div>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1100 }}>
        <Eyebrow>職訓班課程｜餐飲創業</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 104, fontWeight: 700, lineHeight: 1.22, margin: '0 0 36px' }}>
          個人工作室
          <br />
          vs. 實體門市，
          <br />
          該如何選擇？
        </h1>
        <div style={{ fontSize: 46, color: 'var(--osd-accent)', fontWeight: 500 }}>
          烘焙新手老闆的第一個關鍵抉擇
        </div>
      </div>
      <svg width="540" height="400" viewBox="0 0 540 400" aria-hidden="true">
        <rect x="10" y="60" width="240" height="300" rx="14" fill={C.panel} stroke={C.muted} strokeWidth="5" />
        <path d="M30 150 L130 80 L230 150" fill="none" stroke={C.muted} strokeWidth="6" strokeLinejoin="round" />
        <rect x="60" y="230" width="80" height="130" fill={C.line} stroke={C.muted} strokeWidth="4" />
        <rect x="160" y="270" width="70" height="90" fill="var(--osd-accent)" opacity="0.85" />
        <line x1="150" y1="250" x2="150" y2="360" stroke={C.muted} strokeWidth="4" />
        <rect x="290" y="60" width="240" height="300" fill={C.panel} stroke={C.muted} strokeWidth="5" />
        <path d="M280 60 L295 10 H525 L540 60 Z" fill="var(--osd-accent)" />
        <path d="M335 10 L330 60 M385 10 L382 60 M435 10 L434 60 M485 10 L486 60" stroke={C.panel} strokeWidth="10" />
        <rect x="330" y="130" width="160" height="230" fill={C.dark} />
        <rect x="350" y="150" width="120" height="90" fill={C.line} opacity="0.5" />
        <text x="130" y="392" textAnchor="middle" fontSize="30" fill={C.muted}>工作室</text>
        <text x="410" y="392" textAnchor="middle" fontSize="30" fill={C.muted}>門市</text>
      </svg>
    </div>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先投票</Eyebrow>
    <H size={72}>
      進廚房的時間會越來越少，
      <br />
      你還會想創業嗎？
    </H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Vote n="A">會</Vote>
        <Vote n="B">不會</Vote>
        <Vote n="C">找人經營，我待在廚房</Vote>
      </div>
      <Note>先舉手記下票數，最後一頁再投一次</Note>
    </Body>
  </Slide>
);

const Path: Page = () => (
  <Slide>
    <Eyebrow>常見的創業路徑</Eyebrow>
    <H size={72}>從工作室走到門市，常常會卡住</H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <Chip>喜歡手作</Chip>
        <Arrow />
        <Chip>個人工作室</Chip>
        <Arrow />
        <Chip>生意穩定</Chip>
        <Arrow />
        <Chip strong>開實體門市</Chip>
      </div>
      <div style={{ marginTop: 48, display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1.2, padding: '36px 44px' }}>
          <div style={{ fontSize: 46, lineHeight: 1.55 }}>
            不少工作室做得不錯的老闆，
            <br />
            換到門市卻
            <b style={{ color: C.berry }}>很不適應</b>。
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '36px 44px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 46, lineHeight: 1.55 }}>
            <b style={{ color: C.gold }}>心態</b>和<b style={{ color: C.gold }}>工作重心</b>，
            <br />
            完全不同。
          </div>
        </Card>
      </div>
    </Body>
  </Slide>
);

const NotThis: Page = () => (
  <Slide>
    <Eyebrow>先講清楚</Eyebrow>
    <H size={88}>這場不是什麼</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, fontSize: 54 }}>
        <Steps>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是告訴你哪一個比較好
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是教你怎麼做甜點
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是勸你別開店
            </div>
          </Step>
          <Step>
            <div
              style={{
                marginTop: 20,
                background: C.panel,
                borderRadius: 'var(--osd-radius)',
                padding: '28px 40px',
                fontWeight: 700,
              }}
            >
              <span style={{ color: 'var(--osd-accent)', marginRight: 24 }}>✓</span>
              是看清楚兩種型態，各要承擔什麼
            </div>
          </Step>
        </Steps>
      </div>
    </Body>
  </Slide>
);

const Agenda: Page = () => (
  <Slide>
    <Eyebrow>今天的順序</Eyebrow>
    <H size={88}>3 件事，一步步看</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <GroupBox tag="第一組" title="看懂第一年" items={['時間怎麼分', '能力怎麼練']} />
        <GroupBox tag="第二組" title="被迫成長" items={['第一年之後', '專業分工']} />
        <GroupBox tag="第三組" title="選擇與初心" items={['我該選哪個', '初心三問']} />
      </div>
    </Body>
  </Slide>
);

/* ---------- 第一組：看懂第一年 ---------- */

const Ch1: Page = () => <Chapter no="01" title="看懂第一年" sub="工作室 vs. 門市" />;

const Table: Page = () => (
  <Slide>
    <Eyebrow>第一年的差別</Eyebrow>
    <H size={72}>一張表看懂本質差異</H>
    <Body>
      <div>
        <T3 head a="" b="個人工作室" c="實體門市" />
        <T3 a="固定成本" b="低" c="每月十幾萬起跳" />
        <T3 a="收入" b="有上限，淨利可達 50%" c="無上限，但也無下限" warn />
        <T3 a="老闆的生產時間" b="60%" c="5%" />
        <T3 a="最重要的能力" b="手藝、社群" c="品牌、商業直覺、行銷、文案" />
        <T3 a="風險" b="低，倒了不影響人生" c="高，可能背幾百萬的債" />
        <T3 a="自由度" b="想做就做" c="每月被迫達標" />
      </div>
      <Note>數字是業界創業者的經驗估算，不是統計</Note>
    </Body>
  </Slide>
);

const Pies: Page = () => (
  <Slide>
    <Eyebrow>第一年，老闆的時間怎麼分</Eyebrow>
    <H size={72}>工作室動手，門市動腦</H>
    <Body>
      <div style={{ display: 'flex', gap: 32 }}>
        <PieBlock
          title="個人工作室"
          data={[
            { label: '研發及生產', pct: 60 },
            { label: '行銷及訂單', pct: 20 },
            { label: '內部管理', pct: 10 },
            { label: '包裝出貨', pct: 5 },
            { label: '面交', pct: 5 },
          ]}
        />
        <PieBlock
          title="實體門市"
          data={[
            { label: '生產', pct: 5 },
            { label: '研發', pct: 15 },
            { label: '社群', pct: 20 },
            { label: '人事', pct: 20 },
            { label: '行銷', pct: 20 },
            { label: '財務', pct: 5 },
            { label: '其他', pct: 15 },
          ]}
        />
      </div>
      <Note>進廚房的時候，通常是產品出問題要補救。比例是經驗估算，不是統計</Note>
    </Body>
  </Slide>
);

const Skills: Page = () => (
  <Slide>
    <Eyebrow>第一年最需要的能力（滿分 10）</Eyebrow>
    <H size={72}>手藝，從 8 分降到 5 分</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1, padding: '36px 40px' }}>
          <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, marginBottom: 20 }}>個人工作室</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Skill name="手藝" score={8} />
            <Skill name="社群經營" score={8} />
            <Skill name="品牌與行銷" score={2} />
            <Skill name="財務管理" score={2} />
            <Skill name="人脈經營" score={2} />
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '36px 40px' }}>
          <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, marginBottom: 20 }}>實體門市</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Skill name="品牌管理" score={8} />
            <Skill name="商業直覺" score={8} />
            <Skill name="行銷能力" score={8} />
            <Skill name="文案寫作" score={8} />
            <Skill name="手藝" score={5} />
          </div>
        </Card>
      </div>
      <Note>分數是業界創業者的主觀評分，不是統計</Note>
    </Body>
  </Slide>
);

const Cost: Page = () => (
  <Slide>
    <Eyebrow>門市的第一年</Eyebrow>
    <H size={72}>月初什麼都還沒做，錢已經在等</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1, padding: '40px 44px' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)' }}>每月固定成本，十幾萬起跳</div>
          <div style={{ fontSize: 46, lineHeight: 1.7, marginTop: 12 }}>
            房租
            <br />
            貸款＋利息
            <br />
            人事
            <br />
            設備攤提
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '40px 44px' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)' }}>還要應付這些人</div>
          <div style={{ fontSize: 46, lineHeight: 1.7, marginTop: 12 }}>
            房東、廠商、員工
            <br />
            勞健保局、衛生局
            <br />
            國稅局、鄰居
          </div>
        </Card>
      </div>
      <div style={{ fontFamily: serif, fontSize: 42, fontWeight: 700, color: C.berry, marginTop: 36, lineHeight: 1.5 }}>
        好不容易繳清，正要去買雞排慶祝，下個月又開始了。
      </div>
    </Body>
  </Slide>
);

const ProsCons: Page = () => (
  <Slide>
    <Eyebrow>優點與缺點</Eyebrow>
    <H size={72}>各有各的代價</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1, padding: '36px 44px' }}>
          <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 700 }}>個人工作室</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)', margin: '16px 0 6px' }}>優點</div>
          <div style={{ fontSize: 38, lineHeight: 1.5 }}>
            一人飽全家飽，進可攻退可守
            <br />
            風險低，倒了不影響人生
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.berry, margin: '16px 0 6px' }}>缺點</div>
          <div style={{ fontSize: 38, lineHeight: 1.5 }}>
            只有自己生產，營收有限
            <br />
            工時長，有做才有賺
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '36px 44px' }}>
          <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 700 }}>實體門市</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)', margin: '16px 0 6px' }}>優點</div>
          <div style={{ fontSize: 38, lineHeight: 1.5 }}>
            時間自由，放假也有人幫你賺
            <br />
            收入不容易有上限
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.berry, margin: '16px 0 6px' }}>缺點</div>
          <div style={{ fontSize: 38, lineHeight: 1.5 }}>
            初期投資高、參與的人多
            <br />
            <b style={{ color: C.berry }}>收入沒有下限，最可怕</b>
          </div>
        </Card>
      </div>
    </Body>
  </Slide>
);

const Sum1: Page = () => <Summary label="這一組只記一句" line="差別的根源，只有固定成本" />;

/* ---------- 第二組：被迫成長 ---------- */

const Ch2: Page = () => <Chapter no="02" title="被迫成長" sub="第一年之後" />;

const GROW_COLS = '190px 1fr 330px';

const Grow: Page = () => (
  <Slide>
    <Eyebrow>第一年之後</Eyebrow>
    <H size={72}>兩種型態，都會被推著長大</H>
    <Body>
      <div>
        <T3 cols={GROW_COLS} head a="型態" b="情境" c="結果" />
        <T3 cols={GROW_COLS} a="工作室 ①" b="不滿足收入上限，請人、添設備、換大場地" c="規模變得像門市" />
        <T3 cols={GROW_COLS} a="工作室 ②" b="年紀漸長、體力下滑、家庭壓力，只好請員工" c="規模變得像門市" />
        <T3 cols={GROW_COLS} a="門市 ①" b="新店越來越多，品牌老化，要開新產品線" c="被迫成長" />
        <T3 cols={GROW_COLS} a="門市 ②" b="不想擴張，員工學不到新東西，留不住" c="老闆要逼自己成長" />
      </div>
      <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, color: C.berry, marginTop: 36 }}>
        持續成長，是品牌活下去的唯一方法。
      </div>
    </Body>
  </Slide>
);

const Division: Page = () => (
  <Slide>
    <Eyebrow>最終的樣子</Eyebrow>
    <H size={72}>走向專業分工，老闆只剩經營管理</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div
          style={{
            background: C.dark,
            color: C.darkText,
            borderRadius: 'var(--osd-radius)',
            padding: '20px 56px',
            fontFamily: serif,
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          老闆：經營管理 100%
        </div>
        <div style={{ width: 4, height: 28, background: C.muted }} />
        <div style={{ width: '88%', height: 4, background: C.muted }} />
        <div style={{ display: 'flex', gap: 24, width: '100%', marginTop: 0 }}>
          {['研發', '生產', '行銷', '財務', '電商與社群'].map((t) => (
            <div key={t} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ width: 4, height: 24, background: C.muted, margin: '0 auto' }} />
              <div
                style={{
                  background: C.panel,
                  borderRadius: 'var(--osd-radius)',
                  padding: '22px 8px',
                  fontSize: 40,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {t}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 42, lineHeight: 1.6, marginTop: 40 }}>
        動腦的時間越來越長，動手的時間越來越短。
        <br />
        不必樣樣自己做，但下決策前要了解每個面向的後續影響。
      </div>
    </Body>
  </Slide>
);

const Sum2: Page = () => <Summary label="這一組只記一句" line="動手越來越少，動腦越來越多" />;

/* ---------- 第三組：選擇與初心 ---------- */

const Ch3: Page = () => <Chapter no="03" title="選擇與初心" sub="你要承擔什麼" />;

const Check: Page = () => (
  <Slide>
    <Eyebrow>
      選擇前的自我檢核
      <Tag />
    </Eyebrow>
    <H size={72}>我該選哪一個？</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="適合先從工作室開始"
          title="如果你…"
          lines={['資金有限，承受不了每月固定支出', '還在測試產品和市場反應', '有正職或家庭，時間不固定']}
        />
        <Pair
          tag="可以考慮實體門市"
          title="如果你…"
          lines={['已有穩定訂單和陌生客群', '準備好周轉金，算過損益平衡點', '願意從做甜點，轉成管理人和品牌']}
        />
      </div>
    </Body>
  </Slide>
);

const Heart: Page = () => (
  <Slide>
    <Eyebrow>給喜歡做甜點的人</Eyebrow>
    <H size={72}>初心三問</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Row n="1">事業被迫成長後，你還有多少時間能親自製作？</Row>
        <Row n="2">如果知道幾年後再也進不了廚房，你還會開始嗎？</Row>
        <Row n="3">發現和當初「喜歡做甜點」的初心不同，你會放棄嗎？</Row>
      </div>
      <Note>一位業界創業者的看法：品牌像自己的孩子，只要還在賺錢，沒必要放棄</Note>
    </Body>
  </Slide>
);

const Sum3: Page = () => <Summary label="這一組只記一句" line="不能只會做，要會經營管理" />;

/* ---------- 收尾 ---------- */

const Pitfalls: Page = () => (
  <Slide>
    <Eyebrow>踩坑分享</Eyebrow>
    <H size={72}>轉型時，最常卡在這 5 關</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Flip front="月初什麼都還沒做" back="房租、貸款、薪水已經在等" hint="點一下看後果" h={100} />
        <Flip front="連續幾個月低於損益平衡點" back="可能背好幾年的債" hint="點一下看後果" h={100} />
        <Flip front="事業被迫成長" back="規模不知不覺像門市" hint="點一下看後果" h={100} />
        <Flip front="只想維持現狀" back="員工學不到新東西，留不住" hint="點一下看後果" h={100} />
        <Flip front="手藝一直放不下" back="經營管理佔掉 100% 時間" hint="點一下看後果" h={100} />
      </div>
    </Body>
  </Slide>
);

const Tool: Page = () => (
  <Slide>
    <Eyebrow>今天帶走的工具</Eyebrow>
    <H size={72}>我的時間分配圓餅圖</H>
    <Body>
      <div style={{ display: 'flex', gap: 72, alignItems: 'center' }}>
        <svg width="430" height="430" viewBox="0 0 430 430" aria-hidden="true">
          <circle cx="215" cy="215" r="200" fill="none" stroke={C.muted} strokeWidth="6" strokeDasharray="18 14" />
          <line x1="215" y1="215" x2="215" y2="15" stroke={C.line} strokeWidth="5" />
          <text x="215" y="240" textAnchor="middle" fontSize="60" fontWeight="700" fill={C.muted}>
            我的
          </text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Row n="1">列出你一週的工作項目</Row>
          <Row n="2">填上各佔幾 %，加起來 100%</Row>
          <Row n="3">對照工作室、門市，看你像哪一邊</Row>
        </div>
      </div>
    </Body>
  </Slide>
);

const Outcome: Page = () => (
  <Slide>
    <Eyebrow>預期的成果</Eyebrow>
    <H size={72}>能力，不知不覺變成你的專業</H>
    <Body>
      <div style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
        <Card style={{ flex: 1, padding: '32px 36px' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>
            工作室期
            <Tag />
          </div>
          <div style={{ fontSize: 40, lineHeight: 1.5, marginTop: 12 }}>
            產品力、社群基本盤、<br />第一批陌生客
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '32px 36px' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>門市期</div>
          <div style={{ fontSize: 40, lineHeight: 1.5, marginTop: 12 }}>
            團隊、品牌知名度、<br />穩定營運系統
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '32px 36px' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>成熟期</div>
          <div style={{ fontSize: 40, lineHeight: 1.5, marginTop: 12 }}>
            專業分工的公司，<br />老闆成為經營者
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 42, lineHeight: 1.6, marginTop: 40 }}>
        因為真心喜歡，所以學得快；邊經營邊學，還能賺到錢。
      </div>
      <div style={{ fontFamily: serif, fontSize: 42, fontWeight: 700, color: C.berry, marginTop: 12, lineHeight: 1.5 }}>
        能在自己喜歡的產業，做自己擅長的事，也挺幸福的。
      </div>
    </Body>
  </Slide>
);

const DiscussQA: Page = () => (
  <Slide>
    <Eyebrow>課堂討論＋ Q&amp;A</Eyebrow>
    <H size={72}>先聊 3 分鐘，再來問答</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Row n="1">你的條件（資金、時間、家庭），適合哪一種？</Row>
        <Row n="2">你願意從做甜點，變成經營品牌的人嗎？</Row>
        <Row n="3">選 C 的人：你要找什麼樣的人？給他什麼？</Row>
      </div>
      <div style={{ fontFamily: serif, fontSize: 64, fontWeight: 700, color: 'var(--osd-accent)', marginTop: 56 }}>
        Q&amp;A　有問題，現在問
      </div>
    </Body>
  </Slide>
);

const TakeAway: Page = () => (
  <Slide>
    <Eyebrow>今天帶走的三樣</Eyebrow>
    <H size={72}>一個觀念、一個工具、一個行動</H>
    <Body>
      <div style={{ display: 'flex', gap: 36 }}>
        <Col tag="觀念" title="差在固定成本" body={'門市收入無上限\n也無下限'} />
        <Col tag="工具" title="時間分配圓餅圖" body={'畫出你的一週\n對照兩種型態'} />
        <Col tag="行動" title="寫下你的選擇" body={'工作室或門市\n以及你的理由'} />
      </div>
    </Body>
  </Slide>
);

const Closing: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>
      最後一句話
    </div>
    <H size={112} dark style={{ marginTop: 32, lineHeight: 1.3 }}>
      不能只會做，
      <br />
      要會經營管理。
    </H>
    <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 48, lineHeight: 1.6 }}>
      再投一次：進廚房的時間會越來越少，你還會想創業嗎？
      <br />
      <span style={{ color: C.gold }}>A 會　B 不會　C 找人經營，我待在廚房</span>
    </div>
  </Slide>
);

export const notes: (string | undefined)[] = [
  '歡迎大家。今天不教做甜點，而是談你要用哪一種方式，把甜點變成事業。',
  '先請大家投票。如果知道創業後，進廚房的時間會越來越少，你還會想創業嗎？A 會、B 不會、C 找人經營，我待在廚房。記下票數，最後一頁再投一次。',
  '很多人是這樣開始的：喜歡手作，先開個人工作室，生意穩定後開實體門市。但不少工作室做得不錯的老闆，換到門市卻很不適應。這位業界創業者自己是工作室做兩年才開門市，親身體會到兩者在心態和工作重心上完全不同。',
  '先講清楚這場不是什麼：不是告訴你哪個比較好，不是教你做甜點，也不是勸你別開店。是看清楚兩種型態各要承擔什麼。',
  '今天分三組：先看懂第一年的差別，再看第一年之後為什麼被迫成長，最後談怎麼選擇和初心。',
  undefined,
  '第一年的差別，一張表看完。固定成本：工作室低，門市每月十幾萬起跳。收入：工作室有上限，淨利可到 50%；門市無上限，但也無下限，這點最可怕。老闆生產時間：60% 對 5%。最重要的能力：手藝、社群，對上品牌、商業直覺、行銷、文案。風險：工作室低，門市可能背幾百萬債。這些數字是業界創業者的經驗估算，不是統計。差異的根源只有一個：固定成本。',
  '看看老闆的時間怎麼分。工作室：研發及生產 60%，行銷及訂單 20%，內部管理 10%，包裝出貨和面交各 5%。門市：生產只有 5%，研發 15%，社群、人事、行銷各 20%，財務 5%，其他 15%。進廚房的時候，通常是產品出問題要補救。',
  '再看能力，滿分 10 分。工作室最重要的是手藝 8、社群 8，品牌行銷、財務、人脈各 2。門市則是品牌管理、商業直覺、行銷、文案各 8，手藝降到 5。分數是主觀評分，不是統計。',
  '門市第一年，月初什麼都還沒做，房租、貸款加利息、人事、設備攤提，每月十幾萬起跳已經在等。還要應付房東、廠商、員工、勞健保局、衛生局、國稅局、鄰居。好不容易繳清，正要去買雞排慶祝，下個月又開始了。連續幾個月低於損益平衡點，可能要背好幾年的債。',
  '優缺點。工作室：一人飽全家飽，進可攻退可守，風險低；缺點是只有自己生產、營收有限，有做才有賺。門市：時間自由，放假也有人幫你賺，收入不容易有上限；缺點是初期投資高、參與的人多，還有收入沒有下限。',
  '第一組只記一句：差別的根源，只有固定成本。',
  undefined,
  '第一年之後，兩種型態都會被推著成長。工作室：不滿足收入上限，就請人、添設備、換大場地；或是年紀漸長、體力下滑、家庭壓力，不得不請員工，規模都變得像門市。門市：新店越來越多、品牌老化，要開新產品線；就算不想擴張，員工學不到新東西也留不住，老闆要逼自己成長。持續成長，是品牌活下去的唯一方法。',
  '成長幾年後，兩種型態都會走向專業分工：研發、生產、行銷、財務、電商與社群各有專人。老闆的工作是經營管理佔 100%。動腦的時間越來越長，動手的時間越來越短。可以每個領域請專人，但老闆下決策前，必須了解每個面向的後續影響。',
  '第二組只記一句：動手越來越少，動腦越來越多。',
  undefined,
  '選擇前的自我檢核，這一頁是我們依影片內容整理的判斷框架，不是影片原話。資金有限、還在測試、時間不固定，適合先從工作室開始；已有穩定訂單和陌生客群、準備好周轉金、願意轉成管理者，可以考慮門市。',
  '三個問題請大家想一想：事業被迫成長後，你還有多少時間能親自製作？如果知道幾年後再也進不了廚房，你還會開始嗎？發現和初心不同時，會放棄嗎？這位業界創業者的看法是，品牌像自己的孩子，只要還在賺錢，沒必要放棄。',
  '第三組只記一句：不能只會做，要會經營管理。',
  '轉型最常卡的五關，是翻牌卡，請同學先猜後果再翻。注意：要按 F 進播放模式才點得動。',
  '今天帶走的工具：時間分配圓餅圖。請大家在筆記本畫一個圓，填上自己一週的工作項目和比例，對照剛剛兩個圓餅，看你比較像哪一邊。',
  '預期的成果：因為真心喜歡，所以願意也學得快；邊經營邊學還能賺到錢，這些能力不知不覺變成你的專業。工作室期、門市期、成熟期的成果對照，是我們整理的延伸建議。雖然不一定能做甜點到老，但能在自己喜歡的產業做自己擅長的事，也挺幸福的。',
  '請和旁邊的人聊三分鐘，三題任選，聊完請兩到三位同學分享。接著開放問答。',
  '帶走三樣：一個觀念，差在固定成本；一個工具，時間分配圓餅圖；一個行動，寫下你的選擇和理由。',
  '最後一句話：不能只會做，要會經營管理。現在再投一次票：知道進廚房的時間會越來越少，你還會想創業嗎？看看和一開始相比，哪個選項變多、哪個變少，請改票的同學說說原因。謝謝大家。',
];

export const meta: SlideMeta = {
  title: '個人工作室 vs. 實體門市，該如何選擇？',
  createdAt: '2026-10-10T21:55:20.964Z',
};

export default [
  Cover,
  Hook,
  Path,
  NotThis,
  Agenda,
  Ch1,
  Table,
  Pies,
  Skills,
  Cost,
  ProsCons,
  Sum1,
  Ch2,
  Grow,
  Division,
  Sum2,
  Ch3,
  Check,
  Heart,
  Sum3,
  Pitfalls,
  Tool,
  Outcome,
  DiscussQA,
  TakeAway,
  Closing,
] satisfies Page[];
