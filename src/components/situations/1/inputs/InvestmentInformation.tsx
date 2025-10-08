import { InvestmentReturnField } from '@/components/inputs/invest/InvestmentReturn'
import {
    FieldDescription,
    FieldGroup,
    FieldSet
} from '@/components/ui/field'

interface InvestmentInformationProps {
    investmentReturn: number
    setInvestmentReturn: (value: number) => void
}

export const InvestmentInformation: React.FC<InvestmentInformationProps> = ({
    investmentReturn,
    setInvestmentReturn,
}) => {
    return (
        <FieldSet>
            <FieldDescription>
                Expected annual return rate for alternative investments if you choose to rent instead of buying
            </FieldDescription>
            <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InvestmentReturnField
                        value={investmentReturn}
                        onChange={setInvestmentReturn}
                        showHelper={true}
                    />
                </div>
            </FieldGroup>
        </FieldSet>
    )
}