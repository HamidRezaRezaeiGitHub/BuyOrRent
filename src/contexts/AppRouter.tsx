import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeShowcase } from '../components/theme/ThemeShowcase';
import { MainAppPage } from '../pages';

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Home route - Main Application */}
            <Route path="/" element={<MainAppPage />} />

            {/* Temporary component showcase routes */}
            <Route path="/temp/theme" element={<ThemeShowcase />} />

            {/* Catch-all route - redirect any undefined path to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;