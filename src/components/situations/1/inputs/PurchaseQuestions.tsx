import { AssetAppreciationRateField } from '@/components/inputs/buy/AssetAppreciationRate'
import { ClosingCostsPercentageField } from '@/components/inputs/buy/ClosingCostsPercentage'
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
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronsRight, Info } from 'lucide-react'
import { FC, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { localToGlobalStep, globalToLocalStep, buildNavigationUrl } from '@/common/globalStep'

export interface PurchaseQuestionsProps {
    previousUrl?: string
    nextUrl?: string
    progressMin?: number
    progressMax?: number
}

export const PurchaseQuestions: FC<PurchaseQuestionsProps> = ({
    previousUrl,
    nextUrl,
    progressMin = 0,
    progressMax = 100
}) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // Get rent values from URL params (passed from RentQuestions)
    const monthlyRent = searchParams.get('monthlyRent') || '0'
    const rentIncrease = searchParams.get('rentIncrease') || '2.5'

    // Default values - Canadian ranges and defaults
    const defaultPurchasePrice = 1000000
    const minPurchasePrice = 300000
    const maxPurchasePrice = 2500000

    const defaultDownPaymentPercentage = 20
    const minDownPaymentPercentage = 5
    const maxDownPaymentPercentage = 100

    const defaultMortgageRate = 5.25
    const minMortgageRate = 0
    const maxMortgageRate = 15

    const defaultMortgageLength = 25
    const minMortgageLength = 5
    const maxMortgageLength = 35

    const defaultPropertyTaxPercentage = 0.75
    const minPropertyTaxPercentage = 0
    const maxPropertyTaxPercentage = 3.0

    const defaultMaintenancePercentage = 2.0
    const minMaintenancePercentage = 0
    const maxMaintenancePercentage = 5

    const defaultAssetAppreciationRate = 3.0
    const minAssetAppreciationRate = -5
    const maxAssetAppreciationRate = 10

    const defaultClosingCostsPercentage = 1.5
    const minClosingCostsPercentage = 0
    const maxClosingCostsPercentage = 5

    // State
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(1)
    const [purchasePrice, setPurchasePrice] = useState<number>(defaultPurchasePrice)
    const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(defaultDownPaymentPercentage)
    const [mortgageRate, setMortgageRate] = useState<number>(defaultMortgageRate)
    const [mortgageLength, setMortgageLength] = useState<number>(defaultMortgageLength)
    const [propertyTaxPercentage, setPropertyTaxPercentage] = useState<number>(defaultPropertyTaxPercentage)
    const [maintenancePercentage, setMaintenancePercentage] = useState<number>(defaultMaintenancePercentage)
    const [assetAppreciationRate, setAssetAppreciationRate] = useState<number>(defaultAssetAppreciationRate)
    const [closingCostsPercentage, setClosingCostsPercentage] = useState<number>(defaultClosingCostsPercentage)
    
    // Initialize step from gs parameter if present
    useEffect(() => {
        const gsParam = searchParams.get('gs')
        if (gsParam) {
            const globalStep = parseInt(gsParam, 10)
            const stepInfo = globalToLocalStep(globalStep)
            if (stepInfo && stepInfo.component === 'PurchaseQuestions') {
                setStep(stepInfo.localStep as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)
            }
        }
    }, [searchParams])

    // Calculate progress percentage based on step
    const getProgressPercentage = () => {
        // Interpolate between progressMin and progressMax based on current step
        const progressPerStep = (progressMax - progressMin) / 9 // 9 steps total
        const progress = progressMin + (progressPerStep * (step - 1))
        return Math.round(progress)
    }

    // Navigate to next section with all parameters
    const navigateToNext = () => {
        const params = new URLSearchParams(searchParams)
        params.set('monthlyRent', monthlyRent)
        params.set('rentIncrease', rentIncrease)
        params.set('purchasePrice', purchasePrice.toString())
        params.set('downPaymentPercentage', downPaymentPercentage.toString())
        params.set('mortgageRate', mortgageRate.toString())
        params.set('mortgageLength', mortgageLength.toString())
        params.set('propertyTaxPercentage', propertyTaxPercentage.toString())
        params.set('maintenancePercentage', maintenancePercentage.toString())
        params.set('assetAppreciationRate', assetAppreciationRate.toString())
        params.set('closingCostsPercentage', closingCostsPercentage.toString())
        
        // Calculate next global step
        const currentGlobalStep = localToGlobalStep('PurchaseQuestions', step)
        if (currentGlobalStep) {
            const nextGlobalStep = currentGlobalStep + 1
            const navUrl = buildNavigationUrl(nextGlobalStep, params)
            if (navUrl) {
                navigate(navUrl)
                return
            }
        }
        
        // Fallback to legacy navigation
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
            setStep(8)
        } else if (step === 8) {
            setStep(9)
        } else if (step === 9) {
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
        setAssetAppreciationRate(defaultAssetAppreciationRate)
        setClosingCostsPercentage(defaultClosingCostsPercentage)
        
        // Skip all remaining steps and go directly to the next component (InvestmentQuestions)
        const params = new URLSearchParams(searchParams)
        params.set('monthlyRent', monthlyRent)
        params.set('rentIncrease', rentIncrease)
        params.set('purchasePrice', purchasePrice.toString())
        params.set('downPaymentPercentage', defaultDownPaymentPercentage.toString())
        params.set('mortgageRate', defaultMortgageRate.toString())
        params.set('mortgageLength', defaultMortgageLength.toString())
        params.set('propertyTaxPercentage', defaultPropertyTaxPercentage.toString())
        params.set('maintenancePercentage', defaultMaintenancePercentage.toString())
        params.set('assetAppreciationRate', defaultAssetAppreciationRate.toString())
        params.set('closingCostsPercentage', defaultClosingCostsPercentage.toString())
        // Mark that user used defaults to skip intermediate steps
        params.set('usedPurchaseDefaults', 'true')
        
        // Calculate the first global step of the next component (InvestmentQuestions)
        const purchaseLastGlobalStep = localToGlobalStep('PurchaseQuestions', 9)
        if (purchaseLastGlobalStep) {
            const nextGlobalStep = purchaseLastGlobalStep + 1
            const navUrl = buildNavigationUrl(nextGlobalStep, params)
            if (navUrl) {
                navigate(navUrl)
                return
            }
        }
        
        // Fallback to legacy navigation
        if (nextUrl) {
            navigate(`${nextUrl}?${params.toString()}`)
        } else {
            navigate(`/situation/1/question/investment?${params.toString()}`)
        }
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
        } else if (step === 8) {
            setStep(7)
        } else if (step === 9) {
            setStep(8)
        } else if (step === 1) {
            // Navigate to previous global step
            const currentGlobalStep = localToGlobalStep('PurchaseQuestions', step)
            if (currentGlobalStep && currentGlobalStep > 1) {
                const prevGlobalStep = currentGlobalStep - 1
                const dataParams = new URLSearchParams(searchParams)
                // Remove the usedPurchaseDefaults flag when going back
                dataParams.delete('usedPurchaseDefaults')
                const navUrl = buildNavigationUrl(prevGlobalStep, dataParams)
                if (navUrl) {
                    navigate(navUrl)
                    return
                }
            }
            
            // Fallback to previousUrl
            if (previousUrl) {
                navigate(`${previousUrl}?monthlyRent=${monthlyRent}&rentIncrease=${rentIncrease}`)
            }
        }
    }

    // Handler to use default value for down payment
    const handleUseDefaultDownPayment = () => {
        setDownPaymentPercentage(defaultDownPaymentPercentage)
    }

    // Handler to use default value for mortgage rate
    const handleUseDefaultMortgageRate = () => {
        setMortgageRate(defaultMortgageRate)
    }

    // Handler to use default value for mortgage length
    const handleUseDefaultMortgageLength = () => {
        setMortgageLength(defaultMortgageLength)
    }

    // Handler to use default value for property tax
    const handleUseDefaultPropertyTax = () => {
        setPropertyTaxPercentage(defaultPropertyTaxPercentage)
    }

    // Handler to use default value for maintenance
    const handleUseDefaultMaintenance = () => {
        setMaintenancePercentage(defaultMaintenancePercentage)
    }

    // Handler to use default value for asset appreciation rate
    const handleUseDefaultAssetAppreciationRate = () => {
        setAssetAppreciationRate(defaultAssetAppreciationRate)
    }

    // Handler to use default value for closing costs
    const handleUseDefaultClosingCosts = () => {
        setClosingCostsPercentage(defaultClosingCostsPercentage)
    }

    // Define each step JSX separately
    const purchasePriceStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What is the purchase price of the property?</CardTitle>
                <CardDescription>
                    Total amount agreed upon for the property acquisition (before closing costs).
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
                    showDescription={false}
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
                <CardTitle>Use default values?</CardTitle>
                <CardDescription>
                    We'll fill typical Canadian defaults. <span className='italic'>You can change them anytime.</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        The following parameters will be set to these default values:
                    </p>
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Down payment:</span>
                            <span>{defaultDownPaymentPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Mortgage rate:</span>
                            <span>{defaultMortgageRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Mortgage length:</span>
                            <span>{defaultMortgageLength} years</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Property tax:</span>
                            <span>{defaultPropertyTaxPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Maintenance:</span>
                            <span>{defaultMaintenancePercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Appreciation:</span>
                            <span>{defaultAssetAppreciationRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Closing costs:</span>
                            <span>{defaultClosingCostsPercentage}%</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-3">
                    <Button
                        onClick={handlePrevious}
                        variant="secondary"
                        size="icon"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleNext}
                            variant="secondary"
                            className="flex items-center gap-2"
                            aria-label="Review and customize each value"
                        >
                            Review
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={handleUseAllDefaults}
                            variant="default"
                            className="flex items-center gap-2"
                            aria-label="Apply default values and skip to the next section"
                        >
                            Use defaults
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
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
                    The percentage of the purchase price you'll pay upfront.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian down payment requirements */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">About down payments in Canada</p>
                        <p className="text-muted-foreground">
                            Minimum is 5% up to $500k, higher tiers above that. 20% avoids mortgage default insurance.
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
                    showDescription={false}
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
                        {downPaymentPercentage !== defaultDownPaymentPercentage && (
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
                                        <p>Reset to default value</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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
                    The annual interest rate for your mortgage loan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian mortgage rates */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">Mortgage rates</p>
                        <p className="text-muted-foreground">
                            Use your quoted rate if you have one. Otherwise 5.25% is a reasonable placeholder.
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
                    showDescription={false}
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
                        {mortgageRate !== defaultMortgageRate && (
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
                                        <p>Reset to default value</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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
                    Total years to pay off your mortgage (not the fixed-rate term).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        {mortgageLength !== defaultMortgageLength && (
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
                                        <p>Reset to default value</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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
                    Annual property tax as a % of home value. Defaults vary by municipality; 0.75% is a reasonable estimate.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <PropertyTaxPercentageField
                    value={propertyTaxPercentage}
                    onChange={setPropertyTaxPercentage}
                    defaultValue={defaultPropertyTaxPercentage}
                    minValue={minPropertyTaxPercentage}
                    maxValue={maxPropertyTaxPercentage}
                    displayMode="combined"
                    showDescription={false}
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
                        {propertyTaxPercentage !== defaultPropertyTaxPercentage && (
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
                                        <p>Reset to default value</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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
                    Annual maintenance as a % of home value (rule of thumb ≈ 2%/yr). Condos may differ depending on fees.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <MaintenancePercentageField
                    value={maintenancePercentage}
                    onChange={setMaintenancePercentage}
                    defaultValue={defaultMaintenancePercentage}
                    minValue={minMaintenancePercentage}
                    maxValue={maxMaintenancePercentage}
                    displayMode="combined"
                    showDescription={false}
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
                        {maintenancePercentage !== defaultMaintenancePercentage && (
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
                                        <p>Reset to default value</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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

    const assetAppreciationRateStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>How might home prices change each year on average?</CardTitle>
                <CardDescription>
                    Average annual appreciation (can be negative in some markets or years).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <AssetAppreciationRateField
                    value={assetAppreciationRate}
                    onChange={setAssetAppreciationRate}
                    defaultValue={defaultAssetAppreciationRate}
                    minValue={minAssetAppreciationRate}
                    maxValue={maxAssetAppreciationRate}
                    displayMode="combined"
                    showDescription={false}
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
                        {assetAppreciationRate !== defaultAssetAppreciationRate && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={handleUseDefaultAssetAppreciationRate}
                                            variant="secondary"
                                        >
                                            Use default
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Reset to default value</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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

    const closingCostsStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What are the estimated closing costs?</CardTitle>
                <CardDescription>
                    Typical closing costs are around 1.5% of purchase price; varies by province and municipality.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian closing costs */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">About closing costs</p>
                        <p className="text-muted-foreground">
                            Includes legal fees, land transfer tax, title insurance, and other one-time transaction fees. Costs vary by province and municipality.
                        </p>
                    </div>
                </div>

                <ClosingCostsPercentageField
                    value={closingCostsPercentage}
                    onChange={setClosingCostsPercentage}
                    defaultValue={defaultClosingCostsPercentage}
                    minValue={minClosingCostsPercentage}
                    maxValue={maxClosingCostsPercentage}
                    displayMode="combined"
                    showDescription={false}
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
                        {closingCostsPercentage !== defaultClosingCostsPercentage && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={handleUseDefaultClosingCosts}
                                            variant="secondary"
                                        >
                                            Use default
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Reset to default value</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
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
                                    <p>Continue</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const progress = getProgressPercentage()

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <FlexibleNavbar
                showAuthButtons={false}
                showThemeToggle={true}
                ThemeToggleComponent={CompactThemeToggle}
            />

            {/* Main Content */}
            <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">{progress}% complete</span>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Purchase Information</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        Now let's outline the home you have in mind. You can accept defaults or customize.
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

                {/* Step 8: Asset Appreciation Rate */}
                {step === 8 && assetAppreciationRateStep}

                {/* Step 9: Closing Costs */}
                {step === 9 && closingCostsStep}
            </main>
        </div>
    )
}

export default PurchaseQuestions
