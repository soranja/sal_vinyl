export let INIT_AREA_BOUNDS;
export let READY_AREA_BOUNDS;

export function isInArea(point, area) {
  return (
    point.x >= area.left &&
    point.x <= area.left + area.width &&
    point.y >= area.top &&
    point.y <= area.top + area.height
  );
}

export function getBoundingBox(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}
