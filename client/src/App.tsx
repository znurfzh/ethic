import { AuthProvider } from "@/hooks/use-auth";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import PostDetail from "@/pages/post-detail";
import CreatePost from "@/pages/create-post";
import LearningPathsPage from "@/pages/learning-paths-new";
import LearningPathDetailPage from "@/pages/learning-path-detail";
import ResourcesPage from "@/pages/resources";
import ResourceDetailPage from "@/pages/resource-detail";
import MentorshipPage from "@/pages/mentorship-new";
import ForumPage from "@/pages/forum";
import ChallengesPage from "@/pages/challenges";
import CareerPage from "@/pages/career";
import MemberDirectoryPage from "@/pages/member-directory";
import HubEventsPage from "@/pages/hub-events";
import HubPage from "@/pages/hub";
import AnalyticsPage from "@/pages/analytics";
import BookmarksPage from "@/pages/bookmarks";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import EthosAssistant from "@/components/EthosAssistant";
import { ProtectedRoute } from "./lib/protected-route";

import LandingPage from "@/pages/landing-page";

function Router() {
  return (
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
  );
}

function App() {
  return (
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
  );
}

export default App;
