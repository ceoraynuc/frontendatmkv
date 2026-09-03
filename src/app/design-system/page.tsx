export default function DesignSystemPage() {
  const colors = [
    { name: "primary-50", cls: "bg-primary-50" },
    { name: "primary-100", cls: "bg-primary-100" },
    { name: "primary-300", cls: "bg-primary-300" },
    { name: "primary-500", cls: "bg-primary-500" },
    { name: "primary-600", cls: "bg-primary-600" },
    { name: "primary-700", cls: "bg-primary-700" },
    { name: "primary-800", cls: "bg-primary-800" },
    { name: "primary-900", cls: "bg-primary-900" },
    { name: "secondary-50", cls: "bg-secondary-50" },
    { name: "secondary-100", cls: "bg-secondary-100" },
    { name: "secondary-300", cls: "bg-secondary-300" },
    { name: "secondary-500", cls: "bg-secondary-500" },
    { name: "secondary-600", cls: "bg-secondary-600" },
    { name: "secondary-700", cls: "bg-secondary-700" },
    { name: "accent-100", cls: "bg-accent-100" },
    { name: "accent-200", cls: "bg-accent-200" },
    { name: "accent-300", cls: "bg-accent-300" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-primary-700 mb-2">
          MKV Portal — Design System
        </h1>
        <p className="text-gray-500">
          Reference page for colors, typography, and naming conventions.
        </p>
      </div>

      {/* Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Colors</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
          {colors.map((c) => (
            <div key={c.name} className="text-center">
              <div
                className={`${c.cls} h-16 w-full rounded-lg border border-gray-200`}
              />
              <p className="text-xs mt-1 text-gray-600">{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Typography (Figtree)</h2>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">Heading 1 — text-4xl font-bold</h1>
          <h2 className="text-3xl font-bold">Heading 2 — text-3xl font-bold</h2>
          <h3 className="text-2xl font-semibold">Heading 3 — text-2xl font-semibold</h3>
          <h4 className="text-xl font-semibold">Heading 4 — text-xl font-semibold</h4>
          <p className="text-base">Body text — text-base</p>
          <p className="text-sm text-gray-600">Small text — text-sm</p>
        </div>
      </section>

      {/* Buttons preview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">
            Primary
          </button>
          <button className="bg-secondary-600 text-white px-4 py-2 rounded-lg font-medium">
            Secondary
          </button>
          <button className="bg-accent-200 text-primary-800 px-4 py-2 rounded-lg font-medium border border-accent-300">
            Accent
          </button>
        </div>
      </section>

      {/* Naming conventions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Naming Conventions</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Components: PascalCase file names (e.g. <code>Button.tsx</code>)</li>
          <li>Reusable UI pieces: <code>components/ui/</code></li>
          <li>Page-specific components: <code>components/</code> inside the relevant route folder</li>
          <li>Props &amp; functions: camelCase</li>
          <li>Use <code>primary</code> for brand green, <code>secondary</code> for blue, <code>accent</code> for cream</li>
        </ul>
      </section>
    </div>
  );
}