import { calculateMonthlyRentData, MonthlyRentData } from '@/services/MonthlyRentCalculator'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { YearsField } from '../common/Years'
import { FlexibleNavbar } from '../navbar'
import { MonthlyRentGraph } from '../outputs/rent/MonthlyRentGraph'
import { MonthlyRentTable } from '../outputs/rent/MonthlyRentTable'
import { CompactThemeToggle } from '../theme'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { BuyAnalysis, ComparisonAnalysis, InvestmentInformation, PurchaseInformation, RentalInformation, RentAnalysis } from './1'

export const Situation1: React.FC = () => {
    const defaultAnalysisYears = 25
    const minAnalysisYears = 1
    const maxAnalysisYears = 50

    const defaultMonthlyRent = 0
    const minMonthlyRent = 0
    const maxMonthlyRent = 10000

    const defaultRentIncrease = 2.5
    const minRentIncrease = 0
    const maxRentIncrease = 20

    const defaultInvestmentReturn = 7.5

    const defaultPurchasePrice = 0
    const minPurchasePrice = 0
    const maxPurchasePrice = 5000000

    const defaultDownPaymentPercentage = 20
    const minDownPaymentPercentage = 0
    const maxDownPaymentPercentage = 100

    const defaultMortgageRate = 5.5
    const minMortgageRate = 0
    const maxMortgageRate = 15

    const defaultMortgageLength = 25
    const minMortgageLength = 1
    const maxMortgageLength = 40

    const defaultPropertyTaxPercentage = 0.75
    const minPropertyTaxPercentage = 0
    const maxPropertyTaxPercentage = 5.0

    const defaultMaintenancePercentage = 2.0
    const minMaintenancePercentage = 0
    const maxMaintenancePercentage = 10

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

            <Accordion type="single" collapsible className="w-full">
                {/* Rental Information Accordion Item */}
                <AccordionItem value="rent">
                    <AccordionTrigger>Rental Information</AccordionTrigger>
                    <AccordionContent>
                        <RentalInformation
                            monthlyRent={monthlyRent}
                            setMonthlyRent={setMonthlyRent}
                            defaultMonthlyRent={defaultMonthlyRent}
                            minMonthlyRent={minMonthlyRent}
                            maxMonthlyRent={maxMonthlyRent}
                            rentIncrease={rentIncrease}
                            setRentIncrease={setRentIncrease}
                            defaultRentIncrease={defaultRentIncrease}
                            minRentIncrease={minRentIncrease}
                            maxRentIncrease={maxRentIncrease}
                        />
                    </AccordionContent>
                </AccordionItem>

                {/* Purchase Information Accordion Item */}
                <AccordionItem value="buy">
                    <AccordionTrigger>Purchase Information</AccordionTrigger>
                    <AccordionContent>
                        <PurchaseInformation
                            purchasePrice={purchasePrice}
                            setPurchasePrice={setPurchasePrice}
                            defaultPurchasePrice={defaultPurchasePrice}
                            minPurchasePrice={minPurchasePrice}
                            maxPurchasePrice={maxPurchasePrice}
                            downPaymentPercentage={downPaymentPercentage}
                            setDownPaymentPercentage={setDownPaymentPercentage}
                            downPaymentAmount={downPaymentAmount}
                            setDownPaymentAmount={setDownPaymentAmount}
                            downPaymentMode={downPaymentMode}
                            setDownPaymentMode={setDownPaymentMode}
                            defaultDownPaymentPercentage={defaultDownPaymentPercentage}
                            minDownPaymentPercentage={minDownPaymentPercentage}
                            maxDownPaymentPercentage={maxDownPaymentPercentage}
                            mortgageRate={mortgageRate}
                            setMortgageRate={setMortgageRate}
                            defaultMortgageRate={defaultMortgageRate}
                            minMortgageRate={minMortgageRate}
                            maxMortgageRate={maxMortgageRate}
                            mortgageLength={mortgageLength}
                            setMortgageLength={setMortgageLength}
                            defaultMortgageLength={defaultMortgageLength}
                            minMortgageLength={minMortgageLength}
                            maxMortgageLength={maxMortgageLength}
                            propertyTaxPercentage={propertyTaxPercentage}
                            setPropertyTaxPercentage={setPropertyTaxPercentage}
                            propertyTaxAmount={propertyTaxAmount}
                            setPropertyTaxAmount={setPropertyTaxAmount}
                            propertyTaxMode={propertyTaxMode}
                            setPropertyTaxMode={setPropertyTaxMode}
                            defaultPropertyTaxPercentage={defaultPropertyTaxPercentage}
                            minPropertyTaxPercentage={minPropertyTaxPercentage}
                            maxPropertyTaxPercentage={maxPropertyTaxPercentage}
                            maintenancePercentage={maintenancePercentage}
                            setMaintenancePercentage={setMaintenancePercentage}
                            maintenanceAmount={maintenanceAmount}
                            setMaintenanceAmount={setMaintenanceAmount}
                            maintenanceMode={maintenanceMode}
                            setMaintenanceMode={setMaintenanceMode}
                            defaultMaintenancePercentage={defaultMaintenancePercentage}
                            minMaintenancePercentage={minMaintenancePercentage}
                            maxMaintenancePercentage={maxMaintenancePercentage}
                        />
                    </AccordionContent>
                </AccordionItem>

                {/* Investment Information Accordion Item */}
                <AccordionItem value="invest">
                    <AccordionTrigger>Investment Information</AccordionTrigger>
                    <AccordionContent>
                        <InvestmentInformation
                            investmentReturn={investmentReturn}
                            setInvestmentReturn={setInvestmentReturn}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )

    // Property Information Card Component
    const propertyInformationCard = (
        <Card className="w-full">
            <Collapsible open={inputSectionOpen} onOpenChange={setInputSectionOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="px-4 sm:px-6 py-4 sm:py-6 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex-1">
                                <CardTitle className="text-xl sm:text-2xl">Property & Financial Information</CardTitle>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    (Placeholder)
                                </p>
                            </div>
                            {inputSectionOpen ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                            )}
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="px-4 sm:px-6 pb-6">
                        {inputSectionContent}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )

    // Results Section Content
    const resultsSectionContent = (
        <Accordion type="single" collapsible className="w-full">
            {/* Rent Analysis Accordion Item */}
            <AccordionItem value="rent">
                <AccordionTrigger>If you rent</AccordionTrigger>
                <AccordionContent>
                    <RentAnalysis
                        rentData={rentData}
                        setTableDialogOpen={setTableDialogOpen}
                        setGraphDialogOpen={setGraphDialogOpen}
                    />
                </AccordionContent>
            </AccordionItem>

            {/* Buy Analysis Accordion Item */}
            <AccordionItem value="buy">
                <AccordionTrigger>If you buy</AccordionTrigger>
                <AccordionContent>
                    <BuyAnalysis />
                </AccordionContent>
            </AccordionItem>

            {/* Comparison Accordion Item */}
            <AccordionItem value="comparison">
                <AccordionTrigger>Comparison</AccordionTrigger>
                <AccordionContent>
                    <ComparisonAnalysis />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )

    // Decision Analysis Card Component
    const decisionAnalysisCard = (
        <Card className="w-full">
            <Collapsible open={resultsSectionOpen} onOpenChange={setResultsSectionOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="px-4 sm:px-6 py-4 sm:py-6 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex-1">
                                <CardTitle className="text-xl sm:text-2xl">Decision Analysis & Insights</CardTitle>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Personalized recommendations, cost comparisons, and financial projections:
                                </p>
                            </div>
                            {resultsSectionOpen ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
                            )}
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="px-4 sm:px-6 pb-6">
                        {resultsSectionContent}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
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

export default Situation1;
