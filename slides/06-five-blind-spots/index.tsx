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
  palette: { bg: '#eef6f4', text: '#14302c', accent: '#1b6a5c' },
  fonts: {
    display: '"Noto Serif TC", "Source Han Serif TC", "PMingLiU", "Songti TC", serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#46635e',
  line: '#cfe2de',
  panel: '#dcede9',
  berry: '#a5481a',
  dark: '#0e2623',
  darkText: '#eef6f4',
  darkMuted: '#b3d0ca',
  gold: '#e8bb5e',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-06-five-blind-spots';
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
      <span>為什麼你的甜點很好吃，卻沒人買？</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '被看見', from: 6, to: 9 },
  { name: '買得到', from: 10, to: 14 },
  { name: '聽真話', from: 15, to: 18 },
  { name: '收尾', from: 19, to: 25 },
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


/* ---------- 06 專用小元件 ---------- */

const Truth = ({
  left,
  right,
  ll = '顧客端的真相',
  rl = '怎麼做',
  tag,
}: {
  left: ReactNode[];
  right: ReactNode[];
  ll?: string;
  rl?: string;
  tag?: boolean;
}) => (
  <div style={{ display: 'flex', gap: 40 }}>
    <Card style={{ flex: 1.1, padding: '40px 48px' }}>
      <div style={{ fontSize: 34, fontWeight: 700, color: C.berry, marginBottom: 16 }}>{ll}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 40, lineHeight: 1.5 }}>
        {left.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
    </Card>
    <Card style={{ flex: 1, padding: '40px 48px', background: C.dark, color: C.darkText }}>
      <div style={{ fontSize: 34, fontWeight: 700, color: C.gold, marginBottom: 16 }}>
        {rl}
        {tag ? (
          <span
            style={{
              display: 'inline-block',
              fontSize: 28,
              border: `2px solid ${C.gold}`,
              borderRadius: 999,
              padding: '2px 16px',
              marginLeft: 16,
              verticalAlign: 'middle',
            }}
          >
            延伸建議
          </span>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 40, lineHeight: 1.5 }}>
        {right.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
    </Card>
  </div>
);

const ChkRow = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 44, lineHeight: 1.45 }}>
    <div
      style={{
        flex: 'none',
        width: 48,
        height: 48,
        border: '4px solid var(--osd-accent)',
        borderRadius: 8,
      }}
    />
    <div>{children}</div>
  </div>
);

const Flow = ({ n, children }: { n: string; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      fontSize: 38,
      lineHeight: 1.3,
      padding: '12px 0',
      borderBottom: `2px solid ${C.line}`,
    }}
  >
    <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, color: 'var(--osd-accent)', width: 44 }}>{n}</div>
    <div>{children}</div>
  </div>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1200 }}>
        <Eyebrow>職訓班課程｜餐飲創業</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 100, fontWeight: 700, lineHeight: 1.25, margin: '0 0 36px' }}>
          為什麼你的甜點很好吃，
          <br />
          卻沒人買？
        </h1>
        <div style={{ fontSize: 44, color: 'var(--osd-accent)', fontWeight: 500, lineHeight: 1.5 }}>
          從消費習慣，看烘焙工作室的 5 大盲點
        </div>
      </div>
      <svg width="360" height="470" viewBox="0 0 360 470" aria-hidden="true">
        <rect x="40" y="10" width="240" height="450" rx="36" fill={C.panel} stroke={C.muted} strokeWidth="6" />
        <rect x="64" y="60" width="192" height="340" rx="10" fill={C.bg} />
        <circle cx="160" cy="170" r="62" fill="var(--osd-accent)" opacity="0.85" />
        <circle cx="160" cy="170" r="30" fill={C.gold} />
        <rect x="84" y="262" width="152" height="14" rx="7" fill={C.line} />
        <rect x="84" y="290" width="110" height="14" rx="7" fill={C.line} />
        <line x1="145" y1="38" x2="175" y2="38" stroke={C.muted} strokeWidth="6" strokeLinecap="round" />
        <path d="M320 380 L320 220" stroke={C.berry} strokeWidth="10" strokeLinecap="round" />
        <path d="M296 246 L320 214 L344 246" fill="none" stroke={C.berry} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </Slide>
);

const Practice: Page = () => (
  <Slide>
    <Eyebrow>先動手數一數</Eyebrow>
    <H size={72}>
      從看到貼文，到完成下單，
      <br />
      要幾步？
    </H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Chip strong>看到貼文</Chip>
        <Arrow />
        <Chip>？</Chip>
        <Arrow />
        <Chip>？</Chip>
        <Arrow />
        <Chip>？</Chip>
        <Arrow />
        <Chip strong>完成下單</Chip>
      </div>
      <Note>打開你自己（或喜歡的工作室）的 IG，數一數。記下數字，最後一頁再數一次</Note>
    </Body>
  </Slide>
);

const Gate: Page = () => (
  <Slide>
    <Eyebrow>工作室的真相</Eyebrow>
    <H size={72}>進得來，不等於活得下來</H>
    <Body>
      <div style={{ display: 'flex', gap: 40, alignItems: 'stretch' }}>
        <Card style={{ flex: 1, padding: '40px 44px' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>工作室是輕資產</div>
          <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, lineHeight: 1.5, margin: '12px 0 20px' }}>
            一張桌子、一台冰箱、
            <br />
            一台攪拌機，就能開始
          </div>
          <div style={{ fontSize: 42, lineHeight: 1.5 }}>
            門檻太低，容易忘了本質：
            <br />
            <b style={{ color: C.berry }}>仍是商業競爭</b>
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '40px 44px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.gold }}>最常見的陣亡方式</div>
          <div style={{ fontSize: 44, lineHeight: 1.55, marginTop: 16 }}>
            通常不是資金不足，
            <br />
            而是<b style={{ color: C.gold }}>知名度拉不上來</b>、
            <br />
            打不進陌生客群，
            <br />
            幾個月後默默消失
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
              不是教你做出更好吃的甜點
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是叫你亂花錢
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是責怪經營者
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
              是用顧客的眼睛，重看 5 個盲點
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
    <H size={88}>5 個盲點，分 3 組</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <GroupBox tag="盲點 ①④" title="被看見" items={['產品照', '曝光機會']} />
        <GroupBox tag="盲點 ②③" title="買得到" items={['銷售時間', '購買流程']} />
        <GroupBox tag="盲點 ⑤" title="聽真話" items={['人情訂單', '共同根源']} />
      </div>
    </Body>
  </Slide>
);

/* ---------- 第一組：被看見 ---------- */

const Ch1: Page = () => <Chapter no="01" title="被看見" sub="盲點 ①④" />;

const Photo: Page = () => (
  <Slide>
    <Eyebrow>盲點 ①・產品照</Eyebrow>
    <H size={72}>不到 1 秒，就決定滑走或點進去</H>
    <Body>
      <Truth
        left={['滑 FB、IG 時，第一感官就是照片', '網路是工作室唯一的曝光管道', '一張照片，決定一個品牌的生死']}
        right={['把產品照當成投資，不是能省就省', '預算不足：先把主打 3 項請人拍好']}
        tag
      />
      <Note>這是品牌化經營期的做法；副業起步期，可先用手機拍</Note>
    </Body>
  </Slide>
);

const Exposure: Page = () => (
  <Slide>
    <Eyebrow>盲點 ④・曝光機會</Eyebrow>
    <H size={72}>年輕人用 IG 標籤找店</H>
    <Body>
      <Truth
        left={['20～30 歲在 IG 搜尋 #台南甜點', '再用照片，決定要去哪一家']}
        right={['讓產品出現在這些標籤底下', '請粉絲 5 萬內的 IG 網紅發文']}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 36, flexWrap: 'wrap' }}>
        <Chip>不行銷</Chip>
        <Arrow />
        <Chip>業績越差</Chip>
        <Arrow />
        <Chip>越沒預算行銷</Chip>
        <div style={{ fontSize: 38, fontWeight: 700, color: C.berry, marginLeft: 16 }}>惡性循環</div>
      </div>
      <div style={{ fontSize: 38, color: C.muted, marginTop: 20 }}>
        想的是「這筆錢能幫我賺回多少」，不是「支出又增加多少」
      </div>
    </Body>
  </Slide>
);

const Sum1: Page = () => <Summary label="這一組只記一句" line="沒被看見，就沒有下一步" />;

/* ---------- 第二組：買得到 ---------- */

const Ch2: Page = () => <Chapter no="02" title="買得到" sub="盲點 ②③" />;

const Brain: Page = () => (
  <Slide>
    <Eyebrow>盲點 ②・銷售時間</Eyebrow>
    <H size={72}>想吃甜點是衝動，等越久越理性</H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <svg width="760" height="470" viewBox="0 0 760 470" aria-hidden="true">
          <line x1="70" y1="40" x2="70" y2="400" stroke={C.muted} strokeWidth="5" />
          <line x1="70" y1="400" x2="730" y2="400" stroke={C.muted} strokeWidth="5" />
          <path d="M70 80 C 260 90, 340 330, 720 370" fill="none" stroke="var(--osd-accent)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="90" cy="82" r="16" fill={C.berry} />
          <circle cx="680" cy="366" r="16" fill={C.muted} />
          <text x="110" y="72" fontSize="36" fontWeight="700" fill={C.berry}>好想吃！（感性腦）</text>
          <text x="430" y="225" fontSize="36" fontWeight="700" fill={C.muted}>再想想…（理性腦）</text>
          <text x="70" y="448" fontSize="32" fill={C.muted}>等待的時間 →</text>
          <text x="14" y="30" fontSize="32" fill={C.muted}>購買慾</text>
        </svg>
        <div style={{ fontSize: 42, lineHeight: 1.6 }}>
          被話題、IG、同事的下午茶「燒到」，
          <br />
          <b>想吃是突然的</b>。
          <div style={{ marginTop: 24, color: C.berry, fontWeight: 700 }}>
            所以預約制，
            <br />
            對新工作室不利。
          </div>
        </div>
      </div>
    </Body>
  </Slide>
);

const Hunger: Page = () => (
  <Slide>
    <Eyebrow>盲點 ②・銷售時間</Eyebrow>
    <H size={72}>飢餓行銷，要先有聲量</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1, padding: '40px 48px' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>有聲量的品牌</div>
          <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, lineHeight: 1.4, margin: '12px 0' }}>
            「我非吃到不可」
          </div>
          <div style={{ fontSize: 40 }}>客人願意等好幾天</div>
        </Card>
        <Card style={{ flex: 1, padding: '40px 48px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.darkMuted }}>沒聲量的新品牌</div>
          <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, lineHeight: 1.4, margin: '12px 0' }}>
            客人改買別家
          </div>
          <div style={{ fontSize: 40 }}>更吸引人，又知道何時吃得到</div>
        </Card>
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.6, marginTop: 36 }}>
        常見的錯：想集單、兼差、以為飢餓行銷有用，就<b style={{ color: C.berry }}>不定期開單</b>。
      </div>
      <div style={{ fontSize: 40, color: 'var(--osd-accent)', fontWeight: 700, marginTop: 12 }}>
        固定、可預期的販售時間，例如每週五開單
        <Tag />
      </div>
    </Body>
  </Slide>
);

const Buy: Page = () => (
  <Slide>
    <Eyebrow>盲點 ③・購買流程</Eyebrow>
    <H size={72}>流程越長，越容易放棄</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: 1.2 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.berry, marginBottom: 6 }}>現在常見的流程</div>
          <Flow n="1">看完一長串訂購規則</Flow>
          <Flow n="2">研究有哪些商品</Flow>
          <Flow n="3">確認接下來開單哪些</Flow>
          <Flow n="4">私訊訂購</Flow>
          <Flow n="5">約時間面交</Flow>
        </div>
        <Card style={{ flex: 0.9, padding: '44px 44px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.gold }}>
            資訊集中、步驟簡化
            <span
              style={{
                display: 'inline-block',
                fontSize: 28,
                border: `2px solid ${C.gold}`,
                borderRadius: 999,
                padding: '2px 16px',
                marginLeft: 16,
                verticalAlign: 'middle',
              }}
            >
              延伸建議
            </span>
          </div>
          <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, lineHeight: 1.45, marginTop: 14 }}>
            一張圖說清楚，
            <br />
            一個連結下單
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 38, color: C.muted, marginTop: 32 }}>最後能成功下訂的，都是你的真愛</div>
    </Body>
  </Slide>
);

const Sum2: Page = () => <Summary label="這一組只記一句" line="讓顧客知道何時、怎麼買" />;

/* ---------- 第三組：聽真話 ---------- */

const Ch3: Page = () => <Chapter no="03" title="聽真話" sub="盲點 ⑤＋共同根源" />;

const Favor: Page = () => (
  <Slide>
    <Eyebrow>盲點 ⑤・人情訂單</Eyebrow>
    <H size={72}>親友的好評，不等於市場認可</H>
    <Body>
      <Truth
        ll="為什麼不能信"
        rl="怎麼做"
        left={['親友、同學、同事：人情大於真實想法', '正評遠多於負評，還基於禮貌下單', '新手誤以為，產品已通過市場驗證']}
        right={['找足夠數量的陌生目標客來測試', '小至口味、外觀、新品主題', '大至購買流程、面交時間與地點']}
      />
      <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: C.berry, marginTop: 32, lineHeight: 1.5 }}>
        約 15 位來諮詢的經營者，多數都說：一開始大家都說好，兩三個月後幾乎沒訂單。
      </div>
    </Body>
  </Slide>
);

const Root: Page = () => (
  <Slide>
    <Eyebrow>5 個盲點的共同根源</Eyebrow>
    <H size={72}>都是從「自己方便」出發</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ChgRow n="1" title="為了省錢，自己拍產品照" line="不敢請部落客、IG 美食網紅" />
        <ChgRow n="2" title="為了方便，讓顧客配合店家" line="販售時間、購買流程，都要顧客遷就" />
        <ChgRow n="3" title="專心生產，接觸不到顧客" line="最大的盲點：決策容易偏頗，只考慮自己" />
      </div>
    </Body>
  </Slide>
);

const Sum3: Page = () => <Summary label="這一組只記一句" line="看顧客的習慣，不看自己方便" />;

/* ---------- 收尾 ---------- */

const Pitfalls: Page = () => (
  <Slide>
    <Eyebrow>踩坑分享</Eyebrow>
    <H size={72}>為什麼明知道，還是做不到？</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Flip front="覺得拍照、網紅是多出來的錢" back="越不行銷，業績越差" hint="點一下看後果" h={100} />
        <Flip front="兼差、產能不穩，不定期開單" back="客人不知道何時買得到" hint="點一下看後果" h={100} />
        <Flip front="沒有人手，讓顧客配合店家" back="流程太長，客人放棄" hint="點一下看後果" h={100} />
        <Flip front="專心生產，接觸不到顧客" back="決策偏頗，只考慮自己" hint="點一下看後果" h={100} />
        <Flip front="不敢面對陌生人的真話" back="只聽得到好聽的話" hint="點一下看後果" h={100} />
      </div>
    </Body>
  </Slide>
);

const Tool: Page = () => (
  <Slide>
    <Eyebrow>
      今天帶走的工具
      <Tag>整理成檢核表</Tag>
    </Eyebrow>
    <H size={72}>顧客視角檢核表</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <ChkRow>我的產品照，1 秒內能讓人想點進來嗎？</ChkRow>
        <ChkRow>我的販售時間，固定而且客人知道嗎？</ChkRow>
        <ChkRow>從看到貼文到下單，步驟夠少嗎？</ChkRow>
        <ChkRow>顧客搜尋的 IG 標籤底下，找得到我嗎？</ChkRow>
        <ChkRow>我的顧客裡，有足夠的陌生人嗎？</ChkRow>
      </div>
      <Note>每一題答「否」，就是你的盲點</Note>
    </Body>
  </Slide>
);

const Outcome: Page = () => (
  <Slide>
    <Eyebrow>
      預期的成果
      <Tag>依影片整理</Tag>
    </Eyebrow>
    <H size={72}>5 個盲點，改善前後</H>
    <Body>
      <div>
        <T3 cols="200px 1fr 1fr" head a="" b="改善前" c="改善後" />
        <T3 cols="200px 1fr 1fr" a="產品照" b="手機隨手拍，被滑走" c="第一眼就想點進來" />
        <T3 cols="200px 1fr 1fr" a="銷售時間" b="不定期開單，等不到" c="固定時間，知道何時買" />
        <T3 cols="200px 1fr 1fr" a="購買流程" b="資訊分散、步驟冗長" c="一張圖、一個連結" />
        <T3 cols="200px 1fr 1fr" a="曝光" b="等口耳相傳" c="出現在顧客會搜尋的地方" />
        <T3 cols="200px 1fr 1fr" a="人情訂單" b="親友說好，就以為成功" c="用陌生客的反應修正" />
      </div>
    </Body>
  </Slide>
);

const Survive: Page = () => (
  <Slide>
    <Eyebrow>預期的成果</Eyebrow>
    <H size={72}>新品牌的存活率，會大幅提升</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card style={{ flex: 1, padding: '40px 48px' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>七、八年前</div>
          <div style={{ fontSize: 42, lineHeight: 1.55, marginTop: 12 }}>
            網路烘焙品牌不普遍，競爭低、選擇少，這些缺點還撐得過
          </div>
        </Card>
        <Card style={{ flex: 1, padding: '40px 48px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.gold }}>現在</div>
          <div style={{ fontSize: 42, lineHeight: 1.55, marginTop: 12 }}>
            網路甜點品牌隨處可見，任何一個缺點，都會降低購買力
          </div>
        </Card>
      </div>
      <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, color: C.berry, marginTop: 40, lineHeight: 1.5 }}>
        從顧客的消費習性出發，存活的機率才會大幅提升。
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
        <Row n="1">用顧客的眼睛看你的 IG：從看到到下單要幾步？</Row>
        <Row n="2">你的第一批顧客有幾成是親友？怎麼找到 30 位陌生客？</Row>
        <Row n="3">如果有 5,000 元行銷預算，你會怎麼花？</Row>
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
        <Col tag="觀念" title="顧客的習慣" body={'決策不看自己方便\n看顧客習慣'} />
        <Col tag="工具" title="顧客視角檢核表" body={'5 問，看見\n你的盲點'} />
        <Col tag="行動" title="重數一次步驟" body={'把下單流程\n縮短一步'} />
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
      進得來，
      <br />
      不等於活得下來。
    </H>
    <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 48, lineHeight: 1.6 }}>
      再數一次：照今天的方法改，你的下單流程可以縮到幾步？
      <br />
      <span style={{ color: C.gold }}>和一開始的數字比一比</span>
    </div>
  </Slide>
);

export const notes: (string | undefined)[] = [
  '歡迎大家。今天的標題很多人有共鳴：為什麼你的甜點很好吃，卻沒人買？我們從顧客在網路上購買的消費習慣，來看工作室的五個盲點。',
  '先請大家動手。打開你自己，或是你喜歡的工作室的 IG，數一數：從看到一則貼文，到完成下單，要幾個步驟？記下數字，最後一頁再數一次，看有沒有縮短。',
  '工作室是輕資產，家裡一張桌子、一台冰箱、一台攪拌機就能開始，門檻很低。但太容易開始，讓人忘了本質仍是商業競爭。進得來，不等於活得下來。最常見的陣亡方式，通常不是資金不足，而是知名度拉不上來、打不進陌生客群，幾個月後默默消失。',
  '先講清楚這場不是什麼：不是教你做出更好吃的甜點、不是叫你亂花錢、也不是責怪經營者。當局者迷，從旁觀者的角度，答案常常很明顯。這場是用顧客的眼睛，重看五個盲點。',
  '五個盲點分三組：被看見，包含產品照和曝光；買得到，包含銷售時間和購買流程；聽真話，是人情訂單，再加上共同根源。',
  undefined,
  '盲點一，產品照。顧客滑 FB、IG、電商時，第一感官來源就是照片，不到一秒就決定滑走或點進去。網路是工作室唯一的曝光管道，一張產品照決定一個品牌的生死也不為過。要把產品照當成投資，不是能省就省。預算不足時，至少先把主打三項請人拍好，這是我們整理的延伸建議。這是品牌化經營期的做法，副業起步期，可以先用手機拍。',
  '盲點四，曝光機會。二十到三十歲的人，會在 IG 搜尋 #台中火鍋、#台南甜點這類標籤，再用照片決定去哪家。為什麼不讓自己的產品出現在這些標籤底下？越不行銷，業績越差，越沒預算行銷，這是惡性循環。請一位粉絲五萬以內的 IG 美食網紅寫一篇文、發一則限動，真的不會很貴。想的是這筆錢能幫我賺回多少，不是支出又增加多少。',
  '第一組只記一句：沒被看見，就沒有下一步。',
  undefined,
  '盲點二，銷售時間。想吃甜點的慾望，突發性大於計畫性，被話題、IG、同事的下午茶燒到，感性腦說好想吃。等得越久，理性腦就介入，購買慾下降。所以預約制，對新工作室不利。',
  '那為什麼有人願意等好幾天？因為商品、品牌或甜點師有聲量，是我非吃到不可。但許多工作室不定期開單，原因可能是想集單、只是兼差，或誤以為飢餓行銷有用。沒有聲量的新品牌，客人會改買更吸引人、又知道何時吃得到的。建議用固定、可預期的販售時間，例如每週五開單，這是延伸建議。',
  '盲點三，購買流程。顧客想買，要先看完一長串訂購規則，研究商品，確認開單品項，私訊訂購，再約時間面交。這個流程多半是以經營者的角度訂的。最後能成功下訂的客人，都是你的真愛。建議資訊集中、步驟簡化，一張圖說清楚，一個連結下單，這是延伸建議。',
  '第二組只記一句：讓顧客知道何時、怎麼買。',
  undefined,
  '盲點五，把人情訂單誤認為市場認可。第一批顧客通常是親朋好友，在華人社會，人情大於真實想法，正評遠多於負評，基於禮貌下單，新手就誤以為產品通過市場驗證。同學、同事、鄰居也一樣。解法是找足夠數量的陌生目標客測試，小到口味、外觀、新品主題，大到購買流程、面交時間地點。這位業界創業者提供一對一諮詢，約十五位經營者，多數都說一開始大家都說好，兩三個月後幾乎沒訂單。',
  '這五個盲點的共同根源，都是經營者從自己的角度看經營：為了省錢自己拍照，不敢請網紅，為了方便讓顧客配合店家。最大的盲點，是專心在工作室生產，無法真實接觸顧客。',
  '第三組只記一句：用顧客的習慣做決策，不是自己的方便。',
  '為什麼明知道，還是做不到？五個原因，是翻牌卡，請同學先猜後果再翻。注意：要按 F 進播放模式才點得動。最後一個，不敢面對陌生人的真話，是我們整理的延伸。',
  '今天帶走的工具：顧客視角檢核表，五個問題。這張表是我們整理的，請大家抄下來。每一題答否，就是你的盲點。',
  '改善前後的對照，是我們依影片內容整理的。產品照從手機隨手拍，到第一眼就想點進來；銷售時間從不定期，到固定；購買流程從冗長，到一張圖一個連結；曝光從等口耳相傳，到出現在顧客搜尋的地方；人情訂單從親友說好，到用陌生客的反應修正。',
  '新品牌的存活率會大幅提升。七八年前，網路烘焙品牌不普遍，競爭低、選擇少，這些缺點還撐得過；現在網路甜點品牌隨處可見，任何一個缺點，都會降低購買力。從顧客的消費習性出發，存活的機率才會大幅提升。',
  '請和旁邊的人聊三分鐘，三題任選。第一題用顧客的眼睛看你的 IG；第二題你的第一批顧客有幾成是親友；第三題五千元行銷預算怎麼花。接著開放問答。',
  '帶走三樣：一個觀念，用顧客的習慣做決策；一個工具，顧客視角檢核表；一個行動，重新數一次下單步驟，縮短一步。',
  '最後一句話：進得來，不等於活得下來。現在回到一開始的練習，再數一次：照今天的方法改，你的下單流程可以縮到幾步？和一開始的數字比一比。謝謝大家。',
];

export const meta: SlideMeta = {
  title: '為什麼你的甜點很好吃，卻沒人買？',
  createdAt: '2026-10-10T07:54:57.905Z',
};

export default [
  Cover,
  Practice,
  Gate,
  NotThis,
  Agenda,
  Ch1,
  Photo,
  Exposure,
  Sum1,
  Ch2,
  Brain,
  Hunger,
  Buy,
  Sum2,
  Ch3,
  Favor,
  Root,
  Sum3,
  Pitfalls,
  Tool,
  Outcome,
  Survive,
  DiscussQA,
  TakeAway,
  Closing,
] satisfies Page[];
