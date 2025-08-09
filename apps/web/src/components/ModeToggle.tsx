"use client";

import { Mode } from '@/lib/types';

// A basic placeholder for the shadcn ToggleGroup.
// In a real project, you would install this via `npx shadcn-ui@latest add toggle-group`
const ToggleGroupPlaceholder = ({ children, onValueChange, value, ...props }: any) => (
  <div className="flex space-x-1 border rounded-md p-1 bg-muted" {...props}>
    {children.map((child: any) => (
      <button
        key={child.props.value}
        onClick={() => onValueChange(child.props.value)}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          value === child.props.value
            ? 'bg-background text-foreground shadow-sm'
            : 'hover:bg-background/50'
        }`}
      >
        {child.props.children}
      </button>
    ))}
  </div>
);

const ToggleGroupItemPlaceholder = ({ children, ...props }: any) => (
  <div {...props}>{children}</div>
);


interface ModeToggleProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <ToggleGroupPlaceholder
      type="single"
      value={currentMode}
      onValueChange={(value: Mode) => {
        if (value) onModeChange(value);
      }}
      aria-label="Discovery Mode"
    >
      <ToggleGroupItemPlaceholder value="NFT" aria-label="NFT Mode">
        NFTs
      </ToggleGroupItemPlaceholder>
      <ToggleGroupItemPlaceholder value="Shopping" aria-label="Shopping Mode">
        Shopping
      </ToggleGroupItemPlaceholder>
      <ToggleGroupItemPlaceholder value="Media" aria-label="Media Mode">
        Media
      </ToggleGroupItemPlaceholder>
    </ToggleGroupPlaceholder>
  );
}