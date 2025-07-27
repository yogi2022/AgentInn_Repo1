import { cn } from "@/lib/utils";

export const Logo = () => (
  <div className="flex items-center gap-2">
    <div
      className={cn(
        "flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        "group-data-[state=collapsed]/sidebar-wrapper:size-8"
      )}
    >
      <span className="text-lg font-bold font-headline">S</span>
    </div>
    <div className="flex flex-col group-data-[state=collapsed]/sidebar-wrapper:hidden">
      <span className="text-lg font-bold tracking-tighter font-headline text-foreground">
        SahayakAI
      </span>
    </div>
  </div>
);
