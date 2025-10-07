import { MonthlyRentField } from '@/components/inputs/rent/MonthlyRent'
import { RentIncreaseField } from '@/components/inputs/rent/RentIncrease'
import {
    FieldDescription,
    FieldGroup,
    FieldSet,
} from '@/components/ui/field'

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
        <FieldSet>
            <FieldDescription>
                Current or expected rental costs and annual increases
            </FieldDescription>
            <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <MonthlyRentField
                        value={monthlyRent}
                        onChange={setMonthlyRent}
                        defaultValue={defaultMonthlyRent}
                        minValue={minMonthlyRent}
                        maxValue={maxMonthlyRent}
                        displayMode='combined'
                        showDescription={true}
                    />
                    {monthlyRent > 0 && (
                        <RentIncreaseField
                            value={rentIncrease}
                            onChange={setRentIncrease}
                            defaultValue={defaultRentIncrease}
                            minValue={minRentIncrease}
                            maxValue={maxRentIncrease}
                            displayMode='input'
                            showDescription={false}
                            className="sm:col-span-1"
                        />
                    )}
                </div>
            </FieldGroup>
        </FieldSet>
    )
}