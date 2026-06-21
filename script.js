
/* ═══════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

/* ═══════════════════════════════════════════
   PIXEL STARS
═══════════════════════════════════════════ */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 80; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    --d:${(1.5+Math.random()*3).toFixed(1)}s;
    --o:${(0.3+Math.random()*0.7).toFixed(2)};
    background:${['#00F0FF','#FF2D78','#7B2FFF','#FFE600'][Math.floor(Math.random()*4)]};
    animation-delay:${(Math.random()*3).toFixed(1)}s;
  `;
  starsEl.appendChild(s);
}

/* ═══════════════════════════════════════════
   HP / MP SCROLL TRACKER
═══════════════════════════════════════════ */
const hpFill = document.getElementById('hp-fill');
const mpFill = document.getElementById('mp-fill');
window.addEventListener('scroll', () => {
  const prog = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  hpFill.style.height = (100 - prog * 100) + '%';
  mpFill.style.height = (prog * 100) + '%';
});

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ═══════════════════════════════════════════
   PIXEL BLOCK TRANSITION
═══════════════════════════════════════════ */
const overlay = document.getElementById('px-overlay');
const blocks = [];
for (let i = 0; i < 300; i++) {
  const b = document.createElement('div');
  b.className = 'px-block';
  overlay.appendChild(b);
  blocks.push(b);
}
function pixelTransition(cb) {
  overlay.style.opacity = '1';
  const shuffled = [...blocks].sort(() => Math.random() - 0.5);
  shuffled.forEach((b, i) => {
    setTimeout(() => { b.style.opacity = '1'; }, i * 2);
  });
  setTimeout(() => {
    if (cb) cb();
    shuffled.forEach((b, i) => {
      setTimeout(() => { b.style.opacity = '0'; }, i * 2);
    });
    setTimeout(() => { overlay.style.opacity = '0'; }, shuffled.length * 2 + 200);
  }, shuffled.length * 2 + 100);
}

/* Section intersection for transitions */
let lastSection = null;
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && e.target !== lastSection) {
      lastSection = e.target;
      // Light pixel flash on section change (non-intrusive)
      const nb = blocks.slice(0, 40).sort(() => Math.random() - 0.5);
      nb.forEach((b, i) => {
        setTimeout(() => {
          b.style.opacity = '0.6';
          b.style.background = ['#7B2FFF','#FF2D78','#00F0FF'][i % 3];
          setTimeout(() => { b.style.opacity = '0'; }, 150);
        }, i * 8);
      });
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section').forEach(s => sectionObs.observe(s));

/* ═══════════════════════════════════════════
   ARCADE BUTTON COMBO EFFECT
═══════════════════════════════════════════ */
let clickCount = 0;
let clickTimer;
function makeCombo(btn, x, y) {
  clickCount++;
  clearTimeout(clickTimer);
  if (clickCount >= 3) {
    btn.classList.add('combo');
    setTimeout(() => btn.classList.remove('combo'), 800);
    // Burst text
    const burst = document.createElement('div');
    burst.className = 'combo-burst';
    burst.style.left = x + 'px';
    burst.style.top  = y + 'px';
    const msgs = ['ULTRA COMBO!!', 'THIRSTY x3!', 'DRINK MASTER!', '★ LEGENDARY ★'];
    burst.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    burst.style.color = ['#FFE600','#FF2D78','#00F0FF'][Math.floor(Math.random()*3)];
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
    clickCount = 0;
  }
  clickTimer = setTimeout(() => { clickCount = 0; }, 600);
}

document.querySelectorAll('.btn-arcade').forEach(btn => {
  btn.addEventListener('click', e => {
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 150);
    makeCombo(btn, e.clientX, e.clientY - 40);
  });
});

/* ═══════════════════════════════════════════
   COCKTAIL DATA & PIXEL ART RENDERER
═══════════════════════════════════════════ */
const cocktails = [
  {
    tier: '★★★ LEGENDARY SKILL',
    name: '暗影刺客\nShadow Striker',
    desc: '黑醋栗燒酒混合夜影薄荷，\n一口下肚、消失於人群之中。\n速度最大化的刺殺技能。',
    color: '#7B2FFF',
    stats: { ATK: 85, DEF: 30, SPD: 90, MGC: 70 },
    palette: ['#0a0020','#7B2FFF','#FF2D78','#00F0FF','#ffffff'],
    art: [
      '00100',
      '01210',
      '12321',
      '01210',
      '00100',
    ]
  },
  {
    tier: '★★★ RARE SKILL',
    name: '魔法師的告白\nMage Confession',
    desc: '玫瑰利口酒 × 蝶豆花氣泡水，\n藍轉紫的魔法變色反應，\n每一口都是魔力屬性增幅。',
    color: '#FF2D78',
    stats: { ATK: 50, DEF: 60, SPD: 55, MGC: 95 },
    palette: ['#0a0010','#FF2D78','#7B2FFF','#FFE600','#ffffff'],
    art: [
      '00200',
      '02420',
      '24342',
      '02420',
      '00200',
    ]
  },
  {
    tier: '★★ UNCOMMON SKILL',
    name: '鐵甲騎士\nIron Paladin',
    desc: '威士忌 × 焦糖奶油 × 海鹽泡沫，\n防禦力爆表，醉倒也傷不了你。\n老玩家的主力坦克技能。',
    color: '#FFE600',
    stats: { ATK: 65, DEF: 90, SPD: 35, MGC: 45 },
    palette: ['#100800','#FFE600','#FF8C00','#ffffff','#4a3000'],
    art: [
      '01310',
      '13531',
      '35753',
      '13531',
      '01310',
    ]
  },
  {
    tier: '★★ UNCOMMON SKILL',
    name: '青龍閃現\nAzure Flash',
    desc: '琴酒 × 薄荷 × 萊姆 × 蘇打，\n清爽速攻型！召喚出閃電速度\n讓對手還沒反應就已結束戰鬥。',
    color: '#00F0FF',
    stats: { ATK: 70, DEF: 25, SPD: 98, MGC: 60 },
    palette: ['#001020','#00F0FF','#00FF88','#7B2FFF','#ffffff'],
    art: [
      '01110',
      '14441',
      '44444',
      '14441',
      '01110',
    ]
  },
  {
    tier: '★ COMMON SKILL',
    name: '新手入場券\nNewbie Pass',
    desc: '荔枝伏特加 × 橙汁 × 蔓越莓，\n甜蜜無比的新手友好技能。\nEZ模式開啟，通關率 99%。',
    color: '#00FF88',
    stats: { ATK: 40, DEF: 55, SPD: 65, MGC: 75 },
    palette: ['#001810','#00FF88','#FFE600','#FF2D78','#ffffff'],
    art: [
      '02220',
      '24442',
      '44444',
      '24442',
      '02220',
    ]
  },
  {
    tier: '★★★★ MYTHIC SKILL',
    name: '深淵君主\nAbyssal Lord',
    desc: '多重烈酒混合秘密配方，\n只有最終 Boss 才會使用的終極技能。\n⚠️ 店長不負責任何後果。',
    color: '#FF2D78',
    stats: { ATK: 99, DEF: 40, SPD: 77, MGC: 99 },
    palette: ['#100010','#FF2D78','#7B2FFF','#FFE600','#000000'],
    art: [
      '04440',
      '44444',
      '44444',
      '44444',
      '04440',
    ]
  }
];

function drawPixelArt(canvas, palette, grid) {
  const ctx = canvas.getContext('2d');
  const size = 16;
  canvas.width  = grid[0].length * size;
  canvas.height = grid.length * size;
  grid.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      const idx = parseInt(ch);
      if (idx > 0) {
        ctx.fillStyle = palette[idx - 1];
        ctx.fillRect(x * size, y * size, size, size);
        // pixel outline
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(x * size, y * size, 1, size);
        ctx.fillRect(x * size, y * size, size, 1);
      }
    });
  });
}

function drawRadar(container, stats, color) {
  const keys = Object.keys(stats);
  const vals = Object.values(stats);
  const n = keys.length;
  const R = 44, cx = 55, cy = 55;
  const points = keys.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (vals[i] / 100) * R;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const grid = keys.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + R * Math.cos(angle), cy + R * Math.sin(angle)];
  });

  const svg = `<svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
    ${[0.25,0.5,0.75,1].map(f =>
      `<polygon points="${grid.map(([gx,gy]) => {
        const angle = Math.atan2(gy - cy, gx - cx);
        const r2 = R * f;
        return `${cx + r2 * Math.cos(angle)},${cy + r2 * Math.sin(angle)}`;
      }).join(' ')}" fill="none" stroke="#1a003a" stroke-width="1"/>`
    ).join('')}
    ${grid.map(([gx,gy]) =>
      `<line x1="${cx}" y1="${cy}" x2="${gx}" y2="${gy}" stroke="#2a0050" stroke-width="1"/>`
    ).join('')}
    <polygon points="${points.map(p => p.join(',')).join(' ')}"
      fill="${color}44" stroke="${color}" stroke-width="1.5"/>
    ${keys.map((k, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const lx = cx + (R + 12) * Math.cos(angle);
      const ly = cy + (R + 12) * Math.sin(angle);
      return `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Press Start 2P'" font-size="5" fill="#FFE600">${k}</text>`;
    }).join('')}
  </svg>`;
  container.innerHTML = svg;
}

function buildCocktails() {
  const grid = document.getElementById('cocktail-grid');
  cocktails.forEach(c => {
    const card = document.createElement('div');
    card.className = 'cocktail-card reveal';
    card.innerHTML = `
      <div class="card-tier">${c.tier}</div>
      <div class="cocktail-art"><canvas id="art-${Math.random().toString(36).slice(2)}"></canvas></div>
      <div class="cocktail-name">${c.name.replace('\n','<br>')}</div>
      <p class="cocktail-desc">${c.desc.replace(/\n/g,'<br>')}</p>
      <div class="radar-wrap" id="radar-${Math.random().toString(36).slice(2)}"></div>
      <div class="stat-bars-mini">
        ${Object.entries(c.stats).map(([k,v]) => `
          <div class="stat-row">
            <span class="stat-name">${k}</span>
            <div class="stat-bar-bg">
              <div class="stat-bar-fill" style="width:${v}%;background:${c.color}"></div>
            </div>
          </div>`).join('')}
      </div>
    `;
    grid.appendChild(card);
    obs.observe(card);

    // Draw pixel art
    const canvas = card.querySelector('canvas');
    drawPixelArt(canvas, c.palette, c.art);

    // Draw radar
    const radarDiv = card.querySelector('.radar-wrap');
    drawRadar(radarDiv, c.stats, c.color);
  });
}
buildCocktails();

/* ═══════════════════════════════════════════
   RESERVATION FORM
═══════════════════════════════════════════ */
document.getElementById('submit-btn').addEventListener('click', e => {
  e.preventDefault();
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const size  = document.getElementById('f-size').value.trim();
  const date  = document.getElementById('f-date').value;
  const msg   = document.getElementById('form-msg');

  if (!name || !phone || !size || !date) {
    msg.style.color = 'var(--pink)';
    msg.textContent = '⚠ 請填寫所有欄位，冒險者！';
    return;
  }
  msg.style.color = 'var(--green)';
  msg.textContent = '✦ QUEST ACCEPTED! 存檔完成，等待你的到來！✦';
  ['f-name','f-phone','f-size','f-date'].forEach(id =>
    document.getElementById(id).value = ''
  );
  // Pixel flash celebration
  pixelTransition(null);
});

/* ═══════════════════════════════════════════
   DUNGEON GALLERY SWIPER INIT
═══════════════════════════════════════════ */
const dungeonSwiper = new Swiper('#dungeon-swiper', {
  loop: true,
  speed: 600,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    slideChange() {
      const cur = document.getElementById('swiper-cur');
      if (cur) {
        cur.textContent = String(this.realIndex + 1).padStart(2, '0');
      }
    }
  }
});