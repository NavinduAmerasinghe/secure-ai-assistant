import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import ScanResultPage from "./pages/ScanResultPage";
import SubmissionPage from "./pages/SubmissionPage";
import VulnerabilityListPage from "./pages/VulnerabilityListPage";
import CRAReportPage from "./pages/CRAReportPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan/:scanId"
            element={
              <ProtectedRoute>
                <ScanResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan/:scanId/vulnerabilities"
            element={
              <ProtectedRoute>
                <VulnerabilityListPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
           <Route path="/cra-report" element={<CRAReportPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;