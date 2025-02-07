const canvas = document.getElementById("solarCanvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const sun = { x: canvas.width / 2, y: canvas.height / 2, radius: 50 };

        const planets = [
            { name: "Mercury", radius: 5, distance: 80, speed: 0.02, color: "gray", ring: false },
            { name: "Venus", radius: 8, distance: 120, speed: 0.015, color: "yellow", ring: false },
            { name: "Earth", radius: 10, distance: 170, speed: 0.01, color: "blue", ring: false },
            { name: "Mars", radius: 7, distance: 220, speed: 0.008, color: "red", ring: false },
            { name: "Jupiter", radius: 18, distance: 300, speed: 0.008, color: "brown", ring: true },
            { name: "Saturn", radius: 15, distance: 390, speed: 0.005, color: "goldenrod", ring: true },
            { name: "Uranus", radius: 12, distance: 470, speed: 0.003, color: "lightblue", ring: true },
            { name: "Neptune", radius: 11, distance: 550, speed: 0.002, color: "darkblue", ring: false }
        ];

        let angle = 0;
        let hoveredPlanet = null;
        let showOrbits = true;

        // Function to create stars
        function createStars(numStars) {
            const stars = [];
            for (let i = 0; i < numStars; i++) {
                const star = {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random() * 0.5 + 0.3
                };
                stars.push(star);
            }
            return stars;
        }

        const stars = createStars(500);

        // Function to draw stars
        function drawStars() {
            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });
        }

        // Function to create background galaxies
        function createGalaxies(numGalaxies) {
            const galaxies = [];
            for (let i = 0; i < numGalaxies; i++) {
                const galaxy = {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 150 + 100,
                    alpha: Math.random() * 0.2 + 0.05,
                    blur: Math.random() * 20 + 5,
                    color: `hsl(${Math.random() * 360}, 100%, 70%)`
                };
                galaxies.push(galaxy);
            }
            return galaxies;
        }

        const galaxies = createGalaxies(5);

        // Function to draw galaxies
        function drawGalaxies() {
            galaxies.forEach((galaxy) => {
                const gradient = ctx.createRadialGradient(
                    galaxy.x, galaxy.y, 0, galaxy.x, galaxy.y, galaxy.radius
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${galaxy.alpha})`);
                gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

                ctx.beginPath();
                ctx.arc(galaxy.x, galaxy.y, galaxy.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.shadowBlur = galaxy.blur;
                ctx.shadowColor = galaxy.color;
                ctx.fill();
            });
        }

        // Function to draw the sun with a glowing effect
        function drawSun() {
            ctx.beginPath();
            ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
            ctx.fillStyle = "orange";
            ctx.shadowBlur = 30;
            ctx.shadowColor = "yellow";
            ctx.fill();
        }

        // Function to draw the planet
        function drawPlanet(planet, planetX, planetY) {
            const planetGradient = ctx.createRadialGradient(
                planetX, planetY, 0, planetX, planetY, planet.radius
            );
            planetGradient.addColorStop(0, `rgba(255, 255, 255, 0.6)`);
            planetGradient.addColorStop(1, planet.color);

            ctx.beginPath();
            ctx.arc(planetX, planetY, planet.radius, 0, Math.PI * 2);
            ctx.fillStyle = planetGradient;
            ctx.shadowBlur = 10;
            ctx.shadowColor = planet.color;
            ctx.fill();
        }

        // Function to draw the rings around planets
        function drawRings(planetX, planetY, planet) {
            if (planet.ring) {
                ctx.beginPath();
                ctx.arc(planetX, planetY, planet.radius * 2, 0, Math.PI * 2);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                ctx.setLineDash([5, 15]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Function to draw the planets
        function drawPlanets() {
            planets.forEach((planet) => {
                const planetX = sun.x + Math.cos(angle * planet.speed) * planet.distance;
                const planetY = sun.y + Math.sin(angle * planet.speed) * planet.distance;

                drawPlanet(planet, planetX, planetY);
                drawRings(planetX, planetY, planet);

                if (hoveredPlanet === planet) {
                    ctx.fillStyle = "white";
                    ctx.font = "12px Arial";
                    ctx.fillText(planet.name, planetX + 15, planetY - 15);
                }

                // Optionally draw the orbit when the flag is true
                if (showOrbits) {
                    ctx.beginPath();
                    ctx.arc(sun.x, sun.y, planet.distance, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
                    ctx.stroke();
                }
            });
        }

        // Function to check if mouse is over a planet
        function checkHover(event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            hoveredPlanet = null;

            planets.forEach((planet) => {
                const dx = mouseX - (sun.x + Math.cos(angle * planet.speed) * planet.distance);
                const dy = mouseY - (sun.y + Math.sin(angle * planet.speed) * planet.distance);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < planet.radius + 5) {
                    hoveredPlanet = planet;
                }
            });
        }

        // Function to animate
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawGalaxies();
            drawStars();
            drawSun();
            drawPlanets();

            angle += 0.6;
            requestAnimationFrame(animate);
        }

        // Add Event Listener for mouse movement
        canvas.addEventListener("mousemove", checkHover);

        // Toggle orbits on button click
        document.getElementById("toggleButton").addEventListener("click", () => {
            showOrbits = !showOrbits;
        });

        // Start animation
        animate();