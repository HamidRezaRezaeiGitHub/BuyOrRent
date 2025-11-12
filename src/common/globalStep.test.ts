import '@testing-library/jest-dom';


import {
    buildComponentStepMap,
    localToGlobalStep,
    globalToLocalStep,
    getTotalSteps,
    getComponentRoute,
    buildNavigationUrl
} from './globalStep'

describe('Global Step Cursor Helper', () => {
    describe('buildComponentStepMap', () => {
        it('should build correct mappings for all components', () => {
            const mappings = buildComponentStepMap()
            
            expect(mappings).toHaveLength(3)
            
            // RentQuestions: steps 1-2 (2 steps)
            expect(mappings[0]).toEqual({
                component: 'RentQuestions',
                stepCount: 2,
                globalStepStart: 1,
                globalStepEnd: 2
            })
            
            // PurchaseQuestions: steps 3-11 (9 steps)
            expect(mappings[1]).toEqual({
                component: 'PurchaseQuestions',
                stepCount: 9,
                globalStepStart: 3,
                globalStepEnd: 11
            })
            
            // InvestmentQuestions: step 12 (1 step)
            expect(mappings[2]).toEqual({
                component: 'InvestmentQuestions',
                stepCount: 1,
                globalStepStart: 12,
                globalStepEnd: 12
            })
        })
        
        it('should have contiguous step ranges', () => {
            const mappings = buildComponentStepMap()
            
            for (let i = 0; i < mappings.length - 1; i++) {
                expect(mappings[i].globalStepEnd + 1).toBe(mappings[i + 1].globalStepStart)
            }
        })
    })
    
    describe('getTotalSteps', () => {
        it('should return 12 total steps', () => {
            expect(getTotalSteps()).toBe(12)
        })
    })
    
    describe('localToGlobalStep', () => {
        it('should convert RentQuestions local steps correctly', () => {
            expect(localToGlobalStep('RentQuestions', 1)).toBe(1)
            expect(localToGlobalStep('RentQuestions', 2)).toBe(2)
        })
        
        it('should convert PurchaseQuestions local steps correctly', () => {
            expect(localToGlobalStep('PurchaseQuestions', 1)).toBe(3)
            expect(localToGlobalStep('PurchaseQuestions', 2)).toBe(4)
            expect(localToGlobalStep('PurchaseQuestions', 9)).toBe(11)
        })
        
        it('should convert InvestmentQuestions local step correctly', () => {
            expect(localToGlobalStep('InvestmentQuestions', 1)).toBe(12)
        })
        
        it('should return null for unknown component', () => {
            expect(localToGlobalStep('UnknownComponent', 1)).toBeNull()
        })
        
        it('should return null for out of range local step', () => {
            expect(localToGlobalStep('RentQuestions', 0)).toBeNull()
            expect(localToGlobalStep('RentQuestions', 3)).toBeNull()
            expect(localToGlobalStep('PurchaseQuestions', 10)).toBeNull()
        })
    })
    
    describe('globalToLocalStep', () => {
        it('should convert global steps 1-2 to RentQuestions', () => {
            expect(globalToLocalStep(1)).toEqual({
                component: 'RentQuestions',
                localStep: 1
            })
            expect(globalToLocalStep(2)).toEqual({
                component: 'RentQuestions',
                localStep: 2
            })
        })
        
        it('should convert global steps 3-11 to PurchaseQuestions', () => {
            expect(globalToLocalStep(3)).toEqual({
                component: 'PurchaseQuestions',
                localStep: 1
            })
            expect(globalToLocalStep(4)).toEqual({
                component: 'PurchaseQuestions',
                localStep: 2
            })
            expect(globalToLocalStep(11)).toEqual({
                component: 'PurchaseQuestions',
                localStep: 9
            })
        })
        
        it('should convert global step 12 to InvestmentQuestions', () => {
            expect(globalToLocalStep(12)).toEqual({
                component: 'InvestmentQuestions',
                localStep: 1
            })
        })
        
        it('should return null for out of range global step', () => {
            expect(globalToLocalStep(0)).toBeNull()
            expect(globalToLocalStep(13)).toBeNull()
            expect(globalToLocalStep(-1)).toBeNull()
        })
    })
    
    describe('getComponentRoute', () => {
        it('should return correct routes for all components', () => {
            expect(getComponentRoute('RentQuestions')).toBe('/situation/1/question/rent')
            expect(getComponentRoute('PurchaseQuestions')).toBe('/situation/1/question/purchase')
            expect(getComponentRoute('InvestmentQuestions')).toBe('/situation/1/question/investment')
        })
        
        it('should return null for unknown component', () => {
            expect(getComponentRoute('UnknownComponent')).toBeNull()
        })
    })
    
    describe('buildNavigationUrl', () => {
        it('should build URL for RentQuestions step 1', () => {
            const url = buildNavigationUrl(1)
            expect(url).toBe('/situation/1/question/rent?gs=1')
        })
        
        it('should build URL for PurchaseQuestions step 5 (global step 7)', () => {
            const url = buildNavigationUrl(7)
            expect(url).toBe('/situation/1/question/purchase?gs=7')
        })
        
        it('should build URL for InvestmentQuestions', () => {
            const url = buildNavigationUrl(12)
            expect(url).toBe('/situation/1/question/investment?gs=12')
        })
        
        it('should preserve data params when building URL', () => {
            const dataParams = new URLSearchParams({
                monthlyRent: '2400',
                rentIncrease: '2.5'
            })
            const url = buildNavigationUrl(3, dataParams)
            
            expect(url).toContain('/situation/1/question/purchase?')
            expect(url).toContain('gs=3')
            expect(url).toContain('monthlyRent=2400')
            expect(url).toContain('rentIncrease=2.5')
        })
        
        it('should return null for invalid global step', () => {
            expect(buildNavigationUrl(0)).toBeNull()
            expect(buildNavigationUrl(13)).toBeNull()
        })
        
        it('should handle existing gs param in dataParams', () => {
            const dataParams = new URLSearchParams({
                gs: '5',
                monthlyRent: '2400'
            })
            const url = buildNavigationUrl(7, dataParams)
            
            // gs should be overridden to the target global step
            expect(url).toContain('gs=7')
            expect(url).toContain('monthlyRent=2400')
        })
    })
    
    describe('Integration: Round-trip conversions', () => {
        it('should maintain consistency in forward and backward conversions', () => {
            // Test all global steps
            for (let gs = 1; gs <= 12; gs++) {
                const localInfo = globalToLocalStep(gs)
                expect(localInfo).not.toBeNull()
                
                if (localInfo) {
                    const convertedGlobalStep = localToGlobalStep(localInfo.component, localInfo.localStep)
                    expect(convertedGlobalStep).toBe(gs)
                }
            }
        })
    })
})
