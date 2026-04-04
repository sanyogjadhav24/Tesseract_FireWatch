// Utility functions for 3D simulation

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    distance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    clone() {
        return new Vector2(this.x, this.y);
    }
    
    sub(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    mul(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y);
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }
    
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

// Simple pathfinding algorithm
class PathFinder {
    constructor(gridSize = 100, cellSize = 1) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    }
    
    setObstacle(x, y, value) {
        const gx = Math.floor(x / this.cellSize);
        const gy = Math.floor(y / this.cellSize);
        if (gx >= 0 && gx < this.gridSize && gy >= 0 && gy < this.gridSize) {
            this.grid[gy][gx] = value;
        }
    }
    
    findPath(start, goal) {
        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const key = (p) => `${Math.round(p.x)},${Math.round(p.y)}`;
        
        gScore.set(key(start), 0);
        fScore.set(key(start), this.heuristic(start, goal));
        
        while (openSet.length > 0) {
            let current = openSet[0];
            let currentIdx = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                if (fScore.get(key(openSet[i])) < fScore.get(key(current))) {
                    current = openSet[i];
                    currentIdx = i;
                }
            }
            
            if (current.distance(goal) < 1) {
                return this.reconstructPath(cameFrom, current);
            }
            
            openSet.splice(currentIdx, 1);
            
            // Check 8 neighbors
            const neighbors = [
                new Vector2(current.x + 1, current.y),
                new Vector2(current.x - 1, current.y),
                new Vector2(current.x, current.y + 1),
                new Vector2(current.x, current.y - 1),
                new Vector2(current.x + 1, current.y + 1),
                new Vector2(current.x - 1, current.y + 1),
                new Vector2(current.x + 1, current.y - 1),
                new Vector2(current.x - 1, current.y - 1),
            ];
            
            for (const neighbor of neighbors) {
                const tentativeGScore = gScore.get(key(current)) + 1 + (Math.random() * 0.1);
                
                if (!gScore.has(key(neighbor)) || tentativeGScore < gScore.get(key(neighbor))) {
                    cameFrom.set(key(neighbor), current);
                    gScore.set(key(neighbor), tentativeGScore);
                    fScore.set(key(neighbor), tentativeGScore + this.heuristic(neighbor, goal));
                    
                    if (!openSet.some(p => p.distance(neighbor) < 0.5)) {
                        openSet.push(neighbor);
                    }
                }
            }
            
            if (openSet.length > 1000) break; // Prevent infinite loops
        }
        
        return []; // No path found
    }
    
    heuristic(a, b) {
        return a.distance(b);
    }
    
    reconstructPath(cameFrom, current) {
        const path = [current];
        const key = (p) => `${Math.round(p.x)},${Math.round(p.y)}`;
        
        while (cameFrom.has(key(current))) {
            current = cameFrom.get(key(current));
            path.unshift(current);
        }
        
        return path;
    }
}

// Audio synthesis for siren
class SirenAudio {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
    }
    
    playSiren(duration = 2) {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        const now = this.audioContext.currentTime;
        const synthNode = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        synthNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        synthNode.type = 'sine';
        const startFreq = 800;
        const endFreq = 1200;
        
        // Sweep up and down
        synthNode.frequency.setValueAtTime(startFreq, now);
        synthNode.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.3);
        synthNode.frequency.exponentialRampToValueAtTime(startFreq, now + duration);
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        synthNode.start(now);
        synthNode.stop(now + duration);
        
        // Add harmonic for realism
        const harmonic = this.audioContext.createOscillator();
        const harmonicGain = this.audioContext.createGain();
        
        harmonic.connect(harmonicGain);
        harmonicGain.connect(this.audioContext.destination);
        harmonic.type = 'triangle';
        harmonic.frequency.setValueAtTime(startFreq * 1.5, now);
        harmonic.frequency.exponentialRampToValueAtTime(endFreq * 1.5, now + duration * 0.3);
        harmonic.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + duration);
        
        harmonicGain.gain.setValueAtTime(0.1, now);
        harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        harmonic.start(now);
        harmonic.stop(now + duration);
        
        setTimeout(() => {
            this.isPlaying = false;
        }, duration * 1000);
    }
    
    playWarning() {
        const now = this.audioContext.currentTime;
        const beep = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        beep.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        beep.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        beep.start(now);
        beep.stop(now + 0.2);
    }
}

// Particle system for fire
class ParticleSystem {
    constructor(maxParticles = 5000) {
        this.particles = [];
        this.maxParticles = maxParticles;
    }
    
    emit(position, velocity, life = 1) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push({
                position: position.clone(),
                velocity: velocity.clone(),
                life: life,
                maxLife: life,
                size: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= deltaTime;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            p.velocity.y += 0.5 * deltaTime; // Gravity
            p.position.x += p.velocity.x * deltaTime;
            p.position.y += p.velocity.y * deltaTime;
            p.size *= 0.98;
        }
    }
    
    getParticles() {
        return this.particles;
    }
}

// Utility function to generate random color
function getColorByIntensity(intensity) {
    if (intensity < 0.3) return 0xFFA500; // Orange
    if (intensity < 0.6) return 0xFF4500; // Red-Orange
    return 0xFF0000; // Red
}

// Interpolate between two colors
function interpolateColor(color1, color2, t) {
    const r1 = (color1 >> 16) & 255;
    const g1 = (color1 >> 8) & 255;
    const b1 = color1 & 255;
    
    const r2 = (color2 >> 16) & 255;
    const g2 = (color2 >> 8) & 255;
    const b2 = color2 & 255;
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return (r << 16) | (g << 8) | b;
}

// Generate perlin-like noise for realistic distribution
class NoiseGenerator {
    constructor(seed = 0) {
        this.seed = seed;
    }
    
    noise2D(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
        return n - Math.floor(n);
    }
    
    perlin2D(x, y) {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const xf = x - xi;
        const yf = y - yi;
        
        const u = xf * xf * (3.0 - 2.0 * xf);
        const v = yf * yf * (3.0 - 2.0 * yf);
        
        const n00 = this.noise2D(xi, yi);
        const n10 = this.noise2D(xi + 1, yi);
        const n01 = this.noise2D(xi, yi + 1);
        const n11 = this.noise2D(xi + 1, yi + 1);
        
        const nx0 = n00 * (1 - u) + n10 * u;
        const nx1 = n01 * (1 - u) + n11 * u;
        return nx0 * (1 - v) + nx1 * v;
    }
}
