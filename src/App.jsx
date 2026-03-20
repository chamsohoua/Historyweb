// src/App.jsx
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import { GameProvider }   from './context/GameContext';
import { ThemeProvider }  from './context/ThemeContext';
import { LangProvider }   from './i18n/LangContext';

import NavHeader        from './components/common/NavHeader';
import Footer           from './components/common/Footer';
import Toast            from './components/common/Toast';
import HomePage         from './components/home/HomePage';
import Timeline         from './components/timeline/Timeline';
import LoginPage        from './components/auth/LoginPage';
import SignupPage       from './components/auth/SignupPage';
import PeopleGrid       from './components/people/PeopleGrid';
import { PersonProfile } from './components/people/PeopleGrid';
import GameHub          from './components/games/GameHub';
import MapChallenge     from './components/games/MapChallenge';
import QuizGame         from './components/games/QuizGame';
import VoiceGame        from './components/games/VoiceGame';
import AdminDashboard   from './components/admin/AdminDashboard';
import FactsScreen      from './components/content/FactsScreen';
import GalleryScreen    from './components/content/GalleryScreen';

import './styles/Global.css';

function PersonProfilePage() {
  const { id } = useParams();
  return <PersonProfile personId={id} />;
}

function ComingSoon({ icon, title, color }) {
  return (
    <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'var(--sp-4)', textAlign:'center', padding:'var(--sp-12)' }}>
      <div style={{ fontSize:'5rem', animation:'float 3s ease-in-out infinite', filter:`drop-shadow(0 8px 24px ${color || 'rgba(212,175,55,0.3)'})` }}>{icon}</div>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color: color || 'var(--gold-light)' }}>{title}</h2>
      <p style={{ color:'var(--text-muted)', fontSize:'1rem' }}>This section is coming soon! Stay tuned.</p>
    </div>
  );
}

function AppShell({ children, noFooter }) {
  return (
    <>
      <NavHeader />
      <main style={{ flex:1 }}>{children}</main>
      {!noFooter && <Footer />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <BrowserRouter>
          <AuthProvider>
            <GameProvider>
              <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
                <Routes>
                  <Route path="/"           element={<AppShell><HomePage /></AppShell>} />
                  <Route path="/timeline"   element={<AppShell><Timeline /></AppShell>} />
                  <Route path="/people"     element={<AppShell><PeopleGrid /></AppShell>} />
                  <Route path="/people/:id" element={<AppShell><PersonProfilePage /></AppShell>} />
                  <Route path="/games"      element={<AppShell><GameHub /></AppShell>} />
                  <Route path="/games/map"  element={<AppShell noFooter><MapChallenge /></AppShell>} />
                  <Route path="/games/quiz" element={<AppShell noFooter><QuizGame /></AppShell>} />
                  <Route path="/games/voice"element={<AppShell noFooter><VoiceGame /></AppShell>} />
                  <Route path="/facts"      element={<AppShell><FactsScreen /></AppShell>} />
                  <Route path="/gallery"    element={<AppShell><GalleryScreen /></AppShell>} />
                  <Route path="/login"      element={<LoginPage />} />
                  <Route path="/signup"     element={<SignupPage />} />
                  <Route path="/admin"      element={<AdminDashboard />} />
                  <Route path="*"           element={<AppShell><ComingSoon icon="🤔" title="Page Not Found" /></AppShell>} />
                </Routes>
              </div>
            </GameProvider>
          </AuthProvider>
        </BrowserRouter>
      </LangProvider>
    </ThemeProvider>
  );
}
