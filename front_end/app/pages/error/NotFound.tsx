import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600" style={{ background: 'radial-gradient(circle at center, #3B8AFF 0%, #0048B2 100%)' }}>
      <div className="relative w-full max-w-xl px-4">
        {/* Circular Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full border border-white/20 ${
                `w-[${(i + 2) * 100}px] h-[${(i + 2) * 100}px]`
              }`}
              style={{
                width: `${(i + 2) * 100}px`,
                height: `${(i + 2) * 100}px`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center z-10">
          <h1 className="text-[120px] font-bold text-white leading-none mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Oops! This Page is Not Found.
          </h2>
          <p className="text-blue-100 mb-8">
            The requested page does not exist
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg 
              font-medium transition-all hover:bg-opacity-90 hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}