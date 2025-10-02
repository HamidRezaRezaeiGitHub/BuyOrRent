import { FlexibleNavbar } from '@/components/navbar';
import { CompactThemeToggle } from '@/components/theme';
import React, { useCallback, useMemo, useState } from 'react';
import { AddressData } from '../components/address';
import FlexibleAddressForm, { AddressFieldConfig } from '../components/address/FlexibleAddressForm';

export const AddressFormPage: React.FC = () => {
    const [addressData, setAddressData] = useState<AddressData>({
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        city: '',
        stateOrProvince: '',
        postalOrZipCode: '',
        country: ''
    });

    const customFieldsConfig: AddressFieldConfig[] = useMemo(() => [
        { field: 'unitNumber', colSpan: 1, required: false, label: 'Unit Number' },
        { field: 'streetNumberName', colSpan: 1, required: true, label: 'Street Address' },
        { field: 'city', colSpan: 1, required: true, label: 'City' },
        { field: 'stateOrProvince', colSpan: 1, required: true, label: 'Province' },
        { field: 'country', colSpan: 1, required: true, label: 'Country' },
        { field: 'postalOrZipCode', colSpan: 1, required: true, label: 'Postal Code' }
    ], []); // Empty dependency array since this config is static

    // Memoize the change handler to prevent unnecessary re-renders
    const handleAddressChange = useCallback((field: keyof AddressData, value: string) => {
        setAddressData(prev => ({ ...prev, [field]: value }));
    }, []); // Empty dependency array since setAddressData is stable

    // Memoize the submit handler to prevent unnecessary re-renders
    const handleSubmit = useCallback((data: AddressData) => {
        console.log('Address submitted:', data);
        alert('Address form submitted! Check console for details.');
    }, []); // Empty dependency array since this logic is static

    return (
        <div className="min-h-screen bg-background">

            {/* Flexible Navbar with Compact Theme Toggle */}
            <FlexibleNavbar
                brandText="BuyOrRent"
                showAuthButtons={false}
                showThemeToggle={true}
                ThemeToggleComponent={CompactThemeToggle}
            />

            {/* Mobile-optimized container with proper spacing */}
            <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8">

                {/* Header section with mobile-friendly spacing */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Address Information</h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Please provide your complete address details.
                    </p>
                </div>

                {/* Form section with mobile-optimized configuration */}
                <FlexibleAddressForm
                    addressData={addressData}
                    onAddressChange={handleAddressChange}
                    onSubmit={handleSubmit}
                    fieldsConfig={customFieldsConfig}
                    enableValidation={true}
                    maxColumns={2}
                    isSkippable={false}
                    showAddressPanelHeader={false}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default AddressFormPage;