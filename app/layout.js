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
    <html lang="en">
      <head />
      <body
        className="bg-body text-body"
        style={{ '--navH': '64px' }}
      >
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
