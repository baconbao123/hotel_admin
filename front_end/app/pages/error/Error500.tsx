import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center "  style={{ background: 'radial-gradient(36.28% 150.93% at 50% 50%, #3B8AFF 0%, #0048B2 100%)' }}>
      <div className="relative w-full max-w-xl px-4">
        {/* Circular Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full border-2 border-blue-400 opacity-20
                ${i === 0 ? 'w-[200px] h-[200px]' : ''}
                ${i === 1 ? 'w-[300px] h-[300px]' : ''}
                ${i === 2 ? 'w-[400px] h-[400px]' : ''}
                ${i === 3 ? 'w-[500px] h-[500px]' : ''}
                ${i === 4 ? 'w-[600px] h-[600px]' : ''}
                ${i === 5 ? 'w-[700px] h-[700px]' : ''}
                ${i === 6 ? 'w-[800px] h-[800px]' : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center">
          <h1 className="text-[120px] font-bold text-white leading-none">
            500
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Oops! This Page is Not Working.
          </h2>
          <p className="text-blue-200 mb-8">
           The requested is Internal Server Error.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-2 bg-white text-blue-600 rounded-lg 
              font-medium transition-all hover:bg-blue-50 hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}