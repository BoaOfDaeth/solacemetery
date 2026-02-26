import { getDataCutoffDate, getBuildDate } from '@/lib/utils';

export default function Footer() {
  // Calculate timestamp once on server side
  const cutoffDate = getDataCutoffDate();
  const formattedDate = cutoffDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    hour12: false,
  }).replace(/,/g, '');
  
  // Get build date
  const buildDate = getBuildDate();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {/* GitHub Link */}
            <div className="w-5 h-5 flex-shrink-0">
              <a
                href="https://github.com/BoaOfDaeth/solacemetery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 block"
                title="View source code on GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            {/* Discord Link */}
            <div className="w-5 h-5 flex-shrink-0">
              <a
                href="https://discord.gg/tt2Km8vFHa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 block"
                title="Join our Discord"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.369a19.91 19.91 0 00-4.885-1.515.07.07 0 00-.073.035c-.211.375-.444.864-.608 1.249a18.27 18.27 0 00-5.4 0 12.57 12.57 0 00-.617-1.249.074.074 0 00-.073-.035 19.874 19.874 0 00-4.885 1.515.066.066 0 00-.032.027C2.1 9.045 1.37 13.58 1.695 18.067a.08.08 0 00.031.056 19.934 19.934 0 006.027 3.03.076.076 0 00.082-.027c.464-.63.878-1.295 1.236-1.994a.076.076 0 00-.041-.105 13.107 13.107 0 01-1.872-.892.075.075 0 01-.008-.125c.126-.094.252-.192.372-.29a.07.07 0 01.074-.01c3.927 1.793 8.18 1.793 12.062 0a.07.07 0 01.074.01c.12.098.246.196.372.29a.075.075 0 01-.006.125 12.299 12.299 0 01-1.873.891.076.076 0 00-.04.106c.37.698.784 1.363 1.236 1.993a.076.076 0 00.082.027 19.88 19.88 0 006.028-3.03.076.076 0 00.03-.055c.5-6.174-.838-10.673-3.548-13.671a.061.061 0 00-.031-.028zM9.681 15.328c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm4.652 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.333-.947 2.419-2.157 2.419z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Data Cutoff Time and Build Date */}
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground">
              Data served as of: {formattedDate}
            </p>
            <p className="text-xs text-muted-foreground">
              Last app build: {buildDate}
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
