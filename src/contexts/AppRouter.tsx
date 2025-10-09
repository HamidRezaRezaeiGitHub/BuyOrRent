import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeShowcase } from '../components/theme/ThemeShowcase';
import { QuestionnairePage } from '../pages';
import { Situation1 } from '../components/situations';
import { RentQuestions, PurchaseQuestions, InvestmentQuestions } from '../components/situations/1/inputs';

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Home route - Questionnaire Page */}
            <Route path="/" element={<QuestionnairePage />} />

            {/* Situation 1 routes */}
            <Route 
                path="/situation/1/question/rent" 
                element={
                    <RentQuestions 
                        previousUrl="/"
                        nextUrl="/situation/1/question/purchase"
                    />
                } 
            />
            <Route 
                path="/situation/1/question/purchase" 
                element={
                    <PurchaseQuestions 
                        previousUrl="/situation/1/question/rent"
                        nextUrl="/situation/1/question/investment"
                    />
                } 
            />
            <Route 
                path="/situation/1/question/investment" 
                element={
                    <InvestmentQuestions 
                        previousUrl="/situation/1/question/purchase"
                        nextUrl="/situation/1/panel"
                    />
                } 
            />
            <Route path="/situation/1/panel" element={<Situation1 />} />
            <Route path="/situation/1" element={<Situation1 />} />

            {/* Temporary component showcase routes */}
            <Route path="/temp/theme" element={<ThemeShowcase />} />

            {/* Catch-all route - redirect any undefined path to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;