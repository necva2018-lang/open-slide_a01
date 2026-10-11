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
  palette: { bg: '#fbf1f0', text: '#321a1c', accent: '#9f2f3b' },
  fonts: {
    display: '"Noto Serif TC", "Source Han Serif TC", "PMingLiU", "Songti TC", serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#6a4f51',
  line: '#ecd5d4',
  panel: '#f4e3e1',
  berry: '#9a4a0e',
  dark: '#2f1518',
  darkText: '#fbf1f0',
  darkMuted: '#e0c4c5',
  gold: '#edba68',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-08-handmade-trap';
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
      <span>「純手工」是烘焙小店最大的陷阱？</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '手工的真相', from: 6, to: 10 },
  { name: '小店的賣點', from: 11, to: 14 },
  { name: '缺工的解法', from: 15, to: 20 },
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


/* ---------- 08 專用小元件 ---------- */

const ThreeCards = ({ items }: { items: { tag: string; head: string; line: string }[] }) => (
  <div style={{ display: 'flex', gap: 28 }}>
    {items.map((it) => (
      <Card key={it.tag} style={{ flex: 1, padding: '36px 34px' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>{it.tag}</div>
        <div style={{ fontFamily: serif, fontSize: 54, fontWeight: 700, margin: '10px 0 14px' }}>{it.head}</div>
        <div style={{ fontSize: 38, lineHeight: 1.5, color: C.muted }}>{it.line}</div>
      </Card>
    ))}
  </div>
);

const Gauge = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div style={{ flex: 1, textAlign: 'center' }}>
    {label ? <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>{label}</div> : null}
    <div style={{ fontFamily: serif, fontSize: 96, fontWeight: 700, lineHeight: 1.15, margin: '6px 0' }}>{value}</div>
    {sub ? <div style={{ fontSize: 36, color: C.muted }}>{sub}</div> : null}
  </div>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1150 }}>
        <Eyebrow>職訓班課程｜餐飲創業</Eyebrow>
        <h1 style={{ fontFamily: serif, fontSize: 104, fontWeight: 700, lineHeight: 1.25, margin: '0 0 36px' }}>
          「純手工」是
          <br />
          烘焙小店最大的陷阱？
        </h1>
        <div style={{ fontSize: 46, color: 'var(--osd-accent)', fontWeight: 500 }}>
          小店老闆誤會了市場最真實的需求
        </div>
      </div>
      <svg width="440" height="420" viewBox="0 0 440 420" aria-hidden="true">
        <path d="M80 380 C 60 300, 70 230, 110 150 L 130 120 C 140 100, 165 104, 160 128 L 150 200" fill={C.panel} stroke={C.muted} strokeWidth="6" strokeLinejoin="round" />
        <path d="M150 200 L 165 90 C 168 68, 196 70, 194 94 L 190 190 L 200 80 C 202 58, 230 62, 228 86 L 222 190 L 236 100 C 240 80, 266 86, 262 108 L 250 210 C 270 190, 290 150, 306 160 C 318 170, 300 230, 270 290 C 250 330, 240 350, 236 380 Z" fill={C.panel} stroke={C.muted} strokeWidth="6" strokeLinejoin="round" />
        {[[120, 250], [180, 290], [220, 240], [150, 330], [250, 320], [200, 200]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6 + (i % 3) * 3} fill="#fff" opacity="0.9" />
        ))}
        <text x="370" y="120" textAnchor="middle" fontSize="150" fontWeight="700" fill="var(--osd-accent)" fontFamily="serif">?</text>
      </svg>
    </div>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先動手寫一下</Eyebrow>
    <H size={72}>
      你的店（或想開的店），
      <br />
      最大的賣點是什麼？
    </H>
    <Body>
      <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
        <div
          style={{
            width: 620,
            height: 420,
            background: '#f6d98f',
            borderRadius: 8,
            boxShadow: '0 20px 40px -12px rgba(60,40,20,0.35)',
            transform: 'rotate(-2deg)',
            padding: 48,
            fontFamily: serif,
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.5,
            color: C.dark,
          }}
        >
          我的最大賣點：
          <div style={{ borderBottom: '3px solid #b89048', height: 84 }} />
          <div style={{ borderBottom: '3px solid #b89048', height: 84 }} />
        </div>
        <div style={{ fontSize: 44, lineHeight: 1.7 }}>
          寫下一句話，收起來。
          <br />
          最後一頁，再寫一次。
          <div style={{ color: C.muted, fontSize: 36, marginTop: 16 }}>老師會數：有幾個人寫「純手工」</div>
        </div>
      </div>
    </Body>
  </Slide>
);

const Same: Page = () => (
  <Slide>
    <Eyebrow>一位烘焙顧問的觀察</Eyebrow>
    <H size={72}>每家街邊小店，都在講一樣的話</H>
    <Body>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Chip>純手工</Chip>
        <Chip>用好食材</Chip>
        <Chip>天然無添加</Chip>
        <Chip>職人用心</Chip>
      </div>
      <Card style={{ marginTop: 40, padding: '40px 48px', background: C.dark, color: C.darkText }}>
        <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, lineHeight: 1.5 }}>
          消費者嘴上說的「純手工」，
          <br />
          根本不是你以為字面上的意思。
        </div>
      </Card>
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
              不是說手工不好
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是叫你改用機器
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是教你做麵包
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
              是看清楚，客人真正買的是什麼
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
        <GroupBox tag="第一組" title="手工的真相" items={['吃不出差別', '真正的價值']} />
        <GroupBox tag="第二組" title="小店的賣點" items={['4 個賣點', '把它說出來']} />
        <GroupBox tag="第三組" title="缺工的解法" items={['兩個誘惑', '砍品項']} />
      </div>
    </Body>
  </Slide>
);

/* ---------- 第一組：手工的真相 ---------- */

const Ch1: Page = () => <Chapter no="01" title="手工的真相" sub="客人買的是什麼" />;

const Blind: Page = () => (
  <Slide>
    <Eyebrow>殘酷的事實</Eyebrow>
    <H size={72}>多數人，吃不出差別</H>
    <Body>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Card style={{ flex: 1, padding: '40px 36px', textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>A 可頌</div>
          <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, lineHeight: 1.4, marginTop: 8 }}>
            日本大型中央工廠
            <br />
            用優質原料做的可頌
          </div>
        </Card>
        <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 700, color: 'var(--osd-accent)' }}>vs</div>
        <Card style={{ flex: 1, padding: '40px 36px', textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>B 可頌</div>
          <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, lineHeight: 1.4, marginTop: 8 }}>
            你自己手桿折疊
            <br />
            的可頌
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 44, lineHeight: 1.6, marginTop: 40 }}>
        盲測，多數人<b style={{ color: C.berry }}>吃不出決定性的差別</b>。
        <br />
        那為什麼客人還願意多付錢？
      </div>
    </Body>
  </Slide>
);

const Mind: Page = () => (
  <Slide>
    <Eyebrow>純手工的價值</Eyebrow>
    <H size={72}>大部分不在舌頭上，在心理上</H>
    <Body>
      <ThreeCards
        items={[
          { tag: '安心感', head: '有人把關', line: '手工＝職人把關，比較安全、乾淨' },
          { tag: '稀缺感', head: '限量', line: '叫號、預約、會員制，強化「你買到的是特別的」' },
          { tag: '情感溢價', head: '有人為我花心力', line: '像手寫信：理性上沒差，感性上差很多' },
        ]}
      />
      <div style={{ fontSize: 38, color: C.muted, marginTop: 28 }}>這三個，都是消費者自己「腦補」的價值</div>
    </Body>
  </Slide>
);

const Judge: Page = () => (
  <Slide>
    <Eyebrow>真正的手工價值</Eyebrow>
    <H size={72}>師傅腦中的即時判斷</H>
    <Body style={{ justifyContent: 'flex-start', paddingTop: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ChgRow n="1" title="依今天的溫度與濕度" line="調整發酵時間" />
        <ChgRow n="2" title="這批麵粉的吸水率不同" line="改配方" />
        <ChgRow n="3" title="整形時，依麵團的狀態" line="即時微調" />
      </div>
      <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: C.berry, marginTop: 20, lineHeight: 1.5 }}>
        不可取代的，不是用手做的動作，是判斷力。
      </div>
    </Body>
  </Slide>
);

const Sum1: Page = () => <Summary label="這一組只記一句" line="客人要的不是手，是腦" />;

/* ---------- 第二組：小店的賣點 ---------- */

const Ch2: Page = () => <Chapter no="02" title="小店的賣點" sub="把它說出來" />;

const Four: Page = () => (
  <Slide>
    <Eyebrow>小型烘焙店真正的 4 個賣點</Eyebrow>
    <H size={72}>連鎖和超商，做不到的事</H>
    <Body>
      <div>
        <T2 head a="小店的賣點" b="連鎖做不到的原因" />
        <T2 a="現場感" b="中央工廠＋冷鏈配送，無法複製「5 分鐘前才出爐」" />
        <T2 a="品項靈活" b="連鎖品項被效率鎖死；小店被創意驅動" />
        <T2 a="老闆就是品牌" b="信任帶來的回購，砸預算也換不來" />
        <T2 a="職人說的話有人信" b="連鎖講同一句話，消費者會打折扣" />
      </div>
    </Body>
  </Slide>
);

const Say: Page = () => (
  <Slide>
    <Eyebrow>前提：你得讓消費者知道</Eyebrow>
    <H size={72}>差異化，要「說出來」</H>
    <Body>
      <Card style={{ padding: '36px 48px' }}>
        <div style={{ fontSize: 44, lineHeight: 1.6 }}>
          很多小店不是沒有差異化，
          <br />
          是<b style={{ color: C.berry }}>差異化根本沒有被表達出來</b>。
        </div>
      </Card>
      <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)', margin: '32px 0 12px' }}>
        可以怎麼說
        <Tag />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 40, lineHeight: 1.45 }}>
        <div>拍下今天因為天氣潮濕，調整發酵時間的過程</div>
        <div>說明為什麼這批麵粉，要調整配方</div>
        <div>店內放一張「今日師傅判斷」小卡</div>
      </div>
    </Body>
  </Slide>
);

const Sum2: Page = () => <Summary label="這一組只記一句" line="想像加職人價值，護城河更深" />;

/* ---------- 第三組：缺工的解法 ---------- */

const Ch3: Page = () => <Chapter no="03" title="缺工的解法" sub="誘惑與砍品項" />;

const Trap: Page = () => (
  <Slide>
    <Eyebrow>缺工的「解方」，其實是陷阱？</Eyebrow>
    <H size={72}>兩個誘惑，小店要小心</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <RiskCard2
          tag="冷凍麵團、預製半成品"
          title="立即見效的止痛藥"
          lines={['產品和用同一家供應商的店一模一樣', '安心感、稀缺感、情感溢價，全部歸零', '一旦被消費者知道，定價權崩掉']}
        />
        <RiskCard2
          tag="機器手臂、自動化設備"
          title="門檻太高，彈性太低"
          lines={['一台動輒幾十萬到上百萬', '最怕頻繁換線：買了吐司設備，下一季流行貝果怎麼辦？', '小店的優勢是品項靈活']}
        />
      </div>
    </Body>
  </Slide>
);

const RiskCard2 = ({ tag, title, lines }: { tag: string; title: string; lines: string[] }) => (
  <Card style={{ flex: 1, padding: '40px 44px' }}>
    <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>{tag}</div>
    <div style={{ fontFamily: serif, fontSize: 50, fontWeight: 700, margin: '10px 0 20px', lineHeight: 1.3 }}>{title}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 38, lineHeight: 1.45 }}>
      {lines.map((t) => (
        <div key={t}>{t}</div>
      ))}
    </div>
  </Card>
);

const Frozen: Page = () => (
  <Slide>
    <Eyebrow>冷凍麵團</Eyebrow>
    <H size={72}>可以當戰術工具，不能當主角</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="適合的店型"
          title="走便利價值"
          lines={['市場麵包攤', '便利型社區店', '「巷口就買得到新鮮出爐」']}
        />
        <Pair
          tag="適合的店型"
          title="主力不在麵包"
          lines={['複合式咖啡廳', '有能力二次加工', '二次加工才做得出差異']}
        />
      </div>
      <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: C.berry, marginTop: 36, lineHeight: 1.5 }}>
        主角永遠是你的職人判斷力。
      </div>
    </Body>
  </Slide>
);

const Cut: Page = () => (
  <Slide>
    <Eyebrow>缺工的本質</Eyebrow>
    <H size={72}>不是找不到人，是留不住人</H>
    <Body>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Chip>工時長</Chip>
        <Chip>體力消耗大</Chip>
        <Chip>薪資天花板低</Chip>
        <Chip>職涯模糊</Chip>
      </div>
      <div style={{ fontSize: 46, lineHeight: 1.6, margin: '36px 0' }}>
        與其問「怎麼找到人」，
        <br />
        不如問：<b style={{ color: C.berry }}>小店真的需要賣 30、40 個品項嗎？</b>
      </div>
      <Card style={{ padding: '36px 48px', background: C.dark, color: C.darkText }}>
        <div style={{ fontFamily: serif, fontSize: 50, fontWeight: 700, lineHeight: 1.5 }}>
          品項砍到銷售前 20～30% 的核心，
          <br />
          人力需求直接打對折
        </div>
      </Card>
      <Note>20～30%、打對折，是顧問的經驗說法，不是統計</Note>
    </Body>
  </Slide>
);

const Case: Page = () => (
  <Slide>
    <Eyebrow>顧問案例</Eyebrow>
    <H size={72}>30 幾項，砍到 12 項</H>
    <Body>
      <div style={{ display: 'flex', gap: 28, alignItems: 'stretch' }}>
        <Card style={{ flex: 1, padding: '36px 32px' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.muted, textAlign: 'center' }}>調整前・品項</div>
          <Gauge label="" value="30 幾個" />
          <div style={{ fontSize: 36, lineHeight: 1.5, textAlign: 'center', color: C.muted }}>
            4 人團隊每天忙得要死
            <br />
            利潤很薄
          </div>
        </Card>
        <div style={{ alignSelf: 'center', fontSize: 56, color: 'var(--osd-accent)' }}>→</div>
        <Card style={{ flex: 1, padding: '36px 32px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.gold, textAlign: 'center' }}>3 個月後・品項</div>
          <Gauge label="" value="12 個" />
          <div style={{ fontSize: 36, lineHeight: 1.5, textAlign: 'center', color: C.darkMuted }}>
            人事成本下降
            <br />
            營業額持平
          </div>
        </Card>
      </div>
      <div style={{ fontFamily: serif, fontSize: 46, fontWeight: 700, color: C.berry, marginTop: 36 }}>
        少做不是偷懶，是策略。
      </div>
      <Note>一間甜點工作室的案例，不是統計</Note>
    </Body>
  </Slide>
);

const Sum3: Page = () => <Summary label="這一組只記一句" line="少做不是偷懶，而是策略" />;

/* ---------- 收尾 ---------- */

const Pitfalls: Page = () => (
  <Slide>
    <Eyebrow>踩坑分享</Eyebrow>
    <H size={72}>小店最常踩的 5 個坑</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Flip front="只說「純手工」，說不出別的" back="和巷口每家小店講一樣的話" hint="點一下看後果" h={100} />
        <Flip front="以為消費者本來就該知道" back="差異化沒被表達，等於沒有" hint="點一下看後果" h={100} />
        <Flip front="缺工就全用冷凍麵團" back="產品一模一樣，定價權崩掉" hint="點一下看後果" h={100} />
        <Flip front="花大錢買機器手臂" back="攤不平，又不能換線" hint="點一下看後果" h={100} />
        <Flip front="捨不得砍品項" back="人力需求降不下來" hint="點一下看後果" h={100} />
      </div>
    </Body>
  </Slide>
);

const Tool: Page = () => (
  <Slide>
    <Eyebrow>今天帶走的工具</Eyebrow>
    <H size={72}>品項前 30% 清單</H>
    <Body>
      <div style={{ display: 'flex', gap: 40, alignItems: 'stretch' }}>
        <Card style={{ flex: 1.2, padding: '36px 40px' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)' }}>我的銷售排名</div>
          {['第 1 名', '第 2 名', '第 3 名', '……'].map((t) => (
            <div key={t} style={{ display: 'flex', gap: 20, alignItems: 'baseline', fontSize: 38, marginTop: 16 }}>
              <div style={{ flex: '0 0 130px', color: C.muted }}>{t}</div>
              <div style={{ flex: 1, borderBottom: `3px solid ${C.muted}`, height: 40 }} />
            </div>
          ))}
        </Card>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 26, justifyContent: 'center' }}>
          <Row n="1">品項依銷售排名</Row>
          <Row n="2">圈出前 30%</Row>
          <Row n="3">問：砍掉其餘會怎樣？</Row>
        </div>
      </div>
    </Body>
  </Slide>
);

const Outcome: Page = () => (
  <Slide>
    <Eyebrow>預期的成果</Eyebrow>
    <H size={72}>更深的護城河，更輕的人力</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ChgRow n="1" title="護城河比同行深" line="消費者理解，多付的每一塊錢買到什麼" />
        <ChgRow n="2" title="品項精簡，人力變輕" line="人事成本下降，營業額持平（案例）" />
        <ChgRow n="3" title="保有定價權" line="延伸建議：不被同質化拖進價格戰" />
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
        <Row n="1">你有哪些「職人判斷」，可以拍成內容讓顧客看見？</Row>
        <Row n="2">你的品項銷售前 30% 是哪些？砍掉其餘的會怎樣？</Row>
        <Row n="3">冷凍麵團在你的店型，可以當什麼配角？</Row>
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
        <Col tag="觀念" title="要的是你的腦" body={'不是你的手\n是判斷力'} />
        <Col tag="工具" title="前 30% 清單" body={'依銷售排名\n圈出核心品項'} />
        <Col tag="行動" title="說出一個判斷" body={'拍一支短影片\n或寫一張小卡'} />
      </div>
    </Body>
  </Slide>
);

const Closing: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>
      最後一句話
    </div>
    <H size={104} dark style={{ marginTop: 32, lineHeight: 1.35 }}>
      消費者要的不是你的手，
      <br />
      是你的腦。
    </H>
    <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 48, lineHeight: 1.6 }}>
      再寫一次：你店裡最大的賣點是什麼？
      <br />
      <span style={{ color: C.gold }}>看看有多少人，從「純手工」改成更具體的說法</span>
    </div>
  </Slide>
);

export const notes: (string | undefined)[] = [
  '歡迎大家。今天的標題有點挑釁：純手工是烘焙小店最大的陷阱？這是一位烘焙顧問，協助不少店家做營運診斷後，在第一線的觀察。',
  '先請大家拿出便利貼，寫下你的店，或你想開的店，最大的賣點是什麼。一句話就好，寫完收起來。老師會數有幾個人寫純手工，最後一頁再寫一次。',
  '這位顧問的觀察：每家街邊小店，都在講一模一樣的話，純手工、用好食材。但消費者嘴上說的純手工，根本不是你以為字面上的意思。',
  '先講清楚這場不是什麼：不是說手工不好、不是叫你改用機器、也不是教你做麵包。是看清楚，客人真正買的是什麼。',
  '今天分三組：先看手工的真相，再看小店真正的賣點怎麼說出來，最後看缺工的解法。',
  undefined,
  '一個很殘酷的事實：以食品科技的進步程度，吃得出純手工和機器差別的消費者會越來越少。讓普通消費者盲測，一邊是日本最大的烘焙中央工廠，用優質原料做的可頌，一邊是你自己手桿折出來的可頌，多數人吃不出決定性的差別。那他們為什麼還願意多付錢？',
  '因為純手工的價值，大部分不在舌頭上，在心理上。第一，安心感：手工等於職人把關，比較安全乾淨。第二，稀缺感：產量有限，叫號、預約、會員制都在強化你買到的是特別的。第三，情感溢價：有人為我花了時間和心力，像手寫信，理性上沒差，感性上差很多。這三個都是消費者自己腦補的價值。',
  '真正的手工價值，是判斷力。機器是標準化的，不會根據今天的溫度和濕度調整發酵時間，不會因為這批麵粉吸水率不同而改配方，不會在整形時根據麵團的狀態即時微調。手工真正不可取代的，不是用手去做這個動作，而是師傅腦子裡那一套即時判斷系統。',
  '第一組只記一句：消費者要的不是你的手，是你的腦。',
  undefined,
  '小型烘焙店真正的四個賣點。現場感：出爐的香氣、開放式廚房，中央工廠加冷鏈配送，無法複製這個麵包五分鐘前才出爐。品項靈活：連鎖的品項被效率鎖死，小店的品項被創意驅動。老闆就是品牌：客人認的是你這個人，信任帶來的回購，砸行銷預算也換不來。職人說的話有人信：同一句話從連鎖品牌嘴裡說出來，消費者會自動打折扣。',
  '但這四個優勢要成立，有個前提：你得讓消費者知道。很多小店不是沒有差異化，而是差異化根本沒有被表達出來。可以怎麼說，這是我們整理的延伸建議：拍下今天因為天氣潮濕而調整發酵時間的過程、說明為什麼這批麵粉要調整配方、店內放一張今日師傅判斷的小卡。',
  '第二組只記一句：想像加職人價值，護城河更深。意思是，同時傳達消費者的想像，和真正的職人價值。',
  undefined,
  '缺工的解方，其實是陷阱？先講冷凍麵團和預製半成品，是目前小店最容易導入的，對缺工是立即見效的止痛藥，但是雙面刃：你的產品會和用同一家供應商的店一模一樣，安心感、稀缺感、情感溢價全部歸零，一旦被消費者普遍認知，定價權會直接崩掉。再講機器手臂：一台動輒幾十萬到上百萬，小店的優勢是品項靈活，機器最怕頻繁換線，買了吐司設備，下一季流行貝果怎麼辦？投資門檻太高、彈性太低。',
  '那冷凍麵團適合誰？市場麵包攤、便利型社區店，走的是巷口就買得到新鮮出爐的便利價值；或是主力不在麵包、有能力二次加工的複合式咖啡廳。結論：冷凍麵團可以是戰術工具，但只能當配角，主角永遠是你的職人判斷力。',
  '缺工的本質，不是找不到人手，而是這個產業的勞動條件留不住人：工時長、體力消耗大、薪資天花板低、職涯模糊。與其一直問怎麼找到人，不如問：小店真的需要賣三、四十個品項嗎？把品項砍到銷售前 20% 到 30% 的核心產品，人力需求直接打對折，這是顧問的經驗說法，不是統計。',
  '一個顧問案例：一間甜點工作室原本有 30 幾個品項，四人團隊每天忙得要死，利潤很薄。一起把產品線砍到 12 個核心品項，三個月後人事成本降了，營業額還能持平。這是一個案例，不是統計。這個時代創業，少做不是偷懶，是策略。',
  '第三組只記一句：少做不是偷懶，而是策略。',
  '小店最常踩的五個坑，是翻牌卡，請同學先猜後果再翻。注意：要按 F 進播放模式才點得動。',
  '今天帶走的工具：品項前 30% 清單。列出所有品項，依銷售排名，圈出前 30%，問自己砍掉其餘的會怎樣。這張清單是我們整理的延伸，請大家抄下來。',
  '預期的成果：品牌護城河比同行深，消費者不只是用想像買單，而是理解多付的每一塊錢買到什麼。品項精簡後，人事成本下降、營業額持平，這是案例。保有小店的定價權，不被同質化拖進價格戰，這是我們整理的延伸。',
  '請和旁邊的人聊三分鐘，三題任選。聊完請兩到三位同學分享。接著開放問答。',
  '帶走三樣：一個觀念，消費者要的是你的腦，不是你的手；一個工具，品項前 30% 清單；一個行動，把一個職人判斷說出來，拍一支短影片或寫一張小卡。',
  '最後一句話：消費者要的不是你的手，是你的腦。現在再寫一次：你店裡最大的賣點是什麼？看看有多少人，從純手工改成更具體的說法。謝謝大家。',
];

export const meta: SlideMeta = {
  title: '08｜「純手工」是烘焙小店最大的陷阱？',
  createdAt: '2026-10-11T00:00:20.000Z',
};

export default [
  Cover,
  Hook,
  Same,
  NotThis,
  Agenda,
  Ch1,
  Blind,
  Mind,
  Judge,
  Sum1,
  Ch2,
  Four,
  Say,
  Sum2,
  Ch3,
  Trap,
  Frozen,
  Cut,
  Case,
  Sum3,
  Pitfalls,
  Tool,
  Outcome,
  DiscussQA,
  TakeAway,
  Closing,
] satisfies Page[];
