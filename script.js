document.addEventListener('DOMContentLoaded', () => {
    const caseImage = document.getElementById('caseImage');
    const caseContainer = document.getElementById('caseContainer');
    const carouselContainer = document.getElementById('carouselContainer');
    const carouselTrack = document.getElementById('carouselTrack');

    // Configuration
    const ITEM_COUNT = 30;
    const SPIN_DURATION = 7000; // Mantendo 7 segundos
    const ITEM_WIDTH = 220;
    const INITIAL_SPEED = 120; // Aumentado MUITO para velocidade inicial super rápida
    const FINAL_SPEED = 0.1; // Mantido o mesmo para parada suave

    // List of weapon skin images
    const weaponSkins = [
        'MAG-7_SWAG-7.webp',
        'M249_Contrast_Spray.webp',
        'Nova_Koi.webp',
        'MP9_Latte_Rush.webp',
        'USP-S_Cortex.webp',
        'P250_Franklin.webp',
        'SG_553_Candy_Apple.webp',
        'AK-47_Leet_Museo.webp',
        'Tec-9_Decimator.webp',
        'Desert_Eagle_Fennec_Fox.webp',
        'CZ75-Auto_The_Fuschia_Is_Now.webp'
    ];

    let isSpinning = false;
    let currentPosition = 0;
    let startTime;
    let targetLoveLetter = null;

    function getCurrentSpeed(elapsedTime) {
        const progress = elapsedTime / SPIN_DURATION;
        // Curva de desaceleração ainda mais suave (0.02 em vez de 0.03) para compensar a velocidade inicial maior
        const decelerationFactor = Math.pow(0.02, progress);
        return INITIAL_SPEED * decelerationFactor + FINAL_SPEED;
    }

    // Create carousel items
    function createCarouselItems() {
        // Create more items to ensure smooth infinite scroll
        for (let i = 0; i < ITEM_COUNT * 3; i++) {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            
            const img = document.createElement('img');
            const skinIndex = i % weaponSkins.length;
            img.src = `images/${weaponSkins[skinIndex]}`;
            img.alt = `Weapon Skin ${i + 1}`;
            img.className = 'weapon-image';
            
            item.appendChild(img);
            carouselTrack.appendChild(item);
        }

        // Add love letter items at strategic positions
        const loveLetterPositions = [ITEM_COUNT, ITEM_COUNT * 1.5, ITEM_COUNT * 2];
        loveLetterPositions.forEach(position => {
            const loveLetterItem = document.createElement('div');
            loveLetterItem.className = 'carousel-item love-letter-item';
            loveLetterItem.textContent = '💌';
            carouselTrack.insertBefore(loveLetterItem, carouselTrack.children[Math.floor(position)]);
        });

        // Pre-select a random love letter position
        const randomPosition = loveLetterPositions[Math.floor(Math.random() * loveLetterPositions.length)];
        targetLoveLetter = Math.floor(randomPosition);
    }

    // Initialize carousel
    createCarouselItems();

    function startSpinning() {
        isSpinning = true;
        currentPosition = 0;
        startTime = Date.now();
    
        // Calcular a posição final desejada com base no centro da viewport
        const viewportWidth = document.querySelector('.viewport').offsetWidth;
        const centerOffset = viewportWidth / 2;
        const targetPosition = centerOffset - (targetLoveLetter * ITEM_WIDTH + ITEM_WIDTH / 2);
    
        function updatePosition() {
            if (!isSpinning) return;
    
            const elapsedTime = Date.now() - startTime;
            const t = Math.min(elapsedTime / SPIN_DURATION, 1); // tempo normalizado entre 0 e 1
    
            // Easing out ainda mais pronunciado (5 em vez de 4) para desaceleração mais gradual com a velocidade maior
            const easeOut = 1 - Math.pow(1 - t, 5);
    
            // Interpola suavemente entre o início (0) e o destino (targetPosition)
            currentPosition = (1 - easeOut) * 0 + easeOut * targetPosition;
    
            carouselTrack.style.transform = `translateX(${currentPosition}px)`;
    
            if (t < 1) {
                requestAnimationFrame(updatePosition);
            } else {
                isSpinning = false;
                document.getElementById('envelopeOverlay').classList.add('show');
            }
        }
    
        requestAnimationFrame(updatePosition);
    }

    // Handle case click
    caseImage.addEventListener('click', () => {
        // Hide case
        caseContainer.style.display = 'none';
        
        // Show carousel
        carouselContainer.classList.add('active');

        // Start spinning
        startSpinning();
    });
}); 