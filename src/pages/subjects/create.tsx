import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEPARTMENT_OPTIONS } from "@/constants";
import { subjectSchema } from "@/lib/schema";

const SubjectCreate = () => {
  const form = useForm({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: { resource: "subjects", action: "create" },
  });
  const { refineCore: { onFinish }, handleSubmit, control, formState: { isSubmitting } } = form;

  const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
    await onFinish(values);
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <div>
        <h1 className="page-title">Create a subject</h1>
        <p className="mt-1 text-muted-foreground">Add a subject before assigning it to a class.</p>
      </div>
      <Card className="class-form-card">
        <CardHeader><CardTitle>Subject details</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField control={control} name="name" render={({ field }) => <FormItem><FormLabel>Subject name</FormLabel><FormControl><Input autoComplete="off" placeholder="Introduction to biology" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={control} name="code" render={({ field }) => <FormItem><FormLabel>Subject code</FormLabel><FormControl><Input autoComplete="off" placeholder="BIO-101" {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
              <FormField control={control} name="department" render={({ field }) => <FormItem><FormLabel>Department</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl><SelectContent>{DEPARTMENT_OPTIONS.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
              <FormField control={control} name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe what students will learn." {...field} /></FormControl><FormMessage /></FormItem>} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} {isSubmitting ? "Creating subject…" : "Create subject"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CreateView>
  );
};

export default SubjectCreate;
