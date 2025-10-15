import { MonthlyRentField } from '@/components/inputs/rent/MonthlyRent'
import { RentIncreaseField } from '@/components/inputs/rent/RentIncrease'
import { FlexibleNavbar } from '@/components/navbar'
import { CompactThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface RentQuestionsProps {
    previousUrl?: string
    nextUrl?: string
    progressMin?: number
    progressMax?: number
}

export const RentQuestions: FC<RentQuestionsProps> = ({
    previousUrl,
    nextUrl,
    progressMin = 0,
    progressMax = 100
}) => {
    const navigate = useNavigate()

    // Default values
    const defaultMonthlyRent = 2400
    const minMonthlyRent = 500
    const maxMonthlyRent = 5000

    const defaultRentIncrease = 2.5
    const minRentIncrease = 0
    const maxRentIncrease = 10

    // State
    const [step, setStep] = useState<1 | 2>(1)
    const [monthlyRent, setMonthlyRent] = useState<number>(defaultMonthlyRent)
    const [rentIncrease, setRentIncrease] = useState<number>(defaultRentIncrease)

    // Calculate progress percentage based on step
    const getProgressPercentage = () => {
        // Interpolate between progressMin and progressMax based on current step
        const progressPerStep = (progressMax - progressMin) / 2 // 2 steps total
        const progress = progressMin + (progressPerStep * (step - 1))
        return Math.round(progress)
    }

    // Handler to move to next step
    const handleNext = () => {
        if (step === 1) {
            // Validate that monthly rent is entered
            if (monthlyRent > 0) {
                setStep(2)
            }
        } else if (step === 2) {
            // Navigate using nextUrl if provided, otherwise use default
            if (nextUrl) {
                navigate(`${nextUrl}?monthlyRent=${monthlyRent}&rentIncrease=${rentIncrease}`)
            } else {
                navigate(`/situation/1/question/purchase?monthlyRent=${monthlyRent}&rentIncrease=${rentIncrease}`)
            }
        }
    }

    // Handler to go to previous step
    const handlePrevious = () => {
        if (step === 2) {
            setStep(1)
        } else if (step === 1 && previousUrl) {
            navigate(previousUrl)
        }
    }

    // Handler to use default value for rent increase
    const handleUseDefault = () => {
        setRentIncrease(defaultRentIncrease)
        // Automatically proceed to next after setting default
        handleNext()
    }

    // Define each step JSX separately
    const monthlyRentStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>How much rent do you pay each month?</CardTitle>
                <CardDescription>
                    Enter your total out-of-pocket monthly rent. This should include anything you pay separately (e.g., utilities, parking, renter's insurance). If they're already included in your rent, just enter the single amount.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <MonthlyRentField
                    value={monthlyRent}
                    onChange={setMonthlyRent}
                    defaultValue={defaultMonthlyRent}
                    minValue={minMonthlyRent}
                    maxValue={maxMonthlyRent}
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
                                    disabled={monthlyRent === 0}
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

    const rentIncreaseStep = (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>How much might your rent increase each year?</CardTitle>
                <CardDescription>
                    Annual average increase (Canada defaults shown; adjust if your lease or province differs).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Information about Canadian rent control */}
                <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium mb-1">About rent controls in Canada</p>
                        <p className="text-muted-foreground">
                            Many provinces cap annual increases (often around 2.5% for eligible units; details vary by province and building age). We use 2.5% as a reasonable default.
                        </p>
                    </div>
                </div>

                <RentIncreaseField
                    value={rentIncrease}
                    onChange={setRentIncrease}
                    defaultValue={defaultRentIncrease}
                    minValue={minRentIncrease}
                    maxValue={maxRentIncrease}
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

    const progress = getProgressPercentage()

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
                    <Progress value={progress} className="w-full" />
                    <div className="flex justify-end">
                        <span className="text-xs text-muted-foreground">{progress}% complete</span>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Rent Information</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        A few quick questions about your current rental. You can change these later.
                    </p>
                </div>

                {/* Step 1: Monthly Rent */}
                {step === 1 && monthlyRentStep}

                {/* Step 2: Rent Increase Rate */}
                {step === 2 && rentIncreaseStep}
            </main>
        </div>
    )
}

export default RentQuestions
