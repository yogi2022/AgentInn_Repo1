"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateVisualAidAction } from "@/app/_actions/agent-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Image as ImageIcon } from "lucide-react";
import Image from 'next/image';

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
      Generate Visual
    </Button>
  );
}

export default function VisualAidPage() {
  const [state, formAction] = useActionState(generateVisualAidAction, initialState);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Visual Aid Generator</CardTitle>
          <CardDescription>
            Create simple line drawings and diagrams for your blackboard.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" name="topic" placeholder="e.g., The water cycle" />
              {state.errors?.topic && <p className="text-sm font-medium text-destructive">{state.errors.topic}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Label Language</Label>
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
          <CardTitle className="font-headline">Generated Visual Aid</CardTitle>
          <CardDescription>The AI-generated image will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          {useFormStatus().pending ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4">Drawing your visual aid...</p>
            </div>
          ) : state.data ? (
            <div className="relative w-full h-full min-h-64 rounded-lg overflow-hidden border">
              <Image src={state.data} alt="Generated visual aid" layout="fill" objectFit="contain" />
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ImageIcon className="h-12 w-12" />
              <p className="mt-4">Your visual aid is ready to be drawn.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
