import { roundedPath, type Point } from "@/lib/svgPath";

export interface FlowNode {
  id: string;
  col: number;
  row: number;
  label: string;
  sub?: string;
  tone?: "default" | "accent" | "external";
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

const COL_W = 150;
const COL_GAP = 42;
const ROW_H = 54;
const ROW_GAP = 48;

const nodeX = (col: number) => col * (COL_W + COL_GAP);
const nodeY = (row: number) => row * (ROW_H + ROW_GAP);

export function Flow({
  nodes,
  edges,
  caption,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  caption: string;
}) {
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const width = cols * (COL_W + COL_GAP) - COL_GAP;
  const height = rows * (ROW_H + ROW_GAP) - ROW_GAP + 16;
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <figure>
      <div className="scroll-fade overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: Math.min(width, 620) }}
        role="img"
        aria-label={caption}
      >
        <defs>
          <marker id="flow-arrow" markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto">
            <path d="M0 0 L7 3.5 L0 7 z" fill="var(--rule-firm)" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const a = byId.get(edge.from);
          const b = byId.get(edge.to);
          if (!a || !b) return null;

          const ax = nodeX(a.col);
          const ay = nodeY(a.row);
          const bx = nodeX(b.col);
          const by = nodeY(b.row);
          let points: Point[];
          let labelAt: Point;

          if (a.row === b.row) {
            const rightwards = b.col > a.col;
            const x1 = rightwards ? ax + COL_W : ax;
            const x2 = rightwards ? bx : bx + COL_W;
            const y = ay + ROW_H / 2;
            points = [
              [x1, y],
              [x2, y],
            ];
            labelAt = [(x1 + x2) / 2, y - 9];
          } else {
            const downwards = b.row > a.row;
            const y1 = downwards ? ay + ROW_H : ay;
            const y2 = downwards ? by : by + ROW_H;
            const midY = (y1 + y2) / 2;
            const x1 = ax + COL_W / 2;
            const x2 = bx + COL_W / 2;
            points = [
              [x1, y1],
              [x1, midY],
              [x2, midY],
              [x2, y2],
            ];
            labelAt = [(x1 + x2) / 2, midY - 7];
          }

          return (
            <g key={`${edge.from}->${edge.to}`}>
              <path
                d={roundedPath(points)}
                fill="none"
                stroke="var(--rule-firm)"
                strokeWidth={1.4}
                strokeDasharray={edge.dashed ? "4 3" : undefined}
                markerEnd="url(#flow-arrow)"
              />
              {edge.label && (
                <text
                  x={labelAt[0]}
                  y={labelAt[1]}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fill="var(--ink-faint)"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node) => {
          const accent = node.tone === "accent";
          const external = node.tone === "external";
          return (
            <g key={node.id}>
              <rect
                x={nodeX(node.col)}
                y={nodeY(node.row)}
                width={COL_W}
                height={ROW_H}
                rx={8}
                fill={accent ? "var(--sage)" : "var(--paper)"}
                stroke={accent ? "var(--lime-edge)" : "var(--rule-firm)"}
                strokeWidth={1}
                strokeDasharray={external ? "5 3" : undefined}
              />
              <text
                x={nodeX(node.col) + COL_W / 2}
                y={nodeY(node.row) + (node.sub ? 22 : ROW_H / 2 + 1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11.5}
                fontWeight={600}
                fill={accent ? "var(--moss)" : "var(--ink)"}
              >
                {node.label}
              </text>
              {node.sub && (
                <text
                  x={nodeX(node.col) + COL_W / 2}
                  y={nodeY(node.row) + 37}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={9.5}
                  fontFamily="var(--font-mono)"
                  fill="var(--ink-faint)"
                >
                  {node.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      </div>
      <figcaption className="mt-3 max-w-[62ch] text-[13px] leading-normal text-soft">{caption}</figcaption>
    </figure>
  );
}
