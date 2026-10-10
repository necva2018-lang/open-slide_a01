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
  palette: { bg: '#f5f1fa', text: '#25193a', accent: '#583a8c' },
  fonts: {
    display: '"Noto Serif TC", "Source Han Serif TC", "PMingLiU", "Songti TC", serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#5b4f73',
  line: '#ded5ee',
  panel: '#ebe3f6',
  berry: '#a24818',
  dark: '#21162f',
  darkText: '#f5f1fa',
  darkMuted: '#cfc2e6',
  gold: '#edbf66',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-09-bakery-owner';
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
      <span>比起技術，消費者更在意什麼？</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '起心動念', from: 6, to: 9 },
  { name: '創造熱點', from: 10, to: 14 },
  { name: '單純經營', from: 15, to: 19 },
  { name: '收尾', from: 20, to: 26 },
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
          <div style={{ flex: '0 0 700px', fontWeight: 700 }}>{front}</div>
          <div style={{ color: C.gold, fontSize: 52 }}>→</div>
          <div style={{ flex: 1 }}>{back}</div>
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


/* ---------- 09 專用小元件 ---------- */

const Q4 = ({ n, t }: { n: string; t: string }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '34px 36px' }}>
    <div style={{ fontFamily: serif, fontSize: 68, fontWeight: 700, color: 'var(--osd-accent)' }}>{n}</div>
    <div style={{ fontSize: 46 }}>{t}</div>
  </Card>
);

const StepRow = ({ n, children }: { n: string; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '26px 36px',
      fontSize: 42,
      lineHeight: 1.4,
    }}
  >
    <div style={{ flex: 'none', fontFamily: serif, fontSize: 60, fontWeight: 700, color: 'var(--osd-accent)', width: 52 }}>{n}</div>
    <div>{children}</div>
  </div>
);

const Node = ({ when, title, line, hot }: { when: string; title: string; line: string; hot?: boolean }) => (
  <div style={{ flex: 1, textAlign: 'center' }}>
    <div style={{ fontSize: 30, fontWeight: 700, color: hot ? C.berry : 'var(--osd-accent)', height: 40 }}>{when}</div>
    <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
      <div style={{ flex: 1, height: 6, background: C.muted }} />
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          background: hot ? C.berry : 'var(--osd-accent)',
          border: `6px solid ${C.bg}`,
          boxSizing: 'content-box',
        }}
      />
      <div style={{ flex: 1, height: 6, background: C.muted }} />
    </div>
    <div style={{ fontFamily: serif, fontSize: 38, fontWeight: 700, lineHeight: 1.3, margin: '14px 4px 8px' }}>{title}</div>
    <div style={{ fontSize: 32, lineHeight: 1.45, color: C.muted, padding: '0 14px', whiteSpace: 'pre-line' }}>{line}</div>
  </div>
);

const Blank3 = ({ n, q }: { n: string; q: string }) => (
  <Card style={{ padding: '24px 36px' }}>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 38, fontWeight: 700 }}>
      <div style={{ fontFamily: serif, fontSize: 52, color: 'var(--osd-accent)' }}>{n}</div>
      <div>{q}</div>
    </div>
    <div style={{ borderBottom: `4px solid ${C.muted}`, height: 46, marginLeft: 76 }} />
  </Card>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1150 }}>
        <Eyebrow>職訓班課程｜餐飲創業</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 104, fontWeight: 700, lineHeight: 1.25, margin: '0 0 36px' }}>
          比起技術，
          <br />
          消費者更在意什麼？
        </h1>
        <div style={{ fontSize: 46, color: 'var(--osd-accent)', fontWeight: 500 }}>一位麵包店老闆的創業真相</div>
      </div>
      <svg width="480" height="420" viewBox="0 0 480 420" aria-hidden="true">
        <ellipse cx="240" cy="62" rx="76" ry="52" fill="var(--osd-accent)" />
        <path d="M190 30 L215 72 M240 22 L240 80 M290 30 L265 72 M205 54 L275 54" stroke={C.gold} strokeWidth="5" fill="none" />
        <path d="M60 140 L240 90 L420 140 L420 150 L60 150 Z" fill={C.dark} />
        <rect x="80" y="150" width="320" height="220" fill={C.panel} stroke={C.muted} strokeWidth="5" />
        <rect x="120" y="200" width="70" height="170" fill={C.dark} />
        <rect x="260" y="200" width="100" height="70" fill={C.line} stroke={C.muted} strokeWidth="4" />
        <line x1="40" y1="370" x2="440" y2="370" stroke={C.muted} strokeWidth="5" />
        <polygon points="450,370 420,290 480,290" fill="var(--osd-accent)" opacity="0.85" />
        <polygon points="40,370 20,300 60,300" fill="var(--osd-accent)" opacity="0.85" />
      </svg>
    </div>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先舉手</Eyebrow>
    <H size={72}>
      客人選一家麵包店，
      <br />
      最主要的原因是？
    </H>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <Q4 n="A" t="技術好" />
        <Q4 n="B" t="原料高級" />
        <Q4 n="C" t="便宜、方便" />
        <Q4 n="D" t="好吃之外的體驗" />
      </div>
      <Note>先舉手記下票數，最後一頁再問一次</Note>
    </Body>
  </Slide>
);

const Same: Page = () => (
  <Slide>
    <Eyebrow>一位日本麵粉廠講師的觀察</Eyebrow>
    <H size={72}>為什麼全台的麵包店，都長得一樣？</H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <svg width="560" height="400" viewBox="0 0 560 400" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="30" y={40 + i * 90} width="300" height="12" fill={C.muted} />
              {[0, 1, 2, 3].map((j) => (
                <ellipse key={j} cx={70 + j * 72} cy={22 + i * 90} rx="26" ry="16" fill="var(--osd-accent)" opacity={0.85 - i * 0.12} />
              ))}
            </g>
          ))}
          <rect x="30" y="300" width="300" height="12" fill={C.muted} />
          <rect x="370" y="150" width="160" height="110" rx="10" fill={C.panel} stroke={C.muted} strokeWidth="5" />
          <text x="450" y="215" textAnchor="middle" fontSize="34" fontWeight="700" fill={C.muted}>中島</text>
          <text x="180" y="360" textAnchor="middle" fontSize="34" fontWeight="700" fill={C.muted}>三層架</text>
        </svg>
        <div style={{ fontSize: 46, lineHeight: 1.6 }}>
          <b style={{ color: 'var(--osd-accent)' }}>三層架＋一個中島</b>
          <div style={{ marginTop: 20 }}>
            再開一家一樣的店，
            <br />
            只是在茫茫麵包海裡<b style={{ color: C.berry }}>重複出現</b>，
            <br />
            勝率不高。
          </div>
        </div>
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
              不是教你複製一家店
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是說技術不重要
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是保證零廣告就能紅
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
              是看一位創業者，怎麼想「好吃以外」
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
        <GroupBox tag="第一組" title="起心動念" items={['這個人是誰', '情緒價值']} />
        <GroupBox tag="第二組" title="創造熱點" items={['不一樣的店', '十年起伏']} />
        <GroupBox tag="第三組" title="單純經營" items={['80／20 產品', '單純化、二店']} />
      </div>
    </Body>
  </Slide>
);

/* ---------- 第一組：起心動念 ---------- */

const Ch1: Page = () => <Chapter no="01" title="起心動念" sub="這個人，怎麼想" />;

const Who: Page = () => (
  <Slide>
    <Eyebrow>麵包店老闆</Eyebrow>
    <H size={72}>這位老闆，是這樣開始的</H>
    <Body>
      <div>
        <T2 a="經歷" b="16 歲當學徒、讀夜校；後來當日本麵粉廠講師" />
        <T2 a="創業" b="2016～2017 年，夫妻帶著僅有的 80 萬存款" />
        <T2 a="品牌" b="兩個品牌：日式台式麵包店、酥皮＋早午餐店" />
        <T2 a="成績" b="5 個人，年營收 1,300～1,500 萬（含中秋）" />
      </div>
      <Note>以上是這位老闆本人的說法，不是統計；淨利約 20%，是訪談前閒聊的轉述</Note>
    </Body>
  </Slide>
);

const Champ: Page = () => (
  <Slide>
    <Eyebrow>世界冠軍的啟發</Eyebrow>
    <H size={72}>好吃是基本，還能給什麼？</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1, padding: '40px 44px' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>日本麵包世界冠軍返鄉創業</div>
          <div style={{ fontSize: 44, lineHeight: 1.55, marginTop: 12 }}>
            賣的是紅豆麵包、卡士達麵包、牛奶吐司
          </div>
          <div style={{ fontSize: 36, color: C.muted, marginTop: 16, lineHeight: 1.5 }}>
            日常的是大宗，酷炫的偶爾推出就好。不要覺得賣這些丟臉。
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '40px 44px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.gold }}>這位老闆的領悟</div>
          <div style={{ fontSize: 42, lineHeight: 1.55, marginTop: 12 }}>
            師傅太執著宣揚用了什麼奶油、麵粉、技術，<b style={{ color: C.gold }}>消費者不在意</b>。
          </div>
          <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, lineHeight: 1.45, marginTop: 20 }}>
            除了好吃，
            <br />
            還能給我什麼<span style={{ color: C.gold }}>情緒價值</span>？
          </div>
        </Card>
      </div>
    </Body>
  </Slide>
);

const Sum1: Page = () => <Summary label="這一組只記一句" line="好吃是基本，情緒價值才是理由" />;

/* ---------- 第二組：創造熱點 ---------- */

const Ch2: Page = () => <Chapter no="02" title="創造熱點" sub="不一樣的店" />;

const First: Page = () => (
  <Slide>
    <Eyebrow>第一家店</Eyebrow>
    <H size={72}>做一家「不一樣」的店</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="不一樣的做法"
          title="反骨"
          lines={['不要三層架、不要中島', '客人只能從窗口點餐', '一天只賣約 10 種']}
        />
        <Pair
          tag="記憶點"
          title="彩繪牆＋新奇商品"
          lines={['兩層樓高的巨型彩繪牆', '當時沒人賣的菠蘿夾冰淇淋', '搭上 IG 興起，客人免費分享']}
        />
      </div>
      <Note>當時一般店賣二、三十種。窗口點餐的說法：消費者要教育，比較衛生。不是不花廣告費，是沒錢花</Note>
    </Body>
  </Slide>
);

const Journey: Page = () => (
  <Slide>
    <Eyebrow>十年的起伏</Eyebrow>
    <H size={72}>從 7,000 元，到排隊 10 個月</H>
    <Body>
      <div style={{ display: 'flex' }}>
        <Node when="開幕首日" title="營業額 7,000 元" line={"好幾個月\n多是親友、同業"} />
        <Node when="約半年後" title="流量疊加" line={"拍照打卡\n媒體來採訪"} />
        <Node hot when="開了兩年" title="房東賣屋" line={"3 個月內搬走\n花近 100 萬"} />
        <Node hot when="黑暗的一年" title="日賣 8～9 千" line={"靠教課收入\n撐下來"} />
        <Node when="2020 年" title="借錢租老宅" line={"整理近 500 萬\n排隊近 10 個月"} />
      </div>
      <div style={{ fontSize: 38, color: C.muted, marginTop: 32, lineHeight: 1.5 }}>
        撐不撐下去，先撐過「一年四季」再評估；看一整年，不看一個月。
      </div>
      <Note>以上是這位老闆的個人經驗，不是統計</Note>
    </Body>
  </Slide>
);

const Hot: Page = () => (
  <Slide>
    <Eyebrow>創造熱點</Eyebrow>
    <H size={72}>先問：憑什麼人家要來？</H>
    <Body>
      <div style={{ display: 'flex', gap: 28 }}>
        <Card style={{ flex: 1, padding: '34px 30px' }}>
          <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, color: 'var(--osd-accent)' }}>1</div>
          <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700 }}>落羽松</div>
          <div style={{ fontSize: 38, color: C.muted, marginTop: 10, lineHeight: 1.45 }}>市區幾乎看不到</div>
        </Card>
        <Card style={{ flex: 1, padding: '34px 30px' }}>
          <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, color: 'var(--osd-accent)' }}>2</div>
          <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700 }}>百坪老宅</div>
          <div style={{ fontSize: 38, color: C.muted, marginTop: 10, lineHeight: 1.45 }}>在老宅裡買麵包</div>
        </Card>
        <Card style={{ flex: 1, padding: '34px 30px' }}>
          <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, color: 'var(--osd-accent)' }}>3</div>
          <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700 }}>巨大菠蘿</div>
          <div style={{ fontSize: 38, color: C.muted, marginTop: 10, lineHeight: 1.45 }}>屋頂上，正向的誇張</div>
        </Card>
      </div>
      <Card style={{ marginTop: 36, padding: '36px 48px', background: C.dark, color: C.darkText }}>
        <div style={{ fontSize: 46, lineHeight: 1.55 }}>
          <b style={{ color: C.gold }}>飛機上吃到現剉剉冰</b>，你一定下機就發 IG。
          <br />
          他還沒消費，就已經先有記憶點了。
        </div>
      </Card>
    </Body>
  </Slide>
);

const Sum2: Page = () => <Summary label="這一組只記一句" line="先問：憑什麼人家要來？" />;

/* ---------- 第三組：單純經營 ---------- */

const Ch3: Page = () => <Chapter no="03" title="單純經營" sub="產品與風險" />;

const Mix: Page = () => (
  <Slide>
    <Eyebrow>產品策略</Eyebrow>
    <H size={72}>80% 日常，20% 原創</H>
    <Body style={{ justifyContent: 'flex-start', paddingTop: 44 }}>
      <div style={{ display: 'flex', gap: 24, height: 130 }}>
        <div style={{ flex: 8, background: 'var(--osd-accent)', color: C.darkText, borderRadius: '20px 0 0 20px', padding: '22px 32px', fontFamily: serif, fontSize: 44, fontWeight: 700 }}>
          80%　日常基本款：紅豆、菠蘿
        </div>
        <div style={{ flex: 2, background: C.gold, color: C.dark, borderRadius: '0 20px 20px 0', padding: '22px 20px', fontFamily: serif, fontSize: 40, fontWeight: 700, textAlign: 'center' }}>
          20%
          <div style={{ fontSize: 28 }}>每季一款</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 40, marginTop: 36 }}>
        <Pair tag="20% 創意款" title="市面上沒有的" lines={['菠蘿灌布朗尼', '沙發造型可頌', '不加鹽的狗狗法棍', '寵物 YouTuber 主動合作']} />
        <Pair tag="靈感來源" title="痛點＋跨界" lines={['解決客人的痛點', '員工旅遊不看麵包店，去吃米其林', '生活怎麼過，工作就怎麼做']} />
      </div>
    </Body>
  </Slide>
);

const Simple: Page = () => (
  <Slide>
    <Eyebrow>對抗缺工</Eyebrow>
    <H size={72}>產品單純化</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <StepRow n="1">每家店只賣 10～15 種，備料少、利潤出來</StepRow>
        <StepRow n="2">1～2 種麵團，做出 10 種麵包（基底共用，技術底蘊要夠）</StepRow>
        <StepRow n="3">每店 2 師傅＋1 門市，做完該做的量就下班</StepRow>
        <StepRow n="4">每月淘汰銷售最差的 3 名，再推新品補上</StepRow>
      </div>
    </Body>
  </Slide>
);

const Second: Page = () => (
  <Slide>
    <Eyebrow>為什麼開二店</Eyebrow>
    <H size={72}>分散風險，讓價格正常化</H>
    <Body style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair tag="原因 ①" title="分散風險" lines={['只有一家店，房東一句話', '員工就要各自找工作', '有第二家店，員工有去處']} />
        <Pair tag="原因 ②" title="價格正常化" lines={['可頌在日常麵包店，價格上不去', '開專賣店，才賣得到合理價格']} />
      </div>
      <div style={{ marginTop: 20 }}>
        <T3 cols="170px 1fr 1fr" head a="" b="日常麵包店" c="酥皮專賣店" />
        <T3 cols="170px 1fr 1fr" a="定位" b="日常，想吃沒壓力" c="送朋友不丟臉，偶爾小確幸" />
      </div>
    </Body>
  </Slide>
);

const Sum3: Page = () => <Summary label="這一組只記一句" line="產品越單純，人力越輕鬆" />;

/* ---------- 收尾 ---------- */

const Pitfalls: Page = () => (
  <Slide>
    <Eyebrow>踩坑分享</Eyebrow>
    <H size={72}>這位老闆說：這不是後悔，是經驗</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Flip front="烘焙門市也賣早午餐" back="兩人 800 元坐 1 小時，買麵包只要 5 分鐘" hint="點一下看後果" h={100} />
        <Flip front="接了 1,000 顆法國球訂單" back="一個人做 12 小時，機會成本太高" hint="點一下看後果" h={100} />
        <Flip front="被房東賣屋" back="3 個月內搬走，近 100 萬" hint="點一下看後果" h={100} />
        <Flip front="開幕首日只有 7,000 元" back="撐過一年四季，再評估" hint="點一下看後果" h={100} />
        <Flip front="20 年來，菠蘿麵包都 35 元" back="師傅薪水沒辦法漲" hint="點一下看後果" h={100} />
      </div>
    </Body>
  </Slide>
);

const Tool: Page = () => (
  <Slide>
    <Eyebrow>
      今天帶走的工具
      <Tag />
    </Eyebrow>
    <H size={72}>我的記憶點設計卡</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Blank3 n="1" q="好吃以外，我還能給客人什麼？" />
        <Blank3 n="2" q="憑什麼人家要來？我的「正向誇張」記憶點" />
        <Blank3 n="3" q="80% 日常款是什麼？20% 原創款是什麼？" />
      </div>
    </Body>
  </Slide>
);

const Outcome: Page = () => (
  <Slide>
    <Eyebrow>預期的成果</Eyebrow>
    <H size={72}>這位老闆的現在</H>
    <Body style={{ justifyContent: 'flex-start', paddingTop: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ChgRow n="1" title="5 個人，年營收 1,300～1,500 萬" line="3 師傅＋2 門市（含中秋），每店旺季月營收約 80 幾萬" />
        <ChgRow n="2" title="不買廣告、不請部落客" line="靠顧客自發分享" />
        <ChgRow n="3" title="員工做很久" line="一年領 14 個月、新品熱賣獎金、出國補貼" />
      </div>
      <Note>以上是這位老闆個人的經驗，不是統計</Note>
    </Body>
  </Slide>
);

const Trend: Page = () => (
  <Slide>
    <Eyebrow>產業的趨勢與挑戰</Eyebrow>
    <H size={72}>最大的挑戰：人工</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1, padding: '40px 44px' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>趨勢</div>
          <div style={{ fontSize: 40, lineHeight: 1.55, marginTop: 10 }}>
            大者恆大
            <br />
            小店分成工作室與個性店
            <br />
            小店之間交叉供貨、聯盟經營
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '40px 44px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.gold }}>薪水卡住了</div>
          <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, lineHeight: 1.45, marginTop: 10 }}>
            師傅月薪 5 萬，
            <br />
            20 年前是，現在還是。
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.6, marginTop: 32 }}>
        「一顆菠蘿麵包，20 年前 35 元，20 年後還是 35 元，怎麼加薪？」
      </div>
      <div style={{ fontSize: 36, color: C.muted, marginTop: 8 }}>能做的：冷氣照開，吃飯要坐在桌子上</div>
    </Body>
  </Slide>
);

const DiscussQA: Page = () => (
  <Slide>
    <Eyebrow>課堂討論＋ Q&amp;A</Eyebrow>
    <H size={72}>先聊 3 分鐘，再來問答</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        <Row n="1">你的店，「好吃以外」能給顧客什麼？</Row>
        <Row n="2">為你的店，設計一個「正向誇張」的記憶點</Row>
        <Row n="3">你的產品，能用幾種基底做出多少變化？</Row>
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
        <Col tag="觀念" title="情緒價值" body={'好吃是基本\n情緒才是理由'} />
        <Col tag="工具" title="記憶點設計卡" body={'3 個問題\n填完就有方向'} />
        <Col tag="行動" title="寫一個記憶點" body={'為你的店\n寫下一句正向誇張'} />
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
      好吃是基本，
      <br />
      情緒價值才是理由。
    </H>
    <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 48, lineHeight: 1.6 }}>
      再問一次：客人選一家麵包店，最主要的原因是？
      <br />
      <span style={{ color: C.gold }}>A 技術好　B 原料高級　C 便宜方便　D 好吃之外的體驗</span>
    </div>
  </Slide>
);

export const notes: (string | undefined)[] = [
  '歡迎大家。今天不談技術，談一位麵包店老闆的創業真相：比起技術，消費者更在意什麼？這是一場訪談的整理，主角是台中麵包店的老闆這位老闆。',
  '先請大家舉手。客人選一家麵包店，最主要的原因是什麼？A 技術好、B 原料高級、C 便宜方便、D 好吃之外的體驗。記下票數，最後一頁再問一次。',
  '這位老闆開店前，是日本麵粉廠的講師，跑遍全台各地的店。他的總結是：為什麼全台灣的麵包店都長得一樣？三層架加一個中島。他覺得，再開一家一樣的店，只是在茫茫麵包海裡重複出現，勝率不高。',
  '先講清楚這場不是什麼：不是教你複製一家店，不是說技術不重要，也不是保證零廣告就能紅。是看一位創業者，怎麼思考好吃以外的事。',
  '今天分三組：起心動念，創造熱點，單純經營。',
  undefined,
  '先認識這位老闆。他 16 歲當學徒、讀夜校，後來當日本麵粉廠講師。2016 到 2017 年，夫妻帶著僅有的 80 萬存款創業。現在有麵包店和酥皮專賣店兩個品牌。他說，5 個人一年的營收約 1,300 到 1,500 萬，含中秋。這些是他本人的說法，不是統計。淨利約 20%，是訪談前閒聊的轉述，也要打折看。',
  '影片標題的由來：一位日本麵包世界冠軍返鄉創業，大家期待他做酷炫的歐包，結果他賣的是紅豆麵包、卡士達麵包、牛奶吐司。他說，麵包是日常的東西，酷炫的偶爾推出就好，不要覺得賣這些丟臉。這位老闆的領悟：師傅太執著宣揚用了什麼奶油、麵粉、技術，消費者不在意。當大家都很好吃，你還能給我什麼樣的情緒價值？',
  '第一組只記一句：好吃是基本，情緒價值才是理由。',
  undefined,
  '第一家店，他決定做一家不一樣的。不要三層架、不要中島，客人只能從窗口點餐，他的說法是消費者要教育，這樣比較衛生。一天只賣約十種，當時一般店賣二、三十種。再加上兩層樓高的彩繪牆，和當時沒人賣的菠蘿夾冰淇淋。剛好搭上 IG 興起，客人免費分享。他說，不是不花廣告費，是沒錢花。',
  '十年的起伏，請大家順著時間看。開幕第一天，營業額 7,000 元，持續好幾個月，來的多是學生、同業、親友。約半年後，流量疊加，媒體和美食節目來採訪。開了兩年，房東賣屋，三個月內被迫搬走，搬遷近 100 萬。接下來是黑暗的一年，日營業額八、九千，靠教課的收入撐下來。後來看到百坪老宅，借錢也要租，整理近 500 萬，2020 年開幕，排隊近十個月。他說，撐不撐下去，先撐過一年四季再評估，看一整年，不看一個月。這些是他的個人經驗，不是統計。',
  '創造熱點的前提：先反問自己，憑什麼人家要來？老宅店有三個記憶點：市區幾乎看不到的落羽松、在百坪老宅裡買麵包、屋頂上巨大的菠蘿，這是正向的誇張。他用飛機上吃到現剉剉冰來比喻，你一定下機就發 IG。他還沒消費，就已經先有記憶點了。',
  '第二組只記一句：先問，憑什麼人家要來？',
  undefined,
  '產品策略：八成是日常基本款，像紅豆、菠蘿；兩成是市面上沒有的創意款，每季推一款。例如菠蘿灌布朗尼、沙發造型的可頌，還有不加鹽的狗狗法棍，寵物 YouTuber 主動來合作，破圈了。靈感來源：解決客人的痛點，還有涉獵烘焙以外的事，他帶員工去日本旅遊不看麵包店，去吃米其林。生活怎麼過，工作就怎麼做。',
  '對抗缺工，他的做法是產品單純化。每家店只賣 10 到 15 種；用一到兩種麵團做出十種麵包，基底共用，造型和後加工不同，前提是技術底蘊要夠；每店兩位師傅加一位門市，做完該做的量就下班；每個月拉報表，淘汰賣最差的倒數三名，再推新品。好處是備料少、利潤出來、工時不用太長。',
  '為什麼開二店？第一，分散風險：只有一家店，房東一句話，員工就要各自找工作。第二，讓可頌的價格正常化：可頌在日常麵包店，價格一直上不去，開專賣店才賣得到合理價格。兩店定位不同：第一家是日常，想吃沒壓力；酥皮專賣店是送朋友不丟臉、偶爾小確幸。',
  '第三組只記一句：產品越單純，人力越輕鬆。',
  '這位老闆說，這不是後悔，是經驗。五個坑，是翻牌卡，請同學先猜後果再翻。注意：要按 F 進播放模式才點得動。烘焙門市餐飲化，兩人 800 元要坐一小時，買麵包只要五分鐘，還有負評、冷氣、人員的隱藏成本，要看地點。1,000 顆法國球，一個人從晚上八點做到隔天早上八點，機會成本太高。',
  '今天帶走的工具：記憶點設計卡，三個問題。好吃以外，我還能給客人什麼？憑什麼人家要來？我的正向誇張記憶點是什麼？80% 日常款和 20% 原創款各是什麼？這張卡是我們整理的延伸，請大家抄下來。',
  '這位老闆的現在：5 個人，年營收 1,300 到 1,500 萬，每店旺季月營收約八十幾萬。不買廣告、不請部落客，靠顧客自發分享。員工一年領 14 個月，有新品熱賣獎金和出國補貼，都做很久。這些是他個人的經驗，不是統計。',
  '最後談產業。趨勢是大者恆大，小店分成工作室和個性店，小店之間交叉供貨、聯盟經營。最大的挑戰是人工：20 年前師傅月薪 5 萬，現在還是 5 萬。一顆菠蘿麵包，20 年前 35 元，20 年後還是 35 元，怎麼加薪？他能做的是改善環境，冷氣照開，吃飯要坐在桌子上。',
  '請和旁邊的人聊三分鐘，三題任選，聊完請兩到三位同學分享。接著開放問答。',
  '帶走三樣：一個觀念，好吃是基本，情緒價值才是理由；一個工具，記憶點設計卡；一個行動，為你的店寫下一句正向誇張的記憶點。',
  '最後一句話：好吃是基本，情緒價值才是理由。現在回到一開始的問題，再舉一次手：客人選一家麵包店，最主要的原因是什麼？看看和一開始比，有沒有人從技術、原料，換成好吃之外的體驗。謝謝大家。',
];

export const meta: SlideMeta = {
  title: '比起技術，消費者更在意什麼？',
  createdAt: '2026-10-10T20:46:00.485Z',
};

export default [
  Cover,
  Hook,
  Same,
  NotThis,
  Agenda,
  Ch1,
  Who,
  Champ,
  Sum1,
  Ch2,
  First,
  Journey,
  Hot,
  Sum2,
  Ch3,
  Mix,
  Simple,
  Second,
  Sum3,
  Pitfalls,
  Tool,
  Outcome,
  Trend,
  DiscussQA,
  TakeAway,
  Closing,
] satisfies Page[];
