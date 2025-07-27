"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateStoryAction } from "@/app/_actions/agent-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, BookOpen } from "lucide-react";

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
      Generate Story
    </Button>
  );
}

export default function ContentGeneratorPage() {
  const [state, formAction] = useActionState(generateStoryAction, initialState);
  const [grade, setGrade] = useState(4);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Hyper-Local Content Generator</CardTitle>
          <CardDescription>
            Create a story by providing a topic, place, language, and grade level.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" placeholder="e.g., Farmers and soil types" />
              {state.errors?.topic && <p className="text-sm font-medium text-destructive">{state.errors.topic}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="place">Place</Label>
              <Input id="place" name="place" placeholder="e.g., a village in Maharashtra" />
              {state.errors?.place && <p className="text-sm font-medium text-destructive">{state.errors.place}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="grade">Grade: {grade}</Label>
                <Slider
                  id="grade"
                  name="grade"
                  min={1}
                  max={12}
                  step={1}
                  value={[grade]}
                  onValueChange={(value) => setGrade(value[0])}
                />
                 <input type="hidden" name="grade" value={grade} />
              </div>
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
          <CardTitle className="font-headline">Generated Story</CardTitle>
          <CardDescription>The AI-generated story will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {useFormStatus().pending ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4">Generating your story...</p>
            </div>
          ) : state.data ? (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
              {state.data}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <BookOpen className="h-12 w-12" />
              <p className="mt-4">Your story is waiting to be written.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
