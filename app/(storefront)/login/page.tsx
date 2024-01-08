"use client"

import { Separator } from "@/components/ui/common/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/card";
import { Checkbox } from "@/components/ui/common/checkbox";
import { LoginForm, OAuthButtons } from "@/(storefront)/login/login-form";
interface CheckboxWithTextProps {
  id: string,
  label: string,
  description?: string,
}
export function CheckboxWithText({ id, label, description }: CheckboxWithTextProps) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox id={id} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          { label }
        </label>
        {
          description && (
            <p className="text-sm text-muted-foreground">
              { description }
            </p>
          )
        }
      </div>
    </div>
  )
}
export default function Page() {
  return (
    <Card className='w-1/4'>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <Separator />
      <CardFooter className='py-2 px-8 justify-evenly'>
        <OAuthButtons />
      </CardFooter>
    </Card>
  )
}
