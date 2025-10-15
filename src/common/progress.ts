/**
 * Journey Progress Helper
 * 
 * Computes deterministic progress segments for each section in a situation's journey.
 * Progress interpolates between progressMin and progressMax based on current step within a section.
 */

import manifest from '@/config/journey/situation1.manifest.json'

export type Segment = {
    progressMin: number
    progressMax: number
    stepCount: number
}

export type SegmentsByComponent = Record<string, Segment>

/**
 * Compute contiguous progress segments for all sections defined in the manifest.
 * Each section gets a proportional share of the 0-100 progress range based on its step count.
 * 
 * @returns A map of component names to their progress segments
 */
export function computeProgressSegments(): SegmentsByComponent {
    const sections = manifest.sections
    const totalSteps = sections.reduce((sum, section) => sum + section.stepCount, 0)
    
    const segments: SegmentsByComponent = {}
    let currentProgress = 0
    
    for (const section of sections) {
        const progressMin = currentProgress
        const progressRange = (section.stepCount / totalSteps) * 100
        const progressMax = currentProgress + progressRange
        
        segments[section.component] = {
            progressMin,
            progressMax,
            stepCount: section.stepCount
        }
        
        currentProgress = progressMax
    }
    
    return segments
}

/**
 * Calculate the current progress percentage for a given component and step.
 * Progress starts at progressMin and increases linearly as user advances through steps.
 * 
 * @param componentName - The name of the component (e.g., "RentQuestions")
 * @param currentStep - The current step within the component (1-indexed)
 * @returns The progress percentage (0-100)
 */
export function calculateProgress(componentName: string, currentStep: number): number {
    const segments = computeProgressSegments()
    const segment = segments[componentName]
    
    if (!segment) {
        console.warn(`Component "${componentName}" not found in progress segments`)
        return 0
    }
    
    // Progress starts at progressMin and increases as steps are completed
    // Step 1 shows progressMin, step 2 shows partial progress, etc.
    const progressPerStep = (segment.progressMax - segment.progressMin) / segment.stepCount
    const progress = segment.progressMin + (progressPerStep * (currentStep - 1))
    
    // Clamp to segment boundaries
    return Math.max(segment.progressMin, Math.min(segment.progressMax, progress))
}

/**
 * Get the progress segment for a specific component.
 * Useful for passing progressMin/progressMax as props.
 * 
 * @param componentName - The name of the component
 * @returns The segment information or undefined if not found
 */
export function getSegmentForComponent(componentName: string): Segment | undefined {
    const segments = computeProgressSegments()
    return segments[componentName]
}
