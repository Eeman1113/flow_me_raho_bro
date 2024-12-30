import './globals.css'

export const metadata = {
  title: 'Flow Me Raho Bro - Novel Sentiment Analysis',
  description: 'Analyze the sentiment of novels sentence by sentence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="dark:bg-gray-900">{children}</body>
    </html>
  )
}