export function AdminComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1
        className="text-2xl font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
      <div
        className="mt-6 rounded-2xl p-10 text-center text-sm"
        style={{
          background: "var(--bg-primary)",
          border: "1px dashed var(--border-default)",
          color: "var(--text-tertiary)",
        }}
      >
        Coming next.
      </div>
    </div>
  );
}
