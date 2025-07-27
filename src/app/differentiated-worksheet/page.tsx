"use client";

import React, { useState } from "react";
import { generateWorksheetsAction } from "@/app/_actions/agent-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, UploadCloud } from "lucide-react";
import Image from 'next/image';

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type Worksheet = {
  grade: number;
  worksheetContent: string;
};

export default function DifferentiatedWorksheetPage() {
  const [photoDataUri, setPhotoDataUri] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [worksheets, setWorksheets] = useState<Worksheet[] | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPhotoDataUri(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGradeChange = (grade: number) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!photoDataUri || selectedGrades.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please upload an image and select at least one grade.",
      });
      return;
    }

    setIsLoading(true);
    setWorksheets(null);
    const result = await generateWorksheetsAction({ photoDataUri, grades: selectedGrades, language });
    setIsLoading(false);

    if (result.success) {
      setWorksheets(result.data!);
    } else {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: result.message,
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Differentiated Worksheet Generator</CardTitle>
            <CardDescription>
              Upload a textbook image, select grades, and generate tailored worksheets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photo">Textbook Page Image</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                      {photoDataUri ? (
                          <Image src={photoDataUri} alt="Preview" width={150} height={150} className="object-contain h-full p-2"/>
                      ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, or JPEG</p>
                          </div>
                      )}
                      <Input id="photo" name="photo" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg" />
                  </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Grades</Label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {grades.map((grade) => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${grade}`}
                      onCheckedChange={() => handleGradeChange(grade)}
                    />
                    <label htmlFor={`grade-${grade}`} className="text-sm font-medium leading-none">
                      {grade}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select name="language" value={language} onValueChange={setLanguage}>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Worksheets
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Generated Worksheets</CardTitle>
          <CardDescription>Worksheets for each selected grade will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4">Generating worksheets...</p>
            </div>
          ) : worksheets ? (
            <Accordion type="single" collapsible className="w-full">
              {worksheets.sort((a,b) => a.grade - b.grade).map((ws) => (
                <AccordionItem value={`grade-${ws.grade}`} key={ws.grade}>
                  <AccordionTrigger>Grade {ws.grade} Worksheet</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
                      {ws.worksheetContent}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12" />
              <p className="mt-4">Your worksheets are waiting.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
