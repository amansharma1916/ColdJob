export function PageHeader({ title, subtitle, action, breadcrumb }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 md:mb-6">
      <div>
        {breadcrumb && (
          <nav className="text-xs text-gray-500 mb-1">{breadcrumb}</nav>
        )}
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 mt-2 sm:mt-0 ml-0 sm:ml-4 shrink-0">{action}</div>}
    </div>
  );
}
