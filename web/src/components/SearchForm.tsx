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
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
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
          placeholder="Search characters or mobs..."
          className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-base bg-background border border-input rounded-md sm:rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 hover:border-ring/50"
        />
        
        {/* Focus ring effect */}
        <div className="absolute inset-0 rounded-md sm:rounded-lg ring-0 ring-ring/20 group-focus-within:ring-1 sm:group-focus-within:ring-2 transition-all duration-200 pointer-events-none" />
      </div>
    </form>
  );
}
