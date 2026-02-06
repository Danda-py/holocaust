import Link from "next/link";
import { Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-block w-16 h-px bg-muted-foreground/30" />
        </div>

        <blockquote className="font-serif text-lg md:text-xl italic text-muted-foreground mb-8">
          &ldquo;Those who cannot remember the past are condemned to repeat it.&rdquo;
          <footer className="mt-2 text-sm not-italic">
            &mdash; George Santayana
          </footer>
        </blockquote>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/admin"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>Admin</span>
          </Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/60">
          This memorial is dedicated to preserving the memory of Holocaust victims.
        </p>
    </footer>
  );
}
