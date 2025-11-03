import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 · Page Not Found',
  description: 'The page you\'re looking for doesn\'t exist or has been moved.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <h1 className="text-7xl sm:text-8xl font-bold text-primary mb-4 leading-none">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Gods forsaken it
        </p>
      </div>
    </div>
  );
}
