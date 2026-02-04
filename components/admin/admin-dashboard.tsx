"use client";

import type { User } from "@supabase/supabase-js";
import type { HistoryContent, Character } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HistoryEditor } from "./history-editor";
import { CharactersManager } from "./characters-manager";
import { signOut } from "@/app/admin/actions";
import { LogOut, Home, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminDashboardProps {
  user: User;
  initialHistory: HistoryContent | null;
  initialCharacters: Character[];
}

export function AdminDashboard({
  user,
  initialHistory,
  initialCharacters,
}: AdminDashboardProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="font-serif text-xl font-bold text-foreground">
                Admin Panel
              </h1>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                View Site
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              History Content
            </TabsTrigger>
            <TabsTrigger value="characters" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Characters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <HistoryEditor initialHistory={initialHistory} />
          </TabsContent>

          <TabsContent value="characters">
            <CharactersManager initialCharacters={initialCharacters} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
