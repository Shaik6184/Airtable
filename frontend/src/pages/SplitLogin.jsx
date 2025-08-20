import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SplitLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAirtableLogin = async () => {
    setLoading(true);
    try {
      // Simulate OAuth flow
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Left Panel - Dark Blue Background */}
      <div style={{
        flex: 1,
        background: '#1e3a8a',
        color: 'white',
        padding: '40px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: '50%'
      }}>
        <div style={{ width: '100%' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '30px',
            lineHeight: '1.2'
          }}>
            Streamline data collection and workflow automation.
          </h1>

          {/* Features List */}
          <div style={{ marginBottom: '40px' }}>
            {[
              {
                icon: '🗄️',
                title: 'Connect to Airtable',
                description: 'Seamlessly integrate with your existing Airtable bases and tables'
              },
              {
                icon: '⚡',
                title: 'Dynamic Forms',
                description: 'Create intelligent forms with conditional logic and real-time validation'
              },
              {
                icon: '🛡️',
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with OAuth 2.0 and encrypted data transmission'
              },
              {
                icon: '👥',
                title: 'Team Collaboration',
                description: 'Share forms with your team and collect responses in real-time'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginBottom: '25px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  minWidth: '40px'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.5',
                    fontSize: '0.95rem'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
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
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                'No-code form builder with drag & drop',
                'Advanced conditional logic and branching',
                'Real-time Airtable synchronization',
                'Professional form themes and customization',
                'Analytics and response insights'
              ].map((item, index) => (
                <li key={index} style={{
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
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - White Background */}
      <div style={{
        flex: 1,
        background: 'white',
        padding: '40px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '50%'
      }}>
        <div style={{ width: '100%', maxWidth: '450px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{
              fontSize: '3.5rem',
              marginBottom: '20px'
            }}>
              🗄️
            </div>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '12px'
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
          <div style={{
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
              Connect your Airtable account to access your bases and create dynamic forms
            </p>
            
            <button
              onClick={handleAirtableLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.background = '#2563eb')}
              onMouseLeave={(e) => !loading && (e.target.style.background = '#3b82f6')}
            >
              <span style={{ fontSize: '1.2rem' }}>🗄️</span>
              {loading ? 'Connecting...' : 'Continue with Airtable'}
            </button>

            <p style={{
              fontSize: '0.85rem',
              color: '#64748b',
              textAlign: 'center',
              marginTop: '18px',
              lineHeight: '1.4'
            }}>
              By continuing, you agree to our{' '}
              <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Privacy Policy</a>
            </p>
          </div>

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
            <button
              onClick={handleDemoLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                textDecoration: 'underline',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
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
        }
        
        /* Ensure full width coverage */
        div[style*="width: 100vw"] {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Large Desktop Screens (≥1440px) */
        @media (min-width: 1440px) {
          div[style*="padding: 80px 120px"] {
            padding: 100px 140px !important;
          }
          
          div[style*="max-width: 600px"] {
            max-width: 700px !important;
          }
          
          h1[style*="font-size: 3.5rem"] {
            font-size: 4rem !important;
          }
          
          h1[style*="font-size: 3rem"] {
            font-size: 3.5rem !important;
          }
        }
        
        /* Extra Large Screens (≥1920px) */
        @media (min-width: 1920px) {
          div[style*="padding: 80px 120px"] {
            padding: 120px 160px !important;
          }
          
          div[style*="max-width: 600px"] {
            max-width: 800px !important;
          }
          
          h1[style*="font-size: 3.5rem"] {
            font-size: 4.5rem !important;
          }
          
          h1[style*="font-size: 3rem"] {
            font-size: 4rem !important;
          }
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          div[style*="display: flex"] {
            flex-direction: column !important;
          }
          
          div[style*="flex: 1"] {
            flex: none !important;
            min-height: auto !important;
          }
          
          div[style*="padding: 80px 120px"] {
            padding: 40px 20px !important;
          }
          
          h1[style*="font-size: 3.5rem"] {
            font-size: 2rem !important;
          }
          
          h1[style*="font-size: 3rem"] {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default SplitLogin;
