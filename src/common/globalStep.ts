/**
 * Global Step Cursor Helper
 * 
 * Manages global step navigation across question components.
 * Maps component-local steps to/from a global step index (gs).
 */

import manifest from '@/config/journey/situation1.manifest.json'

/**
 * Component step mapping for a section
 */
export type ComponentStepMap = {
    component: string
    stepCount: number
    globalStepStart: number // First global step (1-indexed)
    globalStepEnd: number   // Last global step (1-indexed)
}

/**
 * Build a map of component names to their global step ranges
 * 
 * @returns Array of component step mappings
 */
export function buildComponentStepMap(): ComponentStepMap[] {
    const sections = manifest.sections
    const mappings: ComponentStepMap[] = []
    let currentGlobalStep = 1
    
    for (const section of sections) {
        mappings.push({
            component: section.component,
            stepCount: section.stepCount,
            globalStepStart: currentGlobalStep,
            globalStepEnd: currentGlobalStep + section.stepCount - 1
        })
        currentGlobalStep += section.stepCount
    }
    
    return mappings
}

/**
 * Convert a component-local step to a global step
 * 
 * @param componentName - The component name (e.g., "RentQuestions")
 * @param localStep - The local step within the component (1-indexed)
 * @returns The global step index (1-indexed) or null if invalid
 */
export function localToGlobalStep(componentName: string, localStep: number): number | null {
    const mappings = buildComponentStepMap()
    const mapping = mappings.find(m => m.component === componentName)
    
    if (!mapping) {
        console.warn(`Component "${componentName}" not found in step mappings`)
        return null
    }
    
    if (localStep < 1 || localStep > mapping.stepCount) {
        console.warn(`Local step ${localStep} out of range for ${componentName} (1-${mapping.stepCount})`)
        return null
    }
    
    return mapping.globalStepStart + localStep - 1
}

/**
 * Convert a global step to component name and local step
 * 
 * @param globalStep - The global step index (1-indexed)
 * @returns Object with component name and local step, or null if invalid
 */
export function globalToLocalStep(globalStep: number): { component: string, localStep: number } | null {
    const mappings = buildComponentStepMap()
    
    for (const mapping of mappings) {
        if (globalStep >= mapping.globalStepStart && globalStep <= mapping.globalStepEnd) {
            return {
                component: mapping.component,
                localStep: globalStep - mapping.globalStepStart + 1
            }
        }
    }
    
    console.warn(`Global step ${globalStep} is out of range`)
    return null
}

/**
 * Get the total number of steps across all components
 * 
 * @returns Total step count
 */
export function getTotalSteps(): number {
    const sections = manifest.sections
    return sections.reduce((sum, section) => sum + section.stepCount, 0)
}

/**
 * Get the component route path for a given component name
 * 
 * @param componentName - The component name
 * @returns The route path or null if not found
 */
export function getComponentRoute(componentName: string): string | null {
    const routeMap: Record<string, string> = {
        'RentQuestions': '/situation/1/question/rent',
        'PurchaseQuestions': '/situation/1/question/purchase',
        'InvestmentQuestions': '/situation/1/question/investment'
    }
    
    return routeMap[componentName] || null
}

/**
 * Build navigation URL with global step and data params
 * 
 * @param globalStep - The target global step
 * @param dataParams - URLSearchParams with data to preserve
 * @returns Complete URL with path, gs, and data params, or null if invalid step
 */
export function buildNavigationUrl(globalStep: number, dataParams?: URLSearchParams): string | null {
    const stepInfo = globalToLocalStep(globalStep)
    if (!stepInfo) return null
    
    const route = getComponentRoute(stepInfo.component)
    if (!route) return null
    
    const params = new URLSearchParams(dataParams)
    params.set('gs', globalStep.toString())
    
    return `${route}?${params.toString()}`
}
