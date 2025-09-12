import { Icon } from '@iconify/react';
import { getDataCutoffDate } from '@/lib/utils';

export default function Footer() {

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* GitHub Link */}
          <a
            href="https://github.com/BoaOfDaeth/solacemetery"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            title="View source code on GitHub"
          >
            <Icon icon="tabler:brand-github" className="w-5 h-5" />
          </a>
          
          {/* Data Cutoff Time */}
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground">
              Data served as of: {getDataCutoffDate().toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                year: 'numeric',
                hour12: false,
              }).replace(/,/g, '')}
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
