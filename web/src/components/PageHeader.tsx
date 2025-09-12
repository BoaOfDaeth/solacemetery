interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export default function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative flex flex-col items-center justify-center py-8 px-4 sm:py-12">
        <div className="text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground mb-2 font-medium">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
