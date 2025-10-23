// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ComparisonAnalysisProps {
    // Future: will receive both rent and mortgage data for comparison
}

export const ComparisonAnalysis: React.FC<ComparisonAnalysisProps> = () => {
    return (
        <div className="grid gap-3 sm:gap-4">
            <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <span className="text-xs sm:text-sm text-muted-foreground text-center">Rent vs Buy Comparison<br />Coming Soon</span>
            </div>
        </div>
    )
}