import { Icon } from '@iconify/react';

export default function Footer() {

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* GitHub Link */}
          <a
            href="https://github.com/BoaOfDaeth/solacemetery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            title="View source code on GitHub"
          >
            <Icon icon="tabler:brand-github" className="w-5 h-5" />
            <span className="text-sm">GitHub</span>
          </a>
          
        </div>
      </div>
    </footer>
  );
}
