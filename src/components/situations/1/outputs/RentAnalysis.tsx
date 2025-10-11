import { CompactMonthlyRentGraph } from '@/components/outputs/rent/CompactMonthlyRentGraph'
import { CompactMonthlyRentTable } from '@/components/outputs/rent/CompactMonthlyRentTable'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { MonthlyRentData } from '@/services/MonthlyRentCalculator'
import { Maximize2 } from 'lucide-react'

interface RentAnalysisProps {
    rentData: MonthlyRentData | null
    setTableDialogOpen: (open: boolean) => void
    setGraphDialogOpen: (open: boolean) => void
}

export const RentAnalysis: React.FC<RentAnalysisProps> = ({
    rentData,
    setTableDialogOpen,
    setGraphDialogOpen,
}) => {
    // Tables Carousel Component
    const tablesCarousel = (
        <div className="w-full mb-6">
            <div className="relative mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tables</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => setTableDialogOpen(true)}
                    aria-label="Expand table"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </div>
            <div className="relative px-12 py-2">
                <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                    <CarouselContent>
                        <CarouselItem className="basis-full">
                            <div className="w-full overflow-x-auto">
                                <CompactMonthlyRentTable
                                    data={rentData}
                                    maxRows={5}
                                />
                            </div>
                        </CarouselItem>
                        <CarouselItem className="basis-full">
                            <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                <span className="text-xs sm:text-sm text-muted-foreground text-center">Additional Table View<br />Coming Soon</span>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )

    // Graphs Carousel Component
    const graphsCarousel = (
        <div className="w-full">
            <div className="relative mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Graphs</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => setGraphDialogOpen(true)}
                    aria-label="Expand graph"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </div>
            <div className="relative px-12 py-2">
                <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                    <CarouselContent>
                        <CarouselItem className="basis-full">
                            <div className="w-full overflow-x-auto">
                                <CompactMonthlyRentGraph data={rentData} />
                            </div>
                        </CarouselItem>
                        <CarouselItem className="basis-full">
                            <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                <span className="text-xs sm:text-sm text-muted-foreground text-center">Additional Graph View<br />Coming Soon</span>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )

    return (
        <div className="w-full space-y-6">
            {tablesCarousel}
            {graphsCarousel}
        </div>
    )
}