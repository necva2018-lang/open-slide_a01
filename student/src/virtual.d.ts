declare module 'virtual:decks' {
  import type { ComponentType } from 'react';
  import type { DesignSystem, SlideMeta } from '@open-slide/core';
  export type DeckModule = { default: ComponentType[]; design?: DesignSystem; meta?: SlideMeta };
  export const decks: { no: string; pdf: string | null; load: () => Promise<DeckModule> }[];
}
