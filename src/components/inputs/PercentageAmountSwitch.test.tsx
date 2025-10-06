import { fireEvent, render, screen } from '@testing-library/react';
import { PercentageAmountSwitch } from './PercentageAmountSwitch';

describe('PercentageAmountSwitch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic Rendering Tests
    describe('Basic Rendering', () => {
        test('PercentageAmountSwitch_shouldRenderWithDefaultProps', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            expect(screen.getByText('Test Field')).toBeInTheDocument();
            expect(screen.getByText('Percentage (%)')).toBeInTheDocument();
            expect(screen.getByText('Amount ($)')).toBeInTheDocument();
            expect(screen.getByText('Percentage Component')).toBeInTheDocument();
        });

        test('PercentageAmountSwitch_shouldRenderPercentageMode', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            expect(screen.getByText('Percentage Component')).toBeInTheDocument();
            expect(screen.queryByText('Amount Component')).not.toBeInTheDocument();
        });

        test('PercentageAmountSwitch_shouldRenderAmountMode', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="amount"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            expect(screen.getByText('Amount Component')).toBeInTheDocument();
            expect(screen.queryByText('Percentage Component')).not.toBeInTheDocument();
        });
    });

    // Mode Switching Tests
    describe('Mode Switching', () => {
        test('PercentageAmountSwitch_shouldSwitchToAmountMode_whenAmountRadioSelected', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            const amountRadio = screen.getByLabelText('Amount ($)');
            fireEvent.click(amountRadio);

            expect(mockOnModeChange).toHaveBeenCalledWith('amount');
        });

        test('PercentageAmountSwitch_shouldSwitchToPercentageMode_whenPercentageRadioSelected', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="amount"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            const percentageRadio = screen.getByLabelText('Percentage (%)');
            fireEvent.click(percentageRadio);

            expect(mockOnModeChange).toHaveBeenCalledWith('percentage');
        });
    });

    // Value Calculation Tests
    describe('Value Calculation', () => {
        test('PercentageAmountSwitch_shouldCalculateAmount_whenSwitchingToAmountMode', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            const amountRadio = screen.getByLabelText('Amount ($)');
            fireEvent.click(amountRadio);

            // 20% of 250000 = 50000
            expect(mockOnAmountChange).toHaveBeenCalledWith(50000);
        });

        test('PercentageAmountSwitch_shouldCalculatePercentage_whenSwitchingToPercentageMode', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="amount"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            const percentageRadio = screen.getByLabelText('Percentage (%)');
            fireEvent.click(percentageRadio);

            // 50000 / 250000 * 100 = 20%
            expect(mockOnPercentageChange).toHaveBeenCalledWith(20);
        });

        test('PercentageAmountSwitch_shouldHandleTotalAmountAsCallback', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();
            const mockGetTotalAmount = jest.fn(() => 300000);

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={15}
                    amountValue={45000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={mockGetTotalAmount}
                />
            );

            const amountRadio = screen.getByLabelText('Amount ($)');
            fireEvent.click(amountRadio);

            expect(mockGetTotalAmount).toHaveBeenCalled();
            // 15% of 300000 = 45000
            expect(mockOnAmountChange).toHaveBeenCalledWith(45000);
        });

        test('PercentageAmountSwitch_shouldNotCalculate_whenTotalAmountIsZero', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={0}
                />
            );

            const amountRadio = screen.getByLabelText('Amount ($)');
            fireEvent.click(amountRadio);

            expect(mockOnModeChange).toHaveBeenCalledWith('amount');
            expect(mockOnAmountChange).not.toHaveBeenCalled();
        });

        test('PercentageAmountSwitch_shouldNotCalculate_whenTotalAmountIsUndefined', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                />
            );

            const amountRadio = screen.getByLabelText('Amount ($)');
            fireEvent.click(amountRadio);

            expect(mockOnModeChange).toHaveBeenCalledWith('amount');
            expect(mockOnAmountChange).not.toHaveBeenCalled();
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('PercentageAmountSwitch_shouldNotSwitch_whenDisabled', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                    disabled={true}
                />
            );

            const amountRadio = screen.getByLabelText('Amount ($)');
            fireEvent.click(amountRadio);

            expect(mockOnModeChange).not.toHaveBeenCalled();
        });
    });

    // Props Update Tests
    describe('Props Update', () => {
        test('PercentageAmountSwitch_shouldUpdateMode_whenModePropChanges', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            const { rerender } = render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            expect(screen.getByText('Percentage Component')).toBeInTheDocument();

            rerender(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="amount"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            expect(screen.getByText('Amount Component')).toBeInTheDocument();
        });
    });

    // Custom Props Tests
    describe('Custom Props', () => {
        test('PercentageAmountSwitch_shouldRenderWithCustomId', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            render(
                <PercentageAmountSwitch
                    id="customId"
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                />
            );

            expect(document.querySelector('#customId-percentage')).toBeInTheDocument();
            expect(document.querySelector('#customId-amount')).toBeInTheDocument();
        });

        test('PercentageAmountSwitch_shouldRenderWithCustomClassName', () => {
            const mockOnModeChange = jest.fn();
            const mockOnPercentageChange = jest.fn();
            const mockOnAmountChange = jest.fn();

            const percentageComponent = <div>Percentage Component</div>;
            const amountComponent = <div>Amount Component</div>;

            const { container } = render(
                <PercentageAmountSwitch
                    label="Test Field"
                    percentageComponent={percentageComponent}
                    amountComponent={amountComponent}
                    mode="percentage"
                    onModeChange={mockOnModeChange}
                    percentageValue={20}
                    amountValue={50000}
                    onPercentageChange={mockOnPercentageChange}
                    onAmountChange={mockOnAmountChange}
                    totalAmount={250000}
                    className="custom-class"
                />
            );

            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });
    });
});
