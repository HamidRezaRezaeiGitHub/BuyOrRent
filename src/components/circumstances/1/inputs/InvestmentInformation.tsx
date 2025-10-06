import { InvestmentReturnField } from '@/components/inputs/invest/InvestmentReturn'

interface InvestmentInformationProps {
    investmentReturn: number
    setInvestmentReturn: (value: number) => void
}

export const InvestmentInformation: React.FC<InvestmentInformationProps> = ({
    investmentReturn,
    setInvestmentReturn,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InvestmentReturnField
                value={investmentReturn}
                onChange={setInvestmentReturn}
                showHelper={true}
            />
        </div>
    )
}