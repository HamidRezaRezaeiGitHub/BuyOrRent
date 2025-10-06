import { ChevronDown, ChevronUp, Maximize2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { YearsField } from '../common/Years'
import { InvestmentAnnualReturnField } from '../inputs/invest/InvestmentAnnualReturn'
import { FlexibleNavbar } from '../navbar'
import { CompactMonthlyRentGraph } from '../outputs/rent/CompactMonthlyRentGraph'
import { CompactMonthlyRentTable } from '../outputs/rent/CompactMonthlyRentTable'
import { MonthlyRentField } from '../inputs/rent/MonthlyRent'
import { MonthlyRentGraph } from '../outputs/rent/MonthlyRentGraph'
import { MonthlyRentTable } from '../outputs/rent/MonthlyRentTable'
import { RentIncreaseField } from '../inputs/rent/RentIncrease'
import { CompactThemeToggle } from '../theme'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { calculateMonthlyRentData, MonthlyRentData } from '@/services/MonthlyRentCalculator'

export const Circumstance1: React.FC = () => {
    const defaultAnalysisYears = 25
    const defaultMonthlyRent = 2500
    const defaultRentIncrease = 2.5

    const [inputSectionOpen, setInputSectionOpen] = useState(true)
    const [resultsSectionOpen, setResultsSectionOpen] = useState(false)
    const [analysisYears, setAnalysisYears] = useState<number>(defaultAnalysisYears)
    const [monthlyRent, setMonthlyRent] = useState<number | ''>(defaultMonthlyRent)
    const [rentIncrease, setRentIncrease] = useState<number>(defaultRentIncrease)
    const [investmentAnnualReturn, setInvestmentAnnualReturn] = useState<number | ''>(7.5)
    const [rentData, setRentData] = useState<MonthlyRentData | null>(null)
    const [tableDialogOpen, setTableDialogOpen] = useState(false)
    const [graphDialogOpen, setGraphDialogOpen] = useState(false)

    // Calculate rent data whenever inputs change
    useEffect(() => {
        const data = calculateMonthlyRentData(
            typeof monthlyRent === 'number' ? monthlyRent : 0,
            analysisYears,
            typeof rentIncrease === 'number' ? rentIncrease : 0
        );
        setRentData(data);
    }, [monthlyRent, analysisYears, rentIncrease]);

    // Monthly Rent Table Component (for dialog display only)
    const monthlyRentTableComponent = (
        <MonthlyRentTable data={rentData} />
    )

    // Navigation Component
    const navigationSection = (
        <FlexibleNavbar
            brandText="BuyOrRent"
            showAuthButtons={false}
            showThemeToggle={true}
            ThemeToggleComponent={CompactThemeToggle}
        />
    )

    // Welcome Header Component
    const welcomeHeader = (
        <div className="text-center py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome to BuyOrRent</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Analyze properties and make informed decisions
            </p>
        </div>
    )

    // Input Section Content
    const inputSectionContent = (
        <>
            {/* Common field for both rent and buy - Analysis Period */}
            <div className="mb-4">
                <YearsField
                    value={analysisYears}
                    onChange={setAnalysisYears}
                    defaultValue={defaultAnalysisYears}
                    minValue={1}
                    maxValue={50}
                />
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue="rent">
                {/* Rental Information Accordion Item */}
                <AccordionItem value="rent">
                    <AccordionTrigger>Rental Information</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <MonthlyRentField
                                value={monthlyRent}
                                onChange={setMonthlyRent}
                                enableValidation={true}
                                validationMode="required"
                                defaultValue={defaultMonthlyRent}
                                minValue={0}
                                maxValue={10000}
                                displayMode='combined'
                            />
                            <RentIncreaseField
                                value={rentIncrease}
                                onChange={setRentIncrease}
                                defaultValue={defaultRentIncrease}
                                minValue={0}
                                maxValue={20}
                                displayMode='combined'
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Purchase Information Accordion Item */}
                <AccordionItem value="buy">
                    <AccordionTrigger>Purchase Information</AccordionTrigger>
                    <AccordionContent>
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
                    </AccordionContent>
                </AccordionItem>

                {/* Investment Information Accordion Item */}
                <AccordionItem value="invest">
                    <AccordionTrigger>Investment Information</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <InvestmentAnnualReturnField
                                value={investmentAnnualReturn}
                                onChange={setInvestmentAnnualReturn}
                                enableValidation={true}
                                validationMode="optional"
                                showHelper={true}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )

    // Property Information Card Component
    const propertyInformationCard = (
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
                        {inputSectionContent}
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    )

    // Tables Carousel Component
    const tablesCarousel = (
        <Card className="w-full max-w-full overflow-hidden">
            <CardHeader className="relative px-3 sm:px-4 py-3 sm:py-4">
                <CardTitle className="text-lg pr-10">Tables</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 h-8 w-8 flex-shrink-0"
                    onClick={() => setTableDialogOpen(true)}
                    aria-label="Expand table"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
                <div className="w-full max-w-full overflow-hidden">
                    <Carousel className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-1 sm:-ml-2">
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="w-full max-w-full overflow-hidden">
                                    <CompactMonthlyRentTable
                                        data={rentData}
                                        maxRows={5}
                                    />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                    <span className="text-xs sm:text-sm text-muted-foreground text-center">Additional Table View<br />Coming Soon</span>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
            </CardContent>
        </Card>
    )

    // Graphs Carousel Component
    const graphsCarousel = (
        <Card className="w-full max-w-full overflow-hidden">
            <CardHeader className="relative px-3 sm:px-4 py-3 sm:py-4">
                <CardTitle className="text-lg pr-10">Graphs</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 h-8 w-8 flex-shrink-0"
                    onClick={() => setGraphDialogOpen(true)}
                    aria-label="Expand graph"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
                <div className="w-full max-w-full overflow-hidden">
                    <Carousel className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-1 sm:-ml-2">
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="w-full max-w-full overflow-hidden">
                                    <CompactMonthlyRentGraph data={rentData} />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                    <span className="text-xs sm:text-sm text-muted-foreground text-center">Additional Graph View<br />Coming Soon</span>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
            </CardContent>
        </Card>
    )

    // Rent Analysis Tab Content
    const rentAnalysisContent = (
        <div className="w-full max-w-full overflow-hidden grid gap-3 sm:gap-4">
            {tablesCarousel}
            {graphsCarousel}
        </div>
    )

    // Buy Analysis Tab Content
    const buyAnalysisContent = (
        <div className="grid gap-3 sm:gap-4">
            <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <span className="text-xs sm:text-sm text-muted-foreground text-center">Buy Analysis<br />Coming Soon</span>
            </div>
        </div>
    )

    // Comparison Tab Content
    const comparisonContent = (
        <div className="grid gap-3 sm:gap-4">
            <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                <span className="text-xs sm:text-sm text-muted-foreground text-center">Comparison<br />Coming Soon</span>
            </div>
        </div>
    )

    // Results Section Content
    const resultsSectionContent = (
        <Accordion type="single" collapsible className="w-full" defaultValue="rent">
            {/* Rent Analysis Accordion Item */}
            <AccordionItem value="rent">
                <AccordionTrigger>If you rent</AccordionTrigger>
                <AccordionContent>
                    {rentAnalysisContent}
                </AccordionContent>
            </AccordionItem>

            {/* Buy Analysis Accordion Item */}
            <AccordionItem value="buy">
                <AccordionTrigger>If you buy</AccordionTrigger>
                <AccordionContent>
                    {buyAnalysisContent}
                </AccordionContent>
            </AccordionItem>

            {/* Comparison Accordion Item */}
            <AccordionItem value="comparison">
                <AccordionTrigger>Comparison</AccordionTrigger>
                <AccordionContent>
                    {comparisonContent}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )

    // Decision Analysis Card Component
    const decisionAnalysisCard = (
        <Card className="w-full">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                <CardTitle className="text-xl sm:text-2xl">Decision Analysis & Insights</CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Personalized recommendations, cost comparisons, and financial projections:
                </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
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
                        {resultsSectionContent}
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    )

    // Table Dialog Component
    const tableDialog = (
        <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Monthly Rent Table - Full View</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                    {monthlyRentTableComponent}
                </div>
            </DialogContent>
        </Dialog>
    )

    // Graph Dialog Component
    const graphDialog = (
        <Dialog open={graphDialogOpen} onOpenChange={setGraphDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Monthly Rent Graph - Full View</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                    <MonthlyRentGraph data={rentData} />
                </div>
            </DialogContent>
        </Dialog>
    )

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            {navigationSection}

            {/* Main Content */}
            <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
                {/* Welcome Header */}
                {welcomeHeader}

                {/* Property & Financial Information */}
                {propertyInformationCard}

                {/* Decision Analysis & Insights */}
                {decisionAnalysisCard}
            </main>

            {/* Dialogs */}
            {tableDialog}
            {graphDialog}
        </div>
    )
}

export default Circumstance1;
