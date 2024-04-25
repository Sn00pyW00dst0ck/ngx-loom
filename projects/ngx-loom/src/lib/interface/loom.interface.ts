/**
 * 
 */
export interface Node {
    /**
     * 
     */
    id: string,
    /**
     * 
     */
    position: { x: number, y: number },
    /**
     * 
     */
    dimension: { w: number, h: number },
    /**
     * 
     */
    label: string
};

/**
 * 
 */
export interface Edge {
    /**
     * 
     */
    id: string,
    /**
     * 
     */
    source: string,
    /**
     * 
     */
    target: string,
    /**
     * 
     */
    label: string
};

/**
 * 
 */
export interface Matrix {
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
};