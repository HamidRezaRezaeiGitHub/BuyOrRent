import { buildNavigationUrl, localToGlobalStep } from '@/common/globalStep'
import { InvestmentReturnField } from '@/components/inputs/invest/InvestmentReturn'
import { FlexibleNavbar } from '@/components/navbar'
import { CompactThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { FC, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export interface InvestmentQuestionsProps {
    previousUrl?: string
    nextUrl?: string
    progressMin?: number
    progressMax?: number
}

export const InvestmentQuestions: FC<InvestmentQuestionsProps> = ({
    previousUrl,
    nextUrl,
    progressMin = 0,
    progressMax: _progressMax = 100
}) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // Get all values from URL params (passed from PurchaseQuestions)
    const monthlyRent = searchParams.get('monthlyRent') || '0'
    const rentIncrease = searchParams.get('rentIncrease') || '2.5'
    const purchasePrice = searchParams.get('purchasePrice') || '0'
    const downPaymentPercentage = searchParams.get('downPaymentPercentage') || '20'
    const mortgageRate = searchParams.get('mortgageRate') || '5.5'
    const mortgageLength = searchParams.get('mortgageLength') || '25'
    const propertyTaxPercentage = searchParams.get('propertyTaxPercentage') || '0.75'
    const maintenancePercentage = searchParams.get('maintenancePercentage') || '2.0'

    // Default values - Canadian defaults & ranges
    const defaultInvestmentReturn = 8.0
    const minInvestmentReturn = -10
    const maxInvestmentReturn = 30

    // State
    const [investmentReturn, setInvestmentReturn] = useState<number>(defaultInvestmentReturn)

    // Handler to move to next step
    const handleNext = () => {
        // Navigate using nextUrl if provided, otherwise navigate to panel
        const params = new URLSearchParams(searchParams)
        params.set('monthlyRent', monthlyRent)
        params.set('rentIncrease', rentIncrease)
        params.set('purchasePrice', purchasePrice)
        params.set('downPaymentPercentage', downPaymentPercentage)
        params.set('mortgageRate', mortgageRate)
        params.set('mortgageLength', mortgageLength)
        params.set('propertyTaxPercentage', propertyTaxPercentage)
        params.set('maintenancePercentage', maintenancePercentage)
        params.set('investmentReturn', investmentReturn.toString())

        if (nextUrl) {
            navigate(`${nextUrl}?${params.toString()}`)
        } else {
            navigate(`/situation/1/panel?${params.toString()}`)
        }
    }

    // Handler to go to previous step
    const handlePrevious = () => {
        // Check if user used defaults in PurchaseQuestions
        const usedPurchaseDefaults = searchParams.get('usedPurchaseDefaults') === 'true'

        if (usedPurchaseDefaults) {
            // If user used defaults, go back to step 2 of PurchaseQuestions (the intermediary question)
            const purchaseStep2GlobalStep = localToGlobalStep('PurchaseQuestions', 2)
            if (purchaseStep2GlobalStep) {
                const dataParams = new URLSearchParams(searchParams)
                // Remove the usedPurchaseDefaults flag when going back
                dataParams.delete('usedPurchaseDefaults')
                const navUrl = buildNavigationUrl(purchaseStep2GlobalStep, dataParams)
                if (navUrl) {
                    navigate(navUrl)
                    return
                }
            }
        }

        // Default behavior: Navigate to previous global step (step 8 of PurchaseQuestions)
        const currentGlobalStep = localToGlobalStep('InvestmentQuestions', 1)
        if (currentGlobalStep && currentGlobalStep > 1) {
            const prevGlobalStep = currentGlobalStep - 1
            const dataParams = new URLSearchParams(searchParams)
            const navUrl = buildNavigationUrl(prevGlobalStep, dataParams)
            if (navUrl) {
                navigate(navUrl)
                return
            }
        }

        // Fallback to previousUrl
        if (previousUrl) {
            const params = new URLSearchParams(searchParams)
            navigate(`${previousUrl}?${params.toString()}`)
        }
    }

    // Handler to use default value
    const handleUseDefault = () => {
        setInvestmentReturn(defaultInvestmentReturn)
    }

    // Define the investment return step JSX
    const investmentReturnStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>What annual investment return do you want to assume?</CardTitle>
                <CardDescription>
                    Average yearly percentage return for your invested savings (pre-tax, long-term). You can change this later.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Optional info note */}
                <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex gap-2">
                        <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold mb-1">Why this matters</h4>
                            <p className="text-sm text-muted-foreground">
                                We compare rent + invest versus own. This rate applies to: (1) any lump sum not used for a down payment and (2) any monthly savings versus owning.
                            </p>
                        </div>
                    </div>
                </div>

                <InvestmentReturnField
                    value={investmentReturn}
                    onChange={setInvestmentReturn}
                    defaultValue={defaultInvestmentReturn}
                    minValue={minInvestmentReturn}
                    maxValue={maxInvestmentReturn}
                    displayMode="combined"
                    showHelper={true}
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
                    <div className="flex gap-3 ml-auto">
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
                showAuthButtons={false}
                showThemeToggle={true}
                ThemeToggleComponent={CompactThemeToggle}
            />

            {/* Main Content */}
            <main className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <Progress value={Math.round(progressMin)} className="w-full" />
                    <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">{Math.round(progressMin)}% complete</span>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Investment Information</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        Last step before we crunch the numbers!
                    </p>
                </div>

                {/* Investment Return */}
                {investmentReturnStep}
            </main>
        </div>
    )
}

export default InvestmentQuestions
