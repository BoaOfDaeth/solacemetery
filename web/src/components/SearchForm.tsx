'use client';

export default function SearchForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          type="text"
          name="search"
          placeholder="Search players, mobs..."
          className="pl-10 pr-4 py-2 w-40 sm:w-48 md:w-64 text-sm bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 hover:border-ring/50"
          style={{ fontSize: '16px' }} // Prevent zoom on iPhone
        />
        
        {/* Focus ring effect */}
        <div className="absolute inset-0 rounded-lg ring-0 ring-ring/20 group-focus-within:ring-2 transition-all duration-200 pointer-events-none" />
      </div>
    </form>
  );
}
