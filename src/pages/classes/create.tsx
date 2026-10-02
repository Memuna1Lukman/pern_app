import React from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from '@refinedev/react-hook-form';
import { useBack, useList } from '@refinedev/core';
import { Loader2 } from 'lucide-react';

import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { CreateView } from '@/components/refine-ui/views/create-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { classSchema } from '@/lib/schema';
import UploadWidget from '@/components/UploadWidget';
import { Subject, UploadWidgetValue, User } from '@/types';

const Create = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: 'classes',
      action: 'create',
    },
  });

  const {
    refineCore:{ onFinish },
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    try {
      await onFinish(values)
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const { query:subjectQuery } = useList<Subject>({
    resource:'subjects',
    pagination: {
        pageSize:100
    }
  }) 
  const { query:teachersQuery } = useList<User>({
    resource:'users',
    filters: [{
        field: 'role',
        operator: 'eq',
        value: 'teacher'
    }],
    pagination: {
        pageSize:100
    }
  }) 
  const subjects = subjectQuery?.data?.data || []
  const subjectLoading = subjectQuery.isLoading;
  const teachers = teachersQuery?.data?.data || []
  const teachersLoading = teachersQuery.isLoading;
  

  const bannerPublicId = form.watch('bannerCldPubId');

  const setBannerImage = (file: UploadWidgetValue | null) => {
    form.setValue('bannerUrl', file?.url ?? '', {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue('bannerCldPubId', file?.publicId ?? '', {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Create a Class</h1>
      <div className="intro-row flex items-center justify-between">
        <p>Provide the required information below to add a class.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card w-full">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Fill out form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Banner Image */}
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner Image <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <UploadWidget
                          value={
                            field.value
                              ? { url: field.value, publicId: bannerPublicId ?? '' }
                              : null
                          }
                          onChange={setBannerImage}
                        />
                      </FormControl>
                      <FormMessage />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Class Name */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduction to Biology - Section A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject & Teacher Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                          disabled={subjectLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem
                                key={subject.id}
                                value={subject.id.toString()}
                              >
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={teachersLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem
                                key={teacher.id}
                                value={teacher.id.toString()}
                              >
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Capacity & Status Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="30"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                            value={(field.value as number | undefined) ?? ''}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span>Creating Class...</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    'Create Class'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default Create;
