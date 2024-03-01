'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/common/card';
import { LoginForm } from '@/(auth)/login/login-form';
import { OAuthButtons } from '@/(auth)/oauth-buttons';
import { TermsAndConditions } from '@/(auth)/terms-and-conditions';
import { SeparatorWithText } from '@/(auth)/separator-with-text';
export default function Page() {
  return (
    <Card className="w-1/2 p-2">
      <CardHeader className="gap-2 p-2 text-center">
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your email login</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <LoginForm />
      </CardContent>
      <SeparatorWithText>Or continue with</SeparatorWithText>
      <CardFooter className="justify-evenly p-4">
        <OAuthButtons />
      </CardFooter>
      <TermsAndConditions />
    </Card>
  );
}
