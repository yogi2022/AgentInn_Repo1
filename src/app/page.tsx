import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, FileText, BrainCircuit, Paintbrush, ArrowRight } from "lucide-react";

const agentTools = [
  {
    title: "Hyper-Local Content Generator",
    description: "Create culturally relevant stories and explanations in various Indian languages to engage your students.",
    href: "/content-generator",
    icon: BookText,
  },
  {
    title: "Differentiated Worksheet Generator",
    description: "Upload a textbook page and instantly get worksheets tailored for different grade levels in your classroom.",
    href: "/differentiated-worksheet",
    icon: FileText,
  },
  {
    title: "Instant Knowledge Base",
    description: "Get simple, analogy-rich answers to complex student questions in your local language.",
    href: "/knowledge-base",
    icon: BrainCircuit,
  },
  {
    title: "Visual Aid Generator",
    description: "Create simple, blackboard-friendly line drawings, charts, and diagrams for your lessons.",
    href: "/visual-aid",
    icon: Paintbrush,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome to SahayakAI</h1>
        <p className="text-muted-foreground mt-2">
          Your AI-powered teaching assistant for India's multi-grade classrooms.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {agentTools.map((tool) => (
          <Card key={tool.href} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  <tool.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="font-headline">{tool.title}</CardTitle>
                  <CardDescription className="mt-1">{tool.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={tool.href} className="w-full">
                <Button variant="outline" className="w-full">
                  Go to Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
