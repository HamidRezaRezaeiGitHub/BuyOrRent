import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';


export const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Catch-all route - redirect any undefined path to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;