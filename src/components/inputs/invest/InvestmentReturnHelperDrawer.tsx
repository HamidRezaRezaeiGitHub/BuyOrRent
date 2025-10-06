import { cn } from '@/utils/utils';
import { Building2, LineChart, Percent, TrendingUp } from 'lucide-react';
import { FC, useEffect, useState, useRef } from 'react';
import { Button } from '../../ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '../../ui/drawer';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';

interface InvestmentReturnHelperDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectReturn: (value: number) => void;
    currentValue?: number | '';
    displayMode?: 'slider' | 'input' | 'combined'; // Default: 'combined'
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
        description: 'Stable returns with guaranteed capital protection',
        value: 3,
        icon: Building2,
        category: 'conservative',
    },
    {
        name: 'Global Market Index ETFs (e.g., VEQT)',
        description: 'Diversified portfolio and long-term growth',
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

/**
 * Format a number as a percentage string
 */
const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

/**
 * Parse a formatted percentage string to a number
 */
const parsePercentage = (formatted: string): number | '' => {
    const cleaned = formatted.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-') return '';

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? '' : parsed;
};

export const InvestmentReturnHelperDrawer: FC<InvestmentReturnHelperDrawerProps> = ({
    open,
    onOpenChange,
    onSelectReturn,
    currentValue,
    displayMode = 'combined',
}) => {
    const [otherValue, setOtherValue] = useState<number | ''>(10);
    const [displayValue, setDisplayValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);

    // Handle drawer opening - clear focus from trigger button and set focus to first element in drawer
    useEffect(() => {
        if (open) {
            // Blur any currently focused element when drawer opens to prevent aria-hidden focus issues
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
            // Focus the first interactive element in the drawer after a short delay
            setTimeout(() => {
                firstFocusableRef.current?.focus();
            }, 100);
        }
    }, [open]);

    // Update display value when otherValue changes
    useEffect(() => {
        if (typeof otherValue === 'number') {
            setDisplayValue(isFocused ? otherValue.toString() : formatPercentage(otherValue));
        } else {
            setDisplayValue('');
        }
    }, [otherValue, isFocused]);

    const handleSelectOption = (value: number) => {
        onSelectReturn(value);
        onOpenChange(false);
    };

    const handleOtherSubmit = () => {
        if (typeof otherValue === 'number') {
            onSelectReturn(otherValue);
            onOpenChange(false);
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setDisplayValue(newValue);

        const parsedValue = parsePercentage(newValue);
        setOtherValue(parsedValue);
    };

    // Handle input focus
    const handleFocus = () => {
        setIsFocused(true);
        if (typeof otherValue === 'number') {
            setDisplayValue(otherValue.toString());
        }
    };

    // Handle input blur
    const handleBlur = () => {
        setIsFocused(false);
        if (typeof otherValue === 'number') {
            setDisplayValue(formatPercentage(otherValue));
        }
    };

    // Handle slider change
    const handleSliderChange = (newValue: number[]) => {
        const sliderValue = newValue[0];
        setOtherValue(sliderValue);
    };

    // Drawer header component
    const drawerHeaderComponent = (
        <DrawerHeader>
            <DrawerTitle>Investment Return Examples</DrawerTitle>
            <DrawerDescription>
                Select a common investment type
            </DrawerDescription>
        </DrawerHeader>
    );

    // Individual investment option component
    const renderInvestmentOption = (option: InvestmentOption) => {
        const Icon = option.icon;
        const isSelected = currentValue === option.value;

        return (
            <button
                key={option.name}
                ref={option === investmentOptions[0] ? firstFocusableRef : undefined}
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
    };

    // Investment options list component
    const investmentOptionsListComponent = (
        <div className="space-y-3">
            {investmentOptions.map((option) => renderInvestmentOption(option))}
        </div>
    );

    // Input component (matching parent pattern)
    const inputComponent = (
        <div className="relative">
            <Input
                id={displayMode === 'input' ? 'otherReturnRate' : 'otherReturnRate-input'}
                type="number"
                inputMode="decimal"
                min={0}
                max={50}
                step={0.1}
                placeholder="Enter percentage"
                value={displayValue}
                onFocus={handleFocus}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${displayMode === 'combined' ? 'w-32 pr-12' : 'w-full pr-12'}`}
                aria-label={`Custom investment return in percent, current value: ${typeof otherValue === 'number' ? otherValue : 10}%`}
                aria-describedby="otherReturnRate-suffix"
            />
            <div
                id="otherReturnRate-suffix"
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
            >
                <span className="text-sm text-muted-foreground">%</span>
            </div>
        </div>
    );

    // Slider component (matching parent pattern)
    const sliderComponent = (
        <Slider
            id={displayMode === 'slider' ? 'otherReturnRate' : 'otherReturnRate-slider'}
            min={0}
            max={50}
            step={0.1}
            value={[typeof otherValue === 'number' ? otherValue : 10]}
            onValueChange={handleSliderChange}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'}`}
            aria-label={`Custom investment return: ${typeof otherValue === 'number' ? otherValue : 10}%`}
            aria-valuemin={0}
            aria-valuemax={50}
            aria-valuenow={typeof otherValue === 'number' ? otherValue : 10}
            aria-valuetext={`${typeof otherValue === 'number' ? otherValue : 10} percent`}
        />
    );

    // Value display (for slider and combined modes - matching parent pattern)
    const valueDisplay = (
        <div className="min-w-[5rem] text-center" aria-live="polite">
            <span className="text-sm font-medium" aria-label={`Current value: ${typeof otherValue === 'number' ? otherValue : 10} percent`}>
                {typeof otherValue === 'number' ? formatPercentage(otherValue) : '10.00'}%
            </span>
            <span className="text-xs text-muted-foreground block" aria-hidden="true">per year</span>
        </div>
    );

    // Render field based on displayMode (matching parent pattern exactly)
    const renderField = () => {
        switch (displayMode) {
            case 'slider':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {sliderComponent}
                            {valueDisplay}
                        </div>
                    </div>
                );

            case 'input':
                return (
                    <div className="space-y-2">
                        {inputComponent}
                    </div>
                );

            case 'combined':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {sliderComponent}
                            {inputComponent}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {sliderComponent}
                            {valueDisplay}
                        </div>
                    </div>
                );
        }
    };

    // Custom option section component (matching parent layout)
    const customOptionSectionComponent = (
        <div className="p-4 rounded-lg border-2 bg-muted border-border">
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-1">
                    <Percent className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    <Label htmlFor="otherReturnRate" className="text-xs">
                        Custom investment return
                    </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                    Enter a rate that matches your investment strategy
                </p>
            </div>
            {renderField()}
            <Button
                onClick={handleOtherSubmit}
                className="w-full mt-3"
                disabled={otherValue === ''}
            >
                Apply Custom Rate
            </Button>
        </div>
    );

    // Main content section component
    const mainContentComponent = (
        <div className="flex-1 overflow-hidden">
            <div className="h-full px-4 pb-4 overflow-y-auto">
                <div className="space-y-3">
                    {investmentOptionsListComponent}
                    {customOptionSectionComponent}
                </div>
            </div>
        </div>
    );

    // Drawer footer component
    const drawerFooterComponent = (
        <DrawerFooter>
            <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                    Cancel
                </Button>
            </DrawerClose>
        </DrawerFooter>
    );

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[85vh]">
                {drawerHeaderComponent}
                {mainContentComponent}
                {drawerFooterComponent}
            </DrawerContent>
        </Drawer>
    );
};
