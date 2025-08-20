import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Builder from './pages/Builder.jsx'
import FormView from './pages/FormView.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API}/api/forms`, { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Authentication check failed:', error.response?.status);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Home Page Working!</h1>
      <p>React is working correctly.</p>
      <Link to="/login">Go to Split Login</Link>
    </div>
  );
}

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user info and forms
    const fetchData = async () => {
      try {
        // Get user info from auth endpoint
        const userResponse = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
        setUser(userResponse.data.user);
        
        // Get forms
        const formsResponse = await axios.get(`${API}/api/forms`, { withCredentials: true });
        setForms(formsResponse.data.forms || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px', color: '#ef4444' }}>❌</div>
          <h2>Error Loading Dashboard</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '20px 40px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem' }}>
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>
            Manage your forms and responses
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/builder" style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            + Create New Form
          </Link>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📝</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Total Forms</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {forms.length}
            </div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🗄️</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Airtable Connected</h3>
            <div style={{ fontSize: '1.2rem', color: '#16a34a', fontWeight: '500' }}>
              ✅ Active
            </div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Responses</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              0
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px' 
          }}>
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>
              Your Forms
            </h2>
            <Link to="/builder" style={{
              padding: '12px 20px',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              + New Form
            </Link>
          </div>

          {forms.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '60px 40px',
              borderRadius: '12px',
              border: '2px dashed #d1d5db',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#9ca3af' }}>📝</div>
              <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>
                No forms created yet
              </h3>
              <p style={{ margin: '0 0 25px 0', color: '#6b7280', fontSize: '16px' }}>
                Create your first form to start collecting data from Airtable
              </p>
              <Link to="/builder" style={{
                padding: '14px 28px',
                background: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Create Your First Form
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {forms.map((form) => (
                <div key={form._id} style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      color: '#1e293b', 
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      {form.name}
                    </h3>
                    <p style={{ 
                      margin: '0 0 15px 0', 
                      color: '#64748b', 
                      fontSize: '14px' 
                    }}>
                      Connected to: {form.airtable?.tableName || 'Unknown Table'}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        background: '#f0f9ff',
                        color: '#0369a1',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {form.questions?.length || 0} Questions
                      </span>
                      <span style={{
                        background: '#f0fdf4',
                        color: '#16a34a',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/form/${form._id}`} style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      View Form
                    </Link>
                    <button style={{
                      padding: '10px 16px',
                      background: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SplitLogin() {
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API}/api/auth/login`, {
        personalAccessToken: personalAccessToken
      }, { withCredentials: true });

      if (response.data.success) {
        setSuccess('Login successful! Redirecting...');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          window.location.href = '/#/dashboard';
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please check your Personal Access Token.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100vw',
      overflow: 'hidden',
      maxWidth: '1400px',
      margin: '0 auto',
      boxShadow: '0 0 50px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Left Panel - Dark Blue Background */}
      <div style={{
        flex: '1 1 50%',
        background: '#1e3a8a',
        color: 'white',
        padding: '60px 50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 'bold',
            marginBottom: '35px',
            lineHeight: '1.2'
          }}>
            Streamline data collection and workflow automation.
          </h1>

          {/* Features List */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                fontSize: '2rem',
                minWidth: '40px'
              }}>
                🗄️
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Connect to Airtable
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.5',
                  fontSize: '0.95rem'
                }}>
                  Seamlessly integrate with your existing Airtable bases and tables
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                fontSize: '2rem',
                minWidth: '40px'
              }}>
                ⚡
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Dynamic Forms
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.5',
                  fontSize: '0.95rem'
                }}>
                  Create intelligent forms with conditional logic and real-time validation
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                fontSize: '2rem',
                minWidth: '40px'
              }}>
                🛡️
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Secure & Reliable
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.5',
                  fontSize: '0.95rem'
                }}>
                  Enterprise-grade security with OAuth 2.0 and encrypted data transmission
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                fontSize: '2rem',
                minWidth: '40px'
              }}>
                👥
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Team Collaboration
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.5',
                  fontSize: '0.95rem'
                }}>
                  Share forms with your team and collect responses in real-time
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Section */}
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              Why Choose Our Platform?
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{
                marginBottom: '10px',
                paddingLeft: '20px',
                position: 'relative',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9rem'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  color: '#60a5fa'
                }}>•</span>
                Real-time Airtable synchronization
              </li>
              <li style={{
                marginBottom: '10px',
                paddingLeft: '20px',
                position: 'relative',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9rem'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  color: '#60a5fa'
                }}>•</span>
                Professional form themes and customization
              </li>
              <li style={{
                marginBottom: '10px',
                paddingLeft: '20px',
                position: 'relative',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9rem'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  color: '#60a5fa'
                }}>•</span>
                Analytics and response insights
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - White Background */}
      <div style={{
        flex: '1 1 50%',
        background: 'white',
        padding: '60px 50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{
              fontSize: '3.5rem',
              marginBottom: '20px'
            }}>
              🗄️
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '15px'
            }}>
              Welcome Back
            </h1>
            <p style={{
              color: '#64748b',
              fontSize: '1rem'
            }}>
              Sign in with your Airtable account to continue
            </p>
          </div>

          {/* Login Box */}
          <form onSubmit={handleLogin} style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '25px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <p style={{
              color: '#475569',
              marginBottom: '20px',
              textAlign: 'center',
              lineHeight: '1.5',
              fontSize: '0.95rem'
            }}>
              Enter your Airtable Personal Access Token to connect your account
            </p>
            
            {/* Personal Access Token Input */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                value={personalAccessToken}
                onChange={(e) => setPersonalAccessToken(e.target.value)}
                placeholder="Enter your Personal Access Token"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#16a34a',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {success}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🗄️</span>
              {isLoading ? 'Connecting...' : 'Connect with Airtable'}
            </button>

            <p style={{
              fontSize: '0.85rem',
              color: '#64748b',
              textAlign: 'center',
              marginTop: '18px',
              lineHeight: '1.4'
            }}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>

          {/* Authentication Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '30px',
            padding: '15px',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            <span style={{
              fontSize: '0.9rem',
              color: '#475569'
            }}>
              Secure OAuth 2.0 Authentication
            </span>
          </div>

          {/* Demo Account Section */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '12px'
            }}>
              Demo Account Available
            </h3>
            <p style={{
              color: '#475569',
              marginBottom: '15px',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              Want to try before you connect? Use our demo environment to explore all features.
            </p>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              textDecoration: 'underline',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Try Demo Version
            </button>
          </div>
        </div>
      </div>
      
      {/* Responsive CSS */}
      <style>{`
        /* Global styles to remove any gaps */
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          background: #f5f5f5;
        }
        
        /* Ensure full width coverage */
        div[style*="width: 100vw"] {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Perfect equal split */
        div[style*="flex: 1 1 50%"] {
          flex: 1 1 50% !important;
          width: 50% !important;
        }
        
        /* Responsive breakpoints */
        @media (max-width: 1200px) {
          div[style*="maxWidth: 1400px"] {
            max-width: 95vw !important;
            margin: 0 auto !important;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="display: flex"] {
            flex-direction: column !important;
          }
          
          div[style*="flex: 1 1 50%"] {
            flex: 1 1 100% !important;
            width: 100% !important;
            min-height: auto !important;
          }
          
          div[style*="padding: 60px 50px"] {
            padding: 40px 30px !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="padding: 60px 50px"] {
            padding: 30px 20px !important;
          }
          
          div[style*="fontSize: 2.8rem"] {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SplitLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/form/:id" element={<FormView />} />
      </Routes>
    </HashRouter>
  );
}

export default App
