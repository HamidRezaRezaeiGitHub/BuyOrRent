import { MonthlyRentField } from '@/components/inputs/rent/MonthlyRent'
import { RentIncreaseField } from '@/components/inputs/rent/RentIncrease'
import { FlexibleNavbar } from '@/components/navbar'
import { CompactThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const RentQuestions: FC = () => {
    const navigate = useNavigate()
    
    // Default values
    const defaultMonthlyRent = 0
    const minMonthlyRent = 1000
    const maxMonthlyRent = 5000
    
    const defaultRentIncrease = 2.5
    const minRentIncrease = 0
    const maxRentIncrease = 10
    
    // State
    const [step, setStep] = useState<1 | 2>(1)
    const [monthlyRent, setMonthlyRent] = useState<number>(defaultMonthlyRent)
    const [rentIncrease, setRentIncrease] = useState<number>(defaultRentIncrease)
    
    // Handler to move to next step
    const handleNext = () => {
        if (step === 1) {
            // Validate that monthly rent is entered
            if (monthlyRent > 0) {
                setStep(2)
            }
        } else if (step === 2) {
            // Navigate to purchase questions with URL parameters
            navigate(`/situation/1/question/purchase?monthlyRent=${monthlyRent}&rentIncrease=${rentIncrease}`)
        }
    }
    
    // Handler to go to previous step
    const handlePrevious = () => {
        if (step === 2) {
            setStep(1)
        }
    }
    
    // Handler to use default value for rent increase
    const handleUseDefault = () => {
        setRentIncrease(defaultRentIncrease)
    }
    
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
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Rent Information</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        Let's gather some information about your rental situation
                    </p>
                </div>
                
                {/* Step 1: Monthly Rent */}
                {step === 1 && (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>How much rent are you paying now?</CardTitle>
                            <CardDescription>
                                Enter the total monthly rent amount you currently pay
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
                            
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleNext}
                                    disabled={monthlyRent === 0}
                                >
                                    Next
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {/* Step 2: Rent Increase Rate */}
                {step === 2 && (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>What is your expected average rent increase rate per year?</CardTitle>
                            <CardDescription>
                                The annual percentage by which your rent is expected to increase
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Information about Canadian rent control */}
                            <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                                <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium mb-1">Canadian Rent Control Information</p>
                                    <p className="text-muted-foreground">
                                        In Canada, for properties built before November 2018, the maximum rate of rent increase 
                                        is typically 2.5% per year (varies by province). This is why 2.5% is the default value. 
                                        You can adjust this based on your specific situation or local regulations.
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
                                <Button
                                    onClick={handlePrevious}
                                    variant="outline"
                                >
                                    Previous
                                </Button>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleUseDefault}
                                        variant="secondary"
                                    >
                                        Use Default (2.5%)
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}

export default RentQuestions
