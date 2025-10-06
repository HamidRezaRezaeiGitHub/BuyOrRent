import { MonthlyRentField } from '@/components/inputs/rent/MonthlyRent'
import { RentIncreaseField } from '@/components/inputs/rent/RentIncrease'

interface RentalInformationProps {
    monthlyRent: number
    setMonthlyRent: (value: number) => void
    defaultMonthlyRent: number
    minMonthlyRent: number
    maxMonthlyRent: number
    rentIncrease: number
    setRentIncrease: (value: number) => void
    defaultRentIncrease: number
    minRentIncrease: number
    maxRentIncrease: number
}

export const RentalInformation: React.FC<RentalInformationProps> = ({
    monthlyRent,
    setMonthlyRent,
    defaultMonthlyRent,
    minMonthlyRent,
    maxMonthlyRent,
    rentIncrease,
    setRentIncrease,
    defaultRentIncrease,
    minRentIncrease,
    maxRentIncrease,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <MonthlyRentField
                value={monthlyRent}
                onChange={setMonthlyRent}
                defaultValue={defaultMonthlyRent}
                minValue={minMonthlyRent}
                maxValue={maxMonthlyRent}
                displayMode='combined'
            />
            <RentIncreaseField
                value={rentIncrease}
                onChange={setRentIncrease}
                defaultValue={defaultRentIncrease}
                minValue={minRentIncrease}
                maxValue={maxRentIncrease}
                displayMode='combined'
            />
        </div>
    )
}