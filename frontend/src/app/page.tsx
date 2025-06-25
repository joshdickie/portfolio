'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FORCE_NOJS === 'true') {
      window.location.href = '/nojs/index.html';
    }
  }, []);

  return (
    <main>
      <h1>Josh Dickie</h1>
      <p>Modern view here (under construction!) :^)</p>
    </main>
  );
}
