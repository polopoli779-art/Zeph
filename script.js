// ==================== SOUND EFFECT SYSTEM ====================

let audioContext = null;
let soundEnabled = true;

// Fungsi untuk inisialisasi AudioContext
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  return audioContext;
}

// Fungsi memainkan suara klik
function playClickSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudio();
    if (!ctx || ctx.state !== 'running') return;
    
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    oscillator.stop(now + 0.12);
  } catch (e) {
    console.log('Audio error:', e);
  }
}

// Fungsi memainkan suara notifikasi
function playNotificationSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudio();
    if (!ctx || ctx.state !== 'running') return;
    
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 880;
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(now + 0.12);
    
    setTimeout(() => {
      if (!soundEnabled) return;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = 440;
      gain2.gain.setValueAtTime(0.1, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.15);
    }, 80);
    
  } catch (e) {
    console.log('Audio error:', e);
  }
}

// Setup sound toggle button
function setupSoundToggle() {
  const toggleBtn = document.getElementById('soundToggle');
  if (!toggleBtn) return;
  
  const soundIcon = document.getElementById('soundIcon');
  const soundText = toggleBtn.querySelector('span');
  
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
      soundIcon.className = 'fas fa-volume-up';
      soundText.textContent = 'Sound ON';
      toggleBtn.style.background = 'rgba(0, 0, 0, 0.7)';
      playNotificationSound();
    } else {
      soundIcon.className = 'fas fa-volume-mute';
      soundText.textContent = 'Sound OFF';
      toggleBtn.style.background = 'rgba(0, 0, 0, 0.4)';
    }
  });
}

// Setup semua event listener untuk sound
function setupSoundEvents() {
  const linkCards = document.querySelectorAll('.link-card');
  linkCards.forEach(link => {
    link.addEventListener('click', () => playClickSound());
  });
  
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.addEventListener('click', () => playClickSound());
  });
  
  const categories = document.querySelectorAll('.category');
  categories.forEach(cat => {
    cat.addEventListener('click', () => playClickSound());
  });
  
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    avatar.addEventListener('click', () => playClickSound());
  }
  
  const serverIp = document.getElementById('serverIp');
  if (serverIp) {
    serverIp.addEventListener('click', async (e) => {
      e.preventDefault();
      const ipText = 'zephyra.my.id:19133';
      
      try {
        await navigator.clipboard.writeText(ipText);
        playNotificationSound();
        
        const originalHTML = serverIp.innerHTML;
        serverIp.innerHTML = '<i class="fas fa-check"></i> IP Disalin';
        setTimeout(() => {
          serverIp.innerHTML = originalHTML;
        }, 1500);
      } catch (err) {
        alert('Copy IP: ' + ipText);
      }
    });
  }
}

// Inisialisasi audio
function initAudioOnFirstInteraction() {
  const enableAudio = () => {
    initAudio();
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
    console.log('✅ Audio siap!');
  };
  
  document.addEventListener('click', enableAudio);
  document.addEventListener('touchstart', enableAudio);
}

// Cek video background
function checkVideoBackground() {
  const video = document.getElementById('bgVideo');
  if (video) {
    video.addEventListener('error', function() {
      console.log('⚠️ Video gagal dimuat');
    });
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  checkVideoBackground();
  setupSoundToggle();
  setupSoundEvents();
  initAudioOnFirstInteraction();
  console.log('✅ Website siap dengan video background & sound effect!');
});