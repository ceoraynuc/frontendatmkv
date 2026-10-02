export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0d1117]">
      {/* Left panel — hidden on mobile/tablet */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-700 dark:bg-[#161b22] relative overflow-hidden flex-col items-center justify-center px-12 pt-12 pb-28 text-center">
        {/* Background circles */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="200" cy="200" r="180" fill="#ffffff" opacity="0.06" />
          <circle cx="200" cy="200" r="130" fill="#ffffff" opacity="0.05" />
        </svg>

        {/* Logo image (aspect ratio 1200:1309) */}
        <div className="relative w-52 xl:w-60 aspect-[1200/1309] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-[#fdecb6]">
          <img
            src="/mkv-hands.png"
            alt="MK Volunteers — two hands reaching towards each other"
            width={1200}
            height={1309}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <div className="relative mt-8">
          <h2 className="text-4xl font-extrabold tracking-wide text-white">
            <span className="text-[#fdeeb7]">MK</span> VOLUNTEERS
          </h2>
          <p className="text-primary-100 text-sm mt-3 max-w-sm mx-auto">
            Free, high-quality education — for every student, regardless of background or location.
          </p>
        </div>

        {/* Tagline at the end */}
        <p className="absolute bottom-10 left-12 right-12 text-[#fdeeb7] text-lg font-semibold tracking-wide">
          We are the agents of positive change
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-10">
        {/* Brand block for mobile/tablet (left panel hidden there) */}
        <div className="lg:hidden flex flex-col items-center text-center mb-4">
          <img
            src="/mkv-hand.ico"
            alt="MK Volunteers"
            width={1200}
            height={1309}
            className="w-16 h-auto rounded-lg shadow-md"
          />
          <h2 className="mt-3 text-xl font-extrabold text-primary-700 dark:text-white">
            <span className="text-[#c9a227]">MK</span> VOLUNTEERS
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We are the agents of positive change
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}