import BaseLink from "next/link";

export function TermsAndConditions() {
  return (
    <p className="px-8 pb-2 text-center text-sm text-muted-foreground">
      By clicking continue, you agree to our{" "}
      <BaseLink
        href="/terms"
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms of Service
      </BaseLink>{" "}
      and{" "}
      <BaseLink
        href="/privacy"
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </BaseLink>
      .
    </p>
  );
}
