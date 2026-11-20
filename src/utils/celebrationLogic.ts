export interface MemoryItem {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  story: string;
}

export interface WishState {
  isBlown: boolean;
  wishCount: number;
  messageVisible: boolean;
}

export interface BalloonConfig {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  opacity: number;
  color: string;
}

export const INITIAL_WISH_STATE: WishState = {
  isBlown: false,
  wishCount: 0,
  messageVisible: false,
};

export const CELEBRATION_MESSAGE =
  'Tüm dileklerinin gerçekleştiği harika bir yaşın olsun sevgilim. Seni çok seviyorum!';

export function blowOutCandle(state: WishState): WishState {
  if (state.isBlown) {
    return state;
  }
  return {
    isBlown: true,
    wishCount: state.wishCount + 1,
    messageVisible: true,
  };
}

export function relightCandle(state: WishState): WishState {
  return {
    isBlown: false,
    wishCount: state.wishCount,
    messageVisible: false,
  };
}

export function getWrappedMemoryIndex(
  currentIndex: number,
  delta: number,
  total: number
): number {
  if (total <= 0) {
    return -1;
  }
  return ((currentIndex + delta) % total + total) % total;
}

export function createBalloon(
  viewportWidth: number,
  viewportHeight: number,
  palette: readonly string[],
  rand: () => number = Math.random,
  startOnScreen = false
): BalloonConfig {
  const safeWidth = Math.max(320, viewportWidth);
  const safeHeight = Math.max(480, viewportHeight);
  const radius = 18 + rand() * 24;
  const x = radius + rand() * Math.max(1, safeWidth - radius * 2);
  const y = startOnScreen
    ? safeHeight * (0.25 + rand() * 0.85)
    : safeHeight + radius * 2 + rand() * 220;
  const speedY = 0.45 + rand() * 0.85;
  const swayAmp = 10 + rand() * 22;
  const swayFreq = 0.004 + rand() * 0.005;
  const phase = rand() * Math.PI * 2;
  const opacity = 0.24 + rand() * 0.28;
  const color = palette[Math.floor(rand() * palette.length) % palette.length];

  return {
    x,
    y,
    radius,
    speedY,
    swayAmp,
    swayFreq,
    phase,
    opacity,
    color,
  };
}

export function stepBalloonPosition(
  balloon: BalloonConfig,
  tick: number,
  deltaScale = 1
): { x: number; y: number; offTop: boolean } {
  const nextY = balloon.y - balloon.speedY * deltaScale;
  const nextX = balloon.x + Math.sin(tick * balloon.swayFreq + balloon.phase) * 0.45 * deltaScale;
  const offTop = nextY + balloon.radius * 2.8 < 0;
  return { x: nextX, y: nextY, offTop };
}
