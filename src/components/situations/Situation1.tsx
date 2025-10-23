import { calculateMonthlyRentData, MonthlyRentData } from '@/services/MonthlyRentCalculator'
import { calculateMortgageAmortization, MortgageAmortizationData } from '@/services/MortgageAmortizationCalculator'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { YearsField } from '../common/Years'
import { FlexibleNavbar } from '../navbar'
import { MortgageAmortizationGraph } from '../outputs/mortgage/MortgageAmortizationGraph'
import { MortgageAmortizationTable } from '../outputs/mortgage/MortgageAmortizationTable'
import { MonthlyRentGraph } from '../outputs/rent/MonthlyRentGraph'
import { MonthlyRentTable } from '../outputs/rent/MonthlyRentTable'
import { CompactThemeToggle } from '../theme'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { BuyAnalysis, ComparisonAnalysis, InvestmentInformation, PurchaseInformation, RentalInformation, RentAnalysis } from './1'

export const Situation1: React.FC = () => {
    const [searchParams] = useSearchParams()

    const defaultAnalysisYears = 40
    const minAnalysisYears = 1
    const maxAnalysisYears = 50

    const defaultMonthlyRent = 0
    const minMonthlyRent = 1000
    const maxMonthlyRent = 5000

    const defaultRentIncrease = 2.5
    const minRentIncrease = 0
    const maxRentIncrease = 10

    const defaultInvestmentReturn = 7.5

    const defaultPurchasePrice = 0
    const minPurchasePrice = 400000
    const maxPurchasePrice = 4000000

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

    const defaultAssetAppreciationRate = 3.0
    const minAssetAppreciationRate = -5
    const maxAssetAppreciationRate = 20

    const defaultClosingCostsPercentage = 1.5
    const minClosingCostsPercentage = 0
    const maxClosingCostsPercentage = 5

    const [inputSectionOpen, setInputSectionOpen] = useState(true)
    const [resultsSectionOpen, setResultsSectionOpen] = useState(true)
    const [analysisYears, setAnalysisYears] = useState<number>(defaultAnalysisYears)

    // Initialize monthlyRent and rentIncrease from URL params or use defaults
    const initialMonthlyRent = searchParams.get('monthlyRent')
        ? parseFloat(searchParams.get('monthlyRent')!)
        : defaultMonthlyRent
    const initialRentIncrease = searchParams.get('rentIncrease')
        ? parseFloat(searchParams.get('rentIncrease')!)
        : defaultRentIncrease
    const initialInvestmentReturn = searchParams.get('investmentReturn')
        ? parseFloat(searchParams.get('investmentReturn')!)
        : defaultInvestmentReturn

    const [monthlyRent, setMonthlyRent] = useState<number>(initialMonthlyRent)
    const [rentIncrease, setRentIncrease] = useState<number>(initialRentIncrease)
    const [investmentReturn, setInvestmentReturn] = useState<number>(initialInvestmentReturn)

    // Initialize purchase fields from URL params or use defaults
    const initialPurchasePrice = searchParams.get('purchasePrice')
        ? parseFloat(searchParams.get('purchasePrice')!)
        : defaultPurchasePrice
    const initialDownPaymentPercentage = searchParams.get('downPaymentPercentage')
        ? parseFloat(searchParams.get('downPaymentPercentage')!)
        : defaultDownPaymentPercentage
    const initialMortgageRate = searchParams.get('mortgageRate')
        ? parseFloat(searchParams.get('mortgageRate')!)
        : defaultMortgageRate
    const initialMortgageLength = searchParams.get('mortgageLength')
        ? parseFloat(searchParams.get('mortgageLength')!)
        : defaultMortgageLength
    const initialPropertyTaxPercentage = searchParams.get('propertyTaxPercentage')
        ? parseFloat(searchParams.get('propertyTaxPercentage')!)
        : defaultPropertyTaxPercentage
    const initialMaintenancePercentage = searchParams.get('maintenancePercentage')
        ? parseFloat(searchParams.get('maintenancePercentage')!)
        : defaultMaintenancePercentage
    const initialAssetAppreciationRate = searchParams.get('assetAppreciationRate')
        ? parseFloat(searchParams.get('assetAppreciationRate')!)
        : defaultAssetAppreciationRate
    const initialClosingCostsPercentage = searchParams.get('closingCostsPercentage')
        ? parseFloat(searchParams.get('closingCostsPercentage')!)
        : defaultClosingCostsPercentage

    // Buy fields state
    const [purchasePrice, setPurchasePrice] = useState<number>(initialPurchasePrice)
    const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(initialDownPaymentPercentage)
    const [downPaymentAmount, setDownPaymentAmount] = useState<number>(initialDownPaymentPercentage / 100 * initialPurchasePrice)
    const [downPaymentMode, setDownPaymentMode] = useState<'percentage' | 'amount'>('percentage')
    const [mortgageRate, setMortgageRate] = useState<number>(initialMortgageRate)
    const [mortgageLength, setMortgageLength] = useState<number>(initialMortgageLength)
    const [propertyTaxPercentage, setPropertyTaxPercentage] = useState<number>(initialPropertyTaxPercentage)
    const [propertyTaxAmount, setPropertyTaxAmount] = useState<number>(initialPropertyTaxPercentage / 100 * initialPurchasePrice)
    const [propertyTaxMode, setPropertyTaxMode] = useState<'percentage' | 'amount'>('percentage')
    const [maintenancePercentage, setMaintenancePercentage] = useState<number>(initialMaintenancePercentage)
    const [maintenanceAmount, setMaintenanceAmount] = useState<number>(initialMaintenancePercentage / 100 * initialPurchasePrice)
    const [maintenanceMode, setMaintenanceMode] = useState<'percentage' | 'amount'>('percentage')
    const [assetAppreciationRate, setAssetAppreciationRate] = useState<number>(initialAssetAppreciationRate)
    const [closingCostsPercentage, setClosingCostsPercentage] = useState<number>(initialClosingCostsPercentage)
    const [closingCostsAmount, setClosingCostsAmount] = useState<number>(initialClosingCostsPercentage / 100 * initialPurchasePrice)
    const [closingCostsMode, setClosingCostsMode] = useState<'percentage' | 'amount'>('percentage')

    const [rentData, setRentData] = useState<MonthlyRentData | null>(null)
    const [mortgageData, setMortgageData] = useState<MortgageAmortizationData | null>(null)
    const [rentTableDialogOpen, setRentTableDialogOpen] = useState(false)
    const [rentGraphDialogOpen, setRentGraphDialogOpen] = useState(false)
    const [mortgageTableDialogOpen, setMortgageTableDialogOpen] = useState(false)
    const [mortgageGraphDialogOpen, setMortgageGraphDialogOpen] = useState(false)

    // Calculate rent data whenever inputs change
    useEffect(() => {
        const data = calculateMonthlyRentData(
            typeof monthlyRent === 'number' ? monthlyRent : 0,
            analysisYears,
            typeof rentIncrease === 'number' ? rentIncrease : 0
        );
        setRentData(data);
    }, [monthlyRent, analysisYears, rentIncrease]);

    // Calculate mortgage data whenever inputs change
    useEffect(() => {
        const data = calculateMortgageAmortization(
            typeof purchasePrice === 'number' ? purchasePrice : 0,
            typeof downPaymentPercentage === 'number' ? downPaymentPercentage : 0,
            typeof mortgageRate === 'number' ? mortgageRate : 0,
            typeof mortgageLength === 'number' ? mortgageLength : 0
        );
        setMortgageData(data);
    }, [purchasePrice, downPaymentPercentage, mortgageRate, mortgageLength]);



    // Table Components (for dialog display only)
    const monthlyRentTableComponent = (
        <MonthlyRentTable data={rentData} />
    )

    const mortgageAmortizationTableComponent = (
        <MortgageAmortizationTable data={mortgageData} />
    )

    // Navigation Component
    const navigationSection = (
        <FlexibleNavbar
            showAuthButtons={false}
            showThemeToggle={true}
            ThemeToggleComponent={CompactThemeToggle}
        />
    )

    // Input Section Content
    const inputSectionContent = (
        <>
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
                            assetAppreciationRate={assetAppreciationRate}
                            setAssetAppreciationRate={setAssetAppreciationRate}
                            defaultAssetAppreciationRate={defaultAssetAppreciationRate}
                            minAssetAppreciationRate={minAssetAppreciationRate}
                            maxAssetAppreciationRate={maxAssetAppreciationRate}
                            closingCostsPercentage={closingCostsPercentage}
                            setClosingCostsPercentage={setClosingCostsPercentage}
                            closingCostsAmount={closingCostsAmount}
                            setClosingCostsAmount={setClosingCostsAmount}
                            closingCostsMode={closingCostsMode}
                            setClosingCostsMode={setClosingCostsMode}
                            defaultClosingCostsPercentage={defaultClosingCostsPercentage}
                            minClosingCostsPercentage={minClosingCostsPercentage}
                            maxClosingCostsPercentage={maxClosingCostsPercentage}
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
                                    All the input data about the property and your financial assumptions:
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
        <>
            {/* Analysis Period */}
            {false && <div className="mb-4">
                <YearsField
                    value={analysisYears}
                    onChange={setAnalysisYears}
                    defaultValue={defaultAnalysisYears}
                    minValue={minAnalysisYears}
                    maxValue={maxAnalysisYears}
                />
            </div>}

            <Accordion type="single" collapsible className="w-full">
                {/* Rent Analysis Accordion Item */}
                <AccordionItem value="rent">
                    <AccordionTrigger>If you rent</AccordionTrigger>
                    <AccordionContent>
                        <RentAnalysis
                            rentData={rentData}
                            setTableDialogOpen={setRentTableDialogOpen}
                            setGraphDialogOpen={setRentGraphDialogOpen}
                        />
                    </AccordionContent>
                </AccordionItem>

                {/* Buy Analysis Accordion Item */}
                <AccordionItem value="buy">
                    <AccordionTrigger>If you buy</AccordionTrigger>
                    <AccordionContent>
                        <BuyAnalysis
                            mortgageData={mortgageData}
                            setTableDialogOpen={setMortgageTableDialogOpen}
                            setGraphDialogOpen={setMortgageGraphDialogOpen}
                        />
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
        </>
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

    // Rent Table Dialog Component
    const rentTableDialog = (
        <Dialog open={rentTableDialogOpen} onOpenChange={setRentTableDialogOpen}>
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

    // Rent Graph Dialog Component
    const rentGraphDialog = (
        <Dialog open={rentGraphDialogOpen} onOpenChange={setRentGraphDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl max-h-[90vh] overflow-auto">
                <div className="overflow-x-auto">
                    <MonthlyRentGraph data={rentData} />
                </div>
            </DialogContent>
        </Dialog>
    )

    // Mortgage Table Dialog Component
    const mortgageTableDialog = (
        <Dialog open={mortgageTableDialogOpen} onOpenChange={setMortgageTableDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Mortgage Amortization Table - Full View</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                    {mortgageAmortizationTableComponent}
                </div>
            </DialogContent>
        </Dialog>
    )

    // Mortgage Graph Dialog Component
    const mortgageGraphDialog = (
        <Dialog open={mortgageGraphDialogOpen} onOpenChange={setMortgageGraphDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl max-h-[90vh] overflow-auto">
                <div className="overflow-x-auto">
                    <MortgageAmortizationGraph data={mortgageData} />
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
                {/* Property & Financial Information */}
                {propertyInformationCard}

                {/* Decision Analysis & Insights */}
                {decisionAnalysisCard}
            </main>

            {/* Dialogs */}
            {rentTableDialog}
            {rentGraphDialog}
            {mortgageTableDialog}
            {mortgageGraphDialog}
        </div>
    )
}

export default Situation1;
