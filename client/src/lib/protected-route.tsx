import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import AppLayout from "@/components/app-layout";

// Flag for UI-only mode bypass of authentication
const UI_ONLY_MODE = true;

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType<any>;
}) {
  const { user, isLoading } = useAuth();

  // In UI-only mode, bypass authentication for all routes
  if (UI_ONLY_MODE) {
    return (
      <Route path={path}>
        {() => (
          <AppLayout>
            <Component />
          </AppLayout>
        )}
      </Route>
    );
  }

  if (isLoading) {
    return (
      <Route path={path}>
        {() => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-border" />
          </div>
        )}
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        {() => <Redirect to="/auth" />}
      </Route>
    );
  }

  return (
    <Route path={path}>
      {() => (
        <AppLayout>
          <Component />
        </AppLayout>
      )}
    </Route>
  );
}
