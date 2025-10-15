import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlexibleNavbar } from '@/components/navbar';
import { CompactThemeToggle } from '@/components/theme';
import { ChevronRight } from 'lucide-react';

export const QuestionnairePage: React.FC = () => {
    const navigate = useNavigate();

    const situations = [
        {
            id: 1,
            title: 'I am renting now & thinking about purchasing',
            description: 'Compare the costs of continuing to rent versus buying a property',
            available: true,
            route: '/situation/1/question/rent'
        },
        {
            id: 2,
            title: 'I own a home & thinking about selling',
            description: 'Analyze the financial implications of selling your current property',
            available: false,
            route: '/situation/2'
        },
        {
            id: 3,
            title: 'I want to compare multiple properties',
            description: 'Side-by-side comparison of different property options',
            available: false,
            route: '/situation/3'
        }
    ];

    const handleSituationClick = (situation: typeof situations[0]) => {
        if (situation.available) {
            navigate(situation.route);
        }
    };

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
                {/* Welcome Header */}
                <div className="text-center py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome to BuyOrRent</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        Choose your situation to get started
                    </p>
                </div>

                {/* Situations List */}
                <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Which situation applies to you?</h2>
                    {situations.map((situation) => (
                        <Card
                            key={situation.id}
                            className={`
                                transition-all
                                ${situation.available
                                    ? 'cursor-pointer hover:shadow-lg hover:border-primary/50'
                                    : 'opacity-60 cursor-not-allowed'
                                }
                            `}
                            onClick={() => handleSituationClick(situation)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg sm:text-xl">
                                            {situation.title}
                                            {!situation.available && (
                                                <span className="ml-2 text-sm text-muted-foreground font-normal">
                                                    (Coming Soon)
                                                </span>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="mt-1.5">
                                            {situation.description}
                                        </CardDescription>
                                    </div>
                                    {situation.available && (
                                        <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0 ml-4" />
                                    )}
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default QuestionnairePage;
