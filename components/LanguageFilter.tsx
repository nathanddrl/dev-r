"use client";

interface LanguageFilterProps {
  languages: string[];
  selected: string | null;
  onChange: (lang: string | null) => void;
}

const baseStyle: React.CSSProperties = {
  borderRadius: "9999px",
  padding: "4px 12px",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  transition: "opacity 0.15s",
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    ...baseStyle,
    background: active ? "var(--color-accent, #D97B4F)" : "var(--color-accent-light, #F5EBD8)",
    color: active ? "#ffffff" : "var(--color-accent-dark, #8B5E2B)",
  };
}

export function LanguageFilter({ languages, selected, onChange }: LanguageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button style={pillStyle(selected === null)} onClick={() => onChange(null)}>
        Tous
      </button>
      {languages.map((lang) => (
        <button
          key={lang}
          style={pillStyle(selected === lang)}
          onClick={() => onChange(selected === lang ? null : lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
