// 提供簡報頁面需要的環境：頁碼（useSlidePageNumber）與分段出現（<Steps>）。
// open-slide 把這兩個 context 掛在 globalThis 上，這裡直接取用同一個物件。
import { CANVAS_HEIGHT, CANVAS_WIDTH, type DesignSystem, designToCssVars } from '@open-slide/core';
import {
  type Context,
  type CSSProperties,
  type MutableRefObject,
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

type PageCtx = { index: number; total: number };
type Registration = {
  id: object;
  stepCount: number;
  initialRevealed: number;
  controller: StepController;
  setRevealed: (n: number) => void;
};
type StepHostCtx = {
  register: (reg: Registration) => () => void;
  reportRevealed: (id: object, revealed: number) => void;
  entryDirection: 'forward' | 'backward' | 'jump';
  controlled: boolean;
  isActivePage: boolean;
};
export type StepController = { advance: () => boolean; retreat: () => boolean };

const g = globalThis as unknown as Record<string, Context<unknown> | undefined>;
const PageContext = g.__open_slide_page_context__ as Context<PageCtx | null>;
const StepContext = g.__open_slide_step_host_context__ as Context<StepHostCtx | null>;

export function PageProvider({ index, total, children }: PropsWithChildren<PageCtx>) {
  const value = useMemo(() => ({ index, total }), [index, total]);
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function StepHost({
  entryDirection,
  controllerRef,
  children,
}: PropsWithChildren<{
  entryDirection: 'forward' | 'backward';
  controllerRef: MutableRefObject<StepController | null>;
}>) {
  const regs = useRef<(Registration & { revealed: number })[]>([]);
  const composite = useMemo<StepController>(
    () => ({
      advance: () => regs.current.some((r) => r.controller.advance()),
      retreat: () => {
        for (let i = regs.current.length - 1; i >= 0; i--) {
          if (regs.current[i].controller.retreat()) return true;
        }
        return false;
      },
    }),
    [],
  );
  useLayoutEffect(() => {
    controllerRef.current = composite;
    return () => {
      if (controllerRef.current === composite) controllerRef.current = null;
    };
  }, [composite, controllerRef]);

  const value = useMemo<StepHostCtx>(
    () => ({
      register: (reg) => {
        const tracked = { ...reg, revealed: reg.initialRevealed };
        regs.current.push(tracked);
        return () => {
          const i = regs.current.indexOf(tracked);
          if (i !== -1) regs.current.splice(i, 1);
        };
      },
      reportRevealed: (id, revealed) => {
        const r = regs.current.find((x) => x.id === id);
        if (r) r.revealed = revealed;
      },
      entryDirection,
      controlled: false,
      isActivePage: true,
    }),
    [entryDirection],
  );
  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
}

// 1920×1080 畫布，等比縮放到 scale
export function Canvas({
  design,
  scale,
  children,
}: PropsWithChildren<{ design?: DesignSystem; scale: number }>) {
  const vars = design ? designToCssVars(design) : {};
  return (
    <div
      style={
        {
          width: CANVAS_WIDTH * scale,
          height: CANVAS_HEIGHT * scale,
          overflow: 'hidden',
          background: design ? 'var(--osd-bg)' : '#fff',
          ...vars,
        } as CSSProperties
      }
    >
      <div
        style={
          {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            ...vars,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}

export { CANVAS_HEIGHT, CANVAS_WIDTH };
