import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_WISH_STATE,
  CELEBRATION_MESSAGE,
  blowOutCandle,
  relightCandle,
  getWrappedMemoryIndex,
  createBalloon,
  stepBalloonPosition,
} from './celebrationLogic';

test('blowOutCandle transitions lit candle to blown state and reveals message once', () => {
  const afterBlow = blowOutCandle(INITIAL_WISH_STATE);
  assert.equal(afterBlow.isBlown, true);
  assert.equal(afterBlow.wishCount, 1);
  assert.equal(afterBlow.messageVisible, true);
  assert.match(CELEBRATION_MESSAGE, /Tüm dileklerinin gerçekleştiği/);

  // Blowing again when already blown is idempotent
  const secondBlow = blowOutCandle(afterBlow);
  assert.deepEqual(secondBlow, afterBlow);
});

test('relightCandle resets flame while preserving wish count', () => {
  const afterBlow = blowOutCandle(INITIAL_WISH_STATE);
  const relit = relightCandle(afterBlow);
  assert.equal(relit.isBlown, false);
  assert.equal(relit.messageVisible, false);
  assert.equal(relit.wishCount, 1);

  const secondWish = blowOutCandle(relit);
  assert.equal(secondWish.wishCount, 2);
});

test('getWrappedMemoryIndex wraps cleanly forward and backward across 6 polaroids', () => {
  assert.equal(getWrappedMemoryIndex(0, -1, 6), 5);
  assert.equal(getWrappedMemoryIndex(5, 1, 6), 0);
  assert.equal(getWrappedMemoryIndex(2, 1, 6), 3);
  assert.equal(getWrappedMemoryIndex(0, 1, 0), -1);
});

test('createBalloon and stepBalloonPosition produce bounded upward motion', () => {
  let seed = 0.42;
  const deterministicRand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const palette = ['#D4AF37', '#E11D48', '#F3E5D0'] as const;
  const balloon = createBalloon(1440, 900, palette, deterministicRand, false);

  assert.ok(balloon.x >= balloon.radius && balloon.x <= 1440 - balloon.radius);
  assert.ok(balloon.y > 900);
  assert.ok(palette.includes(balloon.color as (typeof palette)[number]));

  const next = stepBalloonPosition(balloon, 10, 1);
  assert.ok(next.y < balloon.y);
  assert.equal(next.offTop, false);

  const highBalloon = { ...balloon, y: -150 };
  const gone = stepBalloonPosition(highBalloon, 10, 1);
  assert.equal(gone.offTop, true);
});
