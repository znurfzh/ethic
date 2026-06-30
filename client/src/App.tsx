import { lazy, Suspense } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { Loader2 } from "lucide-react";

// Always-eager: tiny pages needed immediately on load
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import LandingPage from "@/pages/landing-page";

// Lazy: heavy app pages — only loaded when the user navigates there
const HomePage = lazy(() => import("@/pages/home-page"));
const ProfilePage = lazy(() => import("@/pages/profile-page"));
const PostDetail = lazy(() => import("@/pages/post-detail"));
const CreatePost = lazy(() => import("@/pages/create-post"));
const LearningPathsPage = lazy(() => import("@/pages/learning-paths-new"));
const LearningPathDetailPage = lazy(() => import("@/pages/learning-path-detail"));
const ResourcesPage = lazy(() => import("@/pages/resources"));
const ResourceDetailPage = lazy(() => import("@/pages/resource-detail"));
const MentorshipPage = lazy(() => import("@/pages/mentorship-new"));
const ChallengesPage = lazy(() => import("@/pages/challenges"));
const CareerPage = lazy(() => import("@/pages/career"));
const HubEventsPage = lazy(() => import("@/pages/hub-events"));
const HubPage = lazy(() => import("@/pages/hub"));
const AnalyticsPage = lazy(() => import("@/pages/analytics"));
const BookmarksPage = lazy(() => import("@/pages/bookmarks"));

import OnboardingTutorial from "@/components/OnboardingTutorial";
import EthosAssistant from "@/components/EthosAssistant";
import { ProtectedRoute } from "./lib/protected-route";

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <ProtectedRoute path="/home" component={HomePage} />
        <ProtectedRoute path="/profile/:id" component={ProfilePage} />
        <ProtectedRoute path="/posts/:id" component={PostDetail} />
        <ProtectedRoute path="/create" component={CreatePost} />
        <ProtectedRoute path="/learning-paths" component={LearningPathsPage} />
        <ProtectedRoute path="/learning-paths/:id" component={LearningPathDetailPage} />
        <ProtectedRoute path="/resources" component={ResourcesPage} />
        <ProtectedRoute path="/resources/:id" component={ResourceDetailPage} />
        <ProtectedRoute path="/analytics" component={AnalyticsPage} />
        <ProtectedRoute path="/bookmarks" component={BookmarksPage} />
        <ProtectedRoute path="/hub" component={HubPage} />
        <ProtectedRoute path="/mentorship" component={MentorshipPage} />
        <ProtectedRoute path="/challenges" component={ChallengesPage} />
        <ProtectedRoute path="/career" component={CareerPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarProvider>
            <Router />
            <Toaster />
            <OnboardingTutorial />
            <EthosAssistant />
          </SidebarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
