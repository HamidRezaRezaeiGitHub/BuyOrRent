import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { FlexibleNavbar } from '../components/navbar'
import { CompactThemeToggle } from '../components/theme'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

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

            {/* Mobile-optimized main content with multiple cards */}
            <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">

                {/* Welcome Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome to BuyOrRent</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        Analyze properties and make informed decisions
                    </p>
                </div>

                {/* Property & Financial Information Card with Tabs */}
                <Card className="w-full">
                    <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                        <CardTitle className="text-xl sm:text-2xl">Property & Financial Information</CardTitle>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            (Placeholder)
                        </p>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-6">
                        <Collapsible open={inputSectionOpen} onOpenChange={setInputSectionOpen}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-between mb-4"
                                >
                                    <span className="text-sm sm:text-base font-medium">
                                        {inputSectionOpen ? 'Hide' : 'Show'}
                                    </span>
                                    {inputSectionOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <Tabs defaultValue="rent" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="rent">Rental Information</TabsTrigger>
                                        <TabsTrigger value="buy">Purchase Information</TabsTrigger>
                                    </TabsList>

                                    {/* Rental Information Tab */}
                                    <TabsContent value="rent" className="mt-0">
                                        <div className="grid gap-3 sm:gap-4">
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Monthly Rent Amount</span>
                                            </div>
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Security Deposit</span>
                                            </div>
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Utilities & Additional Costs</span>
                                            </div>
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Lease Duration</span>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Buy House/Condo Tab */}
                                    <TabsContent value="buy" className="mt-0">
                                        <div className="grid gap-3 sm:gap-4">
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Property Purchase Price</span>
                                            </div>
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Down Payment Amount</span>
                                            </div>
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Mortgage Interest Rate</span>
                                            </div>
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Property Taxes & HOA</span>
                                            </div>
                                            <div className="h-10 sm:h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground">Maintenance & Insurance</span>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CollapsibleContent>
                        </Collapsible>
                    </CardContent>
                </Card>

                {/* Decision Analysis & Insights Card */}
                <Card className="w-full">
                    <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                        <CardTitle className="text-xl sm:text-2xl">Decision Analysis & Insights</CardTitle>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Personalized recommendations, cost comparisons, and financial projections:
                        </p>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-6">
                        {/* Analysis Results */}
                        <Collapsible open={resultsSectionOpen} onOpenChange={setResultsSectionOpen}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-between mb-4"
                                >
                                    <span className="text-sm sm:text-base font-medium">
                                        {resultsSectionOpen ? 'Hide' : 'Show'}
                                    </span>
                                    {resultsSectionOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
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
                            </CollapsibleContent>
                        </Collapsible>
                    </CardContent>
                </Card>

            </main>
        </div>
    )
}

export default MainAppPage;