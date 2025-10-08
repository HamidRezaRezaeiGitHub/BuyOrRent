import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeShowcase } from '../components/theme/ThemeShowcase';
import { QuestionnairePage } from '../pages';
import { Circumstance1 } from '../components/circumstances';

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Home route - Questionnaire Page */}
            <Route path="/" element={<QuestionnairePage />} />

            {/* Situation routes */}
            <Route path="/situation/1" element={<Circumstance1 />} />

            {/* Temporary component showcase routes */}
            <Route path="/temp/theme" element={<ThemeShowcase />} />

            {/* Catch-all route - redirect any undefined path to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;