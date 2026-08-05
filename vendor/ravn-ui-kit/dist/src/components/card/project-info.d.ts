export interface ProjectInfoProps {
    /** Task/project title. Grows to fill the row and truncates to a single line. */
    title: string;
    /**
     * Optional trailing 24×24 icon (Figma "Icon Placeholder" slot). Should use `currentColor`
     * for its fill/stroke — the slot always renders it in neutral.2, matching every captured
     * instance (the icon glyph itself is never legible/labeled in the export).
     */
    icon?: React.ReactNode;
    /** Additional class names, merged last via `cn()` so they can override defaults. */
    className?: string;
}
/**
 * ProjectInfo
 *
 * Figma: "Project Info" COMPONENT (Cards00.md/Cards01.md, also recurring inside
 * "Task Column03.md"). A single row: title text (flex-grow, truncates) + an optional
 * trailing 24×24 icon. Every real instance across both files shares this exact shape —
 * there is no name/description/status-badge/progress-bar variant anywhere in spec (that
 * was a prior fabrication with zero ground-truth basis and zero consumers).
 */
export declare function ProjectInfo({ title, icon, className }: ProjectInfoProps): import("react").JSX.Element;
