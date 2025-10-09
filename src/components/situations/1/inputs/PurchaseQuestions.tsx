import { DownPaymentPercentageField } from '@/components/inputs/buy/DownPaymentPercentage'
import { MaintenancePercentageField } from '@/components/inputs/buy/MaintenancePercentage'
import { MortgageLengthField } from '@/components/inputs/buy/MortgageLength'
import { MortgageRateField } from '@/components/inputs/buy/MortgageRate'
import { PropertyTaxPercentageField } from '@/components/inputs/buy/PropertyTaxPercentage'
import { PurchasePriceField } from '@/components/inputs/buy/PurchasePrice'
import { FlexibleNavbar } from '@/components/navbar'
import { CompactThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { FC, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export interface PurchaseQuestionsProps {
    previousUrl?: string
    nextUrl?: string
}

export const PurchaseQuestions: FC<PurchaseQuestionsProps> = ({
    previousUrl,
    nextUrl
}) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    
    // Get rent values from URL params (passed from RentQuestions)
    const monthlyRent = searchParams.get('monthlyRent') || '0'
    const rentIncrease = searchParams.get('rentIncrease') || '2.5'
    
    // Default values
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
    
    // State
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1)
    const [purchasePrice, setPurchasePrice] = useState<number>(defaultPurchasePrice)
    const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(defaultDownPaymentPercentage)
    const [mortgageRate, setMortgageRate] = useState<number>(defaultMortgageRate)
    const [mortgageLength, setMortgageLength] = useState<number>(defaultMortgageLength)
    const [propertyTaxPercentage, setPropertyTaxPercentage] = useState<number>(defaultPropertyTaxPercentage)
    const [maintenancePercentage, setMaintenancePercentage] = useState<number>(defaultMaintenancePercentage)
    
    // Navigate to next section with all parameters
    const navigateToNext = () => {
        const params = new URLSearchParams({
            monthlyRent,
            rentIncrease,
            purchasePrice: purchasePrice.toString(),
            downPaymentPercentage: downPaymentPercentage.toString(),
            mortgageRate: mortgageRate.toString(),
            mortgageLength: mortgageLength.toString(),
            propertyTaxPercentage: propertyTaxPercentage.toString(),
            maintenancePercentage: maintenancePercentage.toString()
        })
        if (nextUrl) {
            navigate(`${nextUrl}?${params.toString()}`)
        } else {
            navigate(`/situation/1/question/investment?${params.toString()}`)
        }
    }
    
    // Handler to move to next step
    const handleNext = () => {
        if (step === 1) {
            // Validate that purchase price is entered
            if (purchasePrice > 0) {
                setStep(2) // Go to intermediary question
            }
        } else if (step === 2) {
            setStep(3) // Skip to first with-default question
        } else if (step === 3) {
            setStep(4)
        } else if (step === 4) {
            setStep(5)
        } else if (step === 5) {
            setStep(6)
        } else if (step === 6) {
            setStep(7)
        } else if (step === 7) {
            navigateToNext()
        }
    }
    
    // Handler to use all defaults and skip to next section
    const handleUseAllDefaults = () => {
        setDownPaymentPercentage(defaultDownPaymentPercentage)
        setMortgageRate(defaultMortgageRate)
        setMortgageLength(defaultMortgageLength)
        setPropertyTaxPercentage(defaultPropertyTaxPercentage)
        setMaintenancePercentage(defaultMaintenancePercentage)
        navigateToNext()
    }
    
    // Handler to go to previous step
    const handlePrevious = () => {
        if (step === 2) {
            setStep(1)
        } else if (step === 3) {
            setStep(2)
        } else if (step === 4) {
            setStep(3)
        } else if (step === 5) {
            setStep(4)
        } else if (step === 6) {
            setStep(5)
        } else if (step === 7) {
            setStep(6)
        } else if (step === 1 && previousUrl) {
            navigate(`${previousUrl}?monthlyRent=${monthlyRent}&rentIncrease=${rentIncrease}`)
        }
    }
    
    // Handler to use default value for down payment
    const handleUseDefaultDownPayment = () => {
        setDownPaymentPercentage(defaultDownPaymentPercentage)
        // Automatically proceed to next after setting default
        handleNext()
    }
    
    // Handler to use default value for mortgage rate
    const handleUseDefaultMortgageRate = () => {
        setMortgageRate(defaultMortgageRate)
        // Automatically proceed to next after setting default
        handleNext()
    }
    
    // Handler to use default value for mortgage length
    const handleUseDefaultMortgageLength = () => {
        setMortgageLength(defaultMortgageLength)
        // Automatically proceed to next after setting default
        handleNext()
    }
    
    // Handler to use default value for property tax
    const handleUseDefaultPropertyTax = () => {
        setPropertyTaxPercentage(defaultPropertyTaxPercentage)
        // Automatically proceed to next after setting default
        handleNext()
    }
    
    // Handler to use default value for maintenance
    const handleUseDefaultMaintenance = () => {
        setMaintenancePercentage(defaultMaintenancePercentage)
        // Automatically proceed to next after setting default
        handleNext()
    }
    
    // Define each step JSX separately
    const purchasePriceStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What is the purchase price of the property?</CardTitle>
                <CardDescription>
                    Enter the total price you would pay to purchase the property
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <PurchasePriceField
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                    defaultValue={defaultPurchasePrice}
                    minValue={minPurchasePrice}
                    maxValue={maxPurchasePrice}
                    displayMode="combined"
                    showDescription={true}
                />
                
                <div className="flex justify-between gap-3">
                    {previousUrl && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handlePrevious}
                                        variant="outline"
                                        size="icon"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Previous question</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleNext}
                                    disabled={purchasePrice <= 0}
                                    className={previousUrl ? '' : 'ml-auto'}
                                    size="icon"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Next question</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    )
    
    const defaultsOverviewStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Use Default Values?</CardTitle>
                <CardDescription>
                    We have default values for the remaining purchase-related questions. Would you like to use them or customize each one?
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        The following parameters will be set to these default values:
                    </p>
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Down Payment:</span>
                            <span>{defaultDownPaymentPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Mortgage Rate:</span>
                            <span>{defaultMortgageRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Mortgage Length:</span>
                            <span>{defaultMortgageLength} years</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Property Tax:</span>
                            <span>{defaultPropertyTaxPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Maintenance:</span>
                            <span>{defaultMaintenancePercentage}%</span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                        Don't worry, you'll be able to modify these parameters later if needed.
                    </p>
                </div>
                
                <div className="flex justify-between gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handlePrevious}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Previous question</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleUseAllDefaults}
                                        variant="default"
                                    >
                                        Use all defaults
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Apply default values and skip to next section</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleNext}
                                        size="icon"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Customize values</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
    
    const downPaymentStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What percentage will you put as a down payment?</CardTitle>
                <CardDescription>
                    The percentage of the purchase price you'll pay upfront
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian down payment requirements */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">Canadian Down Payment Requirements</p>
                        <p className="text-muted-foreground">
                            In Canada, the minimum down payment is 5% for properties under $500,000, 
                            and increases for higher-priced properties. A 20% down payment allows you 
                            to avoid mortgage default insurance (CMHC insurance). The default value is 
                            set to 20% for this reason.
                        </p>
                    </div>
                </div>
                
                <DownPaymentPercentageField
                    value={downPaymentPercentage}
                    onChange={setDownPaymentPercentage}
                    defaultValue={defaultDownPaymentPercentage}
                    minValue={minDownPaymentPercentage}
                    maxValue={maxDownPaymentPercentage}
                    displayMode="combined"
                />
                
                <div className="flex justify-between gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handlePrevious}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Previous question</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleUseDefaultDownPayment}
                                        variant="secondary"
                                    >
                                        Use default
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Use default value and continue</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleNext}
                                        size="icon"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Next question</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
    
    const mortgageRateStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What is the mortgage interest rate?</CardTitle>
                <CardDescription>
                    The annual interest rate for your mortgage loan
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian mortgage rates */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">Canadian Mortgage Rates</p>
                        <p className="text-muted-foreground">
                            As of 2025, typical Canadian mortgage rates range from 4% to 7% depending 
                            on the term length and whether it's a fixed or variable rate. The default 
                            value of 5.5% represents a typical 5-year fixed rate mortgage.
                        </p>
                    </div>
                </div>
                
                <MortgageRateField
                    value={mortgageRate}
                    onChange={setMortgageRate}
                    defaultValue={defaultMortgageRate}
                    minValue={minMortgageRate}
                    maxValue={maxMortgageRate}
                    displayMode="combined"
                    showLabel={true}
                />
                
                <div className="flex justify-between gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handlePrevious}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Previous question</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleUseDefaultMortgageRate}
                                        variant="secondary"
                                    >
                                        Use default
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Use default value and continue</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleNext}
                                        size="icon"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Next question</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
    
    const mortgageLengthStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What is the amortization period?</CardTitle>
                <CardDescription>
                    The number of years to fully pay off the mortgage
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian amortization periods */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">Canadian Amortization Periods</p>
                        <p className="text-muted-foreground">
                            In Canada, the most common amortization period is 25 years. If you have 
                            at least a 20% down payment, you can extend the amortization up to 30 years. 
                            Longer periods mean lower monthly payments but more interest paid over time.
                        </p>
                    </div>
                </div>
                
                <MortgageLengthField
                    value={mortgageLength}
                    onChange={setMortgageLength}
                    defaultValue={defaultMortgageLength}
                    minValue={minMortgageLength}
                    maxValue={maxMortgageLength}
                    displayMode="combined"
                    showLabel={true}
                />
                
                <div className="flex justify-between gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handlePrevious}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Previous question</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleUseDefaultMortgageLength}
                                        variant="secondary"
                                    >
                                        Use default
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Use default value and continue</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleNext}
                                        size="icon"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Next question</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
    
    const propertyTaxStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What is the annual property tax rate?</CardTitle>
                <CardDescription>
                    The percentage of the property value you'll pay in property taxes each year
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian property taxes */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">Canadian Property Taxes</p>
                        <p className="text-muted-foreground">
                            Property tax rates in Canada vary by municipality. They typically range from 
                            0.5% to 2.5% of the property value annually. The default value of 0.75% 
                            represents a common rate in many Canadian cities.
                        </p>
                    </div>
                </div>
                
                <PropertyTaxPercentageField
                    value={propertyTaxPercentage}
                    onChange={setPropertyTaxPercentage}
                    defaultValue={defaultPropertyTaxPercentage}
                    minValue={minPropertyTaxPercentage}
                    maxValue={maxPropertyTaxPercentage}
                    displayMode="combined"
                    showDescription={true}
                />
                
                <div className="flex justify-between gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handlePrevious}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Previous question</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleUseDefaultPropertyTax}
                                        variant="secondary"
                                    >
                                        Use default
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Use default value and continue</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleNext}
                                        size="icon"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Next question</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
    
    const maintenanceStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What is the annual maintenance cost rate?</CardTitle>
                <CardDescription>
                    The percentage of the property value you'll spend on maintenance and repairs each year
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about maintenance costs */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">Property Maintenance Costs</p>
                        <p className="text-muted-foreground">
                            Financial experts typically recommend budgeting 1% to 3% of your home's value 
                            annually for maintenance and repairs. This includes routine upkeep, 
                            unexpected repairs, and replacing major systems. The default value of 2% 
                            represents a balanced estimate for most properties.
                        </p>
                    </div>
                </div>
                
                <MaintenancePercentageField
                    value={maintenancePercentage}
                    onChange={setMaintenancePercentage}
                    defaultValue={defaultMaintenancePercentage}
                    minValue={minMaintenancePercentage}
                    maxValue={maxMaintenancePercentage}
                    displayMode="combined"
                    showDescription={true}
                />
                
                <div className="flex justify-between gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handlePrevious}
                                    variant="outline"
                                    size="icon"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Previous question</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleUseDefaultMaintenance}
                                        variant="secondary"
                                    >
                                        Use default
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Use default value and continue</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleNext}
                                        size="icon"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Next question</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
    
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <FlexibleNavbar
                brandText="BuyOrRent"
                showAuthButtons={false}
                showThemeToggle={true}
                ThemeToggleComponent={CompactThemeToggle}
            />
            
            {/* Main Content */}
            <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
                {/* Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Purchase Information</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        Let's gather some information about the property you're considering
                    </p>
                </div>
                
                {/* Step 1: Purchase Price */}
                {step === 1 && purchasePriceStep}
                
                {/* Step 2: Intermediary question */}
                {step === 2 && defaultsOverviewStep}
                
                {/* Step 3: Down Payment */}
                {step === 3 && downPaymentStep}
                
                {/* Step 4: Mortgage Rate */}
                {step === 4 && mortgageRateStep}
                
                {/* Step 5: Mortgage Length */}
                {step === 5 && mortgageLengthStep}
                
                {/* Step 6: Property Tax */}
                {step === 6 && propertyTaxStep}
                
                {/* Step 7: Maintenance */}
                {step === 7 && maintenanceStep}
            </main>
        </div>
    )
}

export default PurchaseQuestions
