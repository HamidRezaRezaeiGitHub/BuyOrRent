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
}

export const InvestmentQuestions: FC<InvestmentQuestionsProps> = ({
    previousUrl,
    nextUrl
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
    const defaultInvestmentReturn = 6.0
    const minInvestmentReturn = -10
    const maxInvestmentReturn = 15

    // State
    const [investmentReturn, setInvestmentReturn] = useState<number>(defaultInvestmentReturn)

    // Handler to move to next step
    const handleNext = () => {
        // Navigate using nextUrl if provided, otherwise navigate to panel
        const params = new URLSearchParams({
            monthlyRent,
            rentIncrease,
            purchasePrice,
            downPaymentPercentage,
            mortgageRate,
            mortgageLength,
            propertyTaxPercentage,
            maintenancePercentage,
            investmentReturn: investmentReturn.toString()
        })
        if (nextUrl) {
            navigate(`${nextUrl}?${params.toString()}`)
        } else {
            navigate(`/situation/1/panel?${params.toString()}`)
        }
    }

    // Handler to go to previous step
    const handlePrevious = () => {
        if (previousUrl) {
            const params = new URLSearchParams({
                monthlyRent,
                rentIncrease
            })
            navigate(`${previousUrl}?${params.toString()}`)
        }
    }

    // Handler to use default value
    const handleUseDefault = () => {
        setInvestmentReturn(defaultInvestmentReturn)
        // Automatically proceed to next after setting default
        handleNext()
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
                                        onClick={handleUseDefault}
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
                {/* Progress Bar */}
                <div className="space-y-2">
                    <Progress value={100} className="w-full" />
                    <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">100% complete</span>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Investment Information</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        This is the expected annual return if you rent and invest the cash you don't use for buying (e.g., the down payment and monthly differences).
                    </p>
                </div>

                {/* Investment Return */}
                {investmentReturnStep}
            </main>
        </div>
    )
}

export default InvestmentQuestions
