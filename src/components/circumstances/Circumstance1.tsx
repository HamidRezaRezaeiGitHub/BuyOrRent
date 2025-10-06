import { calculateMonthlyRentData, MonthlyRentData } from '@/services/MonthlyRentCalculator'
import { ChevronDown, ChevronUp, Maximize2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { YearsField } from '../common/Years'
import { PercentageAmountSwitch } from '../inputs/PercentageAmountSwitch'
import { MaintenanceAmountField } from '../inputs/buy/MaintenanceAmount'
import { MaintenancePercentageField } from '../inputs/buy/MaintenancePercentage'
import { DownPaymentAmountField } from '../inputs/buy/DownPaymentAmount'
import { DownPaymentPercentageField } from '../inputs/buy/DownPaymentPercentage'
import { MortgageLengthField } from '../inputs/buy/MortgageLength'
import { MortgageRateField } from '../inputs/buy/MortgageRate'
import { PropertyTaxAmountField } from '../inputs/buy/PropertyTaxAmount'
import { PropertyTaxPercentageField } from '../inputs/buy/PropertyTaxPercentage'
import { PurchasePriceField } from '../inputs/buy/PurchasePrice'
import { InvestmentReturnField } from '../inputs/invest/InvestmentReturn'
import { MonthlyRentField } from '../inputs/rent/MonthlyRent'
import { RentIncreaseField } from '../inputs/rent/RentIncrease'
import { FlexibleNavbar } from '../navbar'
import { CompactMonthlyRentGraph } from '../outputs/rent/CompactMonthlyRentGraph'
import { CompactMonthlyRentTable } from '../outputs/rent/CompactMonthlyRentTable'
import { MonthlyRentGraph } from '../outputs/rent/MonthlyRentGraph'
import { MonthlyRentTable } from '../outputs/rent/MonthlyRentTable'
import { CompactThemeToggle } from '../theme'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

export const Circumstance1: React.FC = () => {
    const defaultAnalysisYears = 25
    const minAnalysisYears = 1
    const maxAnalysisYears = 50

    const defaultMonthlyRent = 2500
    const minMonthlyRent = 0
    const maxMonthlyRent = 10000
    
    const defaultRentIncrease = 2.5
    const minRentIncrease = 0
    const maxRentIncrease = 20
    
    const defaultInvestmentReturn = 7.5
    
    const defaultPurchasePrice = 600000
    const minPurchasePrice = 100000
    const maxPurchasePrice = 5000000
    
    const defaultDownPaymentPercentage = 20
    const minDownPaymentPercentage = 0
    const maxDownPaymentPercentage = 100
    // const defaultDownPaymentAmount = defaultDownPaymentPercentage / 100 * purchasePrice
    // const minDownPaymentAmount = minDownPaymentPercentage / 100 * purchasePrice
    // const maxDownPaymentAmount = purchasePrice // Max down payment cannot exceed purchase price

    const defaultMortgageRate = 5.5
    const minMortgageRate = 0
    const maxMortgageRate = 15
    
    const defaultMortgageLength = 25
    const minMortgageLength = 1
    const maxMortgageLength = 40
    
    const defaultPropertyTaxPercentage = 0.75
    const minPropertyTaxPercentage = 0
    const maxPropertyTaxPercentage = 5.0
    // const defaultPropertyTaxAmount = defaultPropertyTaxPercentage / 100 * purchasePrice
    // const minPropertyTaxAmount = minPropertyTaxPercentage / 100 * purchasePrice
    // const maxPropertyTaxAmount = maxPropertyTaxPercentage / 100 * purchasePrice
    
    const defaultMaintenancePercentage = 2.0
    const minMaintenancePercentage = 0
    const maxMaintenancePercentage = 10
    // const defaultMaintenanceAmount = defaultMaintenancePercentage / 100 * purchasePrice
    // const minMaintenanceAmount = minMaintenancePercentage / 100 * purchasePrice
    // const maxMaintenanceAmount = maxMaintenancePercentage / 100 * purchasePrice

    const [inputSectionOpen, setInputSectionOpen] = useState(true)
    const [resultsSectionOpen, setResultsSectionOpen] = useState(false)
    const [analysisYears, setAnalysisYears] = useState<number>(defaultAnalysisYears)
    const [monthlyRent, setMonthlyRent] = useState<number>(defaultMonthlyRent)
    const [rentIncrease, setRentIncrease] = useState<number>(defaultRentIncrease)
    const [investmentReturn, setInvestmentReturn] = useState<number>(defaultInvestmentReturn)
    
    // Buy fields state
    const [purchasePrice, setPurchasePrice] = useState<number>(defaultPurchasePrice)
    const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(defaultDownPaymentPercentage)
    const [downPaymentAmount, setDownPaymentAmount] = useState<number>(defaultDownPaymentPercentage / 100 * purchasePrice)
    const [downPaymentMode, setDownPaymentMode] = useState<'percentage' | 'amount'>('percentage')
    const [mortgageRate, setMortgageRate] = useState<number>(defaultMortgageRate)
    const [mortgageLength, setMortgageLength] = useState<number>(defaultMortgageLength)
    const [propertyTaxPercentage, setPropertyTaxPercentage] = useState<number>(defaultPropertyTaxPercentage)
    const [propertyTaxAmount, setPropertyTaxAmount] = useState<number>(defaultPropertyTaxPercentage / 100 * purchasePrice)
    const [propertyTaxMode, setPropertyTaxMode] = useState<'percentage' | 'amount'>('percentage')
    const [maintenancePercentage, setMaintenancePercentage] = useState<number>(defaultMaintenancePercentage)
    const [maintenanceAmount, setMaintenanceAmount] = useState<number>(defaultMaintenancePercentage / 100 * purchasePrice)
    const [maintenanceMode, setMaintenanceMode] = useState<'percentage' | 'amount'>('percentage')
    
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

    // Buy field components
    const purchasePriceComponent = (
        <PurchasePriceField
            value={purchasePrice}
            onChange={setPurchasePrice}
            defaultValue={defaultPurchasePrice}
            minValue={minPurchasePrice}
            maxValue={maxPurchasePrice}
            displayMode='combined'
        />
    );

    const downPaymentPercentageComponent = (
        <DownPaymentPercentageField
            value={downPaymentPercentage}
            onChange={setDownPaymentPercentage}
            defaultValue={defaultDownPaymentPercentage}
            minValue={minDownPaymentPercentage}
            maxValue={maxDownPaymentPercentage}
            displayMode='combined'
        />
    );

    const downPaymentAmountComponent = (
        <DownPaymentAmountField
            value={downPaymentAmount}
            onChange={setDownPaymentAmount}
            defaultValue={defaultDownPaymentPercentage / 100 * purchasePrice}
            minValue={minDownPaymentPercentage}
            maxValue={purchasePrice} // Max down payment cannot exceed purchase price
            displayMode='combined'
        />
    );

    const downPaymentSwitchComponent = (
        <PercentageAmountSwitch
            label="Down Payment"
            percentageComponent={downPaymentPercentageComponent}
            amountComponent={downPaymentAmountComponent}
            mode={downPaymentMode}
            onModeChange={setDownPaymentMode}
            percentageValue={downPaymentPercentage}
            amountValue={downPaymentAmount}
            onPercentageChange={setDownPaymentPercentage}
            onAmountChange={setDownPaymentAmount}
            totalAmount={purchasePrice}
        />
    );

    const mortgageRateComponent = (
        <MortgageRateField
            value={mortgageRate}
            onChange={setMortgageRate}
            defaultValue={defaultMortgageRate}
            minValue={minMortgageRate}
            maxValue={maxMortgageRate}
            displayMode='combined'
        />
    );

    const mortgageLengthComponent = (
        <MortgageLengthField
            value={mortgageLength}
            onChange={setMortgageLength}
            defaultValue={defaultMortgageLength}
            minValue={minMortgageLength}
            maxValue={maxMortgageLength}
            displayMode='combined'
        />
    );

    const propertyTaxPercentageComponent = (
        <PropertyTaxPercentageField
            value={propertyTaxPercentage}
            onChange={setPropertyTaxPercentage}
            defaultValue={defaultPropertyTaxPercentage}
            minValue={minPropertyTaxPercentage}
            maxValue={maxPropertyTaxPercentage}
            displayMode='combined'
        />
    );

    const propertyTaxAmountComponent = (
        <PropertyTaxAmountField
            value={propertyTaxAmount}
            onChange={setPropertyTaxAmount}
            defaultValue={defaultPropertyTaxPercentage / 100 * purchasePrice}
            minValue={minPropertyTaxPercentage / 100 * purchasePrice}
            maxValue={maxPropertyTaxPercentage / 100 * purchasePrice}
            displayMode='combined'
        />
    );

    const propertyTaxSwitchComponent = (
        <PercentageAmountSwitch
            label="Property Tax"
            percentageComponent={propertyTaxPercentageComponent}
            amountComponent={propertyTaxAmountComponent}
            mode={propertyTaxMode}
            onModeChange={setPropertyTaxMode}
            percentageValue={propertyTaxPercentage}
            amountValue={propertyTaxAmount}
            onPercentageChange={setPropertyTaxPercentage}
            onAmountChange={setPropertyTaxAmount}
            totalAmount={purchasePrice}
        />
    );

    const maintenancePercentageComponent = (
        <MaintenancePercentageField
            value={maintenancePercentage}
            onChange={setMaintenancePercentage}
            defaultValue={defaultMaintenancePercentage}
            minValue={minMaintenancePercentage}
            maxValue={maxMaintenancePercentage}
            displayMode='combined'
        />
    );

    const maintenanceAmountComponent = (
        <MaintenanceAmountField
            value={maintenanceAmount}
            onChange={setMaintenanceAmount}
            defaultValue={defaultMaintenancePercentage / 100 * purchasePrice}
            minValue={minMaintenancePercentage / 100 * purchasePrice}
            maxValue={maxMaintenancePercentage / 100 * purchasePrice}
            displayMode='combined'
        />
    );

    const maintenanceSwitchComponent = (
        <PercentageAmountSwitch
            label="Maintenance"
            percentageComponent={maintenancePercentageComponent}
            amountComponent={maintenanceAmountComponent}
            mode={maintenanceMode}
            onModeChange={setMaintenanceMode}
            percentageValue={maintenancePercentage}
            amountValue={maintenanceAmount}
            onPercentageChange={setMaintenancePercentage}
            onAmountChange={setMaintenanceAmount}
            totalAmount={purchasePrice}
        />
    );

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
                    minValue={minAnalysisYears}
                    maxValue={maxAnalysisYears}
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
                                defaultValue={defaultMonthlyRent}
                                minValue={minMonthlyRent}
                                maxValue={maxMonthlyRent}
                                displayMode='combined'
                            />
                            <RentIncreaseField
                                value={rentIncrease}
                                onChange={setRentIncrease}
                                defaultValue={defaultRentIncrease}
                                minValue={minRentIncrease}
                                maxValue={maxRentIncrease}
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
                            {/* Purchase Price */}
                            {purchasePriceComponent}
                            
                            {/* Down Payment with Percentage/Amount Switch */}
                            {downPaymentSwitchComponent}
                            
                            {/* Mortgage Rate */}
                            {mortgageRateComponent}
                            
                            {/* Mortgage Length */}
                            {mortgageLengthComponent}
                            
                            {/* Property Tax with Percentage/Amount Switch */}
                            {propertyTaxSwitchComponent}
                            
                            {/* Annual Maintenance with Percentage/Amount Switch */}
                            {maintenanceSwitchComponent}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Investment Information Accordion Item */}
                <AccordionItem value="invest">
                    <AccordionTrigger>Investment Information</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <InvestmentReturnField
                                value={investmentReturn}
                                onChange={setInvestmentReturn}
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
        <Card className="w-full max-w-full overflow-x-hidden">
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
                <div className="w-full max-w-full overflow-x-hidden">
                    <Carousel className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-1 sm:-ml-2">
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="w-full max-w-full overflow-x-hidden">
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
        <Card className="w-full max-w-full overflow-x-hidden">
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
                <div className="w-full max-w-full overflow-x-hidden">
                    <Carousel className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-1 sm:-ml-2">
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="w-full max-w-full overflow-x-hidden">
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
        <div className="w-full max-w-full overflow-x-hidden grid gap-3 sm:gap-4">
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
