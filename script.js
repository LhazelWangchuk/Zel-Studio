document.addEventListener("DOMContentLoaded", () => {
    // Live Clock based on user location
    function updateLiveClock() {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Thimphu';
        const options = {
            timeZone: timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        };
        let liveTime;
        try {
            liveTime = new Date().toLocaleTimeString("en-US", options);
        } catch (e) {
            liveTime = new Date().toISOString().split("T")[1].split(".")[0];
        }
        const clockElement = document.getElementById("clock");
        if (clockElement) {
            clockElement.innerText = liveTime;
        }
    }
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    const appElement = document.getElementById("app");
    if (appElement) appElement.classList.add("loaded");

    if (window.THREE) {
        const THREE = window.THREE;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.pointerEvents = "none";
        const blobContainer = document.getElementById("backgroundBlob");
        if (blobContainer) {
            blobContainer.innerHTML = "";
            blobContainer.appendChild(renderer.domElement);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x5ECBB8, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        let model;
        let modelLoaded = false;
        if (typeof THREE.GLTFLoader !== 'undefined') {
            const loader = new THREE.GLTFLoader();
            const glbPath = './images/abstract_design.glb';
            loader.load(
                glbPath,
                (gltf) => {
                    model = gltf.scene;
                    scene.add(model);
                    model.position.set(0, 0, 0);
                    model.scale.set(1, 1, 1);
                    modelLoaded = true;
                },
                (xhr) => { },
                (error) => {
                    const geometry = new THREE.BoxGeometry(5, 5, 5);
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x5ECBB8,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.8
                    });
                    model = new THREE.Mesh(geometry, material);
                    scene.add(model);
                    modelLoaded = true;
                }
            );
        } else {
            const geometry = new THREE.BoxGeometry(5, 5, 5);
            const material = new THREE.MeshPhongMaterial({
                color: 0x5ECBB8,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            model = new THREE.Mesh(geometry, material);
            scene.add(model);
            modelLoaded = true;
        }

        camera.position.z = 15;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        function animate() {
            requestAnimationFrame(animate);
            if (model && modelLoaded) {
                model.rotation.x = mouseY * 0.5;
                model.rotation.y = mouseX * 0.5;
                model.position.set(0, 0, 0);
                camera.position.z = 15;
            }
            renderer.render(scene, camera);
        }
        animate();

        const sections = document.querySelectorAll('main, .page');
        const navLinks = document.querySelectorAll('header a');
        let currentSection = 'home';

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            let activeSection = 'home';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop - window.innerHeight / 2 && scrollPosition < sectionTop + sectionHeight) {
                    activeSection = section.getAttribute('id');
                }
            });
            if (activeSection !== currentSection) {
                currentSection = activeSection;
                const section = document.getElementById(currentSection);
                if (section) {
                    section.classList.add('visible');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${currentSection}`) {
                            link.style.fontWeight = 'bold';
                            link.style.textDecoration = 'underline';
                        } else {
                            link.style.fontWeight = 'normal';
                            link.style.textDecoration = 'none';
                        }
                    });
                }
            }

            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollPosition / scrollHeight) * 100;
            document.getElementById('progress-bar').style.width = `${progress}%`;
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        const backgroundBlob = document.getElementById("backgroundBlob");
        const sectionGradients = {
            'home': 'linear-gradient(135deg, #34495E 0%, #5ECBB8 100%)',
            'about': 'linear-gradient(135deg, #000000 0%, #34495E 100%)',
            'services': 'linear-gradient(135deg, #5ECBB8 0%, #34495E 100%)',
            'featured-work': 'linear-gradient(135deg, #5ECBB8 0%, #5ECBB8 100%)',
            'contact': 'linear-gradient(135deg, #34495E 0%, #000000 100%)'
        };

        const backgroundObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    backgroundBlob.style.background = sectionGradients[sectionId] || sectionGradients['home'];
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => {
            backgroundObserver.observe(section);
        });

        backgroundBlob.style.background = sectionGradients['home'];
    }

    const animatedElements = document.querySelectorAll(
        '.about-title, .about-lead-bold, .about-body-bold, .services-intro, .service-card, .project-card'
    );

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('visible');
                if (element.classList.contains('project-card')) {
                    const cards = Array.from(document.querySelectorAll('.project-card'));
                    const index = cards.indexOf(element);
                    element.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, { threshold: 0.1 });

    setTimeout(() => {
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });

        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
            if (isVisible) {
                element.classList.add('visible');
                if (element.classList.contains('project-card')) {
                    const cards = Array.from(document.querySelectorAll('.project-card'));
                    const index = cards.indexOf(element);
                    element.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, 100);

    // Slider navigation, progress bar, keyboard navigation, and autoplay
    const slider = document.querySelector('.works-slider');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');
    const progressBar = document.querySelector('.slider-progress');
    const progressIndicator = document.querySelector('.progress-indicator');

    if (slider && prevButton && nextButton && progressBar && progressIndicator) {
        const cardWidth = () => {
            const card = slider.querySelector('.project-card');
            return card ? card.offsetWidth + parseFloat(getComputedStyle(card).marginRight) : 0;
        };

        const totalCards = slider.querySelectorAll('.project-card').length;

        const updateProgress = () => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const progress = (slider.scrollLeft / maxScroll) * 100;
            progressBar.style.width = `${progress}%`;
            const currentCard = Math.round((slider.scrollLeft / maxScroll) * (totalCards - 1)) + 1;
            progressIndicator.textContent = `${currentCard}/${totalCards}`;
            // Update progress bar color
            const colorProgress = slider.scrollLeft / maxScroll;
            const startColor = [52, 73, 94]; // #34495E
            const endColor = [94, 203, 184]; // #5ECBB8
            const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * colorProgress);
            const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * colorProgress);
            const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * colorProgress);
            progressBar.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            prevButton.disabled = slider.scrollLeft <= 0;
            nextButton.disabled = slider.scrollLeft >= maxScroll;
        };

        prevButton.addEventListener('click', () => {
            slider.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            slider.scrollBy({ left: cardWidth(), behavior: 'smooth' });
        });

        slider.addEventListener('scroll', updateProgress);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                slider.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                slider.scrollBy({ left: cardWidth(), behavior: 'smooth' });
            }
        });

        // Autoplay
        let autoplayInterval = null;
        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                if (slider.scrollLeft >= maxScroll) {
                    slider.scrollTo({ left: 0, behavior: 'smooth' }); // Reset to start
                } else {
                    slider.scrollBy({ left: cardWidth(), behavior: 'smooth' });
                }
            }, 5000);
        };
        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        };

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        startAutoplay();

        // Trigger initial progress and button state
        updateProgress();
    }

    // Accessibility for progress bar
    progressBar.setAttribute('aria-live', 'polite');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
});

const cursor = document.querySelector('.custom-cursor');
const outline = document.querySelector('.custom-cursor-outline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animate() {
    outlineX += (mouseX - outlineX) * 0.1;
    outlineY += (mouseY - outlineY) * 0.1;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animate);
}

animate();

const hoverTargets = document.querySelectorAll('a, button, .service-card, .project-card');

hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const rotateX = (mouseY / rect.height) * -20;
        const rotateY = (mouseX / rect.width) * 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
});