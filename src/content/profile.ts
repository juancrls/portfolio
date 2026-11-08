
export const CONTACT = {
  name: "Juan Costa",
  email: "juanfcosta.dev@gmail.com",
  github: "https://github.com/juancrls",
  linkedin: "https://linkedin.com/in/juan-fcosta",
  repo: "https://github.com/juancrls/portfolio",
  location: "São Paulo, Brazil · remote",
};

export const HERO = {
  headline: "Full-stack engineer, fluent in AI.",
  lede: "Six years shipping .NET distributed systems: payments, claims, dispatch. I use AI across architecture, testing and review, and I train the model myself when the product needs one.",
  stack: [".NET", "C#", "React", "Vue", "Azure", "AWS", "PyTorch"],
};

export interface ProjectCard {
  slug: string;
  name: string;
  tagline: string;
  metric: { value: string; label: string };
  stack: string[];
  href: string;
}

export const PROJECTS: ProjectCard[] = [
  {
    slug: "debt-recovery",
    name: "Debt Recovery Platform",
    tagline: ".NET microservices for contract and claims management.",
    metric: { value: "$22M+", label: "recovered in unpaid installments" },
    stack: [".NET 10", "Azure Service Bus", "RabbitMQ", "SQL Server", "Terraform"],
    href: "/work/debt-recovery",
  },
  {
    slug: "incident-dispatch",
    name: "Incident Dispatch",
    tagline: "Unified case creation and patrol dispatch for the São Paulo military police.",
    metric: { value: "−62%", label: "response time on urgent incidents" },
    stack: [".NET 8", "gRPC", "RabbitMQ", "Redis", "DDD"],
    href: "/work/incident-dispatch",
  },
  {
    slug: "caligrafia",
    name: "Caligraf.ia",
    tagline: "A Portuguese handwriting engine I trained, benchmarked and shipped.",
    metric: { value: "0.42 → 0.70", label: "legibility, four training rounds" },
    stack: ["PyTorch", "Python", "Flask", "TrOCR"],
    href: "/work/caligrafia",
  },
  {
    slug: "playground",
    name: "Component Playground",
    tagline: "Components that wire themselves. Measured live.",
    metric: { value: "50k", label: "rows, windowed" },
    stack: ["React 19", "TypeScript", "Vue 3"],
    href: "/playground",
  },
];

export const ABOUT =
  "Senior software engineer in São Paulo. Most of my work is .NET services that move money or coordinate people, plus the interfaces on top of them. AI runs through how I build, from architecture and tests to code review, and when a product needs a model that does not exist yet I train it. Portuguese native, English C1, open to remote roles.";
