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
  palette: { bg: '#f3f3f0', text: '#1d2023', accent: '#a04210' },
  fonts: {
    display: '"Noto Serif TC", "Source Han Serif TC", "PMingLiU", "Songti TC", serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#595e63',
  line: '#dcdcd6',
  panel: '#e7e7e2',
  berry: '#7a1f2b',
  dark: '#1f2326',
  darkText: '#f3f3f0',
  darkMuted: '#c9cbc7',
  gold: '#f0b25a',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-10-bento-founder';
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
      <span>230 元的便當怎麼賣？</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '定位', from: 6, to: 9 },
  { name: '系統化', from: 10, to: 14 },
  { name: '放權與行銷', from: 15, to: 19 },
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


/* ---------- 10 專用小元件 ---------- */

const Q3 = ({ n, t }: { n: string; t: string }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '34px 40px' }}>
    <div style={{ fontFamily: serif, fontSize: 72, fontWeight: 700, color: 'var(--osd-accent)' }}>{n}</div>
    <div style={{ fontSize: 48 }}>{t}</div>
  </Card>
);

const Tile = ({ label, value, sub, dark }: { label: string; value: string; sub?: string; dark?: boolean }) => (
  <div
    style={{
      flex: 1,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 20px',
      textAlign: 'center',
      background: dark ? C.dark : C.panel,
      color: dark ? C.darkText : 'var(--osd-text)',
    }}
  >
    <div style={{ fontSize: 32, fontWeight: 700, color: dark ? C.gold : C.muted }}>{label}</div>
    <div style={{ fontFamily: serif, fontSize: 68, fontWeight: 700, lineHeight: 1.2, margin: '6px 0' }}>{value}</div>
    {sub ? <div style={{ fontSize: 32, color: dark ? C.darkMuted : C.muted }}>{sub}</div> : null}
  </div>
);

const Flow4 = ({ n, title, line }: { n: string; title: string; line: string }) => (
  <div style={{ flex: 1, background: C.panel, borderRadius: 'var(--osd-radius)', padding: '30px 22px', textAlign: 'center' }}>
    <div style={{ fontFamily: serif, fontSize: 64, fontWeight: 700, color: 'var(--osd-accent)' }}>{n}</div>
    <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, margin: '4px 0 10px', lineHeight: 1.3 }}>{title}</div>
    <div style={{ fontSize: 34, lineHeight: 1.45, color: C.muted }}>{line}</div>
  </div>
);

const Leak = ({ title, lines }: { title: string; lines: string[] }) => (
  <Card style={{ flex: 1, padding: '38px 44px' }}>
    <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, color: C.berry }}>{title}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 40, lineHeight: 1.5, marginTop: 14 }}>
      {lines.map((t) => (
        <div key={t}>{t}</div>
      ))}
    </div>
  </Card>
);

const BlankRow = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 28,
      padding: '22px 0',
      borderBottom: `2px solid ${C.line}`,
    }}
  >
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ borderBottom: `4px solid ${C.muted}`, height: 56 }} />
    ))}
  </div>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1150 }}>
        <Eyebrow>職訓班課程｜餐飲創業</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 124, fontWeight: 700, lineHeight: 1.2, margin: '0 0 36px' }}>
          230 元的便當，
          <br />
          怎麼賣？
        </h1>
        <div style={{ fontSize: 46, color: 'var(--osd-accent)', fontWeight: 500, lineHeight: 1.5 }}>
          「零炒菜鍋＋自動化」的便當店革命
        </div>
      </div>
      <svg width="480" height="400" viewBox="0 0 480 400" aria-hidden="true">
        <rect x="30" y="140" width="260" height="200" rx="22" fill={C.panel} stroke={C.muted} strokeWidth="6" />
        <line x1="30" y1="205" x2="290" y2="205" stroke={C.muted} strokeWidth="4" />
        <line x1="150" y1="205" x2="150" y2="340" stroke={C.muted} strokeWidth="4" />
        <circle cx="90" cy="172" r="18" fill="var(--osd-accent)" />
        <circle cx="220" cy="172" r="18" fill={C.gold} />
        <rect x="55" y="228" width="70" height="90" rx="10" fill="var(--osd-accent)" opacity="0.85" />
        <rect x="175" y="228" width="90" height="90" rx="10" fill={C.berry} opacity="0.85" />
        <rect x="330" y="150" width="130" height="190" rx="12" fill={C.dark} />
        <rect x="346" y="176" width="98" height="80" rx="8" fill={C.line} />
        <circle cx="395" cy="296" r="16" fill={C.gold} />
        <rect x="330" y="340" width="130" height="14" fill={C.muted} />
      </svg>
    </div>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先舉手</Eyebrow>
    <H size={72}>你願意花 230 元，買一個便當嗎？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Q3 n="A" t="願意" />
        <Q3 n="B" t="不願意" />
        <Q3 n="C" t="看情況（什麼情況？）" />
      </div>
      <Note>先舉手記下票數，最後一頁再問一次</Note>
    </Body>
  </Slide>
);

const Who: Page = () => (
  <Slide>
    <Eyebrow>便當店創辦人</Eyebrow>
    <H size={72}>這位創辦人，18 歲就創業</H>
    <Body>
      <div style={{ display: 'flex', gap: 28 }}>
        <Tile label="創業次數" value="3 次" sub="第一次在 18 歲" />
        <Tile label="便當店" value="7 家" sub="現有" dark />
        <Tile label="早午餐店" value="2 家" sub="開了 6 年多" />
      </div>
      <div style={{ fontSize: 40, color: C.muted, marginTop: 32, lineHeight: 1.5 }}>
        不好的事，不記太久；有問題就解決，記得不要再犯。
      </div>
      <Note>以上是這位創辦人本人的說法</Note>
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
              不是叫你買一堆機器
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是教你開加盟
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是說貴的才好賣
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
              是看「讓錯誤變得困難」怎麼做
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
        <GroupBox tag="第一組" title="定位" items={['三次創業', '漂亮便當']} />
        <GroupBox tag="第二組" title="系統化" items={['零炒菜鍋', '設備與成本']} />
        <GroupBox tag="第三組" title="放權與行銷" items={['加盟、多店', '發傳單']} />
      </div>
    </Body>
  </Slide>
);

/* ---------- 第一組：定位 ---------- */

const Ch1: Page = () => <Chapter no="01" title="定位" sub="三次創業，學到什麼" />;

const Three: Page = () => (
  <Slide>
    <Eyebrow>三次創業</Eyebrow>
    <H size={72}>每一次，都學到一件事</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <ChgRow n="1" title="平價雞肉飯（18 歲）→ 學會行銷" line="前半年虧損，傳單、布條沒用，找部落客後翻身" />
        <ChgRow n="2" title="早午餐（2 家）→ 人很難控制" line="內外場要很多人協調，年長廚師覺得「你不懂」" />
        <ChgRow n="3" title="第三次：便當店 → 系統化＋設備化" line="把前兩次學到的，整合起來" />
      </div>
    </Body>
  </Slide>
);

const Position: Page = () => (
  <Slide>
    <Eyebrow>品牌定位</Eyebrow>
    <H size={72}>夾在日常便當與健康餐之間</H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Card style={{ flex: 1, padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: C.muted }}>平價連鎖</div>
          <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, marginTop: 6 }}>打不贏</div>
        </Card>
        <Card style={{ flex: 1.3, padding: '28px 24px', textAlign: 'center', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 32, color: C.gold }}>這家店：漂亮便當</div>
          <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, marginTop: 6, lineHeight: 1.3 }}>
            原型食物、健康又美味
            <br />
            絕不油炸
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: C.muted }}>健康餐</div>
          <div style={{ fontFamily: serif, fontSize: 38, fontWeight: 700, marginTop: 6, lineHeight: 1.3 }}>
            自己不吃，
            <br />
            沒信心做好
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.6, marginTop: 36 }}>
        中價位：很多便當是<b style={{ color: C.berry }}>買給客戶吃的，要有面子</b>。
        <br />
        「這世界上沒有人不喜歡漂亮的東西。」
      </div>
      <Note>非會員售價 169～230 元，是這位創辦人的說法；難處：常被誤認是健康餐盒</Note>
    </Body>
  </Slide>
);

const Sum1: Page = () => <Summary label="這一組只記一句" line="先讓客人吃過，才會回不去" />;

/* ---------- 第二組：系統化 ---------- */

const Ch2: Page = () => <Chapter no="02" title="系統化" sub="讓錯誤變得困難" />;

const Pot: Page = () => (
  <Slide>
    <Eyebrow>零炒菜鍋</Eyebrow>
    <H size={72}>炒菜鍋換成烤箱</H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 16 }}>
        <Flow4 n="1" title="工廠預分裝" line="調味包事先包好" />
        <div style={{ alignSelf: 'center', fontSize: 44, color: 'var(--osd-accent)' }}>→</div>
        <Flow4 n="2" title="現場秤重" line="5 公斤菜，配 1 包" />
        <div style={{ alignSelf: 'center', fontSize: 44, color: 'var(--osd-accent)' }}>→</div>
        <Flow4 n="3" title="倒下去拌" line="不靠師傅手藝" />
        <div style={{ alignSelf: 'center', fontSize: 44, color: 'var(--osd-accent)' }}>→</div>
        <Flow4 n="4" title="送進烤箱" line="食材先前處理" />
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.6, marginTop: 36 }}>
        像鼎泰豐一樣分好份量，<b style={{ color: C.berry }}>不會今天太鹹、明天不鹹</b>。
        <br />
        新人沒經驗，約 1 週就能上手。
      </div>
    </Body>
  </Slide>
);

const Equip: Page = () => (
  <Slide>
    <Eyebrow>設備投資</Eyebrow>
    <H size={72}>設備貴，人力省</H>
    <Body style={{ justifyContent: 'flex-start', paddingTop: 32 }}>
      <div style={{ display: 'flex', gap: 28 }}>
        <Tile label="開一家店約" value="300 萬" sub="烤箱、打飯機、冰箱、凍庫" />
        <Tile label="每店人事成本約" value="10%" sub="薪水還算高" dark />
      </div>
      <div style={{ display: 'flex', gap: 36, marginTop: 24 }}>
        <Pair
          tag="說服加盟主"
          title="未來人力越來越貴"
          lines={['而且不好教', '設備是長期投資']}
        />
        <Pair
          tag="打飯機"
          title="打 1 小時，一定比人快"
          lines={['人工打飯一定要秤', '離峰只有 1 人，「他沒有四隻手」']}
        />
      </div>
      <div style={{ fontSize: 30, color: C.muted, marginTop: 14 }}>300 萬、10% 是這位創辦人的自述，沒有財報查證</div>
    </Body>
  </Slide>
);

const Profit: Page = () => (
  <Slide>
    <Eyebrow>利潤的關鍵</Eyebrow>
    <H size={72}>控制成本，先關緊兩個水龍頭</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Leak title="食材報廢" lines={['便當最容易報廢', '商辦區平日好、假日普通', '不能每天備一樣的量']} />
        <Leak title="人力浪費" lines={['離峰沒事', '還是排 2 個人', '也是一種浪費']} />
      </div>
      <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: 'var(--osd-accent)', marginTop: 36 }}>
        食材成本，控制在 40% 以內。
      </div>
    </Body>
  </Slide>
);

const Sum2: Page = () => <Summary label="這一組只記一句" line="人很難控制，就讓錯誤變得困難" />;

/* ---------- 第三組：放權與行銷 ---------- */

const Ch3: Page = () => <Chapter no="03" title="放權與行銷" sub="多店與發傳單" />;

const Franchise: Page = () => (
  <Slide>
    <Eyebrow>加盟與多店管理</Eyebrow>
    <H size={72}>從「我的店」，變成「我們的店」</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="篩選加盟主"
          title="看有沒有用心"
          lines={['受訓 1 個月，評分考核', '學會了嗎、用心嗎、遲到嗎', '加分：願意親自經營、重品質']}
        />
        <Pair
          tag="多店管理"
          title="差在放權"
          lines={['和每位店長溝通', '提升他們的認知與實力', '老闆定期回到現場']}
        />
      </div>
    </Body>
  </Slide>
);

const Flyer: Page = () => (
  <Slide>
    <Eyebrow>西屯店案例</Eyebrow>
    <H size={72}>每月 60 萬，做到 100 萬</H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Tile label="原本" value="約 60 萬" sub="每月卡住" />
        <div style={{ fontSize: 56, color: 'var(--osd-accent)' }}>→</div>
        <Tile label="1 月" value="100 萬" sub="這位創辦人親自帶" dark />
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.6, marginTop: 32 }}>
        便當很吃發傳單：找<b style={{ color: C.berry }}>派報公司</b>，
        <br />
        從投信箱，改成<b>站在大樓門口，發 8 小時，直接對人發</b>。
      </div>
      <Note>主管認為不可能而離職。數字是這位創辦人的自述，不是統計</Note>
    </Body>
  </Slide>
);

const Move: Page = () => (
  <Slide>
    <Eyebrow>產品屬性，決定行銷方式</Eyebrow>
    <H size={72}>客人不來，就搬去客人附近</H>
    <Body>
      <div>
        <T3 cols="190px 1fr 1fr" head a="" b="早午餐（體驗型）" c="便當（日常型）" />
        <T3 cols="190px 1fr 1fr" a="行銷" b="請部落客拍，店夠漂亮就會來" c="請部落客不一定有用" />
        <T3 cols="190px 1fr 1fr" a="客人" b="被吸引來" c="要靠累積與培養" />
        <T3 cols="190px 1fr 1fr" a="做法" b="好看、好吃、有話題" c="發傳單、團訂、進駐醫院與大樓" />
      </div>
    </Body>
  </Slide>
);

const Sum3: Page = () => <Summary label="這一組只記一句" line="便當靠發傳單，不靠網紅" />;

/* ---------- 收尾 ---------- */

const Pitfalls: Page = () => (
  <Slide>
    <Eyebrow>踩坑分享</Eyebrow>
    <H size={72}>導入自動化，最常卡在這 5 關</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Flip front="老員工反對制式化" back="堅持高麗菜要用炒的，溝通後選擇離開" hint="點一下看後果" h={100} />
        <Flip front="定位夾在中間" back="常被誤認是健康餐盒，要一直解釋" hint="點一下看後果" h={100} />
        <Flip front="老闆很久沒下現場" back="主管說「你又沒做，哪知道」" hint="點一下看後果" h={100} />
        <Flip front="離峰還排 2 個人" back="人力浪費，成本壓不下來" hint="點一下看後果" h={100} />
        <Flip front="情緒積在身上" back="車上坐到想通，才回家" hint="點一下看後果" h={100} />
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
    <H size={72}>「讓錯誤變困難」檢查表</H>
    <Body>
      <div>
        <T3 cols="1fr 1fr 1fr" head a="最依賴人手藝的環節" b="錯誤會怎麼發生" c="怎麼讓它變困難" />
        <BlankRow />
        <BlankRow />
        <BlankRow />
      </div>
      <Note>參考：預分裝、秤重、固定流程、設備取代</Note>
    </Body>
  </Slide>
);

const Outcome: Page = () => (
  <Slide>
    <Eyebrow>預期的成果</Eyebrow>
    <H size={72}>這位創辦人的成績單</H>
    <Body>
      <div style={{ display: 'flex', gap: 22 }}>
        <Tile label="人事成本" value="10%" />
        <Tile label="食材成本" value="≤ 40%" />
        <Tile label="3 人 3 小時" value="260 盒" dark />
      </div>
      <div style={{ display: 'flex', gap: 22, marginTop: 22 }}>
        <Tile label="新人上手" value="1 週" />
        <Tile label="半年內展店" value="2 → 7 家" />
        <Tile label="西屯店" value="60 → 100 萬" />
      </div>
      <Note>以上都是這位創辦人的自述，沒有財報查證，不是統計</Note>
    </Body>
  </Slide>
);

const Compare: Page = () => (
  <Slide>
    <Eyebrow>
      對照討論
      <Tag />
    </Eyebrow>
    <H size={72}>為什麼便當店適合設備化？</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="便當店"
          title="適合設備化"
          lines={['品項標準化', '出餐量大', '走加盟複製']}
        />
        <Pair
          tag="小型烘焙店"
          title="要小心設備化"
          lines={['品項靈活、愛換線', '靠師傅的判斷力', '出餐量有限']}
        />
      </div>
      <div style={{ fontFamily: serif, fontSize: 42, fontWeight: 700, color: C.berry, marginTop: 32 }}>
        設備值不值得，要看產品和出餐量。
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
        <Row n="1">你的店，哪些環節最依賴「人的手藝」？</Row>
        <Row n="2">你的產品是體驗型還是日常型？怎麼行銷？</Row>
        <Row n="3">導入設備時，你怎麼跟老員工溝通？</Row>
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
        <Col tag="觀念" title="讓錯誤變困難" body={'人很難控制\n就改系統'} />
        <Col tag="工具" title="困難檢查表" body={'3 個環節\n逐一想辦法'} />
        <Col tag="行動" title="選一個環節改" body={'預分裝或秤重\n先改一個'} />
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
      人很難控制，
      <br />
      就讓錯誤變得困難。
    </H>
    <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 48, lineHeight: 1.6 }}>
      再問一次：你願意花 230 元，買一個便當嗎？
      <br />
      <span style={{ color: C.gold }}>「看情況」的人，說說是什麼情況</span>
    </div>
  </Slide>
);

export const notes: (string | undefined)[] = [
  '歡迎大家。今天的主題：230 元的便當怎麼賣？這是一場訪談的整理，主角是便當店的創辦人，她用零炒菜鍋加自動化，做出不太一樣的便當店。',
  '先請大家舉手。你願意花 230 元，買一個便當嗎？A 願意、B 不願意、C 看情況。選 C 的人，記得想一想是什麼情況。記下票數，最後一頁再問一次。',
  '先認識這位創辦人。她 18 歲第一次創業，到現在已經創業三次，目前有七家便當店，和兩家早午餐店，早午餐店開了六年多。她的個性很樂觀，不好的事不記太久，有問題就解決，記得不要再犯同樣的錯。',
  '先講清楚這場不是什麼：不是叫你買一堆機器、不是教你開加盟、也不是說貴的才好賣。是看讓錯誤變得困難，怎麼做。',
  '今天分三組：先看定位，再看系統化，最後看放權和行銷。',
  undefined,
  '這位創辦人三次創業，每一次都學到一件事。第一次是 18 歲的平價雞肉飯，前半年虧損，發傳單、掛布條都沒用，找部落客行銷後生意變超好，她學會行銷。第二次是早午餐，商業模式要很多人維持，內外場要協調，年長的廚師常覺得年輕老闆不懂，她學到人很難控制。第三次是便當店便當，把前兩次的學習整合起來：系統化加設備化。',
  '便當店的定位，夾在日常便當和健康餐之間。平價連鎖打不贏；健康餐她自己不吃，沒有自信做好。所以切入原型食物、健康又美味、絕不油炸，走中價位，因為很多便當是買給客戶吃的，要有面子。宣傳說法是漂亮便當：這個世界上沒有人不喜歡漂亮的東西。非會員售價 169 到 230 元。難處是常被誤認為健康餐盒，要一直教育市場。這些都是她的說法。',
  '第一組只記一句：先讓客人吃過，才會回不去。這位創辦人說，客人吃過好的東西之後就回不去了，但最重要的是，他要先吃過。',
  undefined,
  '核心做法：零炒菜鍋。把一般便當店的炒菜鍋換成烤箱。工廠預先把調味包分裝好，現場只要秤重：五公斤的菜，配一包調味粉，倒下去拌，送進烤箱。食材也交給代工廠前處理。就像鼎泰豐一樣分好份量，不會有今天太鹹、明天不鹹的問題。新人沒有經驗，大約一週就能上手。',
  '設備投資。開一家店大約 300 萬，包含烤箱、打飯機、冰箱、大型凍庫。她說服加盟主的理由是：未來人力一定越來越貴，而且不好教。設備貴，但每店人事成本約 10%。打飯機：打十分鐘不一定比人快，打一小時一定比人快；人工打飯一定要秤；離峰只有一個人，一定需要打飯機，因為他沒有四隻手。300 萬和 10% 是她自己的說法，沒有財報查證。',
  '利潤的關鍵是控制成本，要關緊兩個水龍頭。第一，食材報廢：便當最容易報廢，商辦區平日好、假日普通，不能每天備一樣的量。第二，人力浪費：離峰沒事，還是排兩個人。食材成本，她控制在 40% 以內。',
  '第二組只記一句：人很難控制，就讓錯誤變得困難。',
  undefined,
  '加盟和多店管理。篩選加盟主，不是付錢就能加盟，要看有沒有用心想做，受訓一個月，評分考核。加分是願意親自經營、對品質有要求。多店管理的差別在放權：和每位店長溝通，提升他們的認知和實力，從我的店變成我們的店。',
  '西屯店案例。每月卡在五、六十萬，她設定目標 100 萬，主管說不可能就離職，她自己下去帶，一月真的做到 100 萬。她做了什麼？發傳單。便當真的很吃發傳單。她找派報公司，先投信箱效果普通，改成請派報人員站在大樓門口，發八個小時，直接對人發。這些數字是她的自述，不是統計。',
  '產品屬性，決定行銷方式。早午餐請部落客來拍，店夠漂亮、東西夠好吃，客人就會來；便當很日常，請部落客不一定有用，客人要靠累積和培養。所以客人不來，就搬去客人附近：進駐醫院、大樓，大部分接公司團訂。這跟前面那位麵包店老闆，靠打卡熱點、零廣告的做法不同，產品不同，行銷也不同。',
  '第三組只記一句：便當靠發傳單，不靠網紅。',
  '導入自動化最常卡的五關，是翻牌卡，請同學先猜後果再翻。注意：要按 F 進播放模式才點得動。老員工反對制式化，堅持高麗菜要用炒的，溝通後選擇離開。這位創辦人的溝通觀念是：自動化不是取代人，是讓人去做更有價值的事。最後一個是情緒：她的做法是先打一場手遊，真的很難過，就在車上坐到想通才回家。',
  '今天帶走的工具：讓錯誤變困難檢查表。列出你的店最依賴人手藝的三個環節，想想錯誤會怎麼發生，再想怎麼讓它變困難，例如預分裝、秤重、固定流程、設備取代。這張表是我們整理的延伸，請大家抄下來。',
  '這位創辦人的成績單：人事成本約 10%、食材成本 40% 以內、三個人三小時可以出 260 個便當、新人一週上手、半年內從兩家展到七家、西屯店從 60 萬做到 100 萬。這些都是她自己的說法，沒有財報查證，不是統計。',
  '對照討論，這一頁是我們整理的延伸。前面「純手工」那一場，講過小型烘焙店要小心機器，為什麼便當店卻適合大量設備化？差別在品項標準化的程度、出餐量，還有是不是走加盟複製。設備值不值得，要看產品和出餐量。',
  '請和旁邊的人聊三分鐘，三題任選。聊完請兩到三位同學分享。接著開放問答。',
  '帶走三樣：一個觀念，人很難控制，就讓錯誤變得困難；一個工具，錯誤變困難檢查表；一個行動，選一個最依賴手藝的環節，先改一個。',
  '最後一句話：人很難控制，就讓錯誤變得困難。現在回到一開始的問題，再舉一次手：你願意花 230 元買一個便當嗎？選看情況的人，說說是什麼情況，看看和一開始比，有沒有改變。謝謝大家。',
];

export const meta: SlideMeta = {
  title: '230 元的便當怎麼賣？',
  createdAt: '2026-10-10T21:55:21.223Z',
};

export default [
  Cover,
  Hook,
  Who,
  NotThis,
  Agenda,
  Ch1,
  Three,
  Position,
  Sum1,
  Ch2,
  Pot,
  Equip,
  Profit,
  Sum2,
  Ch3,
  Franchise,
  Flyer,
  Move,
  Sum3,
  Pitfalls,
  Tool,
  Outcome,
  Compare,
  DiscussQA,
  TakeAway,
  Closing,
] satisfies Page[];
