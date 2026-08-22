export type SwipePoint = Readonly<{ x: number; y: number }>;

const MINIMUM_SWIPE_DISTANCE = 48;
const HORIZONTAL_INTENT_RATIO = 1.25;

export function resolveStageSwipe(
  start: SwipePoint,
  end: SwipePoint,
  viewedStage: number,
  furthestUnlockedStage: number,
): number | null {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  if (
    Math.abs(deltaX) < MINIMUM_SWIPE_DISTANCE
    || Math.abs(deltaX) <= Math.abs(deltaY) * HORIZONTAL_INTENT_RATIO
  ) {
    return null;
  }

  if (deltaX < 0) {
    return viewedStage < furthestUnlockedStage ? viewedStage + 1 : null;
  }

  return viewedStage > 0 ? viewedStage - 1 : null;
}
