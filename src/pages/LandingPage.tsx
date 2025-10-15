import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FlexibleNavbar } from '@/components/navbar';
import { CompactThemeToggle } from '@/components/theme';
import { ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleStartJourney = () => {
        navigate('/situation/1/question/rent');
    };

    const handleAdvancedMode = () => {
        navigate('/situation/1/panel');
    };

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
            <main className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">0% complete</span>
                    </div>
                    <Progress value={0} className="w-full" />
                </div>

                {/* Hero Card */}
                <Card className="w-full">
                    <CardHeader className="text-center space-y-4 py-8 sm:py-10">
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                Should I keep renting or buy a home?
                            </h1>
                            <p className="text-base sm:text-lg text-muted-foreground">
                                Get personalized insights to make an informed decision
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Takes ~2 minutes • No signup required
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Button
                                size="lg"
                                onClick={handleStartJourney}
                                className="w-full sm:w-auto"
                            >
                                Start the Journey
                                <ArrowRight className="ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                variant="ghost"
                                onClick={handleAdvancedMode}
                                className="w-full sm:w-auto"
                            >
                                I already have some numbers
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Scenario Card */}
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg sm:text-xl">
                                        I'm renting and wondering if I should buy
                                    </CardTitle>
                                    <Badge variant="default">Selected</Badge>
                                </div>
                                <CardDescription>
                                    Compare the costs of continuing to rent versus buying a property
                                </CardDescription>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground pt-2">
                            More scenarios coming soon
                        </p>
                    </CardHeader>
                </Card>

                {/* How This Works Section */}
                <Card className="w-full">
                    <CardHeader className="space-y-4">
                        <CardTitle className="text-xl sm:text-2xl">How this works</CardTitle>
                        <ul className="space-y-3 text-sm sm:text-base">
                            <li className="flex gap-3">
                                <span className="text-primary font-semibold shrink-0">1.</span>
                                <span>Answer a few quick questions about your current rent and potential purchase</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary font-semibold shrink-0">2.</span>
                                <span>We'll calculate the real costs, including taxes, maintenance, and opportunity costs</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary font-semibold shrink-0">3.</span>
                                <span>Get personalized insights, charts, and recommendations to guide your decision</span>
                            </li>
                        </ul>
                    </CardHeader>
                </Card>

                {/* Disclaimer */}
                <div className="text-center py-4">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        This tool provides educational estimates only and should not be considered financial advice.
                        Consult with qualified professionals for personalized guidance.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
