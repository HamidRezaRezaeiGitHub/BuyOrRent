import { InvestmentReturnField } from '@/components/inputs/invest/InvestmentReturn'
import { FlexibleNavbar } from '@/components/navbar'
import { CompactThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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
    
    // Default values
    const defaultInvestmentReturn = 7.5
    const minInvestmentReturn = -20
    const maxInvestmentReturn = 100
    
    // State
    const [step, _setStep] = useState<1>(1)
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
                <CardTitle>What is your expected annual investment return rate?</CardTitle>
                <CardDescription>
                    The average yearly percentage return you expect from alternative investments if you choose to rent instead of buying
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                {/* Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Investment Information</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        Let's understand your expected investment returns
                    </p>
                </div>
                
                {/* Investment Return */}
                {step === 1 && investmentReturnStep}
            </main>
        </div>
    )
}

export default InvestmentQuestions
