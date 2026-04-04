# FireWatch 3D Disaster Simulation

An immersive 3D simulation of a forest fire disaster scenario with real-time evacuation dynamics.

## Features

### 🌲 Forest Environment
- **Procedurally generated forest** with 200+ trees
- **Realistic tree models** with trunk and foliage
- **Noise-based distribution** for natural tree placement
- **Dynamic fire spreading** physics

### 📡 Sensor Network
- **15 distributed sensors** throughout the forest
- **Real-time fire detection** within 30-unit radius
- **Blue indicator lights** showing sensor status
- **Automatic activation** when fire detected

### 🔥 Fire Simulation
- **Natural fire spreading** to neighboring trees
- **Wind influence** on fire direction (adjustable)
- **Particle effects** showing smoke and flames
- **Color-based intensity** visualization (green → orange → red)
- **Configurable spread rate** for experimentation

### 🏙️ City& Evacuation
- **Procedurally generated city** with buildings
- **60+ NPC population** with AI behavior
- **Real-time evacuation system** when siren triggers
- **3 designated safe zones** with protective halos
- **Pathfinding algorithm** for realistic movement

### 🔔 Alert System
- **Audio siren synthesis** with realistic frequency sweep
- **Visual alerts** on screen
- **Real-time population tracking**
- **Evacuation statistics**

## How to Use

### Opening the Simulation
1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge)
2. The simulation loads with a 3D view of the forest and city

### Controls

#### Camera Navigation
- **Mouse Drag**: Rotate view
- **Mouse Wheel**: Zoom in/out
- **W/A/S/D**: Pan camera (when holding keys)

#### Simulation Controls (Right Panel)
- **▶ Start**: Begin simulation
- **⏸ Pause**: Pause simulation
- **↻ Reset**: Reset to initial state
- **🔥 Trigger Fire**: Manually start a fire

### Settings
- **Simulation Speed**: 0.5x - 3x (controls time passage)
- **Fire Spread Rate**: 0.1x - 3x (controls how fast fire spreads)
- **Wind Speed**: 0x - 2x (affects fire direction)

### Information Panel (Left Panel)
Shows real-time statistics:
- Forest count
- Active sensors
- City population
- Fire intensity (%)
- Number evacuated
- Simulation time

## Simulation Mechanics

### Fire Behavior
1. Fire starts at random tree in forest
2. Spreads to nearby trees based on distance and spread rate
3. Wind direction influences spread direction
4. Sensors activate when fire gets within range
5. Siren triggers when fire intensity exceeds 10%

### Evacuation Process
1. When siren activates, all people are alerted
2. Each person calculates route to nearest safe zone
3. People move with increased speed (1-3x normal)
4. Movement includes collision avoidance & pathfinding
5. Reaching safe zone marks person as "Evacuated"

### Sensor System
- **Detection range**: 30 units
- **Indicator**: Blue cube with glowing green light
- **Status**: Activates red when fire nearby
- **Placement**: Strategic locations throughout forest

## Accuracy Features

✅ **Physical Realism**
- Real fire spread mechanics (exponential growth)
- Wind vector calculations
- Particle physics for smoke/flames
- Realistic crowd evacuation patterns

✅ **Fire Science**
- Temperature-based color transitions
- Fuel consumption model
- Spread dependent on distance and intensity
- Environmental factors (wind)

✅ **Crowd Dynamics**
- Individual NPC AI with pathfinding
- Panic behavior within evacuation
- Target-seeking navigation
- Collision avoidance

✅ **Audio Realism**
- Synthesized siren with frequency sweep (800Hz → 1200Hz)
- Harmonic overtones for realism
- Warning beeps for status changes

## Performance Tips

- **For smoother performance**: Reduce Simulation Speed or disable particles
- **For faster fire spread**: Increase Wind Speed and Fire Spread Rate
- **For larger scale**: Open developer console and modify tree/population counts

## Browser Requirements
- Modern browser with **WebGL** support
- **Web Audio API** for siren sounds
- Minimum 4GB RAM recommended for smooth 60 FPS

## Technical Stack
- **Three.js**: 3D rendering
- **Web Audio API**: Procedural audio synthesis
- **JavaScript**: Simulation logic & physics
- **Canvas**: Real-time rendering

## Future Enhancements
- [ ] Firefighter units with water drops
- [ ] Helicopter support
- [ ] Weather system (rain effects)
- [ ] Building damage modeling
- [ ] Multiplayer coordination
- [ ] Mobile touch controls
- [ ] VR support
- [ ] Save/replay functionality

## Tips for Best Experience

1. **Start small**: Begin with default settings to understand mechanics
2. **Experiment**: Adjust wind and spread rate for different scenarios
3. **Observe**: Watch sensor activation and evacuation patterns
4. **Analyze**: Use statistics panel to understand disaster progression
5. **Scenario testing**: Try different fire start locations for varied outcomes

## Educational Value

This simulation demonstrates:
- Real-time emergency response systems
- Sensor network effectiveness
- Crowd evacuation dynamics
- Fire spread prediction
- Urban planning for disaster resilience
- 3D graphics and physics programming

---

**Developed for FireWatch Disaster Management System**
Real-time fire detection and evacuation coordination
