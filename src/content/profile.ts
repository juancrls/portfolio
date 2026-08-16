
export const CONTACT = {
  name: "Juan Costa",
  email: "juan1112@outlook.com.br",
  github: "https://github.com/juancrls",
  linkedin: "https://linkedin.com/in/juan-fcosta",
  repo: "https://github.com/juancrls/portfolio",
  location: "São Paulo, Brazil · remote",
};

export const HERO = {
  headline: "Backend engineer, full stack when it helps.",
  lede: "Six years on .NET distributed systems: payments, claims, dispatch. I also train the models and build the interfaces on top.",
  stack: [".NET", "C#", "Azure", "AWS", "SQL Server", "React"],
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
    stack: [".NET 8", "gRPC", "Azure Service Bus", "Redis", "DDD"],
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
  "Senior software engineer in São Paulo. I spend most of my time on .NET services that move money or coordinate people, and the rest making sure the front end in front of them is not an afterthought. Portuguese native, English C1, open to remote roles.";
