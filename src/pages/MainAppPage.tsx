import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useCallback } from 'react'
import { FlexibleNavbar } from '../components/navbar'
import { YearsField } from '../components/common/Years'
import { MonthlyRentField } from '../components/rent/MonthlyRent'
import { RentIncreaseField } from '../components/rent/RentIncrease'
import { MonthlyRentTable, MonthlyRentData } from '../components/rent/MonthlyRentTable'
import { MonthlyRentGraph } from '../components/rent/MonthlyRentGraph'
import { CompactThemeToggle } from '../components/theme'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel'

export const MainAppPage: React.FC = () => {
    const [inputSectionOpen, setInputSectionOpen] = useState(true)
    const [resultsSectionOpen, setResultsSectionOpen] = useState(false)
    const [monthlyRent, setMonthlyRent] = useState<number | ''>('')
    const [rentIncrease, setRentIncrease] = useState<number | ''>(2.5)
    const [analysisYears, setAnalysisYears] = useState<number>(30)
    const [rentData, setRentData] = useState<MonthlyRentData | null>(null)

    // Callback to receive calculated rent data from MonthlyRentTable
    const handleRentDataCalculated = useCallback((data: MonthlyRentData) => {
        setRentData(data)
    }, [])

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
                                {/* Common field for both rent and buy - Analysis Period */}
                                <div className="mb-4">
                                    <YearsField
                                        value={analysisYears}
                                        onChange={setAnalysisYears}
                                        enableValidation={true}
                                        validationMode="optional"
                                    />
                                </div>
                                
                                <Tabs defaultValue="rent" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="rent">Rental Information</TabsTrigger>
                                        <TabsTrigger value="buy">Purchase Information</TabsTrigger>
                                    </TabsList>

                                    {/* Rental Information Tab */}
                                    <TabsContent value="rent" className="mt-0">
                                        <div className="grid gap-3 sm:gap-4">
                                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                                <MonthlyRentField
                                                    value={monthlyRent}
                                                    onChange={setMonthlyRent}
                                                    enableValidation={true}
                                                    validationMode="optional"
                                                />
                                                <RentIncreaseField
                                                    value={rentIncrease}
                                                    onChange={setRentIncrease}
                                                    enableValidation={true}
                                                    validationMode="optional"
                                                />
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
                                <Tabs defaultValue="rent" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-4">
                                        <TabsTrigger value="rent">If you rent</TabsTrigger>
                                        <TabsTrigger value="buy">If you buy</TabsTrigger>
                                        <TabsTrigger value="comparison">Comparison</TabsTrigger>
                                    </TabsList>

                                    {/* If you rent Tab */}
                                    <TabsContent value="rent" className="mt-0">
                                        <div className="grid gap-3 sm:gap-4">
                                            {/* Tables Card with Carousel */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Tables</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Carousel className="w-full max-w-full">
                                                        <CarouselContent>
                                                            <CarouselItem>
                                                                <MonthlyRentTable
                                                                    monthlyRent={typeof monthlyRent === 'number' ? monthlyRent : 0}
                                                                    analysisYears={analysisYears}
                                                                    annualRentIncrease={typeof rentIncrease === 'number' ? rentIncrease : 0}
                                                                    onDataCalculated={handleRentDataCalculated}
                                                                />
                                                            </CarouselItem>
                                                        </CarouselContent>
                                                        <CarouselPrevious />
                                                        <CarouselNext />
                                                    </Carousel>
                                                </CardContent>
                                            </Card>

                                            {/* Graphs Card with Carousel */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Graphs</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <Carousel className="w-full max-w-full">
                                                        <CarouselContent>
                                                            <CarouselItem>
                                                                <MonthlyRentGraph data={rentData} />
                                                            </CarouselItem>
                                                        </CarouselContent>
                                                        <CarouselPrevious />
                                                        <CarouselNext />
                                                    </Carousel>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    {/* If you buy Tab */}
                                    <TabsContent value="buy" className="mt-0">
                                        <div className="grid gap-3 sm:gap-4">
                                            <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground text-center">Buy Analysis<br />Coming Soon</span>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Comparison Tab */}
                                    <TabsContent value="comparison" className="mt-0">
                                        <div className="grid gap-3 sm:gap-4">
                                            <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                                <span className="text-xs sm:text-sm text-muted-foreground text-center">Comparison<br />Coming Soon</span>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CollapsibleContent>
                        </Collapsible>
                    </CardContent>
                </Card>

            </main>
        </div>
    )
}

export default MainAppPage;