import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/card';
import { SignupForm } from '@/(auth)/signup/signup-form';
import { OAuthButtons } from '@/(auth)/oauth-buttons';
import { TermsAndConditions } from '@/(auth)/terms-and-conditions';
import { SeparatorWithText } from '@/components/ui/common/separator-with-text';
import React from 'react';

export default function Page() {
  return (
    <Card className="w-1/2 p-2">
      <CardHeader className="gap-2 p-2 text-center">
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Enter your email below to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <SignupForm />
      </CardContent>
      <SeparatorWithText>
        <span className="bg-background px-2 text-muted-foreground text-xs uppercase">
          Or continue with
        </span>
      </SeparatorWithText>
      <CardFooter className="justify-evenly p-4">
        <OAuthButtons />
      </CardFooter>
      <TermsAndConditions />
    </Card>
  );
}
