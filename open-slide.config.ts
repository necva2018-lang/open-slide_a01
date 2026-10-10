import type { OpenSlideConfig } from '@open-slide/core';

// 本機開發用根路徑；部署到 GitHub Pages 時由 workflow 帶入 BASE_PATH（例如 /open-slide_a01/）
const openSlideConfig: OpenSlideConfig = {
  base: process.env.BASE_PATH ?? '/',
};

export default openSlideConfig;
