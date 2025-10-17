import { PercentageAmountSwitch } from '@/components/inputs/PercentageAmountSwitch'
import { AssetAppreciationRateField } from '@/components/inputs/buy/AssetAppreciationRate'
import { ClosingCostsAmountField } from '@/components/inputs/buy/ClosingCostsAmount'
import { ClosingCostsPercentageField } from '@/components/inputs/buy/ClosingCostsPercentage'
import { DownPaymentAmountField } from '@/components/inputs/buy/DownPaymentAmount'
import { DownPaymentPercentageField } from '@/components/inputs/buy/DownPaymentPercentage'
import { MaintenanceAmountField } from '@/components/inputs/buy/MaintenanceAmount'
import { MaintenancePercentageField } from '@/components/inputs/buy/MaintenancePercentage'
import { MortgageLengthField } from '@/components/inputs/buy/MortgageLength'
import { MortgageRateField } from '@/components/inputs/buy/MortgageRate'
import { PropertyTaxAmountField } from '@/components/inputs/buy/PropertyTaxAmount'
import { PropertyTaxPercentageField } from '@/components/inputs/buy/PropertyTaxPercentage'
import { PurchasePriceField } from '@/components/inputs/buy/PurchasePrice'
import {
    FieldDescription,
    FieldGroup,
    FieldSeparator,
    FieldSet
} from '@/components/ui/field'

interface PurchaseInformationProps {
    purchasePrice: number
    setPurchasePrice: (value: number) => void
    defaultPurchasePrice: number
    minPurchasePrice: number
    maxPurchasePrice: number
    downPaymentPercentage: number
    setDownPaymentPercentage: (value: number) => void
    downPaymentAmount: number
    setDownPaymentAmount: (value: number) => void
    downPaymentMode: 'percentage' | 'amount'
    setDownPaymentMode: (mode: 'percentage' | 'amount') => void
    defaultDownPaymentPercentage: number
    minDownPaymentPercentage: number
    maxDownPaymentPercentage: number
    mortgageRate: number
    setMortgageRate: (value: number) => void
    defaultMortgageRate: number
    minMortgageRate: number
    maxMortgageRate: number
    mortgageLength: number
    setMortgageLength: (value: number) => void
    defaultMortgageLength: number
    minMortgageLength: number
    maxMortgageLength: number
    propertyTaxPercentage: number
    setPropertyTaxPercentage: (value: number) => void
    propertyTaxAmount: number
    setPropertyTaxAmount: (value: number) => void
    propertyTaxMode: 'percentage' | 'amount'
    setPropertyTaxMode: (mode: 'percentage' | 'amount') => void
    defaultPropertyTaxPercentage: number
    minPropertyTaxPercentage: number
    maxPropertyTaxPercentage: number
    maintenancePercentage: number
    setMaintenancePercentage: (value: number) => void
    maintenanceAmount: number
    setMaintenanceAmount: (value: number) => void
    maintenanceMode: 'percentage' | 'amount'
    setMaintenanceMode: (mode: 'percentage' | 'amount') => void
    defaultMaintenancePercentage: number
    minMaintenancePercentage: number
    maxMaintenancePercentage: number
    assetAppreciationRate: number
    setAssetAppreciationRate: (value: number) => void
    defaultAssetAppreciationRate: number
    minAssetAppreciationRate: number
    maxAssetAppreciationRate: number
    closingCostsPercentage: number
    setClosingCostsPercentage: (value: number) => void
    closingCostsAmount: number
    setClosingCostsAmount: (value: number) => void
    closingCostsMode: 'percentage' | 'amount'
    setClosingCostsMode: (mode: 'percentage' | 'amount') => void
    defaultClosingCostsPercentage: number
    minClosingCostsPercentage: number
    maxClosingCostsPercentage: number
}

export const PurchaseInformation: React.FC<PurchaseInformationProps> = ({
    purchasePrice,
    setPurchasePrice,
    defaultPurchasePrice,
    minPurchasePrice,
    maxPurchasePrice,
    downPaymentPercentage,
    setDownPaymentPercentage,
    downPaymentAmount,
    setDownPaymentAmount,
    downPaymentMode,
    setDownPaymentMode,
    defaultDownPaymentPercentage,
    minDownPaymentPercentage,
    maxDownPaymentPercentage,
    mortgageRate,
    setMortgageRate,
    defaultMortgageRate,
    minMortgageRate,
    maxMortgageRate,
    mortgageLength,
    setMortgageLength,
    defaultMortgageLength,
    minMortgageLength,
    maxMortgageLength,
    propertyTaxPercentage,
    setPropertyTaxPercentage,
    propertyTaxAmount,
    setPropertyTaxAmount,
    propertyTaxMode,
    setPropertyTaxMode,
    defaultPropertyTaxPercentage,
    minPropertyTaxPercentage,
    maxPropertyTaxPercentage,
    maintenancePercentage,
    setMaintenancePercentage,
    maintenanceAmount,
    setMaintenanceAmount,
    maintenanceMode,
    setMaintenanceMode,
    defaultMaintenancePercentage,
    minMaintenancePercentage,
    maxMaintenancePercentage,
    assetAppreciationRate,
    setAssetAppreciationRate,
    defaultAssetAppreciationRate,
    minAssetAppreciationRate,
    maxAssetAppreciationRate,
    closingCostsPercentage,
    setClosingCostsPercentage,
    closingCostsAmount,
    setClosingCostsAmount,
    closingCostsMode,
    setClosingCostsMode,
    defaultClosingCostsPercentage,
    minClosingCostsPercentage,
    maxClosingCostsPercentage,
}) => {
    // Purchase Price Component
    const purchasePriceComponent = (
        <PurchasePriceField
            value={purchasePrice}
            onChange={setPurchasePrice}
            defaultValue={defaultPurchasePrice}
            minValue={minPurchasePrice}
            maxValue={maxPurchasePrice}
            displayMode='combined'
            showDescription={false}
        />
    );

    // Down Payment Components
    const downPaymentPercentageComponent = (
        <DownPaymentPercentageField
            value={downPaymentPercentage}
            onChange={setDownPaymentPercentage}
            defaultValue={defaultDownPaymentPercentage}
            minValue={minDownPaymentPercentage}
            maxValue={maxDownPaymentPercentage}
            displayMode='combined'
            showDescription={false}
        />
    );

    const downPaymentAmountComponent = (
        <DownPaymentAmountField
            value={downPaymentAmount}
            onChange={setDownPaymentAmount}
            defaultValue={defaultDownPaymentPercentage / 100 * purchasePrice}
            minValue={minDownPaymentPercentage}
            maxValue={purchasePrice}
            displayMode='combined'
            
        />
    );

    const downPaymentSwitchComponent = (
        <PercentageAmountSwitch
            label="Down Payment"
            percentageComponent={downPaymentPercentageComponent}
            amountComponent={downPaymentAmountComponent}
            mode={downPaymentMode}
            onModeChange={setDownPaymentMode}
            percentageValue={downPaymentPercentage}
            amountValue={downPaymentAmount}
            onPercentageChange={setDownPaymentPercentage}
            onAmountChange={setDownPaymentAmount}
            totalAmount={purchasePrice}
            className="sm:col-span-1"
        />
    );

    // Mortgage Rate Component
    const mortgageRateComponent = (
        <MortgageRateField
            value={mortgageRate}
            onChange={setMortgageRate}
            defaultValue={defaultMortgageRate}
            minValue={minMortgageRate}
            maxValue={maxMortgageRate}
            displayMode='combined'
            className="sm:col-span-1"
        />
    );

    // Mortgage Length Component
    const mortgageLengthComponent = (
        <MortgageLengthField
            value={mortgageLength}
            onChange={setMortgageLength}
            defaultValue={defaultMortgageLength}
            minValue={minMortgageLength}
            maxValue={maxMortgageLength}
            displayMode='combined'
            className="sm:col-span-1"
        />
    );

    // Property Tax Components
    const propertyTaxPercentageComponent = (
        <PropertyTaxPercentageField
            value={propertyTaxPercentage}
            onChange={setPropertyTaxPercentage}
            defaultValue={defaultPropertyTaxPercentage}
            minValue={minPropertyTaxPercentage}
            maxValue={maxPropertyTaxPercentage}
            displayMode='input'
            showDescription={false}
        />
    );

    const propertyTaxAmountComponent = (
        <PropertyTaxAmountField
            value={propertyTaxAmount}
            onChange={setPropertyTaxAmount}
            defaultValue={defaultPropertyTaxPercentage / 100 * purchasePrice}
            minValue={minPropertyTaxPercentage / 100 * purchasePrice}
            maxValue={maxPropertyTaxPercentage / 100 * purchasePrice}
            displayMode='input'
            showDescription={false}
        />
    );

    const propertyTaxSwitchComponent = (
        <PercentageAmountSwitch
            label="Property Tax"
            percentageComponent={propertyTaxPercentageComponent}
            amountComponent={propertyTaxAmountComponent}
            mode={propertyTaxMode}
            onModeChange={setPropertyTaxMode}
            percentageValue={propertyTaxPercentage}
            amountValue={propertyTaxAmount}
            onPercentageChange={setPropertyTaxPercentage}
            onAmountChange={setPropertyTaxAmount}
            totalAmount={purchasePrice}
            className="sm:col-span-1"
        />
    );

    // Maintenance Components
    const maintenancePercentageComponent = (
        <MaintenancePercentageField
            value={maintenancePercentage}
            onChange={setMaintenancePercentage}
            defaultValue={defaultMaintenancePercentage}
            minValue={minMaintenancePercentage}
            maxValue={maxMaintenancePercentage}
            displayMode='input'
            showDescription={false}
        />
    );

    const maintenanceAmountComponent = (
        <MaintenanceAmountField
            value={maintenanceAmount}
            onChange={setMaintenanceAmount}
            defaultValue={defaultMaintenancePercentage / 100 * purchasePrice}
            minValue={minMaintenancePercentage / 100 * purchasePrice}
            maxValue={maxMaintenancePercentage / 100 * purchasePrice}
            displayMode='input'
            showDescription={false}
        />
    );

    const maintenanceSwitchComponent = (
        <PercentageAmountSwitch
            label="Maintenance"
            percentageComponent={maintenancePercentageComponent}
            amountComponent={maintenanceAmountComponent}
            mode={maintenanceMode}
            onModeChange={setMaintenanceMode}
            percentageValue={maintenancePercentage}
            amountValue={maintenanceAmount}
            onPercentageChange={setMaintenancePercentage}
            onAmountChange={setMaintenanceAmount}
            totalAmount={purchasePrice}
            className="sm:col-span-1"
        />
    );

    // Asset Appreciation Rate Component
    const assetAppreciationRateComponent = (
        <AssetAppreciationRateField
            value={assetAppreciationRate}
            onChange={setAssetAppreciationRate}
            defaultValue={defaultAssetAppreciationRate}
            minValue={minAssetAppreciationRate}
            maxValue={maxAssetAppreciationRate}
            displayMode='combined'
            className="sm:col-span-1"
        />
    );

    // Closing Costs Components
    const closingCostsPercentageComponent = (
        <ClosingCostsPercentageField
            value={closingCostsPercentage}
            onChange={setClosingCostsPercentage}
            defaultValue={defaultClosingCostsPercentage}
            minValue={minClosingCostsPercentage}
            maxValue={maxClosingCostsPercentage}
            displayMode='input'
            showDescription={false}
        />
    );

    const closingCostsAmountComponent = (
        <ClosingCostsAmountField
            value={closingCostsAmount}
            onChange={setClosingCostsAmount}
            defaultValue={defaultClosingCostsPercentage / 100 * purchasePrice}
            minValue={minClosingCostsPercentage / 100 * purchasePrice}
            maxValue={maxClosingCostsPercentage / 100 * purchasePrice}
            displayMode='input'
            showDescription={false}
        />
    );

    const closingCostsSwitchComponent = (
        <PercentageAmountSwitch
            label="Closing Costs"
            percentageComponent={closingCostsPercentageComponent}
            amountComponent={closingCostsAmountComponent}
            mode={closingCostsMode}
            onModeChange={setClosingCostsMode}
            percentageValue={closingCostsPercentage}
            amountValue={closingCostsAmount}
            onPercentageChange={setClosingCostsPercentage}
            onAmountChange={setClosingCostsAmount}
            totalAmount={purchasePrice}
            className="sm:col-span-1"
        />
    );

    return (
        <FieldSet>
            <FieldDescription>
                Purchase terms
            </FieldDescription>

            <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Purchase Price */}
                    {purchasePriceComponent}

                    {purchasePrice > 0 && (
                        <>
                            {/* Down Payment with Percentage/Amount Switch */}
                            {downPaymentSwitchComponent}
                        </>
                    )}
                </div>
                {purchasePrice > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Closing Costs with Percentage/Amount Switch */}
                        {closingCostsSwitchComponent}
                    </div>
                )}
            </FieldGroup>

            {purchasePrice > 0 && (
                <>
                    <FieldSeparator />

                    <FieldGroup>
                        <FieldDescription>
                            Mortgage interest rate and amortization period
                        </FieldDescription>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Mortgage Rate */}
                            {mortgageRateComponent}

                            {/* Mortgage Length */}
                            {mortgageLengthComponent}
                        </div>
                    </FieldGroup>

                    <FieldSeparator />

                    <FieldGroup>
                        <FieldDescription>
                            Ongoing property taxes and maintenance expenses
                        </FieldDescription>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Property Tax with Percentage/Amount Switch */}
                            {propertyTaxSwitchComponent}

                            {/* Annual Maintenance with Percentage/Amount Switch */}
                            {maintenanceSwitchComponent}
                        </div>
                    </FieldGroup>

                    <FieldSeparator />

                    <FieldGroup>
                        <FieldDescription>
                            Expected property value appreciation
                        </FieldDescription>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Asset Appreciation Rate */}
                            {assetAppreciationRateComponent}
                        </div>
                    </FieldGroup>
                </>
            )}
        </FieldSet>
    )
}