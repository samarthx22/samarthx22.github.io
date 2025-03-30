import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Music, Library, Upload, LogIn, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { BeatLibrary } from './components/BeatLibrary';
import { UploadBeat } from './components/UploadBeat';
import { LoginPage } from './components/LoginPage';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert('Error logging out');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Music className="text-purple-500" />
              JS Sam Beats
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/library" className="flex items-center gap-1 hover:text-purple-500 transition-colors">
                <Library size={20} />
                Library
              </Link>
              {session && (
                <Link to="/upload" className="flex items-center gap-1 hover:text-purple-500 transition-colors">
                  <Upload size={20} />
                  Upload
                </Link>
              )}
              {session ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-purple-500 transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1 hover:text-purple-500 transition-colors"
                >
                  <LogIn size={20} />
                  Login to Upload Beats
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="max-w-4xl mx-auto space-y-12">
                <section className="text-center space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    JS Sam Beats
                  </h1>
                  <p className="text-xl text-gray-300">
                    Where Code Meets Music
                  </p>
                </section>

                <section className="bg-gray-800 rounded-lg p-8 space-y-4">
                  <h2 className="text-2xl font-bold">About Me</h2>
                  <p className="text-gray-300">
                    As a student deeply passionate about both music and coding, I've combined my two greatest interests into this platform. 
                    This website represents my journey in exploring the intersection of technology and music production. 
                    What started as a passion project has evolved into a space where I can share my beats while practicing my development skills.
                  </p>
                  <div className="flex justify-center">
                    <a
                      href="mailto:samarthsinghjuneja@gmail.com"
                      className="inline-flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Contact Me
                    </a>
                  </div>
                </section>
              </div>
            } />
            <Route path="/library" element={<BeatLibrary />} />
            <Route path="/login" element={<LoginPage />} />
            {session && <Route path="/upload" element={<UploadBeat />} />}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;