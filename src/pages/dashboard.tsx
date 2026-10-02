import { useList } from "@refinedev/core";
import { ArrowRight, BookOpen, GraduationCap, Users } from "lucide-react";

import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassDetails, Subject, User } from "@/types";

const Dashboard = () => {
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { pageSize: 1 },
  });
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 1 },
  });
  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 1 },
  });

  const stats = [
    { label: "Classes", value: classesQuery.data?.total ?? 0, icon: GraduationCap },
    { label: "Subjects", value: subjectsQuery.data?.total ?? 0, icon: BookOpen },
    { label: "Teachers", value: teachersQuery.data?.total ?? 0, icon: Users },
  ];

  return (
    <div className="class-view space-y-8">
      <section aria-labelledby="dashboard-title" className="space-y-2">
        <p className="text-sm font-medium text-primary">Classroom overview</p>
        <h1 id="dashboard-title" className="page-title">Welcome to your classroom</h1>
        <p className="max-w-2xl text-muted-foreground">
          Keep classes, subjects, and teaching assignments organized from one place.
        </p>
      </section>

      <section aria-labelledby="summary-title" className="space-y-4">
        <h2 id="summary-title" className="text-lg font-semibold">Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="actions-title" className="space-y-4">
        <h2 id="actions-title" className="text-lg font-semibold">Next steps</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Create a class</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Add a class, assign a subject and teacher, and upload its banner.</p>
              <CreateButton resource="classes"><span className="flex items-center gap-2">Create class <ArrowRight className="size-4" aria-hidden="true" /></span></CreateButton>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Add a subject</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Create the subjects that teachers can assign to classes.</p>
              <CreateButton resource="subjects"><span className="flex items-center gap-2">Create subject <ArrowRight className="size-4" aria-hidden="true" /></span></CreateButton>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
