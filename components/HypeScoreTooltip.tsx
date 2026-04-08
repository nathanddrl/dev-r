import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HypeScoreTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Explication du HypeScore"
        >
          ℹ️
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          <p className="font-medium mb-1">Score calculé depuis :</p>
          <ul className="space-y-1 list-none">
            <li>
              • <span className="font-medium">GitHub</span> : (stars × 0.6 +
              forks × 0.4) normalisé /100 — poids 60%
            </li>
            <li>
              • <span className="font-medium">Dev.to</span> : réactions des
              articles liés, normalisé /100 — poids 40%
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
