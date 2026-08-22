export type Point = [number, number];

export function roundedPath(points: Point[], radius = 9): string {
  if (points.length < 2) return "";
  const parts: string[] = [`M ${points[0][0]} ${points[0][1]}`];

  for (let i = 1; i < points.length - 1; i += 1) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];

    const inLen = Math.hypot(cx - px, cy - py);
    const outLen = Math.hypot(nx - cx, ny - cy);
    if (inLen < 1 || outLen < 1) continue;

    const r = Math.min(radius, inLen / 2, outLen / 2);
    parts.push(
      `L ${cx - ((cx - px) / inLen) * r} ${cy - ((cy - py) / inLen) * r}`,
      `Q ${cx} ${cy} ${cx + ((nx - cx) / outLen) * r} ${cy + ((ny - cy) / outLen) * r}`,
    );
  }

  const last = points[points.length - 1];
  parts.push(`L ${last[0]} ${last[1]}`);
  return parts.join(" ");
}
