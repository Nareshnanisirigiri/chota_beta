import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { requestPasswordReset } from '../lib/auth';

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setMessage(`Password reset request accepted for ${email}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to process request');
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

      {/* Forgot Password Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '15px',
          boxShadow: '0 5px 30px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '480px',
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
          Forgot your password?
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}
        >
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '10px 15px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
              border: '1px solid #86efac'
            }}
          >
            {message}
          </div>
        )}

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

          {/* Send button */}
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
              boxShadow: '0 4px 6px -1px rgba(0, 123, 255, 0.2)'
            }}
          >
            {isLoading ? 'Sending...' : 'Send password reset link'}
          </button>

          {/* Back link */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Remember your password?{' '}
            </span>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: '#007bff',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
