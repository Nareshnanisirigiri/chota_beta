import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { loginUser } from '../lib/auth';

interface LoginProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export default function Login({ onLogin, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const auth = await loginUser(email, password);
      localStorage.setItem('chota_beta_token', auth.token);
      localStorage.setItem('chota_beta_user', JSON.stringify(auth.user));
      onLogin();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 24px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Logo Container */}
      <div
        style={{
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <img
          src={logo}
          alt="Chota Beta Logo"
          style={{
            height: '70px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Login Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '15px',
          boxShadow: '0 5px 30px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          border: '1px solid #eaedf0',
          boxSizing: 'border-box'
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: '40px',
            marginTop: 0
          }}
        >
          Login to your account
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '10px 15px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
              border: '1px solid #fca5a5'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#4b5563',
                marginBottom: '8px'
              }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '14px',
                color: '#1f2937'
              }}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#4b5563'
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#0062cc',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                I forgot password
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                  color: '#1f2937'
                }}
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label
              htmlFor="remember"
              style={{
                fontSize: '14px',
                color: '#4b5563',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Remember me on this device
            </label>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#60a5fa' : '#007bff',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: 600,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              marginTop: '4px',
              boxShadow: '0 4px 6px -1px rgba(0, 123, 255, 0.2)',
              transition: 'all 0.2s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}
                />
                Logging in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
