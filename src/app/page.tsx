import Link from "next/link";
import { greet } from "@/app/actions/hello";

export default async function Home() {
  const message = await greet("fullstack");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-24 font-sans dark:bg-black">
      <main className="flex max-w-lg flex-col gap-6 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          tro-choi-hou
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{message}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Server Action (server) · Route Handlers dưới{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
            app/api
          </code>
        </p>
        <Link
          href="/api/health"
          className="inline-flex w-fit items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Mở GET /api/health
        </Link>
      </main>
    </div>
  );
}
