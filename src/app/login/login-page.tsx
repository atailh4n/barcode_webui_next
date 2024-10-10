'use client';
import React, { useState } from 'react';

const BarcodeReaderLogo = () => (
  <h1 className='text-2xl font-bold mb-4'>EaseBarkod</h1>
);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Giriş başarısız.');
      }

      const data = await response.json();
      console.log('Giriş onaylandı. Yönlendiriliyor...', data);
      // Here you would typically store the user's session/token
      // and redirect to a dashboard or home page
      if (data.token) {
        document.cookie = `session_token=${data.token}; path=/; max-age=3600`; // 1 saat geçerli
      }
    } catch (err) {
      console.error(err);
      setError('Kullanıcı adı ya da şifreniz yanlış.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <BarcodeReaderLogo />
        <h1 className='text-2xl font-bold mb-4'>Giriş Yap</h1>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Kullanıcı Adı
            :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Şifre:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Bekleyin...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}