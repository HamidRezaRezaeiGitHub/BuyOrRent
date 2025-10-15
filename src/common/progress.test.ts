/**
 * @jest-environment jsdom
 */

import { calculateProgress, computeProgressSegments, getSegmentForComponent } from './progress'

describe('Progress Helper', () => {
    describe('computeProgressSegments', () => {
        it('should compute segments that span 0-100', () => {
            const segments = computeProgressSegments()
            
            // Check that we have all expected components
            expect(segments).toHaveProperty('RentQuestions')
            expect(segments).toHaveProperty('PurchaseQuestions')
            expect(segments).toHaveProperty('InvestmentQuestions')
            
            // Check that segments are contiguous and span 0-100
            expect(segments.RentQuestions.progressMin).toBe(0)
            expect(segments.InvestmentQuestions.progressMax).toBeCloseTo(100, 1)
        })

        it('should allocate progress proportionally based on step counts', () => {
            const segments = computeProgressSegments()
            
            // Total steps: 2 + 8 + 1 = 11
            // RentQuestions: 2/11 ≈ 18.18%
            // PurchaseQuestions: 8/11 ≈ 72.73%
            // InvestmentQuestions: 1/11 ≈ 9.09%
            
            expect(segments.RentQuestions.stepCount).toBe(2)
            expect(segments.PurchaseQuestions.stepCount).toBe(8)
            expect(segments.InvestmentQuestions.stepCount).toBe(1)
            
            // Check approximate ranges
            expect(segments.RentQuestions.progressMax).toBeCloseTo(18.18, 1)
            expect(segments.PurchaseQuestions.progressMin).toBeCloseTo(18.18, 1)
            expect(segments.PurchaseQuestions.progressMax).toBeCloseTo(90.91, 1)
        })

        it('should ensure segments are contiguous', () => {
            const segments = computeProgressSegments()
            
            // RentQuestions ends where PurchaseQuestions starts
            expect(segments.RentQuestions.progressMax).toBeCloseTo(segments.PurchaseQuestions.progressMin, 5)
            
            // PurchaseQuestions ends where InvestmentQuestions starts
            expect(segments.PurchaseQuestions.progressMax).toBeCloseTo(segments.InvestmentQuestions.progressMin, 5)
        })
    })

    describe('calculateProgress', () => {
        it('should return progressMin for step 1 of RentQuestions', () => {
            const progress = calculateProgress('RentQuestions', 1)
            
            // Step 1 should show progressMin (0%)
            expect(progress).toBe(0)
        })

        it('should interpolate progress for RentQuestions step 2', () => {
            const progress = calculateProgress('RentQuestions', 2)
            const segments = computeProgressSegments()
            
            // Step 2 of 2 should be at progressMin + half the range
            const expected = segments.RentQuestions.progressMin + 
                (segments.RentQuestions.progressMax - segments.RentQuestions.progressMin) / 2
            expect(progress).toBeCloseTo(expected, 1)
        })

        it('should return progressMin for step 1 of PurchaseQuestions', () => {
            const segments = computeProgressSegments()
            const progress = calculateProgress('PurchaseQuestions', 1)
            
            // Step 1 should show progressMin (≈18.18%)
            expect(progress).toBeCloseTo(segments.PurchaseQuestions.progressMin, 1)
        })

        it('should interpolate through all steps of PurchaseQuestions', () => {
            const segments = computeProgressSegments()
            
            // Test all 8 steps
            for (let step = 1; step <= 8; step++) {
                const progress = calculateProgress('PurchaseQuestions', step)
                
                // Progress should be within the segment bounds
                expect(progress).toBeGreaterThanOrEqual(segments.PurchaseQuestions.progressMin - 0.1)
                expect(progress).toBeLessThanOrEqual(segments.PurchaseQuestions.progressMax + 0.1)
                
                // Each step should have higher progress than the previous
                if (step > 1) {
                    const prevProgress = calculateProgress('PurchaseQuestions', step - 1)
                    expect(progress).toBeGreaterThan(prevProgress)
                }
            }
        })

        it('should return progressMin for InvestmentQuestions (single step)', () => {
            const segments = computeProgressSegments()
            const progress = calculateProgress('InvestmentQuestions', 1)
            
            // Single step should show progressMin (≈90.91%)
            expect(progress).toBeCloseTo(segments.InvestmentQuestions.progressMin, 1)
        })

        it('should handle unknown components gracefully', () => {
            const progress = calculateProgress('UnknownComponent', 1)
            expect(progress).toBe(0)
        })
    })

    describe('getSegmentForComponent', () => {
        it('should return the correct segment for a known component', () => {
            const segment = getSegmentForComponent('RentQuestions')
            
            expect(segment).toBeDefined()
            expect(segment?.progressMin).toBe(0)
            expect(segment?.stepCount).toBe(2)
        })

        it('should return undefined for an unknown component', () => {
            const segment = getSegmentForComponent('UnknownComponent')
            expect(segment).toBeUndefined()
        })
    })
})
