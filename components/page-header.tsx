export function PageHeader({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="grid gap-1">
      <h1 className="font-medium text-pretty">{title}</h1>
      {meta && <p className="text-faint">{meta}</p>}
      {children}
    </header>
  );
}
