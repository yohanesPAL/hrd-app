'use client'

export default function Error({ error }: { error: Error & { status?: number } }) {
  return (
    <div className="p-6 w-100 vh-100 d-flex flex-column align-items-center justify-content-center">
      <h2 className="text-lg font-semibold">
        {error.message}
      </h2>

      <p>Status: {error.status ?? 500}</p>
    </div>
  );
}