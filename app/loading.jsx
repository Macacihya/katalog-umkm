export default function Loading() {
  return (
    <div className="flex flex-col gap-8 py-10 animate-pulse">
      {/* Store Header Skeleton */}
      <section className="py-2">
        <div className="h-10 w-64 rounded-xl bg-permukaan"></div>
        <div className="mt-3 h-5 w-80 rounded-lg bg-permukaan"></div>
        <div className="mt-4 h-4 w-40 rounded-lg bg-permukaan"></div>
      </section>

      {/* Filter Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-11 flex-1 rounded-xl bg-permukaan"></div>
          <div className="h-9 w-36 rounded-xl bg-permukaan"></div>
        </div>
        <div className="flex gap-2 overflow-hidden">
          <div className="h-8 w-16 rounded-full bg-permukaan"></div>
          <div className="h-8 w-24 rounded-full bg-permukaan"></div>
          <div className="h-8 w-24 rounded-full bg-permukaan"></div>
          <div className="h-8 w-24 rounded-full bg-permukaan"></div>
        </div>
      </div>

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
          >
            <div className="aspect-square w-full bg-permukaan"></div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="h-3 w-16 rounded bg-permukaan"></div>
              <div className="h-4 w-3/4 rounded bg-permukaan"></div>
              <div className="mt-auto h-5 w-20 rounded bg-permukaan"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
