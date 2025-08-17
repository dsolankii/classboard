// frontend/app/(auth)/login/page.tsx
import LoginClient from "./LoginClient";

type SearchParams = {
  next?: string;
  registered?: string; // "true" | "false"
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const next =
    typeof searchParams?.next === "string" && searchParams.next
      ? searchParams.next
      : "/dashboard";
  const registered = searchParams?.registered === "true";
  return <LoginClient next={next} registered={registered} />;
}
