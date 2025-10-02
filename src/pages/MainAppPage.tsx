import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { FlexibleNavbar } from '../components/navbar'
import { CompactThemeToggle } from '../components/theme'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible'

export const MainAppPage: React.FC = () => {
    const [inputSectionOpen, setInputSectionOpen] = useState(true)
    const [resultsSectionOpen, setResultsSectionOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            {/* Flexible Navbar with Compact Theme Toggle */}
            <FlexibleNavbar
                brandText="BuyOrRent"
                showAuthButtons={false}
                showThemeToggle={true}
                ThemeToggleComponent={CompactThemeToggle}
            />

            {/* Mobile-optimized main content */}
            <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
                <Card className="w-full">
                    <CardHeader className="text-center px-4 py-6 sm:px-6 sm:py-8">
                        <CardTitle className="text-2xl sm:text-3xl lg:text-4xl">Welcome to BuyOrRent</CardTitle>
                        <p className="text-sm sm:text-base text-muted-foreground mt-2">
                            Analyze properties and make informed decisions
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                        {/* Upper Section - Input Fields (default open) */}
                        <Collapsible open={inputSectionOpen} onOpenChange={setInputSectionOpen}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-between p-4 sm:p-6 h-auto"
                                >
                                    <span className="text-base sm:text-lg font-semibold">Property Input Fields</span>
                                    {inputSectionOpen ? (
                                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 sm:mt-4">
                                <div className="p-4 sm:p-6 border rounded-lg bg-muted/50">
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Enter property details, financial information, and preferences to analyze your buy vs rent decision.
                                    </p>
                                    {/* Placeholder for future input fields */}
                                    <div className="mt-4 grid gap-3 sm:gap-4">
                                        <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                            <span className="text-xs sm:text-sm text-muted-foreground">Property Price Input</span>
                                        </div>
                                        <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                            <span className="text-xs sm:text-sm text-muted-foreground">Monthly Rent Input</span>
                                        </div>
                                        <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                            <span className="text-xs sm:text-sm text-muted-foreground">Additional Costs Input</span>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {/* Lower Section - Results/Reports/Graphs (default closed) */}
                        <Collapsible open={resultsSectionOpen} onOpenChange={setResultsSectionOpen}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-between p-4 sm:p-6 h-auto"
                                >
                                    <span className="text-base sm:text-lg font-semibold">Financial Analysis & Reports</span>
                                    {resultsSectionOpen ? (
                                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 sm:mt-4">
                                <div className="p-4 sm:p-6 border rounded-lg bg-muted/50">
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                                        View comprehensive analysis results, financial projections, and interactive charts comparing buy vs rent scenarios.
                                    </p>
                                    {/* Placeholder for future analysis results */}
                                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                                        <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                            <span className="text-xs sm:text-sm text-muted-foreground text-center">Cost Comparison<br />Chart</span>
                                        </div>
                                        <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                            <span className="text-xs sm:text-sm text-muted-foreground text-center">ROI Analysis<br />Graph</span>
                                        </div>
                                        <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center sm:col-span-2">
                                            <span className="text-xs sm:text-sm text-muted-foreground text-center">Recommendation Summary</span>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default MainAppPage;