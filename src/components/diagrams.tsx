
interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  sub?: string;
  tone?: "default" | "accent" | "gate";
}

const BOX_W = 132;
const BOX_H = 52;

function Box({ node }: { node: Node }) {
  const accent = node.tone === "accent" || node.tone === "gate";
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={BOX_W}
        height={BOX_H}
        rx={8}
        fill={accent ? "var(--sage)" : "var(--paper)"}
        stroke={accent ? "var(--lime-edge)" : "var(--rule-firm)"}
        strokeWidth={node.tone === "gate" ? 1.75 : 1}
        strokeDasharray={node.tone === "gate" ? "5 3" : undefined}
      />
      <text
        x={node.x + BOX_W / 2}
        y={node.y + (node.sub ? 21 : BOX_H / 2 + 1)}
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
          x={node.x + BOX_W / 2}
          y={node.y + 36}
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
}

function Arrow({ d, dashed }: { d: string; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="var(--rule-firm)"
      strokeWidth={1.4}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd="url(#arrowhead)"
    />
  );
}

function Defs() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth={7}
        markerHeight={7}
        refX={6}
        refY={3.5}
        orient="auto"
      >
        <path d="M0 0 L7 3.5 L0 7 z" fill="var(--rule-firm)" />
      </marker>
    </defs>
  );
}

const TRAIN_ROW_1: Node[] = [
  { id: "fonts", x: 0, y: 16, label: "OFL fonts", sub: "12 cursive faces" },
  { id: "skeleton", x: 176, y: 16, label: "1px skeleton", sub: "skimage" },
  { id: "traj", x: 352, y: 16, label: "Pen trajectory", sub: "accents kept" },
  { id: "dataset", x: 528, y: 16, label: "Dataset", sub: "21.6k pairs" },
];

const TRAIN_ROW_2: Node[] = [
  { id: "train", x: 528, y: 132, label: "RNN training", sub: "priming 0.7", tone: "accent" },
  { id: "ckpt", x: 352, y: 132, label: "Checkpoint", sub: "every 500 steps" },
  { id: "gate", x: 176, y: 132, label: "Quality gate", sub: "TrOCR judge", tone: "gate" },
  { id: "ship", x: 0, y: 132, label: "Promote", sub: "or discard" },
];

export function TrainingPipeline() {
  return (
    <figure>
      <div className="scroll-fade overflow-x-auto">
      <svg viewBox="0 0 660 230" className="w-full min-w-[620px]" role="img"
        aria-label="Training pipeline: OFL fonts to skeleton to pen trajectory to dataset, then RNN training, checkpoint, TrOCR quality gate, and promote, with a feedback loop from the gate back to training.">
        <Defs />
        {TRAIN_ROW_1.map((node) => (
          <Box key={node.id} node={node} />
        ))}
        {TRAIN_ROW_2.map((node) => (
          <Box key={node.id} node={node} />
        ))}

        {[0, 1, 2].map((i) => (
          <Arrow key={`t1-${i}`} d={`M ${132 + i * 176} 42 L ${168 + i * 176} 42`} />
        ))}

        <Arrow d="M 594 68 L 594 126" />

        {[0, 1, 2].map((i) => (
          <Arrow key={`t2-${i}`} d={`M ${528 - i * 176} 158 L ${484 - i * 176} 158`} />
        ))}

        <path
          d="M 242 132 C 242 96, 420 96, 594 108"
          fill="none"
          stroke="var(--lime-edge)"
          strokeWidth={1.3}
          strokeDasharray="4 3"
          markerEnd="url(#arrowhead)"
          opacity={0.75}
        />
        <text x={400} y={92} textAnchor="middle" fontSize={9.5} fontFamily="var(--font-mono)" fill="var(--moss)">
          score below the frozen ruler → retrain
        </text>
      </svg>
      </div>
      <figcaption className="mt-3 max-w-[62ch] text-[13px] leading-normal text-soft">
        Fonts become strokes, strokes become a dataset, and no checkpoint ships until the frozen ruler scores it.
      </figcaption>
    </figure>
  );
}

const RUNTIME: Node[] = [
  { id: "client", x: 0, y: 20, label: "Browser", sub: "text input" },
  { id: "api", x: 176, y: 20, label: "Flask API", sub: "/generate" },
  { id: "engine", x: 352, y: 20, label: "RNN engine", sub: "torch, CPU", tone: "accent" },
  { id: "svg", x: 528, y: 20, label: "SVG strokes", sub: "~9s total" },
];

export function RuntimeDiagram() {
  return (
    <figure>
      <div className="scroll-fade overflow-x-auto">
      <svg viewBox="0 0 660 100" className="w-full min-w-[620px]" role="img"
        aria-label="Runtime: browser sends text to the Flask API, the RNN engine generates strokes, and SVG comes back in about nine seconds on CPU.">
        <Defs />
        {RUNTIME.map((node) => (
          <Box key={node.id} node={node} />
        ))}
        {[0, 1, 2].map((i) => (
          <Arrow key={`r-${i}`} d={`M ${132 + i * 176} 46 L ${168 + i * 176} 46`} />
        ))}
      </svg>
      </div>
      <figcaption className="mt-3 max-w-[62ch] text-[13px] leading-normal text-soft">
        One request: text in, pen strokes back as SVG, about nine seconds on CPU.
      </figcaption>
    </figure>
  );
}

const RUNS = [
  { tag: "sint1", note: "system fonts", score: 0.42 },
  { tag: "ofl1", note: "open cursive fonts", score: 0.54 },
  { tag: "ofl2", note: "open cursive fonts", score: 0.68 },
  { tag: "ofl3", note: "open cursive fonts", score: 0.7 },
];

const BASELINE = 0.944;

export function ProgressionChart() {
  const width = 620;
  const height = 210;
  const padLeft = 44;
  const padBottom = 34;
  const plotW = width - padLeft - 12;
  const plotH = height - padBottom - 16;
  const y = (score: number) => 16 + plotH - score * plotH;
  const x = (index: number) => padLeft + (index + 0.5) * (plotW / RUNS.length);

  const line = RUNS.map((run, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(run.score)}`).join(" ");

  return (
    <figure>
      <div className="scroll-fade overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[560px]" role="img"
        aria-label="Legibility score by training run: sint1 0.42, ofl1 0.54, ofl2 0.68, ofl3 0.70, against a 0.944 research baseline.">
        <Defs />
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <g key={tick}>
            <line x1={padLeft} y1={y(tick)} x2={width - 12} y2={y(tick)} stroke="var(--rule)" strokeWidth={1} />
            <text x={padLeft - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle" fontSize={9.5}
              fontFamily="var(--font-mono)" fill="var(--ink-faint)">
              {tick.toFixed(2)}
            </text>
          </g>
        ))}

        <line x1={padLeft} y1={y(BASELINE)} x2={width - 12} y2={y(BASELINE)} stroke="var(--clay)"
          strokeWidth={1.3} strokeDasharray="5 4" />
        <text x={width - 14} y={y(BASELINE) - 6} textAnchor="end" fontSize={9.5}
          fontFamily="var(--font-mono)" fill="var(--clay)">
          0.944 research baseline (IAM, not licensable)
        </text>

        <path d={line} fill="none" stroke="var(--lime-edge)" strokeWidth={2} strokeLinejoin="round" />

        {RUNS.map((run, index) => (
          <g key={run.tag}>
            <circle cx={x(index)} cy={y(run.score)} r={4} fill="var(--lime-edge)" />
            <text x={x(index)} y={y(run.score) - 12} textAnchor="middle" fontSize={10.5} fontWeight={600}
              fontFamily="var(--font-mono)" fill="var(--moss)">
              {run.score.toFixed(2)}
            </text>
            <text x={x(index)} y={height - 18} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--ink)">
              {run.tag}
            </text>
            <text x={x(index)} y={height - 6} textAnchor="middle" fontSize={9}
              fontFamily="var(--font-mono)" fill="var(--ink-faint)">
              {run.note}
            </text>
          </g>
        ))}
      </svg>
      </div>
      <figcaption className="mt-3 max-w-[62ch] text-[13px] leading-normal text-soft">
        Four rounds against the frozen corpus. The dashed line is the research baseline that cannot be licensed.
      </figcaption>
    </figure>
  );
}
