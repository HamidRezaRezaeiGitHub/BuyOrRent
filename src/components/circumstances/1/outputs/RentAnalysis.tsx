import { CompactMonthlyRentGraph } from '@/components/outputs/rent/CompactMonthlyRentGraph'
import { CompactMonthlyRentTable } from '@/components/outputs/rent/CompactMonthlyRentTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <Card className="w-full max-w-full overflow-x-hidden">
            <CardHeader className="relative px-3 sm:px-4 py-3 sm:py-4">
                <CardTitle className="text-lg pr-10">Tables</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 h-8 w-8 flex-shrink-0"
                    onClick={() => setTableDialogOpen(true)}
                    aria-label="Expand table"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
                <div className="w-full max-w-full overflow-x-hidden">
                    <Carousel className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-1 sm:-ml-2">
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="w-full max-w-full overflow-x-hidden">
                                    <CompactMonthlyRentTable
                                        data={rentData}
                                        maxRows={5}
                                    />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                    <span className="text-xs sm:text-sm text-muted-foreground text-center">Additional Table View<br />Coming Soon</span>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
            </CardContent>
        </Card>
    )

    // Graphs Carousel Component
    const graphsCarousel = (
        <Card className="w-full max-w-full overflow-x-hidden">
            <CardHeader className="relative px-3 sm:px-4 py-3 sm:py-4">
                <CardTitle className="text-lg pr-10">Graphs</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 h-8 w-8 flex-shrink-0"
                    onClick={() => setGraphDialogOpen(true)}
                    aria-label="Expand graph"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
                <div className="w-full max-w-full overflow-x-hidden">
                    <Carousel className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-1 sm:-ml-2">
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="w-full max-w-full overflow-x-hidden">
                                    <CompactMonthlyRentGraph data={rentData} />
                                </div>
                            </CarouselItem>
                            <CarouselItem className="pl-1 sm:pl-2 basis-full">
                                <div className="h-20 sm:h-24 bg-muted rounded border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                    <span className="text-xs sm:text-sm text-muted-foreground text-center">Additional Graph View<br />Coming Soon</span>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="w-full max-w-full overflow-x-hidden grid gap-3 sm:gap-4">
            {tablesCarousel}
            {graphsCarousel}
        </div>
    )
}