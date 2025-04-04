import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "sonner";
// import { TooltipProvider } from "./components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectProvider } from "./contexts/ProjectContext";

import Navbar from "./components/Navbar";
import CreateProject from "./pages/CreateProject";
import ProjectDashboard from "./pages/ProjectDashboard";
import Repository from "./pages/Repository";
import UserStories from "./pages/UserStories";
import TechnicalInsights from "./pages/TechnicalInsights";
import TestPlan from "./pages/TestPlan";
import NotFound from "./pages/NotFound";
import UploadPRD from "./pages/UploadPRD";
import UploadTechDoc from "./pages/UploadTechDoc";
import GenerateTests from "./pages/GenerateTests";
import NotionIntegration from "./pages/NotionIntegration";
import JiraIntegration from "./pages/JiraIntegration";
// const queryClient = new QueryClient();

const App = () => {
  return (
    // <QueryClientProvider client={queryClient}>
    //   <TooltipProvider>
        // <Toaster />
        <ProjectProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<CreateProject />} />
              <Route path="/project/:projectId" element={<ProjectDashboard />} />
              <Route path="/project/:projectId/repository" element={<Repository />} />
              <Route path="/project/:projectId/user-stories" element={<UserStories />} />
              <Route path="/project/:projectId/technical-insights" element={<TechnicalInsights />} />
              <Route path="/project/:projectId/test-plan" element={<TestPlan />} />
              <Route path="/project/:projectId/upload-prd" element={<UploadPRD />} />
              <Route path="/project/:projectId/upload-tech-doc" element={<UploadTechDoc />} />
              <Route path="/project/:projectId/generate-tests" element={<GenerateTests />} />
              <Route path="/project/:projectId/notion-integration" element={<NotionIntegration />} />
              <Route path="/project/:projectId/jira-integration" element={<JiraIntegration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProjectProvider>
    //   </TooltipProvider>
    // </QueryClientProvider>
  );
};

export default App;