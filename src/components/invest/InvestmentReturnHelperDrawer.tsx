import { FC } from 'react';
import { Button } from '../ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '../ui/drawer';
import { TrendingUp, Building2, LineChart, Percent } from 'lucide-react';
import { cn } from '@/utils/utils';

interface InvestmentReturnHelperDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectReturn: (value: number) => void;
    currentValue?: number | '';
}

interface InvestmentOption {
    name: string;
    description: string;
    value: number;
    icon: typeof TrendingUp;
    category: 'conservative' | 'moderate' | 'aggressive';
}

const investmentOptions: InvestmentOption[] = [
    {
        name: 'High Interest Savings Account',
        description: 'Low risk, stable returns with guaranteed capital protection',
        value: 3,
        icon: Building2,
        category: 'conservative',
    },
    {
        name: 'Global Market Index ETFs (e.g., VEQT)',
        description: 'Diversified portfolio with moderate risk and long-term growth',
        value: 7,
        icon: LineChart,
        category: 'moderate',
    },
    {
        name: 'US Market Index ETFs (e.g., S&P 500)',
        description: 'Higher growth potential with increased market volatility',
        value: 15,
        icon: TrendingUp,
        category: 'aggressive',
    },
];

const getCategoryColor = (category: string): string => {
    switch (category) {
        case 'conservative':
            return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
        case 'moderate':
            return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
        case 'aggressive':
            return 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800';
        default:
            return 'bg-muted border-border';
    }
};

const getCategoryBadge = (category: string): string => {
    switch (category) {
        case 'conservative':
            return 'Low Risk';
        case 'moderate':
            return 'Moderate Risk';
        case 'aggressive':
            return 'Higher Risk';
        default:
            return '';
    }
};

export const InvestmentReturnHelperDrawer: FC<InvestmentReturnHelperDrawerProps> = ({
    open,
    onOpenChange,
    onSelectReturn,
    currentValue,
}) => {
    const handleSelectOption = (value: number) => {
        onSelectReturn(value);
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[85vh]">
                <DrawerHeader>
                    <DrawerTitle>Investment Return Examples</DrawerTitle>
                    <DrawerDescription>
                        Select a common investment type to autofill the expected return rate
                    </DrawerDescription>
                </DrawerHeader>
                
                <div className="px-4 pb-4 overflow-y-auto space-y-3">
                    {investmentOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = currentValue === option.value;
                        
                        return (
                            <button
                                key={option.name}
                                onClick={() => handleSelectOption(option.value)}
                                className={cn(
                                    'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
                                    getCategoryColor(option.category),
                                    isSelected
                                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                        : 'hover:shadow-md hover:scale-[1.02]'
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        'p-2 rounded-md',
                                        option.category === 'conservative' && 'bg-blue-100 dark:bg-blue-900',
                                        option.category === 'moderate' && 'bg-green-100 dark:bg-green-900',
                                        option.category === 'aggressive' && 'bg-orange-100 dark:bg-orange-900'
                                    )}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-sm sm:text-base leading-tight">
                                                {option.name}
                                            </h4>
                                            <div className="flex items-center gap-1 flex-shrink-0 font-bold text-base sm:text-lg">
                                                <Percent className="h-4 w-4" />
                                                {option.value}
                                            </div>
                                        </div>
                                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                            {option.description}
                                        </p>
                                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-background/50">
                                            {getCategoryBadge(option.category)}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
