const desktopPyramids = [
    { top: '-12%', left: '8%', size: 460, rot: '168deg', speed: '6s', mx: '20px', my: '25px' },
    { top: '26%', left: '-6%', size: 370, rot: '95deg', speed: '7s', mx: '25px', my: '-15px' },
    { bottom: '-12%', left: '-4%', size: 340, rot: '78deg', speed: '6.5s', mx: '20px', my: '-20px' },
    { bottom: '-14%', left: '31%', size: 360, rot: '-12deg', speed: '5.5s', mx: '-15px', my: '-25px' },
    { top: '31%', left: '53%', size: 240, rot: '88deg', speed: '5s', mx: '-20px', my: '15px' },
    { top: '-4%', right: '-4%', size: 380, rot: '-115deg', speed: '7.5s', mx: '-25px', my: '20px' },
    { bottom: '-10%', right: '-2%', size: 450, rot: '-68deg', speed: '8s', mx: '-30px', my: '-25px' }
];

const mobilePyramids = [
    { top: '-6%', left: '-12%', size: 230, rot: '165deg', speed: '6s', mx: '12px', my: '15px' },
    { top: '-4%', right: '-14%', size: 210, rot: '-115deg', speed: '7.5s', mx: '-15px', my: '12px' },
    { top: '28%', left: '-18%', size: 190, rot: '92deg', speed: '7s', mx: '14px', my: '-10px' },
    { top: '32%', right: '-16%', size: 170, rot: '-85deg', speed: '5.5s', mx: '-12px', my: '10px' },
    { bottom: '-7%', left: '-10%', size: 220, rot: '75deg', speed: '6.5s', mx: '12px', my: '-14px' },
    { bottom: '-8%', right: '-12%', size: 250, rot: '-65deg', speed: '8s', mx: '-16px', my: '-14px' }
];

function createBackgroundLayer() {
    const bgLayer = document.getElementById('bgLayer');
    const isMobile = window.innerWidth <= 600;
    const data = isMobile ? mobilePyramids : desktopPyramids;
    let html = '';

    data.forEach(item => {
        const posTop = item.top ? `top: ${item.top};` : '';
        const posBottom = item.bottom ? `bottom: ${item.bottom};` : '';
        const posLeft = item.left ? `left: ${item.left};` : '';
        const posRight = item.right ? `right: ${item.right};` : '';

        html += `
            <svg viewBox="0 0 200 200" class="pyramid" style="width: ${item.size}px; ${posTop} ${posBottom} ${posLeft} ${posRight} --rot: ${item.rot}; --speed: ${item.speed}; --moveX: ${item.mx}; --moveY: ${item.my}; transform: rotate(${item.rot});">
                <polygon points="100,20 185,175 15,175" fill="none" stroke="#c0984c" stroke-width="1.8" transform="translate(8, -6)" opacity="0.85"/>
                <polygon points="100,20 185,175 100,120" fill="#f7f5f0"/>
                <polygon points="100,20 15,175 100,120" fill="#eae5dc"/>
                <polygon points="15,175 185,175 100,120" fill="#dcd5c9"/>
            </svg>
        `;
    });

    bgLayer.innerHTML = html;
}

createBackgroundLayer();

let lastIsMobile = window.innerWidth <= 600;
window.addEventListener('resize', () => {
    const currentIsMobile = window.innerWidth <= 600;
    if (currentIsMobile !== lastIsMobile) {
        lastIsMobile = currentIsMobile;
        createBackgroundLayer();
    }
});

document.addEventListener('mousemove', (e) => {
    if (!document.body.classList.contains('active')) return;
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    document.getElementById('bgLayer').style.transform = `translate(${x}px, ${y}px)`;
});

function handleGyroscope(e) {
    if (!document.body.classList.contains('active')) return;
    if (e.gamma === null || e.beta === null) return;

    const tiltX = Math.max(-35, Math.min(35, e.gamma));
    const tiltY = Math.max(-35, Math.min(35, e.beta - 45));

    const x = tiltX * 0.7;
    const y = tiltY * 0.7;
    document.getElementById('bgLayer').style.transform = `translate(${x}px, ${y}px)`;
}

function enableGyroscope() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', handleGyroscope);
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('deviceorientation', handleGyroscope);
    }
}

function startAnimation() {
    document.body.classList.add('active');
    enableGyroscope();

    const startCard = document.getElementById('startCard');
    startCard.classList.add('slide-down');

    const mainScreen = document.getElementById('mainScreen');
    setTimeout(() => {
        mainScreen.classList.remove('hidden');
        mainScreen.classList.add('show');
    }, 350);
}

function resetAnimation() {
    document.body.classList.remove('active');
    document.getElementById('bgLayer').style.transform = 'translate(0, 0)';

    const startCard = document.getElementById('startCard');
    const mainScreen = document.getElementById('mainScreen');

    mainScreen.classList.remove('show');
    mainScreen.classList.add('hidden');

    setTimeout(() => {
        startCard.classList.remove('slide-down');
    }, 250);
}
