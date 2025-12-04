import { useEffect, useRef } from 'react';
import logoImage from '../../assets/img/Assets_inicio/logo4.png';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('❌ Canvas no encontrado');
            return;
        }

        const ctx = canvas.getContext('2d');
        let animationFrameId = null;
        let particles = [];
        let logoPoints = [];
        let isMounted = true; // 🚩 Flag para controlar si el componente está montado

        // Configuración
        const particleCount = 2000;
        const particleSize = 3;
        const mouseRadius = 150;
        const disperseForce = 20;
        const logoAttractionForce = 0.1;
        const logoAttractionRadius = 120;
        const maxSpeed = 10;

        const resizeCanvas = () => {
            if (!isMounted) return; // 🛑 No redimensionar si está desmontado
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Clase de partícula unificada
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;

                // Tamaño aleatorio: 1, 2 o 3 píxeles
                const sizes = [2, 3, 4];
                this.size = sizes[Math.floor(Math.random() * sizes.length)];

                // Color morado con variación
                const opacity = Math.random() * 0.8 + 0.5;
                const colorVariants = [
                    `rgba(161, 140, 209, ${opacity})`,
                    `rgba(132, 94, 194, ${opacity})`,
                    `rgba(180, 167, 214, ${opacity})`
                ];
                this.color = colorVariants[Math.floor(Math.random() * colorVariants.length)];
            }

            update(mouseX, mouseY) {
                // 1. Dispersión por el mouse
                const dxMouse = mouseX - this.x;
                const dyMouse = mouseY - this.y;
                const distanceToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distanceToMouse < mouseRadius && distanceToMouse > 0) {
                    const angle = Math.atan2(dyMouse, dxMouse);
                    const force = (mouseRadius - distanceToMouse) / mouseRadius;
                    this.vx -= Math.cos(angle) * force * disperseForce;
                    this.vy -= Math.sin(angle) * force * disperseForce;
                }

                // 2. Atracción hacia puntos del logo (si están cerca)
                let closestPoint = null;
                let closestDistance = Infinity;

                // Encontrar el punto del logo más cercano
                for (let point of logoPoints) {
                    const dx = point.x - this.x;
                    const dy = point.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < closestDistance && distance < logoAttractionRadius) {
                        closestDistance = distance;
                        closestPoint = point;
                    }
                }

                // Si hay un punto cercano, atraer suavemente
                if (closestPoint) {
                    const dx = closestPoint.x - this.x;
                    const dy = closestPoint.y - this.y;
                    const attractionStrength = 1 - (closestDistance / logoAttractionRadius);

                    this.vx += dx * logoAttractionForce * attractionStrength;
                    this.vy += dy * logoAttractionForce * attractionStrength;
                }

                // 3. Movimiento aleatorio (flotación)
                this.vx += (Math.random() - 0.5) * 0.1;
                this.vy += (Math.random() - 0.5) * 0.1;

                // 4. Limitar velocidad máxima
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }

                // 5. Fricción
                this.vx *= 0.98;
                this.vy *= 0.98;

                // 6. Actualizar posición
                this.x += this.vx;
                this.y += this.vy;

                // 7. Rebotar en bordes
                if (this.x < 0 || this.x > canvas.width) {
                    this.vx *= -1;
                    this.x = Math.max(0, Math.min(canvas.width, this.x));
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.vy *= -1;
                    this.y = Math.max(0, Math.min(canvas.height, this.y));
                }
            }

            draw() {
                // Efecto de brillo sutil
                ctx.shadowBlur = 3;
                ctx.shadowColor = this.color;

                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Resetear sombra
                ctx.shadowBlur = 0;
            }
        }

        // Cargar imagen del logo y extraer puntos de atracción
        const loadImage = () => {
            console.log('🖼️ Cargando imagen:', logoImage);
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                if (!isMounted) return; // 🛑 Si ya se desmontó, no continuar
                console.log('✅ Imagen cargada:', img.width, 'x', img.height);

                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');

                const scale = 0.5;
                const logoWidth = img.width * scale;
                const logoHeight = img.height * scale;

                tempCanvas.width = logoWidth;
                tempCanvas.height = logoHeight;

                tempCtx.drawImage(img, 0, 0, logoWidth, logoHeight);

                const imageData = tempCtx.getImageData(0, 0, logoWidth, logoHeight);
                const pixels = imageData.data;

                const offsetX = (canvas.width - logoWidth) / 2;
                const offsetY = (canvas.height - logoHeight) / 2 - 80;

                const sampling = 3; // Menos muestreo = más puntos de atracción

                // Extraer puntos de atracción del logo
                for (let y = 0; y < logoHeight; y += sampling) {
                    for (let x = 0; x < logoWidth; x += sampling) {
                        const index = (y * logoWidth + x) * 4;
                        const r = pixels[index];
                        const g = pixels[index + 1];
                        const b = pixels[index + 2];

                        if (r < 240 || g < 240 || b < 240) {
                            logoPoints.push({
                                x: x + offsetX,
                                y: y + offsetY
                            });
                        }
                    }
                }

                console.log(`✨ ${logoPoints.length} puntos de atracción del logo`);

                // Crear partículas
                // 75% empiezan cerca del logo, 25% empiezan aleatorias
                const particlesNearLogo = Math.floor(particleCount * 0.90);

                for (let i = 0; i < particleCount; i++) {
                    const particle = new Particle();

                    // Si es una de las primeras 75%, posicionarla cerca de un punto del logo
                    if (i < particlesNearLogo && logoPoints.length > 0) {
                        const randomPoint = logoPoints[Math.floor(Math.random() * logoPoints.length)];
                        // Posicionar cerca del punto con un poco de dispersión
                        const offsetX = (Math.random() - 0.5) * 40;
                        const offsetY = (Math.random() - 0.5) * 40;
                        particle.x = randomPoint.x + offsetX;
                        particle.y = randomPoint.y + offsetY;
                    }
                    // El resto ya están en posiciones aleatorias (por defecto)

                    particles.push(particle);
                }

                console.log(`🎈 ${particleCount} partículas creadas (${particlesNearLogo} cerca del logo)`);
                animate();
            };

            img.onerror = (error) => {
                console.error('❌ Error al cargar imagen:', error);
            };

            img.src = logoImage;
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!isMounted) return; // 🛑 Detener animación si está desmontado

            ctx.fillStyle = '#faf8f8ff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Actualizar y dibujar todas las partículas
            particles.forEach(particle => {
                particle.update(mouseRef.current.x, mouseRef.current.y);
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        loadImage();

        return () => {
            isMounted = false; // 🛑 Marcar como desmontado
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 3,
                pointerEvents: 'none',
                backgroundColor: 'transparent'
            }}
        />
    );
};

export default ParticleBackground;
