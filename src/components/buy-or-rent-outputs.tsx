import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { BuyOrRentInputs } from '@/types/inputs'

interface BuyOrRentOutputsSectionProps {
  inputs: BuyOrRentInputs | null
}

interface CalculationResults {
  monthlyPayment: number
  totalPurchaseCost: number
  totalRentalCost: number
  netWorth: {
    buy: number
    rent: number
  }
  recommendation: 'buy' | 'rent'
  yearByYearBreakdown: Array<{
    year: number
    ownershipCost: number
    rentalCost: number
    cumulativeOwnership: number
    cumulativeRental: number
    netWorthBuy: number
    netWorthRent: number
  }>
}

export function BuyOrRentOutputsSection({ inputs }: BuyOrRentOutputsSectionProps) {
  const [summaryOpen, setSummaryOpen] = useState(true)
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)

  if (!inputs) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Submit the form above to see calculation results.</p>
      </div>
    )
  }

  // Calculate results based on inputs
  const results = calculateBuyVsRent(inputs)

  return (
    <div className="space-y-4">
      {/* Summary Section */}
      <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                <CardTitle className="text-lg">Summary & Recommendation</CardTitle>
                {summaryOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${results.recommendation === 'buy' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                    <h3 className="font-semibold text-lg mb-2">
                      Recommendation: {results.recommendation === 'buy' ? '🏠 Buy' : '🏠 Rent'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Based on a {inputs.yearsToAnalyze}-year analysis
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Payment (Buy):</span>
                      <span className="font-medium">${results.monthlyPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span className="font-medium">${inputs.monthlyRent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Net Worth After {inputs.yearsToAnalyze} Years</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>If you buy:</span>
                      <span className="font-medium text-green-600">
                        ${results.netWorth.buy.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>If you rent:</span>
                      <span className="font-medium text-blue-600">
                        ${results.netWorth.rent.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Difference:</span>
                      <span className={results.netWorth.buy > results.netWorth.rent ? 'text-green-600' : 'text-blue-600'}>
                        ${Math.abs(results.netWorth.buy - results.netWorth.rent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Year-by-Year Breakdown */}
      <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                <CardTitle className="text-lg">Year-by-Year Breakdown</CardTitle>
                {breakdownOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Annual Cost (Buy)</TableHead>
                      <TableHead>Annual Cost (Rent)</TableHead>
                      <TableHead>Cumulative (Buy)</TableHead>
                      <TableHead>Cumulative (Rent)</TableHead>
                      <TableHead>Net Worth (Buy)</TableHead>
                      <TableHead>Net Worth (Rent)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.yearByYearBreakdown.map((year) => (
                      <TableRow key={year.year}>
                        <TableCell>{year.year}</TableCell>
                        <TableCell>${year.ownershipCost.toLocaleString()}</TableCell>
                        <TableCell>${year.rentalCost.toLocaleString()}</TableCell>
                        <TableCell>${year.cumulativeOwnership.toLocaleString()}</TableCell>
                        <TableCell>${year.cumulativeRental.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">${year.netWorthBuy.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-600">${year.netWorthRent.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Chart Section (placeholder) */}
      <Collapsible open={chartOpen} onOpenChange={setChartOpen}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                <CardTitle className="text-lg">Charts & Visualizations</CardTitle>
                {chartOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="text-center py-8 text-muted-foreground">
                <p>Charts and visualizations will be implemented here.</p>
                <p className="text-sm mt-2">Coming soon: Net worth comparison chart, monthly cost breakdown, etc.</p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}

// Simple calculation function (can be moved to a service later)
function calculateBuyVsRent(inputs: BuyOrRentInputs): CalculationResults {
  const {
    homePrice,
    downPayment,
    mortgageRate,
    loanTerm,
    monthlyRent,
    rentGrowthRate,
    sp500GrowthRate,
    propertyTax,
    homeInsurance,
    hoa,
    maintenance,
    yearsToAnalyze
  } = inputs

  // Calculate monthly mortgage payment
  const loanAmount = homePrice - downPayment
  const monthlyRate = mortgageRate / 100 / 12
  const numPayments = loanTerm * 12
  const monthlyPayment = monthlyRate > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments

  // Calculate annual costs
  const annualPropertyTax = propertyTax
  const annualInsurance = homeInsurance
  const annualHOA = hoa * 12
  const annualMaintenance = homePrice * (maintenance / 100)

  const yearByYearBreakdown = []
  let cumulativeOwnership = downPayment
  let cumulativeRental = 0
  let currentRent = monthlyRent
  let investmentValue = downPayment // If renting, downpayment is invested in S&P 500

  for (let year = 1; year <= yearsToAnalyze; year++) {
    // Annual ownership costs
    const annualMortgage = monthlyPayment * 12
    const ownershipCost = annualMortgage + annualPropertyTax + annualInsurance + annualHOA + annualMaintenance
    
    // Annual rental costs
    const rentalCost = currentRent * 12
    
    // Update cumulative costs
    cumulativeOwnership += ownershipCost
    cumulativeRental += rentalCost
    
    // Calculate net worth
    // For buying: home equity - remaining debt
    const paidPrincipal = (monthlyPayment * 12 * year) - (loanAmount * (mortgageRate / 100) * year) // Simplified
    const homeEquity = Math.max(0, homePrice + (homePrice * 0.02 * year)) // Assume 2% annual appreciation
    const remainingDebt = Math.max(0, loanAmount - paidPrincipal)
    const netWorthBuy = homeEquity - remainingDebt
    
    // For renting: investment growth
    investmentValue = investmentValue * (1 + sp500GrowthRate / 100) + (ownershipCost - rentalCost)
    const netWorthRent = Math.max(0, investmentValue)
    
    yearByYearBreakdown.push({
      year,
      ownershipCost: Math.round(ownershipCost),
      rentalCost: Math.round(rentalCost),
      cumulativeOwnership: Math.round(cumulativeOwnership),
      cumulativeRental: Math.round(cumulativeRental),
      netWorthBuy: Math.round(netWorthBuy),
      netWorthRent: Math.round(netWorthRent)
    })
    
    // Increase rent for next year
    currentRent = currentRent * (1 + rentGrowthRate / 100)
  }

  const finalYear = yearByYearBreakdown[yearByYearBreakdown.length - 1]
  
  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPurchaseCost: Math.round(cumulativeOwnership),
    totalRentalCost: Math.round(cumulativeRental),
    netWorth: {
      buy: finalYear.netWorthBuy,
      rent: finalYear.netWorthRent
    },
    recommendation: finalYear.netWorthBuy > finalYear.netWorthRent ? 'buy' : 'rent',
    yearByYearBreakdown
  }
}