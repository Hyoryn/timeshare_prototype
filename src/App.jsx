import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ModeProvider, useMode } from './context/ModeContext';
import ModeSelection from './pages/ModeSelection';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import MyPage from './pages/MyPage';
import TalentVerification from './pages/TalentVerification';
import Resume from './pages/Resume';
import Matching from './pages/Matching';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { mode } = useMode();
  return mode ? children : <Navigate to="/select-mode" replace />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/select-mode" element={<ModeSelection />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/:id"
        element={
          <ProtectedRoute>
            <PostDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify/talent"
        element={
          <ProtectedRoute>
            <TalentVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/:id"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matching/:id?"
        element={
          <ProtectedRoute>
            <Matching />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ModeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ModeProvider>
  );
}

export default App;
