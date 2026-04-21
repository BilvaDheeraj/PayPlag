import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { SmoothScrollProvider } from './providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Pay&Plag — Check It. Pay It. Trust It.',
  description: 'The world\'s most trusted content intelligence platform. Plagiarism detection, AI content detection, and paraphrasing — ₹19 per use, no subscriptions.',
  keywords: ['plagiarism checker', 'AI detector', 'paraphraser', 'content intelligence', 'payplag'],
  authors: [{ name: 'Pay&Plag' }],
  openGraph: {
    title: 'Pay&Plag — Check It. Pay It. Trust It.',
    description: 'Plagiarism. AI Detection. Paraphrasing. ₹19 flat. No subscriptions.',
    url: 'https://payplag.in',
    siteName: 'Pay&Plag',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pay&Plag — ₹19 per check. No subscriptions.',
    description: 'Plagiarism. AI Detection. Paraphrasing. Check once. Pay ₹19. Trust the result.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
