// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import ScrollProgress from './components/ScrollProgress';

export const metadata = {
  title: 'Biswajit Panda | Full Stack Developer',
  description:
    'Portfolio of Biswajit Panda - Next.js, React, Node, Express, PostgreSQL, Redux, JWT',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    // Default to dark. suppressHydrationWarning avoids mismatch if JS flips it on mount.
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="bg-body text-body" style={{ '--navH': '64px' }}>
        {/* Apply saved theme (or keep dark) BEFORE the UI renders */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var s = localStorage.getItem('theme');
                  var t = (s === 'light' || s === 'dark') ? s : 'dark';
                  document.documentElement.setAttribute('data-theme', t);
                } catch (e) {}
              })();
            `,
          }}
        />
        
        {/* Global top progress bar */}
        <ScrollProgress />

        {children}
      </body>
    </html>
  );
}
