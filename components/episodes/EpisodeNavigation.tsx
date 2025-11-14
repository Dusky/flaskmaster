import { cn } from "@/lib/utils";

interface Section {
  id: number;
  label: string;
  type: string;
  taskNumber?: number;
}

interface EpisodeNavigationProps {
  sections: Section[];
  currentSection: number;
  onSectionChange: (sectionId: number) => void;
  completedSections: number;
}

export function EpisodeNavigation({
  sections,
  currentSection,
  onSectionChange,
  completedSections,
}: EpisodeNavigationProps) {
  return (
    <div className="bg-surface rounded-card border border-white/10 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {sections.map((section, index) => {
          const isActive = currentSection === section.id;
          const isCompleted = section.id < completedSections;
          const isUpcoming = section.id > currentSection;

          return (
            <div key={section.id} className="flex items-center gap-2">
              <button
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-200",
                  isActive &&
                    "bg-gold text-background border-gold shadow-[0_0_12px_rgba(244,162,97,0.4)]",
                  isCompleted &&
                    !isActive &&
                    "bg-success/20 text-success border-success/30 hover:bg-success/30",
                  isUpcoming &&
                    "bg-surface text-text-secondary border-white/10 hover:border-white/20"
                )}
              >
                <span className="mr-2">
                  {isCompleted && !isActive ? "✓" : isUpcoming ? "○" : "●"}
                </span>
                {section.label}
              </button>

              {index < sections.length - 1 && (
                <span className="text-text-secondary">→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
