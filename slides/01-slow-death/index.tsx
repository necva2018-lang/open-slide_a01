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
  palette: { bg: '#f1f4f6', text: '#17232d', accent: '#1f5c78' },
  fonts: {
    display: '"Noto Serif TC", "Source Han Serif TC", "PMingLiU", "Songti TC", serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#4f6270',
  line: '#d3dde4',
  panel: '#e2eaef',
  berry: '#b8431f',
  dark: '#12212b',
  darkText: '#f1f4f6',
  darkMuted: '#b7c8d3',
  gold: '#f0b45a',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-01-slow-death';
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
      <span>開店＝慢性死亡？</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '看懂新規則', from: 6, to: 11 },
  { name: '用系統活下來', from: 12, to: 15 },
  { name: '把錢留在店裡', from: 16, to: 20 },
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


/* ---------- 01 專用小元件 ---------- */

const ChkRow = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 42, lineHeight: 1.45 }}>
    <div
      style={{
        flex: 'none',
        width: 44,
        height: 44,
        border: '4px solid var(--osd-accent)',
        borderRadius: 8,
      }}
    />
    <div>{children}</div>
  </div>
);

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1100 }}>
        <Eyebrow>職訓班課程｜餐飲創業</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 128,
            fontWeight: 700,
            lineHeight: 1.18,
            margin: '0 0 40px',
          }}
        >
          開店＝慢性死亡？
        </h1>
        <div style={{ fontSize: 48, color: 'var(--osd-accent)', fontWeight: 500, lineHeight: 1.5 }}>
          8 個餐飲業的真實現況，
          <br />與 8 個生存建議
        </div>
      </div>
      <svg width="520" height="480" viewBox="0 0 520 480" aria-hidden="true">
        <rect x="60" y="150" width="400" height="290" fill={C.panel} stroke={C.muted} strokeWidth="5" />
        <path d="M40 150 L60 70 H460 L480 150 Z" fill="var(--osd-accent)" />
        <path d="M120 70 L110 150 M200 70 L190 150 M280 70 L270 150 M360 70 L350 150 M440 70 L430 150" stroke={C.panel} strokeWidth="14" />
        <rect x="90" y="200" width="150" height="130" fill={C.line} stroke={C.muted} strokeWidth="4" />
        <rect x="290" y="200" width="130" height="240" fill={C.dark} />
        <rect x="95" y="360" width="140" height="80" fill="none" />
        <g transform="rotate(-6 150 270)">
          <rect x="105" y="215" width="90" height="110" fill={C.berry} />
          <text x="150" y="285" textAnchor="middle" fontSize="44" fontWeight="700" fill={C.darkText}>
            頂讓
          </text>
        </g>
        <line x1="40" y1="440" x2="480" y2="440" stroke={C.muted} strokeWidth="5" />
      </svg>
    </div>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先舉手</Eyebrow>
    <H size={80}>餐廳收掉，最大的原因是？</H>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <Q n="A">租金太高</Q>
        <Q n="B">找不到人</Q>
        <Q n="C">東西不好吃</Q>
        <Q n="D">其他原因</Q>
      </div>
      <Note>先舉手記下票數，最後一頁再問一次</Note>
    </Body>
  </Slide>
);

const OldSaying: Page = () => (
  <Slide>
    <Eyebrow>老話還成立嗎</Eyebrow>
    <H size={80}>酒香不怕巷子深？</H>
    <Body>
      <div style={{ display: 'flex', gap: 48, alignItems: 'stretch' }}>
        <Card style={{ flex: 1, padding: '44px 48px' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.muted }}>老一輩說</div>
          <div style={{ fontFamily: serif, fontSize: 60, fontWeight: 700, margin: '12px 0', lineHeight: 1.3 }}>
            東西好，客人自己會來
          </div>
        </Card>
        <Card style={{ flex: 1.15, padding: '44px 48px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.darkMuted }}>現在的事實</div>
          <div style={{ fontSize: 46, lineHeight: 1.55, marginTop: 12 }}>
            同一條街的客人，集中到
            <b style={{ color: C.gold }}>網路聲量最高、Google 評價最高</b>
            的那一家。顧客是從眾的。
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 46, lineHeight: 1.6, marginTop: 44 }}>
        餐飲業從「民生必需產業」，變成
        <b style={{ color: C.berry }}>「生命週期短的娛樂業」</b>
        ，大家經營的是消費者的注意力。
      </div>
    </Body>
  </Slide>
);

const NotThis: Page = () => (
  <Slide>
    <Eyebrow>先講清楚</Eyebrow>
    <H size={88}>這場不是什麼</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 44, fontSize: 56 }}>
        <Steps>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是勸你別開店
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是教你怎麼做菜
            </div>
          </Step>
          <Step>
            <div>
              <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
              不是一份統計報告
            </div>
          </Step>
          <Step>
            <div
              style={{
                marginTop: 24,
                background: C.panel,
                borderRadius: 'var(--osd-radius)',
                padding: '28px 40px',
                fontWeight: 700,
              }}
            >
              <span style={{ color: 'var(--osd-accent)', marginRight: 24 }}>✓</span>
              是看懂遊戲規則已經變了
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
    <H size={88}>8 個改變，8 個建議</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <GroupBox tag="第一組" title="看懂新規則" items={['表象與真相', '8 個結構改變']} />
        <GroupBox tag="第二組" title="用系統活下來" items={['建議 ①～④', '系統與信任']} />
        <GroupBox tag="第三組" title="把錢留在店裡" items={['建議 ⑤～⑧', '資源與利潤']} />
      </div>
    </Body>
  </Slide>
);

/* ---------- 第一組：8 個結構性改變 ---------- */

const Ch1: Page = () => <Chapter no="01" title="看懂新規則" sub="8 個結構性改變" />;

const Iceberg: Page = () => (
  <Slide>
    <Eyebrow>先分清楚</Eyebrow>
    <H size={72}>租金、缺工，只是表象</H>
    <Body>
      <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
        <svg width="760" height="620" viewBox="0 0 760 620" aria-hidden="true">
          <rect x="0" y="240" width="760" height="380" fill="var(--osd-accent)" opacity="0.12" />
          <line x1="0" y1="240" x2="760" y2="240" stroke="var(--osd-accent)" strokeWidth="5" />
          <polygon points="380,40 470,240 290,240" fill={C.panel} stroke={C.muted} strokeWidth="5" strokeLinejoin="round" />
          <polygon points="250,244 510,244 620,420 500,590 270,590 140,410" fill="var(--osd-accent)" />
          <text x="500" y="150" fontSize="40" fontWeight="700" fill={C.muted}>表象</text>
          <text x="380" y="400" textAnchor="middle" fontSize="46" fontWeight="700" fill={C.darkText}>8 個</text>
          <text x="380" y="460" textAnchor="middle" fontSize="46" fontWeight="700" fill={C.darkText}>結構改變</text>
        </svg>
        <div style={{ fontSize: 46, lineHeight: 1.6 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.muted }}>水面上，新聞常說</div>
          租金太高、104 開半年找不到人
          <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)', marginTop: 28 }}>
            水面下，真正的原因
          </div>
          <b>餐飲業整體的結構已經改變</b>
          <div style={{ color: C.berry, fontWeight: 700, marginTop: 28 }}>
            還用十年前的方法經營，
            <br />
            很高機率活不下去。
          </div>
        </div>
      </div>
    </Body>
  </Slide>
);

const Chg1: Page = () => (
  <Slide>
    <Eyebrow>結構改變 ①～③</Eyebrow>
    <H size={72}>人、成本、流量，三面夾擊</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <ChgRow n="1" title="勞動力結構" line="就算你給得起，也沒人願意做" />
        <ChgRow n="2" title="通膨與心理價格帶" line="營收看起來漂亮，淨利幾乎沒有" />
        <ChgRow n="3" title="社群行銷壓力" line="老闆要兼廚師、攝影、剪輯、企劃" />
      </div>
    </Body>
  </Slide>
);

const Chg2: Page = () => (
  <Slide>
    <Eyebrow>結構改變 ④～⑥</Eyebrow>
    <H size={72}>流量、利潤、知識，都換了規則</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <ChgRow n="4" title="商圈紅利消失" line="人潮不在商圈，在一台台手機螢幕裡" />
        <ChgRow n="5" title="平台抽成" line="利潤不是進到餐廳，是進到平台和中間商" />
        <ChgRow n="6" title="創業者的知識落差" line="不缺好吃的，缺能長久的系統" />
      </div>
    </Body>
  </Slide>
);

const Chg3: Page = () => (
  <Slide>
    <Eyebrow>結構改變 ⑦～⑧</Eyebrow>
    <H size={72}>跟風，只會跟成價格戰</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <ChgRow n="7" title="產品生命週期縮短" line="新品最多紅半年，跟風只是表層創新" />
        <ChgRow n="8" title="市場飽和、同質化" line="品項十幾種，卻沒有一種是招牌" />
      </div>
      <div style={{ fontSize: 42, lineHeight: 1.55, marginTop: 40, fontWeight: 700, color: C.berry }}>
        這 8 點很多沒有解決方案，
        <br />
        能不能活下去，看能不能看懂新規則。
      </div>
      <Note>「最多紅半年」是業界經驗，不是統計</Note>
    </Body>
  </Slide>
);

const Sum1: Page = () => <Summary label="這一組只記一句" line="競爭的是商業模式，不是味道" />;

/* ---------- 第二組：建議 1～4 ---------- */

const Ch2: Page = () => <Chapter no="02" title="用系統活下來" sub="建議 ①～④" />;

const Adv12: Page = () => (
  <Slide>
    <Eyebrow>建議 ①②</Eyebrow>
    <H size={72}>產品只是門票，系統才是護城河</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="建議 ①"
          title="從產品導向，轉成系統導向"
          lines={['老闆不在，店也能正常運作', '招牌 A 帶人潮', '高利潤的 B、C、D 拉高整體利潤']}
        />
        <Pair
          tag="建議 ②"
          title="第一天就設計低人力模式"
          lines={['假設人力永遠不夠', '動線、菜單、備料、出餐都照這個設計', '人少＝支出穩、教育成本低、複製快']}
        />
      </div>
    </Body>
  </Slide>
);

const Adv34: Page = () => (
  <Slide>
    <Eyebrow>建議 ③④</Eyebrow>
    <H size={72}>先有現金流，再談信任</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="建議 ③"
          title="鎖定一個高週轉核心商品"
          lines={['每天轉、每天賺', '中小餐飲是現金流生意', '創新品，等現金流穩了再做']}
        />
        <Pair
          tag="建議 ④"
          title="行銷做能建立信任的內容"
          lines={['爆紅帶來無效流量，不是信任', <>產品知識、選食材理念、<br />經營思維、創業故事</>, '顧客越相信你，銷售成本越低']}
        />
      </div>
    </Body>
  </Slide>
);

const Sum2: Page = () => <Summary label="這一組只記一句" line="人少是結構性優勢，不是妥協" />;

/* ---------- 第三組：建議 5～8 ---------- */

const Ch3: Page = () => <Chapter no="03" title="把錢留在店裡" sub="建議 ⑤～⑧" />;

const Adv56: Page = () => (
  <Slide>
    <Eyebrow>建議 ⑤⑥</Eyebrow>
    <H size={72}>別迷信地點，也別單打獨鬥</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="建議 ⑤"
          title="重視顧客資料"
          lines={['黃金地段，不等於高利潤', '會員經營、名單收集、再行銷']}
        />
        <Pair
          tag="建議 ⑥"
          title="學會資源共享"
          tagExtra
          lines={['小品牌共享倉儲、人力、採購、行銷', '誰最能整合資源，誰就有新的生存方式', '例：幾家小店聯合採購包材']}
        />
      </div>
    </Body>
  </Slide>
);

const Adv7: Page = () => (
  <Slide>
    <Eyebrow>建議 ⑦・外帶與延伸性</Eyebrow>
    <H size={72}>人潮在手機裡，商品要能走出店外</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Flip front="咖啡廳" back="濾掛包" hint="點一下看延伸商品" h={96} />
        <Flip front="甜點店" back="禮盒" hint="點一下看延伸商品" h={96} />
        <Flip front="早午餐店" back="冷凍包" hint="點一下看延伸商品" h={96} />
        <Flip front="火鍋店" back="飲品" hint="點一下看延伸商品" h={96} />
        <Flip front="魯肉飯店" back="米漢堡" hint="點一下看延伸商品" h={96} />
      </div>
      <div style={{ fontSize: 40, color: C.muted, marginTop: 24 }}>
        營收不再被營業時間、地點、人力綁死
      </div>
    </Body>
  </Slide>
);

const Adv8: Page = () => (
  <Slide>
    <Eyebrow>建議 ⑧・利潤</Eyebrow>
    <H size={72}>把利潤放在第一步</H>
    <Body>
      <div style={{ fontSize: 34, fontWeight: 700, color: C.muted, marginBottom: 16 }}>
        新手常見的順序
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Chip>裝潢</Chip>
        <Arrow />
        <Chip>風格</Chip>
        <Arrow />
        <Chip>菜單</Chip>
        <Arrow />
        <div style={{ fontSize: 42, color: C.berry, fontWeight: 700 }}>最後才算利潤</div>
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)', margin: '48px 0 16px' }}>
        可以持續的順序
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Chip strong>先設計利潤結構</Chip>
        <Arrow />
        <div style={{ fontSize: 42, fontWeight: 700 }}>再談裝潢、風格、菜單</div>
      </div>
      <div style={{ fontSize: 40, lineHeight: 1.6, marginTop: 48 }}>
        定價不是憑第六感，要依原物料、人力、顧客接受度精算。
      </div>
    </Body>
  </Slide>
);

const Sum3: Page = () => <Summary label="這一組只記一句" line="先算利潤，再談裝潢風格" />;

/* ---------- 收尾 ---------- */

const Pitfalls: Page = () => (
  <Slide>
    <Eyebrow>踩坑分享</Eyebrow>
    <H size={72}>轉型時，老闆最常卡在這 4 關</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Flip front="食譜交出去，產品就沒價值？" back="代價：永遠有一個人無法下班" hint="點一下看代價" />
        <Flip front="漲價怕客人跑" back="價格帶跟不上，只好自己吸收" hint="點一下看代價" />
        <Flip front="離不開平台" back="抽成吃掉利潤" hint="點一下看代價" />
        <Flip front="沒資源研發" back="只能跟風，陷入表層創新" hint="點一下看代價" />
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
    <H size={72}>開店前自我檢核表</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ChkRow>老闆不在，店能正常運作嗎？</ChkRow>
        <ChkRow>菜單和動線，是以「人永遠不夠」設計的嗎？</ChkRow>
        <ChkRow>有每天穩定週轉的核心商品嗎？</ChkRow>
        <ChkRow>社群內容在建立信任，還是追流量？</ChkRow>
        <ChkRow>有在收集顧客名單嗎？</ChkRow>
        <ChkRow>產品能延伸成外帶、宅配商品嗎？</ChkRow>
        <ChkRow>開店前，先算過利潤結構了嗎？</ChkRow>
      </div>
      <Note>每一題答「否」，就是你最該先補的一關</Note>
    </Body>
  </Slide>
);

const Outcome: Page = () => (
  <Slide>
    <Eyebrow>預期的成果</Eyebrow>
    <H size={72}>做到這些，店和老闆都不一樣</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <Pair
          tag="店的樣子"
          title="用系統活下來"
          lines={['老闆不在，店也能運作', '低人力，品質一樣', '核心商品穩定帶進現金流']}
        />
        <Pair
          tag="老闆的樣子"
          title="用策略經營"
          tagExtra
          lines={['從「熱情」走到「策略」', '顧客信任你，銷售成本降低', '有自己的顧客名單']}
        />
      </div>
      <div style={{ fontFamily: serif, fontSize: 44, fontWeight: 700, color: C.berry, marginTop: 40, lineHeight: 1.5 }}>
        越來越難的時代，反而比多數人更容易賺到錢。
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
        <Row n="1">你熟悉的店，核心高週轉商品是什麼？</Row>
        <Row n="2">你想開的店型，能延伸出什麼外帶商品？</Row>
        <Row n="3">「食譜交出去」你能接受嗎？為什麼？</Row>
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
        <Col tag="觀念" title="比的是商業模式" body={'不是味道\n產品只是門票'} />
        <Col tag="工具" title="自我檢核表" body={'7 題，看見\n最該先補的一關'} />
        <Col tag="行動" title="拿一家店打分數" body={'用檢核表評你最熟的店\n再回頭看舉手的答案'} />
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
      別只問「我想賣什麼」，
      <br />
      要問「用什麼商業模式生存」
    </H>
    <div style={{ fontSize: 40, color: C.darkMuted, marginTop: 56 }}>
      再問一次：餐廳收掉，最大的原因是什麼？
    </div>
  </Slide>
);

export const notes: (string | undefined)[] = [
  '歡迎大家。今天的標題有點嚇人，但不是要嚇你們，是要一起看懂：遊戲規則已經變了。',
  '先請大家舉手。你覺得餐廳收掉，最大的原因是什麼？A 租金、B 找不到人、C 東西不好吃、D 其他。把票數記在黑板上，最後一頁我們再問一次，看答案有沒有變。',
  '老一輩常說酒香不怕巷子深。但現在同一條街的客人，會集中到網路聲量最高、Google 評價最高的那一家，因為顧客是從眾的。餐飲業從民生必需產業，變成生命週期很短的娛樂業，大家經營的其實是消費者的注意力。',
  '先講清楚這場不是什麼。不是勸你別開店，不是教你怎麼做菜，也不是統計報告。是要看懂遊戲規則已經變了。',
  '今天分三組：先看懂 8 個結構性改變，再看 8 個建議，後半是怎麼把錢留在店裡。',
  undefined,
  '新聞上收店的老闆常說租金太高、104 開半年找不到人。把時間拉長看，這些都只是表象。真正的原因是整個餐飲業的結構改變了，還用十年前的方法經營，很高機率活不下去。',
  '前三個改變。一，勞動力：2000 年後出生的世代覺得餐飲工時長、薪水低、假少，現在不是要給多少薪水的問題，是就算你給得起，也沒人願意做。二，通膨：成本都在漲，但消費者的心理價格帶跟不上，營收漂亮，淨利幾乎沒有。三，社群壓力：老闆要兼廚師、攝影、剪輯、企劃，內容能力和廚藝是兩條不同的曲線。',
  '接著三個。四，商圈紅利消失：人潮不在商圈，在一台台手機螢幕裡。五，平台抽成：利潤不是進到餐廳，是進到平台和中間商手中。六，知識落差：台灣不缺好吃的，缺的是能長久持續的系統，競爭的是商業模式，不是味道。',
  '最後兩個。七，生命週期縮短：新品最多紅半年，這是業界經驗，不是統計；中小店沒資源研發，只能跟風，是表層創新。八，同質化：品項十幾種，卻沒有一種是招牌，損耗和管理成本上升，回購下降，最後打價格戰。這 8 點很多沒有解決方案，能不能活下去，看能不能看懂新規則。',
  '第一組只記一句：競爭的是商業模式，不是味道。',
  undefined,
  '建議一：產品只是門票，系統才是護城河。夫妻店也要設計出能讓所有人操作、穩定重複的流程，目標是老闆不在，店也能正常運作。可以用招牌 A 商品帶人潮，靠利潤高的 B、C、D 拉高整體利潤。建議二：第一天就假設人力永遠不夠，動線、菜單、備料、出餐都照低人力設計。人少是結構性優勢，不是妥協。',
  '建議三：鎖定一個高週轉核心商品，每天轉、每天賺。中小餐飲是現金流生意，不要為了證明研發能力賣一堆沒人看過的新品，等現金流穩了再做。建議四：行銷做能建立信任的內容，爆紅是無效流量。顧客越相信你，銷售成本越低。',
  '第二組只記一句：人少是結構性優勢，不是妥協。',
  undefined,
  '建議五：別迷信地點，要重視顧客資料，也就是會員經營、名單收集、再行銷。建議六：資源共享，小品牌可以共享倉儲、人力、採購、行銷。建議六旁邊有個延伸建議標籤：像幾家小店聯合採購包材，這是我們整理的例子，不是影片原話。',
  '建議七：商品要能外帶、宅配。這一頁是翻牌卡，請同學先猜，再點一下看答案。咖啡廳可以賣濾掛包，甜點店可以做禮盒，早午餐店出冷凍包，火鍋店出飲品，魯肉飯店出米漢堡。注意：要按 F 進播放模式才點得動。',
  '建議八：把利潤放在第一步。新手常先想裝潢、風格、菜單，最後才算利潤。可以持續的生意，要先設計利潤結構。定價不是憑第六感，要依原物料、人力、顧客接受度精算。',
  '第三組只記一句：先算利潤，再談裝潢風格。',
  '轉型時最常卡的四關，也是翻牌卡。食譜交出去，產品就沒價值了嗎？這個擔心不算錯，但代價是這家店永遠有一個人無法下班。漲價怕客人跑、離不開平台、沒資源研發，也請同學先猜代價再翻。',
  '這是今天帶走的工具：開店前自我檢核表，七題。這張表是我們從八個建議整理出來的，請大家抄下來。每一題答否，就是你最該先補的一關。',
  '做到這些，店的樣子是用系統活下來，老闆的樣子是用策略經營。越來越難的時代，反而比多數人更容易賺到錢。',
  '請和旁邊的人聊三分鐘，三題任選，聊完請兩到三位同學分享。接著開放問答。',
  '帶走三樣：一個觀念，競爭的是商業模式，不是味道；一個工具，開店前自我檢核表；一個行動，回去拿一家你最熟的店打分數。',
  '最後一句話：別只問我想賣什麼，要問用什麼商業模式生存。現在回到一開始的問題，再舉一次手：餐廳收掉，最大的原因是什麼？看看和一開始比，有沒有人從租金、缺工，換成結構和商業模式。謝謝大家。',
];

export const meta: SlideMeta = {
  title: '01｜開店＝慢性死亡？',
  createdAt: '2026-10-11T00:00:55.000Z',
};

export default [
  Cover,
  Hook,
  OldSaying,
  NotThis,
  Agenda,
  Ch1,
  Iceberg,
  Chg1,
  Chg2,
  Chg3,
  Sum1,
  Ch2,
  Adv12,
  Adv34,
  Sum2,
  Ch3,
  Adv56,
  Adv7,
  Adv8,
  Sum3,
  Pitfalls,
  Tool,
  Outcome,
  DiscussQA,
  TakeAway,
  Closing,
] satisfies Page[];
