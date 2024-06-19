export function DashBlock({
  children,
  header,
}: {
  children?: React.ReactNode;
  header?: string;
}) {
  return (
    <div className="flex flex-col rounded-card bg-white px-6 py-8 shadow-lg">
      {header && (
        <h2 className="select-none text-4xl font-medium font-display">
          {header}
        </h2>
      )}
      {children}
    </div>
  );
}
