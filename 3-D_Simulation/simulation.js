// Main 3D Fire Disaster Simulation

class FireSimulation {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 300, 500);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 80, 150);
        this.camera.lookAt(0, 0, 0);
        
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        
        // Lighting
        this.setupLighting();
        
        // Simulation parameters
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = Date.now();
        this.simSpeed = 1;
        this.isRunning = false;
        
        // Fire parameters
        this.fireActive = false;
        this.fireIntensity = 0;
        this.fireSpreadRate = 1;
        this.windSpeed = 1;
        this.windDirection = new THREE.Vector3(1, 0, 0.5).normalize();
        
        // Game objects
        this.trees = [];
        this.sensors = [];
        this.people = [];
        this.fireZones = new Set();
        this.safeZones = [];
        this.city = null;
        
        // Audio
        this.siren = new SirenAudio();
        this.sirenTriggered = false;
        
        // Particle system
        this.particleSystem = new ParticleSystem();
        this.fireGeometry = null;
        this.firePoints = null;
        
        // Noise for distribution
        this.noiseGen = new NoiseGenerator(Math.random() * 1000);
        
        // Stats
        this.stats = {
            treeCount: 0,
            sensorCount: 0,
            populationCount: 0,
            evacuatedCount: 0,
            affectedCount: 0
        };
        
        this.setupScene();
        this.setupControls();
        this.setupUI();
        this.animate();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(100, 150, 100);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.left = -200;
        sunLight.shadow.camera.right = 200;
        sunLight.shadow.camera.top = 200;
        sunLight.shadow.camera.bottom = -200;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        this.scene.add(sunLight);
        
        this.sunLight = sunLight;
    }
    
    setupScene() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(400, 400);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create forest (left side)
        this.createForest();
        
        // Create city (right side)
        this.createCity();
        
        // Create safe zones (far side of city)
        this.createSafeZones();
        
        // Particle system for fire
        this.setupParticles();
        
        // Pathfinder for people
        this.pathFinder = new PathFinder(200, 1);
    }
    
    createForest() {
        const forestCenterX = -50;
        const forestCenterZ = 0;
        const forestRadius = 60;
        
        // Generate trees using noise
        for (let i = 0; i < 200; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * forestRadius * 0.9;
            
            const x = forestCenterX + Math.cos(angle) * distance;
            const z = forestCenterZ + Math.sin(angle) * distance;
            
            // Use noise for variety
            const noiseVal = this.noiseGen.perlin2D(x * 0.1, z * 0.1);
            if (noiseVal > 0.3) {
                this.createTree(x, z);
            }
        }
        
        // Place sensors in forest
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * forestRadius * 0.8;
            
            const x = forestCenterX + Math.cos(angle) * distance;
            const z = forestCenterZ + Math.sin(angle) * distance;
            
            this.createSensor(x, z);
        }
        
        this.stats.treeCount = this.trees.length;
        this.stats.sensorCount = this.sensors.length;
    }
    
    createTree(x, z) {
        const trunkHeight = 10 + Math.random() * 5;
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, trunkHeight / 2, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        this.scene.add(trunk);
        
        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(12, 8, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x228B22,
            emissive: 0x000000
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, trunkHeight + 5, z);
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        this.scene.add(foliage);
        
        this.trees.push({
            trunk,
            foliage,
            x,
            z,
            health: 100,
            burning: false,
            fireIntensity: 0
        });
    }
    
    createSensor(x, z) {
        const geometry = new THREE.BoxGeometry(1, 3, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x0080FF,
            emissive: 0x0050AA,
            emissiveIntensity: 0.5
        });
        const sensor = new THREE.Mesh(geometry, material);
        sensor.position.set(x, 2, z);
        sensor.castShadow = true;
        sensor.receiveShadow = true;
        this.scene.add(sensor);
        
        // Add a light indicator on top
        const indicatorGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const indicatorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00FF00,
            emissive: 0x00FF00,
            emissiveIntensity: 0.8
        });
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.set(x, 4, z);
        this.scene.add(indicator);
        
        this.sensors.push({
            mesh: sensor,
            indicator: indicator,
            x,
            z,
            active: false,
            range: 30
        });
    }
    
    createCity() {
        const cityCenterX = 80;
        const cityCenterZ = 0;
        
        const buildings = [];
        
        // Generate city blocks
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const x = cityCenterX - 30 + i * 20;
                const z = cityCenterZ - 30 + j * 20;
                
                if (Math.random() > 0.3) {
                    const building = this.createBuilding(x, z);
                    buildings.push(building);
                }
            }
        }
        
        // Create population in city
        for (let i = 0; i < 60; i++) {
            const x = cityCenterX + (Math.random() - 0.5) * 60;
            const z = cityCenterZ + (Math.random() - 0.5) * 60;
            this.createPerson(x, z);
        }
        
        this.city = {
            centerX: cityCenterX,
            centerZ: cityCenterZ,
            buildings,
            radius: 40
        };
        
        this.stats.populationCount = this.people.length;
    }
    
    createBuilding(x, z) {
        const width = 8 + Math.random() * 6;
        const depth = 8 + Math.random() * 6;
        const height = 10 + Math.random() * 15;
        
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const colorVar = Math.random();
        let color;
        if (colorVar < 0.3) color = 0xE0E0E0; // Light gray
        else if (colorVar < 0.6) color = 0xD0D0D0; // Gray
        else color = 0xC0C0C0; // Dark gray
        
        const material = new THREE.MeshStandardMaterial({ color });
        const building = new THREE.Mesh(geometry, material);
        building.position.set(x, height / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        this.scene.add(building);
        
        return {
            mesh: building,
            x,
            z,
            width,
            depth,
            height
        };
    }
    
    createPerson(x, z) {
        // Enhanced person with animated limbs - looks like real people running!
        const colors = [0xFF69B4, 0x87CEEB, 0xFFB347, 0x98FF98, 0x6495ED, 0xFFB6C1, 0xFF6347];
        const skinColor = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
        
        const person = new THREE.Group();
        
        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), material);
        head.position.y = 1.4;
        head.castShadow = true;
        person.add(head);
        
        // Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.9, 8), material);
        body.position.y = 0.6;
        body.castShadow = true;
        person.add(body);
        
        // Left arm (animated)
        const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 6), material);
        leftArm.position.set(-0.35, 0.9, 0);
        leftArm.castShadow = true;
        person.add(leftArm);
        
        // Right arm (animated)
        const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 6), material);
        rightArm.position.set(0.35, 0.9, 0);
        rightArm.castShadow = true;
        person.add(rightArm);
        
        // Left leg (animated)
        const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.8, 6), material);
        leftLeg.position.set(-0.2, 0.1, 0);
        leftLeg.castShadow = true;
        person.add(leftLeg);
        
        // Right leg (animated)
        const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.8, 6), material);
        rightLeg.position.set(0.2, 0.1, 0);
        rightLeg.castShadow = true;
        person.add(rightLeg);
        
        person.position.set(x, 0, z);
        person.castShadow = true;
        this.scene.add(person);
        
        this.people.push({
            mesh: person,
            limbs: { leftArm, rightArm, leftLeg, rightLeg },
            x,
            z,
            vx: 0,
            vz: 0,
            evacuated: false,
            alerted: false,
            pathIndex: 0,
            path: [],
            panic: 0,
            targetZone: null,
            animationTime: 0,
            skinColor
        });
    }
    
    createSafeZones() {
        // Safe zones - enhanced with animated beacons and platforms
        for (let i = 0; i < 3; i++) {
            const x = 180;
            const z = -40 + i * 40;
            
            // Base platform - glowing green
            const platformGeometry = new THREE.CylinderGeometry(18, 18, 0.8, 32);
            const platformMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x00FF88,
                emissive: 0x00DD66,
                emissiveIntensity: 0.8,
                metalness: 0.3
            });
            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            platform.position.set(x, 0.5, z);
            platform.receiveShadow = true;
            platform.castShadow = true;
            this.scene.add(platform);
            
            // Outer ring - warning yellow
            const ringGeometry = new THREE.TorusGeometry(18.5, 1, 8, 32);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFFF00,
                emissive: 0xFFEE00,
                emissiveIntensity: 0.7
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.set(x, 1, z);
            ring.castShadow = true;
            this.scene.add(ring);
            
            // Beacon lights around the safe zone
            for (let b = 0; b < 6; b++) {
                const angle = (b / 6) * Math.PI * 2;
                const bx = x + Math.cos(angle) * 17;
                const bz = z + Math.sin(angle) * 17;
                
                // Beacon pole
                const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, 9, 8);
                const poleMat = new THREE.MeshStandardMaterial({ color: 0xDDDDDD });
                const pole = new THREE.Mesh(poleGeo, poleMat);
                pole.position.set(bx, 4.5, bz);
                pole.castShadow = true;
                this.scene.add(pole);
                
                // Beacon light emitter
                const beaconGeo = new THREE.SphereGeometry(0.5, 8, 8);
                const beaconMat = new THREE.MeshStandardMaterial({ 
                    color: 0x00FFFF,
                    emissive: 0x00FFFF,
                    emissiveIntensity: 1
                });
                const beacon = new THREE.Mesh(beaconGeo, beaconMat);
                beacon.position.set(bx, 9.3, bz);
                beacon.castShadow = true;
                this.scene.add(beacon);
                
                // Actual light source
                const light = new THREE.PointLight(0x00FFFF, 10, 60);
                light.position.set(bx, 9.5, bz);
                this.scene.add(light);
            }
            
            this.safeZones.push({ x, z, radius: 18, zone: platform, ring, lights: [] });
        }
    }
    
    setupParticles() {
        this.fireGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(3000);
        for (let i = 0; i < 3000; i += 3) {
            positions[i] = Math.random() * 200 - 100;
            positions[i + 1] = Math.random() * 100;
            positions[i + 2] = Math.random() * 200 - 100;
        }
        this.fireGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const fireMaterial = new THREE.PointsMaterial({
            color: 0xFF4500,
            size: 0.5,
            sizeAttenuation: true,
            transparent: true
        });
        
        this.firePoints = new THREE.Points(this.fireGeometry, fireMaterial);
        this.scene.add(this.firePoints);
    }
    
    setupControls() {
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            mouseDown: false,
            mouseX: 0,
            mouseY: 0,
            lastMouseX: 0,
            lastMouseY: 0
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'w' || e.key === 'W') this.controls.forward = true;
            if (e.key === 's' || e.key === 'S') this.controls.backward = true;
            if (e.key === 'a' || e.key === 'A') this.controls.left = true;
            if (e.key === 'd' || e.key === 'D') this.controls.right = true;
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'w' || e.key === 'W') this.controls.forward = false;
            if (e.key === 's' || e.key === 'S') this.controls.backward = false;
            if (e.key === 'a' || e.key === 'A') this.controls.left = false;
            if (e.key === 'd' || e.key === 'D') this.controls.right = false;
        });
        
        document.addEventListener('mousedown', (e) => {
            this.controls.mouseDown = true;
            this.controls.lastMouseX = e.clientX;
            this.controls.lastMouseY = e.clientY;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.controls.mouseDown) {
                this.controls.mouseX = (e.clientX - this.controls.lastMouseX) * 0.01;
                this.controls.mouseY = (e.clientY - this.controls.lastMouseY) * 0.01;
                this.controls.lastMouseX = e.clientX;
                this.controls.lastMouseY = e.clientY;
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.controls.mouseDown = false;
        });
        
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            const direction = this.camera.getWorldDirection(new THREE.Vector3());
            const speed = e.deltaY > 0 ? 2 : -2;
            this.camera.position.addScaledVector(direction, speed);
        }, { passive: false });
    }
    
    setupUI() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.isRunning = true;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('pauseBtn').disabled = false;
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.isRunning = false;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseBtn').disabled = true;
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            window.location.reload();
        });
        
        document.getElementById('fireBtn').addEventListener('click', () => {
            this.triggerFire();
        });
        
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.simSpeed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = this.simSpeed.toFixed(1) + 'x';
        });
        
        document.getElementById('spreadSlider').addEventListener('input', (e) => {
            this.fireSpreadRate = parseFloat(e.target.value);
            document.getElementById('spreadValue').textContent = this.fireSpreadRate.toFixed(1) + 'x';
        });
        
        document.getElementById('windSlider').addEventListener('input', (e) => {
            this.windSpeed = parseFloat(e.target.value);
            document.getElementById('windValue').textContent = this.windSpeed.toFixed(1) + 'x';
        });
        
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    triggerFire() {
        // Auto-start simulation if not running
        if (!this.isRunning) {
            this.isRunning = true;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('pauseBtn').disabled = false;
        }
        
        this.fireActive = true;
        this.fireIntensity = 0.5;
        
        // Start fire in multiple trees for guaranteed spread
        for (let i = 0; i < 5; i++) {
            const idx = Math.floor(Math.random() * Math.min(50, this.trees.length));
            if (this.trees[idx]) {
                this.trees[idx].burning = true;
                this.trees[idx].fireIntensity = 0.9;
                this.fireZones.add(`${Math.round(this.trees[idx].x)},${Math.round(this.trees[idx].z)}`);
            }
        }
    }
    
    updateFire(deltaTime) {
        if (!this.fireActive) return;
        
        // Spread fire to nearby trees
        for (const tree of this.trees) {
            if (tree.burning) {
                tree.fireIntensity = Math.min(1, tree.fireIntensity + deltaTime * 0.3);
                
                // Update appearance
                const burnColor = interpolateColor(0x228B22, 0xFF0000, tree.fireIntensity);
                tree.foliage.material.color.setHex(burnColor);
                tree.foliage.material.emissive.setHex(interpolateColor(0x000000, 0xFF4500, tree.fireIntensity));
                tree.foliage.material.emissiveIntensity = tree.fireIntensity * 0.8;
                
                // Emit particles
                for (let i = 0; i < 5; i++) {
                    const vx = (Math.random() - 0.5) * 2 + this.windDirection.x * this.windSpeed;
                    const vy = Math.random() * 3 + 2;
                    const vz = (Math.random() - 0.5) * 2 + this.windDirection.z * this.windSpeed;
                    
                    this.particleSystem.emit(
                        new Vector2(tree.x, tree.z),
                        new Vector2(vx, vz),
                        1 + Math.random() * 0.5
                    );
                }
                
                // Spread to nearby trees
                for (const otherTree of this.trees) {
                    if (otherTree.burning) continue;
                    
                    const dist = Math.sqrt(
                        Math.pow(tree.x - otherTree.x, 2) + 
                        Math.pow(tree.z - otherTree.z, 2)
                    );
                    
                    const spreadChance = Math.max(0.001, this.fireSpreadRate * deltaTime * 0.1 * (1 - dist / 20));
                    if (dist < 20 && Math.random() < spreadChance) {
                        otherTree.burning = true;
                        otherTree.fireIntensity = 0.3;
                    }
                }
                
                // Activate nearby sensors
                for (const sensor of this.sensors) {
                    const dist = Math.sqrt(
                        Math.pow(sensor.x - tree.x, 2) + 
                        Math.pow(sensor.z - tree.z, 2)
                    );
                    
                    if (dist < sensor.range && tree.fireIntensity > 0.2) {
                        sensor.active = true;
                    }
                }
            }
        }
        
        // Update fire intensity based on burning trees
        const burningTrees = this.trees.filter(t => t.burning);
        this.fireIntensity = Math.min(1, burningTrees.length / this.trees.length);
        
        // Trigger evacuation when fire detected
        if (this.fireIntensity > 0.1 && !this.sirenTriggered) {
            this.triggerEvacuation();
        }
    }
    
    triggerEvacuation() {
        this.sirenTriggered = true;
        this.siren.playSiren(3);
        this.showAlert('🚨 FIRE DETECTED - EVACUATE NOW! 🚨');
        
        // Alert all people to RUN!
        for (const person of this.people) {
            person.alerted = true;
            
            // Find nearest safe zone
            let nearestZone = this.safeZones[0];
            let minDist = Infinity;
            
            for (const zone of this.safeZones) {
                const dist = Math.sqrt(
                    Math.pow(person.x - zone.x, 2) + 
                    Math.pow(person.z - zone.z, 2)
                );
                if (dist < minDist) {
                    minDist = dist;
                    nearestZone = zone;
                }
            }
            
            person.targetZone = nearestZone;
            person.panic = 0.9; // MAXIMUM PANIC!
            
            // Change person color to red to show panic state
            const panicColors = [0xFF0000, 0xFF3333, 0xFF6666];
            const panicColor = panicColors[Math.floor(Math.random() * panicColors.length)];
            person.mesh.traverse(child => {
                if (child.material) {
                    child.material.color.setHex(panicColor);
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0xFF2200);
                        child.material.emissiveIntensity = 0.3;
                    }
                }
            });
        }
    }
    
    updatePeople(deltaTime) {
        for (const person of this.people) {
            person.animationTime = (person.animationTime || 0) + deltaTime;
            
            if (person.evacuated) continue;
            
            // Animate limbs based on panic level
            this.animatePerson(person, deltaTime);
            
            if (person.alerted && person.targetZone) {
                // Move towards safe zone - RUNNING!
                const dx = person.targetZone.x - person.x;
                const dz = person.targetZone.z - person.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                
                if (dist < person.targetZone.radius) {
                    // Reached safety!
                    person.evacuated = true;
                    person.vx = 0;
                    person.vz = 0;
                    this.stats.evacuatedCount++;
                    // Fade out safely evacuated person
                    person.mesh.traverse(child => {
                        if (child.material) child.material.opacity = 0.5;
                    });
                } else {
                    // RUN FASTER when panicking!
                    person.panic = Math.min(1, person.panic + deltaTime * 0.3);
                    const speed = (2 + person.panic * 3) * 30; // 60-90 units/sec (MUCH FASTER!)
                    const angle = Math.atan2(dz, dx);
                    person.vx = Math.cos(angle) * speed;
                    person.vz = Math.sin(angle) * speed;
                    
                    // Lean body forward when running
                    person.mesh.rotation.x = Math.min(0.3, person.panic * 0.4);
                }
            } else if (!person.alerted) {
                // Normal walking
                person.panic = Math.max(0, person.panic - deltaTime * 0.3);
                person.mesh.rotation.x = 0;
                
                if (Math.random() < deltaTime * 0.05) {
                    person.vx = (Math.random() - 0.5) * 5;
                    person.vz = (Math.random() - 0.5) * 5;
                }
            }
            
            // Update position
            person.x += person.vx * deltaTime;
            person.z += person.vz * deltaTime;
            
            // Keep in bounds
            person.x = Math.max(-150, Math.min(200, person.x));
            person.z = Math.max(-100, Math.min(100, person.z));
            
            // Update mesh position
            person.mesh.position.set(person.x, person.mesh.position.y, person.z);
        }
    }
    
    animatePerson(person, deltaTime) {
        const { limbs, alerted, panic, animationTime } = person;
        if (!limbs) return;
        
        const speed = alerted ? 4 : 1; // 4x faster animation when running
        const maxAmplitude = alerted ? Math.PI / 2.5 : Math.PI / 8; // Bigger swings when running
        const amplitude = maxAmplitude * (0.5 + panic * 0.5); // More movement = more panic
        
        // Swing arms and legs in opposite directions (realistic running motion)
        const t = animationTime * speed * Math.PI;
        const armSwing = Math.sin(t) * amplitude;
        const legSwing = Math.sin(t) * amplitude;
        
        if (limbs.leftArm) limbs.leftArm.rotation.z = armSwing;
        if (limbs.rightArm) limbs.rightArm.rotation.z = -armSwing;
        if (limbs.leftLeg) limbs.leftLeg.rotation.z = -legSwing;
        if (limbs.rightLeg) limbs.rightLeg.rotation.z = legSwing;
    }
    
    updateParticles(deltaTime) {
        this.particleSystem.update(deltaTime);
        
        const particles = this.particleSystem.getParticles();
        const positions = new Float32Array(particles.length * 3);
        
        for (let i = 0; i < particles.length; i++) {
            positions[i * 3] = particles[i].position.x;
            positions[i * 3 + 1] = particles[i].position.y;
            positions[i * 3 + 2] = particles[i].position.z;
        }
        
        this.fireGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.fireGeometry.attributes.position.needsUpdate = true;
        this.firePoints.geometry.setDrawRange(0, particles.length);
    }
    
    updateUI() {
        document.getElementById('treeCount').textContent = this.stats.treeCount;
        document.getElementById('sensorCount').textContent = 
            this.sensors.filter(s => s.active).length + '/' + this.stats.sensorCount;
        document.getElementById('populationCount').textContent = this.stats.populationCount;
        document.getElementById('evacuatedCount').textContent = this.stats.evacuatedCount;
        document.getElementById('fireIntensity').textContent = 
            Math.round(this.fireIntensity * 100) + '%';
        
        const minutes = Math.floor(this.time / 60);
        const seconds = Math.floor(this.time % 60);
        document.getElementById('simTime').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update HUD
        if (this.fireActive) {
            document.querySelector('.status-indicator').classList.remove('safe');
            document.querySelector('.status-indicator').classList.add('active');
            document.getElementById('hudText').textContent = '🔥 FIRE ACTIVE';
        } else {
            document.querySelector('.status-indicator').classList.add('safe');
            document.querySelector('.status-indicator').classList.remove('active');
            document.getElementById('hudText').textContent = '✓ System Ready';
        }
    }
    
    updateCamera() {
        if (this.controls.mouseDown) {
            // Rotate camera using quaternions
            const qY = new THREE.Quaternion();
            qY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -this.controls.mouseX);
            
            const qX = new THREE.Quaternion();
            qX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -this.controls.mouseY);
            
            const newQuat = new THREE.Quaternion();
            newQuat.multiplyQuaternions(qY, this.camera.quaternion);
            newQuat.multiplyQuaternions(newQuat, qX);
            
            this.camera.quaternion.copy(newQuat);
        }
        
        const moveSpeed = 50;
        const dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        
        const right = new THREE.Vector3();
        right.crossVectors(this.camera.up, dir);
        
        if (this.controls.forward) {
            this.camera.position.addScaledVector(dir, moveSpeed * this.deltaTime);
        }
        if (this.controls.backward) {
            this.camera.position.addScaledVector(dir, -moveSpeed * this.deltaTime);
        }
        if (this.controls.left) {
            this.camera.position.addScaledVector(right, moveSpeed * this.deltaTime);
        }
        if (this.controls.right) {
            this.camera.position.addScaledVector(right, -moveSpeed * this.deltaTime);
        }
    }
    
    showAlert(message) {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.classList.add('show');
        setTimeout(() => {
            alert.classList.remove('show');
        }, 3000);
    }
    
    update(deltaTime) {
        if (!this.isRunning) return;
        
        this.time += deltaTime * this.simSpeed;
        
        this.updateFire(deltaTime);
        this.updatePeople(deltaTime);
        this.updateParticles(deltaTime);
        this.updateCamera();
    }
    
    animate() {
        const now = Date.now();
        this.deltaTime = Math.min((now - this.lastTime) / 1000, 0.016);
        this.lastTime = now;
        
        // Update FPS
        const fps = Math.round(1 / this.deltaTime);
        document.getElementById('fps').textContent = Math.min(fps, 99);
        
        this.update(this.deltaTime);
        this.updateUI();
        
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    new FireSimulation();
});
