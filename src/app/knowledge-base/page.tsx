"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getKnowledgeAnswerAction } from "@/app/_actions/agent-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, HelpCircle } from "lucide-react";

const initialState = {
  message: "",
  errors: undefined,
  data: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Get Simple Answer
    </Button>
  );
}

export default function KnowledgeBasePage() {
  const [state, formAction] = useActionState(getKnowledgeAnswerAction, initialState);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Instant Knowledge Base</CardTitle>
          <CardDescription>
            Ask a complex question and get a simple, analogy-rich answer for your students.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Your Question</Label>
              <Textarea
                id="question"
                name="question"
                placeholder="e.g., Why is the sky blue?"
                rows={4}
              />
              {state.errors?.question && <p className="text-sm font-medium text-destructive">{state.errors.question}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select name="language" defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {state.message && state.message !== 'success' && <p className="text-sm font-medium text-destructive">{state.message}</p>}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Simple Explanation</CardTitle>
          <CardDescription>The AI-generated answer will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {useFormStatus().pending ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4">Thinking of a simple analogy...</p>
            </div>
          ) : state.data ? (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
              {state.data}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <HelpCircle className="h-12 w-12" />
              <p className="mt-4">Ask a question to get an answer.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
