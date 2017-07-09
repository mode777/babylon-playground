export function clamp(value: number, min: number, max: number){
    return Math.min(max, Math.max(min, value));
}

export function step(value: number, target: number, step: number){
    
    if (value < target){
        const newValue = value + step;
        return Math.min(newValue, target);
    }

    if(value > target){
        const newValue = value - step;
        return Math.max(newValue, target);
    }
    
    return value;
}