# 🔥 3D Fire Disaster Simulation

**An immersive Three.js-based 3D disaster simulation for forest fire response training and planning.**

---

## Overview

This is an interactive 3D visualization of a forest fire disaster scenario, built with **Three.js**. The simulation demonstrates:

- 🌲 **Realistic forest environment** with 600+ procedurally generated trees
- 🏘️ **Urban population** with 140 AI-controlled NPCs showing realistic evacuation behavior
- 🔥 **Dynamic fire propagation** with wind influence and fire spread mechanics
- 📡 **IoT sensor network** detecting fire events and activating alerts
- 🚨 **Evacuation simulation** showing people fleeing to safety zones
- 🔊 **Audio alerts** with procedurally generated siren sounds
- 🎮 **Interactive camera controls** for exploring the disaster scene

**Perfect for training officials, planning emergency response, and demonstrating fire behavior.**

---

## Features

### Environmental Simulation
| Feature | Description |
|---------|-------------|
| **Forest Terrain** | Procedurally generated landscape with realistic elevation |
| **Tree Generation** | 600+ trees with dynamic scale and foliage |
| **Lighting** | Realistic daylight with shadows and ambient light |
| **Sky Gradient** | Beautiful blue sky shader with horizon gradient |
| **Wind System** | Dynamic wind affecting fire spread direction |
| **Fog Effect** | Distance fog for atmospheric depth |

### Fire & Physics
| Feature | Description |
|---------|-------------|
| **Fire Propagation** | Realistic tree-to-tree fire spread |
| **Heat Effects** | Temperature-based visual feedback |
| **Particle System** | 9000 fire particles, 800 smoke, 280 embers |
| **Wind Influence** | Fire spreads faster downwind |
| **Burn Progression** | 3-stage tree burning (healthy → burning → charred) |
| **Sensor Activation** | Proximity-based sensor triggering |

### Urban & Population
| Feature | Description |
|---------|-------------|
| **City Generation** | Colorful buildings (16 buildings, 12-color palette) |
| **NPC Population** | 140 people with realistic body structure (head, arms, legs, body) |
| **Evacuation AI** | NPCs pathfind to nearest safe zone |
| **Panic Animation** | Limb animations that speed up when panicking |
| **Safe Zones** | 3 glowing platforms with beacon lights |

### Alerting & Response
| Feature | Description |
|---------|-------------|
| **Fire Detection** | 14 distributed sensors detecting fire |
| **Alert System** | Automatic siren triggered on detection |
| **Evacuation Trigger** | People alerted and begin running to safety |
| **Status Tracking** | Real-time evacuation counter |
| **HUD Display** | Bottom panel showing sim stats and alerts |

---

## Tech Stack

### Core Engine
- **Engine**: Three.js r128 (WebGL)
- **Physics**: Custom fire propagation algorithms
- **Particle System**: GPU-accelerated custom implementation
- **Audio**: Web Audio API (siren synthesis)

### Graphics
- **Shaders**: Custom GLSL shaders for sky and effects
- **Materials**: MeshLambertMaterial, MeshStandardMaterial, PointsMaterial
- **Geometries**: CylinderGeometry, ConeGeometry, SphereGeometry, BoxGeometry
- **Lighting**: HemisphereLight, DirectionalLight, PointLight

### Frontend
- **Language**: HTML5, CSS3, Vanilla JavaScript
- **Threading**: RequestAnimationFrame for 60 FPS
- **Styling**: Modern CSS with glass-morphism effects
- **UI**: Custom overlays for controls and statistics

### Deployment
- **Hosting**: Static file server (Python, Node.js, or Live Server)
- **Browser Support**: Chrome, Firefox, Safari, Edge (WebGL support required)
- **Performance**: Optimized for 60 FPS on mid-range hardware

---

## Project Structure

```
3-D_Simulation/
├── index.html                # Main entry point with HTML, CSS, and UI
├── simulation.js             # Core simulation logic and game engine
├── utils.js                  # Utility classes (noise, pathfinding, audio, particles)
├── README.md                 # This documentation
│
├── assets/                   # Resources (if any)
│   ├── models/              # 3D models (if using external)
│   └── textures/            # Texture files
│
└── docs/                     # Additional documentation
    ├── CONTROLS.md          # Detailed control guide
    ├── FEATURES.md          # Feature breakdown
    └── DEVELOPMENT.md       # Development setup
```

---

## Installation & Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- WebGL support (check: https://www.khronos.org/webgl/wiki/Getting_Started)
- No installation required!

### Quick Start - Option 1: Python HTTP Server

```bash
# Navigate to simulation directory
cd 3-D_Simulation

# Start Python server
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Quick Start - Option 2: Node.js HTTP Server

```bash
# Navigate to simulation directory
cd 3-D_Simulation

# Install http-server if needed
npm install -g http-server

# Start server
http-server

# Open browser (usually http://localhost:8080)
```

### Quick Start - Option 3: VS Code Live Server

```bash
# Right-click index.html in VS Code
# Select "Open with Live Server"
# Browser opens automatically at http://127.0.0.1:5500
```

---

## Interactive Controls

### Camera Controls

| Control | Action |
|---------|--------|
| **Mouse Drag** | Rotate camera around scene |
| **Mouse Scroll** | Zoom in/out |
| **WASD Keys** | Pan camera (move left/right/forward/backward) |
| **Space** | Move camera up |
| **Shift** | Move camera down |

### Simulation Controls

| Control | Action |
|---------|--------|
| **▶ Start** | Begin simulation |
| **⏸ Pause** | Pause simulation |
| **↻ Reset** | Reset to initial state |
| **🔥 Trigger Fire** | Start fire at forest center |

### Parameter Controls

- **Simulation Speed** (0.5x - 3x): Control time acceleration
- **Fire Spread Rate** (0.1x - 3x): How fast fire spreads between trees
- **Wind Speed** (0x - 2x): Affects fire spread direction

### Information Panel (Left)

Shows real-time statistics:
- **Forest Trees**: Total count (typically 600+)
- **Active Sensors**: How many detected the fire
- **City Population**: Total NPCs (140)
- **Fire Intensity**: Percentage of burning trees
- **Evacuated**: Number of people reached safety
- **Simulation Time**: Elapsed time in MM:SS format
- **Legend**: Color reference for different elements

---

## User Interface

### Top Bar
- **Logo**: FIREWATCH branding
- **Clock**: Current simulation time
- **Status Indicator**: Green (safe) or Red (fire active)
- **HUD Text**: "System Ready" or "🔥 FIRE ACTIVE"

### Bottom HUD
Displays real-time statistics:
- **FPS**: Frame rate (target 60)
- **TIME**: Simulation elapsed time
- **EVACUATED**: Number of people in safe zones
- **THREAT**: LOW / MEDIUM / HIGH / CRITICAL

### Right Panel (Controls)
- Start, Pause, Reset buttons
- Trigger Fire button (when paused)
- Speed, spread rate, wind speed sliders
- Keyboard control reference

### Left Panel (Information)
- Tree count, sensor count, population
- Fire intensity percentage
- Evacuation tracking
- Color legend for visual elements

---

## How the Simulation Works

### 1. Scene Setup
- **Terrain**: 400x400 unit ground plane
- **Trees**: Randomly distributed across forest area
- **City**: Ring of buildings around center
- **Safe Zones**: 3 evacuation platforms on the periphery
- **Sensors**: Distributed across forest for early detection

### 2. Fire Mechanics

**Ignition Phase** (When fire triggered):
1. Center tree ignites at 100% burn intensity
2. Nearby sensors activate and detect fire
3. Siren automatically plays (Web Audio API)
4. Alert message displays "🚨 FIRE DETECTED - EVACUATE NOW!"
5. People receive alert and begin running to safety

**Spread Phase** (Every frame):
1. Each burning tree spreads fire to nearby trees (< 20 units)
2. Wind direction influences spread probability
3. Spread probability: `fireSpreadRate * windInfluence / distance`
4. Trees gradually change color: Green → Orange → Red → Gray
5. Fire intensity updated based on total burning trees

**Particle Effects**:
- **Fire**: 9000 particles, bright orange/red
- **Smoke**: 800 particles, gray/white with upward drift
- **Embers**: 280 particles, ballistic physics

### 3. Evacuation AI

**Alert Behavior**:
1. NPCs receive alert when fire detected
2. Head/body color changes to red (panic state)
3. Limbs begin animating (arm and leg swinging)
4. Pathfinding to nearest safe zone

**Running Behavior**:
1. NPCs move at 60-90 units/second (3-4x walking speed)
2. Speed increases with panic level (0.0-1.0)
3. Body leans forward when running
4. Limb animations speed up (4x faster)
5. Person wobbles slightly from panic

**Safety Achievement**:
1. When NPC reaches safe zone (< 18 units)
2. Person marked as evacuated
3. Evacuation counter increments
4. Person fades out (opacity 0.5)
5. Green beacon light appears at zone

### 4. Sensor Network

**Sensor Triggers**:
1. Each of 14 sensors has detection range
2. Sensor activates if burning tree within range with intensity > 0.2
3. First activation triggers evacuation system
4. Siren plays immediately (one-time)

**Sensor Layout**:
- Distributed across forest perimeter (radius ~25-50 units)
- Marked as blue spheres with glow
- Visual indicator when active

---

## Scene Objects

### Trees
- **Count**: 600+ trees
- **Size**: Height 3.2-6.0 units (dynamic scaling)
- **Model**: Cone-shaped foliage with cylindrical trunk
- **States**: Healthy (green) → Burning (orange/red) → Charred (gray)
- **Detail**: 2+ trees per location adds visual density

### Buildings
- **Count**: 16 buildings in city ring
- **Colors**: 12-color palette for visual variety
- **Windows**: Darker squares for detail
- **Roof**: Contrasting color from building
- **Height**: 8-22 units
- **Arrangement**: Ring formation at 28-40 unit radius

### People (NPCs)
- **Count**: 140 individuals
- **Model**: Head (sphere) + Body (cylinder) + Arms/Legs (cylinders)
- **Colors**: 7-color variety
- **Animation**: Arm/leg swinging when moving
- **Physics**: Pathfinding and collision avoidance (basic)

### Safe Zones
- **Count**: 3 zones
- **Platform**: 20-unit radius glowing green cylinder
- **Ring**: Yellow warning ring
- **Beacons**: 6 tall poles per zone with cyan point lights
- **Lighting**: 10-unit radius per beacon for visibility

### Sensors
- **Count**: 14 distributed across forest
- **Model**: Blue glowing sphere (0.6 unit radius)
- **Range**: ~30-50 units detection radius
- **Indicator**: Light intensifies when detecting fire

---

## Configuration & Customization

### Simulation Parameters (In simulation.js)

```javascript
// Fire parameters
this.fireSpreadRate = 1;       // 0.1 - 5.0 (control fire spread speed)
this.windSpeed = 1;             // 0 - 2.0 (wind strength)
this.windDirection = ...        // Vector3 (wind direction)

// Simulation parameters
this.simSpeed = 1;              // 0.5 - 3.0 (time acceleration)

// Scene dimensions
const FOREST_SIZE = 200;        // Forest width/depth
const CITY_RADIUS = 35;         // City ring radius
const SAFE_ZONE_RADIUS = 55;    // Distance to safe zones
```

### Visual Tweaks

Modify colors in `index.html` style section:
- **Building colors**: `buildingColors` array
- **Fire particle color**: `0xff2200` (orange-red)
- **Safe zone**: `0x00FF88` (bright green)
- **Sensor**: `0x4499ff` (blue)

### Performance Optimization

For lower-end devices, reduce:
- Particle counts (search `FIRE_COUNT`, `SMOKE_COUNT`)
- Tree density (change loop in tree generation)
- Shadow quality (reduce shadow map size)
- Fog distance (increase for less render distance)

---

## Troubleshooting

### Black Screen / Nothing Visible
**Solution**:
1. Check browser console for errors (F12)
2. Ensure WebGL is enabled
3. Try different browser (Chrome recommended)
4. Update graphics drivers

### Very Slow / FPS Drops
**Solution**:
1. Try pausing simulation (⏸ button)
2. Reduce window size
3. Lower Quality Settings (if available)
4. Close other browser tabs
5. Check GPU usage (especially on low-end hardware)

### Fire Not Spreading
**Problem**: Fire spreads very slowly

**Solution**:
1. Increase "Fire Spread Rate" slider (2.0x or higher)
2. Increase "Wind Speed" slider
3. Check if simulation is running (green play button should be active)

### People Not Evacuating
**Problem**: NPCs don't move to safe zones

**Solution**:
1. Trigger fire (🔥 button) - alert must activate
2. Check "Evacuated" counter - should be increasing
3. Zoom out camera to see people movement
4. Verify safe zones are visible on screen

### Audio Not Playing
**Problem**: No siren sound when fire detected

**Solution**:
1. Check browser volume is not muted
2. Try pausing/resuming simulation
3. Manually trigger fire again
4. Check browser console for audio errors
5. Ensure microphone/audio permissions granted

---

## Browser Compatibility

| Browser | Status | Version |
|---------|--------|---------|
| Chrome | ✅ Full Support | 90+ |
| Firefox | ✅ Full Support | 88+ |
| Safari | ✅ Full Support | 14+ |
| Edge | ✅ Full Support | 90+ |
| Opera | ✅ Full Support | 76+ |
| IE | ❌ Not Supported | - |

**Required**: WebGL 1.0 or WebGL 2.0 support

---

## Performance Notes

### Hardware Requirements
- **Min**: 2GB RAM, Intel HD 4000 (2012+)
- **Recommended**: 4GB+ RAM, GTX 1050 or equivalent
- **Optimal**: 8GB+ RAM, RTX 2080+

### FPS Targets
- **Target**: 60 FPS
- **Acceptable**: 30 FPS (still smooth)
- **Playable**: 15 FPS (noticeably choppy)

### Performance Tips
- Close background applications
- Reduce browser zoom to 100%
- Disable browser extensions
- Use Chrome for best performance
- Use hardware acceleration (most browsers auto-enable)

---

## File Descriptions

### index.html (813 lines)
**Contains**: HTML structure, CSS styling, UI panels, canvas element
**Includes Three.js CDN link**: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

### simulation.js (778 lines)
**Main Classes**:
- `FireSimulation`: Main game engine
- Tree generation, building placement
- Fire propagation logic
- NPC evacuation system
- Sensor network management
- Event handling and UI updates

**Key Methods**:
- `setupScene()`: Initialize 3D environment
- `triggerEvacuation()`: Start evacuation sequence
- `updateFire()`: Update fire state each frame
- `updatePeople()`: Update NPC positions and animations
- `animate()`: Main render loop

### utils.js (302 lines)
**Utility Classes**:
- `Vector2`: 2D vector math
- `PathFinder`: A* pathfinding algorithm
- `SirenAudio`: Web Audio API siren synthesis
- `ParticleSystem`: Fire, smoke, ember particles
- `NoiseGenerator`: Perlin-like noise for randomness

---

## Future Enhancements

- 🚁 Add helicopter firefighting mechanics
- 🌧️ Weather effects (rain, wind visualization)
- 🗺️ Larger forest maps with multiple zones
- 👥 More advanced NPC AI (group behavior, routing)
- 🎥 Replay system for recorded simulations
- 📊 Detailed analytics and reporting
- 🌙 Day/night cycle
- 🌊 Water bodies and rivers
- 🛣️ Roads and evacuation routes
- 📱 Mobile responsive version

---

## Contributing

To contribute improvements:

1. Create a feature branch
2. Make changes to the relevant files
3. Test thoroughly in multiple browsers
4. Create a Pull Request with detailed description

**Areas for contribution**:
- Performance optimization
- Visual improvements
- New features (see Future Enhancements)
- Bug fixes and stability
- Documentation improvements

---

## Debugging

### Enable Debug Mode (in console)
```javascript
// Show debug info in console
window.DEBUG = true;

// Log FPS every frame
window.SHOW_STATS = true;

// Disable fire spread for testing
window.DISABLE_FIRE_SPREAD = true;
```

### Browser Developer Tools (F12)
- **Console**: View logs and errors
- **Performance**: Profiler for FPS analysis
- **Network**: Check resource loading
- **Memory**: Monitor memory usage (handy for optimization)

---

## Educational Use

Perfect for teaching:
- 🎓 Forest fire behavior and physics
- 🎓 Emergency response protocols
- 🎓 Evacuation planning and simulation
- 🎓 IoT sensor networks
- 🎓 3D graphics programming (Three.js)
- 🎓 Web-based simulations and interactive systems

---

## Support & Resources

- **Three.js Documentation**: https://threejs.org/docs/
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **GitHub Issues**: Report bugs and request features
- **Email Support**: support@firewatch.dev

---

## License

MIT License - Free to use, modify, and distribute

---

## Acknowledgments

- **Three.js Team**: Amazing 3D graphics library
- **Ultralytics**: YOLO for computer vision inspiration
- **Forest Research**: Domain expertise and fire behavior data
- **Open Source Community**: Tools and libraries used

---

**Interactive disaster simulation for smarter emergency response.**

🔥 *FIREWATCH 3D: Visualizing forest fire disasters in real-time.*


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
