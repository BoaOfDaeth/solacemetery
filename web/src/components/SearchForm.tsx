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
      <div className="relative">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          className="pl-4 pr-4 py-2 w-40 sm:w-48 md:w-64 border border-gray-300 text-base bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
          style={{ fontSize: '16px' }} // Prevent zoom on iPhone
        />
      </div>
    </form>
  );
}
