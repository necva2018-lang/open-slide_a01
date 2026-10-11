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
  palette: { bg: '#fbf5ea', text: '#3b2a20', accent: '#8a5530' },
  fonts: {
    display: '"Noto Serif TC", "Source Han Serif TC", "PMingLiU", "Songti TC", serif',
    body: '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif',
  },
  typeScale: { hero: 150, body: 40 },
  radius: 20,
};

// 額外色票（不在 DesignSystem 範圍內）
const C = {
  muted: '#6b564a',
  line: '#e4d5bd',
  panel: '#f4e9d6',
  berry: '#a63a32',
  dark: '#33201a',
  darkText: '#fbf5ea',
  darkMuted: '#d9c4a8',
  gold: '#e3b778',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-six-things-before-opening';
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
      <span>六件我希望在開店前就知道的事</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// 章節進度條的頁碼區間。增刪、搬移頁面後，必須同步更新這裡的 from / to。
const CHAPTERS = [
  { name: '開場', from: 1, to: 5 },
  { name: '想法擺對', from: 6, to: 10 },
  { name: '手上有本錢', from: 11, to: 15 },
  { name: '時間與決斷', from: 16, to: 20 },
  { name: '收尾', from: 21, to: 25 },
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
                background: dark ? 'rgba(251,245,234,0.22)' : C.line,
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

/* ---------- 開場 ---------- */

const Cover: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 1100 }}>
        <Eyebrow>職訓班課程｜餐飲創業</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 112,
            fontWeight: 700,
            lineHeight: 1.18,
            margin: '0 0 40px',
          }}
        >
          六件我希望
          <br />
          在開店前就知道的事
        </h1>
        <div style={{ fontSize: 44, color: 'var(--osd-accent)', fontWeight: 500 }}>
          提早知道，至少能避開一半的坑
        </div>
      </div>
      <svg width="520" height="460" viewBox="0 0 520 460" aria-hidden="true">
        <rect
          x="40"
          y="90"
          width="440"
          height="300"
          rx="14"
          fill={C.panel}
          stroke="#8a5530"
          strokeWidth="5"
        />
        <path
          d="M40 104 L260 270 L480 104"
          fill="none"
          stroke="#8a5530"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle cx="260" cy="270" r="40" fill="#a63a32" />
        <path
          d="M260 252 C246 236 224 250 238 268 L260 290 L282 268 C296 250 274 236 260 252Z"
          fill="#fbf5ea"
        />
        <text x="260" y="62" textAnchor="middle" fontSize="34" fill="#6b564a">
          寫給過去的自己
        </text>
      </svg>
    </div>
  </Slide>
);

const Hook: Page = () => (
  <Slide>
    <Eyebrow>先動手寫一下</Eyebrow>
    <H size={92}>請拿出便利貼</H>
    <Body>
      <div style={{ display: 'flex', gap: 96, alignItems: 'center' }}>
        <div
          style={{
            width: 680,
            height: 560,
            background: '#f6d98f',
            borderRadius: 8,
            boxShadow: '0 20px 40px -12px rgba(60,40,20,0.35)',
            transform: 'rotate(-2deg)',
            padding: 56,
            fontFamily: serif,
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.5,
            color: C.dark,
          }}
        >
          我想開店的理由：
          <div style={{ borderBottom: '3px solid #b89048', height: 100 }} />
          <div style={{ borderBottom: '3px solid #b89048', height: 100 }} />
          <div style={{ borderBottom: '3px solid #b89048', height: 100 }} />
        </div>
        <div style={{ fontSize: 56, lineHeight: 1.7 }}>
          寫下
          <span style={{ color: C.berry, fontWeight: 700 }}>「我想開店的理由」</span>
          <br />
          寫完先收起來，
          <br />
          最後一頁再拿出來看。
        </div>
      </div>
    </Body>
  </Slide>
);

const Review: Page = () => (
  <Slide>
    <Eyebrow>一位烘焙創業者的回顧</Eyebrow>
    <H size={80}>第一家店，是瞎子摸象做出來的</H>
    <Body>
      <div style={{ display: 'flex', gap: 56 }}>
        <Card style={{ flex: 1, padding: '44px 48px' }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.berry, marginBottom: 20 }}>當時</div>
          <div style={{ fontSize: 48, lineHeight: 1.6 }}>
            每個細節，都照自己的喜好，靠當時有限的認知決定。
          </div>
        </Card>
        <Card style={{ flex: 1.1, padding: '44px 48px' }}>
          <div
            style={{ fontSize: 40, fontWeight: 700, color: 'var(--osd-accent)', marginBottom: 20 }}
          >
            如果決定創業那一刻就知道
          </div>
          <div style={{ fontSize: 48, lineHeight: 1.7 }}>
            <Steps>
              <Step>
                <div>至少少踩一半的坑</div>
              </Step>
              <Step>
                <div>更快開始賺錢</div>
              </Step>
              <Step>
                <div>不會壓力大到睡不好</div>
              </Step>
            </Steps>
          </div>
        </Card>
      </div>
      <Note>以上是業界創業者回頭看的經驗，不是統計數字</Note>
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
            不是教你怎麼做甜點
          </div>
        </Step>
        <Step>
          <div>
            <span style={{ color: C.berry, fontWeight: 700, marginRight: 24 }}>✕</span>
            不是保證開店一定成功
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
            是 6 個開店前就該先想過的經營想法
          </div>
        </Step>
      </Steps>
    </div>
    </Body>
  </Slide>
);

const GroupBox = ({ tag, title, items }: { tag: string; title: string; items: string[] }) => (
  <div
    style={{
      flex: 1,
      background: C.panel,
      borderRadius: 'var(--osd-radius)',
      padding: '52px 36px',
    }}
  >
    <div
      style={{ fontSize: 34, fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '0.1em' }}
    >
      {tag}
    </div>
    <div style={{ fontFamily: serif, fontSize: 64, fontWeight: 700, margin: '16px 0 36px' }}>
      {title}
    </div>
    {items.map((t) => (
      <div key={t} style={{ fontSize: 40, lineHeight: 1.8, whiteSpace: 'nowrap' }}>
        {t}
      </div>
    ))}
  </div>
);

const Agenda: Page = () => (
  <Slide>
    <Eyebrow>今天的順序</Eyebrow>
    <H size={88}>6 件事，分 3 組講</H>
    <Body>
      <div style={{ display: 'flex', gap: 40 }}>
        <GroupBox tag="第一組" title="想法擺對" items={['① 前 10% 的決心', '② 系統化思考']} />
        <GroupBox tag="第二組" title="手上有本錢" items={['③ 跨界能力', '④ 現金流']} />
        <GroupBox tag="第三組" title="時間與決斷" items={['⑤ 黃金 9 個月', '⑥ 該停損就停損']} />
      </div>
    </Body>
  </Slide>
);

/* ---------- 章節頁 / 總結頁 ---------- */

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

const ChapterA: Page = () => <Chapter no="01" title="先把想法擺對" sub="心法 1・心法 2" />;
const ChapterB: Page = () => <Chapter no="02" title="手上要有本錢" sub="心法 3・心法 4" />;
const ChapterC: Page = () => <Chapter no="03" title="時間與決斷" sub="心法 5・心法 6" />;

const SummaryA: Page = () => <Summary label="這一組只記一句" line="不是喜歡什麼，就賣什麼" />;
const SummaryB: Page = () => <Summary label="這一組只記一句" line="先收錢，再慢慢付錢" />;
const SummaryC: Page = () => (
  <Summary label="這一組只記一句" line="先快速試錯，錯了就果斷停損" />
);

/* ---------- 第一組：心法 1・2 ---------- */

const Law1: Page = () => (
  <Slide>
    <Eyebrow>心法 1・心態</Eyebrow>
    <H size={80}>興趣只是第一步</H>
    <Body>
      <div style={{ fontSize: 48, lineHeight: 1.6 }}>
        選自己喜歡的領域，是對的。但只做對了第一步。
      </div>
      <div style={{ display: 'flex', gap: 48, marginTop: 48, alignItems: 'stretch' }}>
        <Card style={{ flex: 1, padding: '44px 48px' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.muted }}>你</div>
          <div style={{ fontFamily: serif, fontSize: 68, fontWeight: 700, marginTop: 8 }}>
            因為喜歡
          </div>
        </Card>
        <div style={{ alignSelf: 'center', fontSize: 60, color: 'var(--osd-accent)' }}>vs</div>
        <Card style={{ flex: 1, padding: '44px 48px', background: C.dark, color: C.darkText }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.darkMuted }}>你的對手</div>
          <div style={{ fontFamily: serif, fontSize: 68, fontWeight: 700, marginTop: 8 }}>
            賭上身家求生存
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 50, marginTop: 52, fontWeight: 700, color: C.berry }}>
        你是用興趣，在挑戰別人的飯碗。
      </div>
    </Body>
  </Slide>
);

const Top10: Page = () => (
  <Slide>
    <Eyebrow>心法 1・怎麼做</Eyebrow>
    <H size={80}>要有做到業界前 10% 的決心</H>
    <Body>
      <div style={{ display: 'flex', gap: 96, alignItems: 'center' }}>
        <svg width="720" height="640" viewBox="0 0 720 640" aria-hidden="true">
          <polygon points="360,10 500,210 220,210" fill="#a63a32" />
          <polygon points="216,220 504,220 580,350 140,350" fill="#7a4a2a" />
          <polygon points="136,360 584,360 664,490 56,490" fill="#c79a6b" />
          <polygon points="52,500 668,500 720,630 0,630" fill="#e6cfae" />
          <text x="360" y="178" textAnchor="middle" fontSize="44" fontWeight="700" fill="#fbf5ea">
            前 10%
          </text>
          <text x="360" y="300" textAnchor="middle" fontSize="40" fill="#fbf5ea">
            專業
          </text>
          <text x="360" y="436" textAnchor="middle" fontSize="40" fill="#3b2a20">
            進步中
          </text>
          <text x="360" y="574" textAnchor="middle" fontSize="40" fill="#3b2a20">
            只靠興趣
          </text>
        </svg>
        <div style={{ fontSize: 48, lineHeight: 1.7 }}>
          很難，甚至可能花一輩子。
          <br />
          但隨時想進步、想更專業，
          <br />
          面對每一件日常小事，
          <br />
          <span style={{ fontWeight: 700, color: 'var(--osd-accent)' }}>
            你還是能找到自己的生存方式。
          </span>
          <Note>前 10% 是業界經驗的說法，不是統計</Note>
        </div>
      </div>
    </Body>
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

const Law2: Page = () => (
  <Slide>
    <Eyebrow>心法 2・執行</Eyebrow>
    <H size={80}>研發新品前，先問 4 個問題</H>
    <Body>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
        }}
      >
        <Q n="1">食材能穩定供應嗎？</Q>
        <Q n="2">短時間能量產嗎？</Q>
        <Q n="3">保存難度高不高？</Q>
        <Q n="4">每位員工的品質一致嗎？</Q>
      </div>
      <div style={{ fontSize: 46, marginTop: 52, lineHeight: 1.6 }}>
        用<span style={{ fontWeight: 700, color: C.berry }}>第三方的角度</span>
        看全局，不要一個人主觀決定所有細節。
      </div>
    </Body>
  </Slide>
);

/* ---------- 第二組：心法 3・4 ---------- */

const CrossRow = ({ who, how, last }: { who: string; how: string; last?: boolean }) => (
  <div
    style={{
      display: 'flex',
      gap: 48,
      padding: '30px 0',
      borderBottom: last ? 'none' : `2px solid ${C.line}`,
      fontSize: 44,
      lineHeight: 1.45,
    }}
  >
    <div style={{ flex: '0 0 520px', fontWeight: 700, color: 'var(--osd-accent)' }}>{who}</div>
    <div style={{ flex: 1 }}>{how}</div>
  </div>
);

const Law3: Page = () => (
  <Slide>
    <Eyebrow>心法 3・競爭力</Eyebrow>
    <H size={80}>本業以外的專長，就是外掛</H>
    <Body>
      <div>
        <CrossRow who="營養師" how="減脂、增肌、依熱量分類的餐盒" />
        <CrossRow who="設計師（飲料店）" how="有世代認同感的杯子與周邊" />
        <CrossRow who="建築系（甜點店）" how="從蛋糕與宅配箱結構，解決「無法宅配」" last />
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: serif,
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.5,
          color: C.berry,
        }}
      >
        「這個時代缺的不是好的產品，
        <br />
        而是消費者未曾有過的消費體驗。」
      </div>
    </Body>
  </Slide>
);

const CashGap: Page = () => (
  <Slide>
    <Eyebrow>心法 4・現金流</Eyebrow>
    <H size={76}>帳上有賺，手上卻沒錢付薪水</H>
    <Body>
      <svg width="1640" height="360" viewBox="0 0 1640 360" aria-hidden="true">
        <line x1="40" y1="140" x2="1600" y2="140" stroke="#3b2a20" strokeWidth="6" />
        <circle cx="140" cy="140" r="26" fill="#a63a32" />
        <circle cx="760" cy="140" r="26" fill="#a63a32" />
        <circle cx="1500" cy="140" r="26" fill="#8a5530" />
        <text x="140" y="70" textAnchor="middle" fontSize="42" fontWeight="700" fill="#a63a32">
          買食材
        </text>
        <text x="140" y="210" textAnchor="middle" fontSize="36" fill="#6b564a">
          先付錢
        </text>
        <text x="760" y="70" textAnchor="middle" fontSize="42" fontWeight="700" fill="#a63a32">
          發薪水・付貨款貸款
        </text>
        <text x="1500" y="70" textAnchor="middle" fontSize="42" fontWeight="700" fill="#8a5530">
          尾款入帳
        </text>
        <text x="1500" y="210" textAnchor="middle" fontSize="36" fill="#6b564a">
          才收到錢
        </text>
        <path d="M140 270 H1500" stroke="#8a5530" strokeWidth="5" fill="none" />
        <path d="M140 252 V288 M1500 252 V288" stroke="#8a5530" strokeWidth="5" />
        <text x="820" y="340" textAnchor="middle" fontSize="42" fontWeight="700" fill="#8a5530">
          時間差：兩個月以上
        </text>
      </svg>
      <div style={{ display: 'flex', gap: 40, marginTop: 32 }}>
        <Card style={{ flex: 1, fontSize: 42, lineHeight: 1.5, padding: '36px 44px' }}>
          <b>大節日</b>
          <br />
          先付多一倍的食材，
          <br />
          還沒開賣就要發薪
        </Card>
        <Card style={{ flex: 1, fontSize: 42, lineHeight: 1.5, padding: '36px 44px' }}>
          <b>外燴、喜餅</b>
          <br />
          買食材到收尾款，
          <br />
          差兩個月以上
        </Card>
      </div>
    </Body>
  </Slide>
);

const CashTool: Page = () => (
  <Slide>
    <Eyebrow>今天帶走的工具</Eyebrow>
    <H size={80}>現金流時間軸</H>
    <Body>
      <div style={{ display: 'flex', gap: 64, alignItems: 'center' }}>
        <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Row n="1">列出每月要付的錢</Row>
          <Row n="2">標出每筆錢「哪一天付」</Row>
          <Row n="3">標出客人的錢「哪一天進來」</Row>
          <div style={{ fontSize: 46, fontWeight: 700, color: C.berry, marginTop: 12 }}>
            兩點之間的落差，就是你要先墊的錢。
          </div>
        </div>
        <Card style={{ flex: 0.8, padding: '44px 44px' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--osd-accent)' }}>
            可以先收錢的產品
          </div>
          <div style={{ marginTop: 12, marginLeft: -16 }}>
            <Tag />
          </div>
          <div style={{ fontSize: 48, lineHeight: 1.8, marginTop: 16 }}>
            預購
            <br />
            節慶禮盒
            <br />
            會員儲值
            <br />
            訂閱制
          </div>
        </Card>
      </div>
    </Body>
  </Slide>
);

/* ---------- 第三組：心法 5・6 ---------- */

const Law5: Page = () => (
  <Slide>
    <Eyebrow>心法 5・策略</Eyebrow>
    <H size={76}>決定開店那天，事業就開始了</H>
    <Body style={{ justifyContent: 'flex-start', paddingTop: 44 }}>
      <div>
        <div
          style={{
            display: 'flex',
            fontFamily: serif,
            fontSize: 50,
            fontWeight: 700,
            color: C.berry,
            borderBottom: `6px solid ${C.berry}`,
            paddingBottom: 12,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          黃金成長期　共 9 個月
        </div>
        <div style={{ display: 'flex', marginTop: 20 }}>
          <div
            style={{
              flex: 6,
              background: 'var(--osd-accent)',
              color: C.darkText,
              borderRadius: '20px 0 0 20px',
              padding: '32px 40px',
            }}
          >
            <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700, translate: '0px 1px' }}>籌備期　6 個月</div>
            <div style={{ fontSize: 36, marginTop: 8, lineHeight: 1.5 }}>
              市場測試、建立運作系統
              <br />
              沒有固定成本壓力
            </div>
          </div>
          <div
            style={{
              flex: 3,
              background: C.gold,
              color: C.dark,
              borderRadius: '0 20px 20px 0',
              padding: '32px 40px',
            }}
          >
            <div style={{ fontFamily: serif, fontSize: 52, fontWeight: 700 }}>蜜月期　3 個月</div>
            <div style={{ fontSize: 36, marginTop: 8, lineHeight: 1.5 }}>
              客人容忍度高
              <br />
              仍在找定位
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: C.muted, marginTop: 12 }}>
          <div style={{ flex: 6 }}>決定開店</div>
          <div style={{ flex: 3 }}>開幕</div>
        </div>
      </div>
      <div style={{ fontSize: 42, lineHeight: 1.6, marginTop: 28 }}>
        快速試錯、修正、微調，找到品牌定位，
        <br />
        比早早買高級設備、裝潢得有質感，
        <span style={{ fontWeight: 700, color: C.berry }}>重要得多</span>。
      </div>
      <Note>6 個月、3 個月是業界經驗分享，不是統一標準</Note>
    </Body>
  </Slide>
);

const Law6: Page = () => (
  <Slide>
    <Eyebrow>心法 6・決斷</Eyebrow>
    <H size={76}>該結束時，就結束</H>
    <Body>
      <div style={{ display: 'flex', gap: 56 }}>
        <div style={{ flex: 1.4, fontSize: 42, lineHeight: 1.65 }}>
          持續虧損，或讓人生往不健康的方向走，
          <br />
          就必須結束。
          <div style={{ marginTop: 24 }}>
            像愛著一個不適合的人，期待付出能改變他。
            <br />
            可是付出多少已經不是重點，
            <br />
            <b style={{ color: C.berry }}>不符合市場需求，就只能結束。</b>
          </div>
        </div>
        <Card style={{ flex: 0.8, padding: '44px 44px', alignSelf: 'flex-start' }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--osd-accent)' }}>
            事先設停損點
          </div>
          <div style={{ marginTop: 12, marginLeft: -16 }}>
            <Tag />
          </div>
          <div style={{ fontSize: 44, lineHeight: 1.7, marginTop: 20 }}>
            連續幾個月虧損，
            <br />
            就停？
            <br />
            現金剩多少，
            <br />
            就停？
          </div>
        </Card>
      </div>
      <div style={{ fontSize: 38, color: C.muted, marginTop: 36 }}>
        這位創業者經歷過分手與公司倒閉，他說：「你終究會好起來的。」
      </div>
    </Body>
  </Slide>
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

const Pit = ({ cause, effect }: { cause: string; effect: string }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      data-osd-interactive
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: 1400, cursor: 'pointer', height: 128 }}
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
          <div style={{ flex: 1, fontWeight: 700 }}>{cause}</div>
          <div style={{ fontSize: 30, color: C.muted }}>點一下看後果</div>
        </div>
        <div
          style={{
            ...FACE,
            background: C.dark,
            color: C.darkText,
            transform: 'rotateX(180deg)',
          }}
        >
          <div style={{ flex: '0 0 760px', fontWeight: 700, fontSize: 40, lineHeight: 1.2 }}>{cause}</div>
          <div style={{ color: C.gold, fontSize: 48 }}>→</div>
          <div style={{ flex: 1, fontSize: 40, lineHeight: 1.2 }}>{effect}</div>
        </div>
      </div>
    </div>
  );
};

const Pitfalls: Page = () => (
  <Slide>
    <Eyebrow>踩坑分享</Eyebrow>
    <H size={80}>最容易一開始就犯的 4 個錯</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Pit cause="只憑自己的喜好決定產品" effect="很難改用市場角度判斷" />
        <Pit cause="開店前沒有現金流概念" effect="發現時已經卡住" />
        <Pit cause="急著買設備、做裝潢" effect="試錯的時間與資金被吃掉" />
        <Pit cause="捨不得停損" effect="人生也被拖垮" />
      </div>
    </Body>
  </Slide>
);

/* ---------- 收尾 ---------- */

const Outcome: Page = () => (
  <Slide>
    <Eyebrow>提早知道，會得到什麼</Eyebrow>
    <H size={80}>6 件事帶來的 5 個好處</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Row n="1">至少避開一半的坑</Row>
        <Row n="2">更快開始賺錢</Row>
        <Row n="3">不會被壓力折磨到睡不好</Row>
        <Row n="4">創業邏輯不一樣，存活機率更高</Row>
        <Row n="5">就算失敗，人還在，就能另起爐灶</Row>
      </div>
    </Body>
  </Slide>
);

const Discuss: Page = () => (
  <Slide>
    <Eyebrow>課堂討論</Eyebrow>
    <H size={80}>和旁邊的人聊 3 分鐘</H>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
        <Row n="1">你有什麼「本業以外」的專長，可以變成外掛？</Row>
        <Row n="2">你的產品，哪些可以設計成「先收款」？</Row>
        <Row n="3">你會把停損點設在哪裡？</Row>
      </div>
    </Body>
  </Slide>
);

const QA: Page = () => (
  <Slide center>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 56 }}>
      <div
        style={{
          fontFamily: serif,
          fontSize: 260,
          fontWeight: 700,
          color: 'var(--osd-accent)',
          lineHeight: 1,
        }}
      >
        Q&amp;A
      </div>
      <div style={{ fontSize: 56, fontFamily: serif, fontWeight: 700 }}>有問題，現在問</div>
    </div>
  </Slide>
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

const TakeAway: Page = () => (
  <Slide>
    <Eyebrow>今天帶走的三樣</Eyebrow>
    <H size={80}>一個觀念、一個工具、一個行動</H>
    <Body>
      <div style={{ display: 'flex', gap: 36 }}>
        <Col tag="觀念" title="興趣只是第一步" body={'用系統和前 10%\n的決心活下去'} />
        <Col tag="工具" title="現金流時間軸" body={'標出付錢點與收錢點\n看見中間的落差'} />
        <Col tag="行動" title="回頭看便利貼" body={'在背面寫下\n你的停損點'} />
      </div>
    </Body>
  </Slide>
);

const Closing: Page = () => (
  <Slide dark center>
    <div style={{ fontSize: 32, color: C.gold, letterSpacing: '0.12em', fontWeight: 700 }}>
      最後一句話
    </div>
    <H size={120} dark style={{ marginTop: 32, lineHeight: 1.3 }}>
      只要人還在，
      <br />
      就有機會再來一次。
    </H>
  </Slide>
);

export const notes: (string | undefined)[] = [
  '歡迎大家。今天講六件事，都是一位烘焙創業者回頭看第一家店，才發現「早知道就好了」的事。',
  '先請大家拿出便利貼，寫下「我想開店的理由」。寫完先收起來，最後一頁再拿出來。給大家一分鐘。',
  '這位創業者的第一家店，每個細節都照自己的喜好，憑當時有限的認知做出來，他自己形容是瞎子摸象。他說，如果決定創業那一刻就知道這六件事，至少少踩一半的坑。提醒一下，這是他自己的經驗，不是統計。',
  '先講清楚這場不是什麼。不是教做甜點，也不保證成功，更不是統計報告。這場是六個開店前就該先想過的經營想法。',
  '六件事分三組。第一組想法，第二組本錢，第三組時間與決斷。',
  undefined,
  '很多人是因為喜歡烘焙才創業，選喜歡的領域是對的，但只做對第一步。你拿興趣去挑戰別人的飯碗，而對手是賭上身家在求生存。',
  '前 10% 很難，甚至可能花一輩子。但只要隨時想進步，面對每一件日常小事，你還是能找到自己的生存方式。前 10% 是講者的目標說法，不是統計。',
  '研發新品前先問四個問題：食材供應穩不穩、能不能量產、好不好保存、每個員工做出來是不是一樣。重點是用第三方角度看全局，不要一個人主觀決定所有細節。',
  '第一組只記一句：不是喜歡什麼，就賣什麼。',
  undefined,
  '老一輩覺得開餐廳要本科系。講者的想法相反：好吃是基本，你有沒有本業以外的專長，才是別人難以複製的外掛。營養師、設計師、建築系，各有各的用法。這個時代缺的是消費者沒有過的消費體驗。',
  '這一頁請慢慢講。帳上有賺，手上卻沒錢付薪水，原因是花錢和收錢有時間差。大節日要先付多一倍的食材；外燴和喜餅，買食材到收尾款可能差兩個月以上。',
  '這是今天的工具。三步：列出要付的錢、標出哪天付、標出哪天收。兩點之間的落差，就是你要先墊的錢。右邊這幾種產品可以先收錢，是我們整理的延伸建議，不是講者原話。',
  '第二組只記一句：先收錢，再慢慢付錢。就算當月虧損，只要手上有足夠現金，就活得下去。',
  undefined,
  '決定開店那天，事業就開始了。籌備期約六個月，開幕後三個月是蜜月期，加起來九個月是黃金成長期。這是講者自己的做法，不是業界標準。這段時間快速試錯，比買高級設備、做裝潢重要得多。',
  '最難的一件：該結束時就結束。像愛著一個不適合的人，期待付出能改變他，但付出多少已經不是重點。建議開店前就先設停損點，這是我們整理的延伸建議。講者自己經歷過分手和公司倒閉，他說「你終究會好起來的」。',
  '這四個錯，都是前面講過的反面。每一列都是翻牌卡：先請同學猜後果，再點一下翻面看答案。注意：要按 F 進播放模式才點得動，編輯畫面點不動。',
  '第三組只記一句：先快速試錯，錯了就果斷停損。',
  '提早知道這六件事，會得到這五個好處。',
  '請和旁邊的人聊三分鐘，三題任選。聊完請兩到三位同學分享。',
  '有問題現在問。',
  '帶走三樣：一個觀念，興趣只是第一步；一個工具，現金流時間軸；一個行動，請拿出一開始的便利貼，在背面寫下你的停損點。',
  '最後一句話：只要人還在，就有機會再來一次。謝謝大家。',
];

export const meta: SlideMeta = {
  title: '03｜六件我希望在開店前就知道的事',
  createdAt: '2026-10-11T00:00:45.000Z',
};

export default [
  Cover,
  Hook,
  Review,
  NotThis,
  Agenda,
  ChapterA,
  Law1,
  Top10,
  Law2,
  SummaryA,
  ChapterB,
  Law3,
  CashGap,
  CashTool,
  SummaryB,
  ChapterC,
  Law5,
  Law6,
  Pitfalls,
  SummaryC,
  Outcome,
  Discuss,
  QA,
  TakeAway,
  Closing,
] satisfies Page[];
