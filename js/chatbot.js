/* ================================================================
   CHATBOT.JS — Floating AI chat widget
   Handles: page navigation buttons + keyword-based responses
   Mock OpenAI API structure included — see OPENAI SECTION below
   ================================================================ */

(function () {
  const toggle    = document.getElementById('chat-toggle');
  const window_   = document.getElementById('chat-window');
  const closeBtn  = document.getElementById('chat-close');
  const messages  = document.getElementById('chat-messages');
  const input     = document.getElementById('chat-input');
  const sendBtn   = document.getElementById('chat-send');
  const badge     = document.getElementById('chat-badge');

  if (!toggle || !window_) return;

  /* ── Toggle open/close ───────────────────────────────── */
  toggle.addEventListener('click', () => {
    const open = window_.classList.toggle('open');
    toggle.classList.toggle('open', open);
    if (badge) badge.style.display = 'none';
    if (open && messages.children.length === 0) showWelcome();
  });
  closeBtn?.addEventListener('click', () => {
    window_.classList.remove('open');
    toggle.classList.remove('open');
  });

  /* ── Append message ──────────────────────────────────── */
  function appendMsg(text, role = 'bot') {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  /* ── Typing indicator ────────────────────────────────── */
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'msg bot typing-indicator';
    div.id = 'typing-bubble';
    div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function removeTyping() {
    document.getElementById('typing-bubble')?.remove();
  }

  /* ── Welcome message with nav buttons ───────────────── */
  function showWelcome() {
    appendMsg(
      `Hi! I'm <strong>KB Assistant</strong> 👋<br>
       I can help you navigate Khent's portfolio or answer questions about his work.`
    );
    setTimeout(() => appendMsg(buildNavMenu()), 600);
  }

  function buildNavMenu() {
    return `Where would you like to go?
      <div class="chat-nav-grid">
        <button class="chat-nav-btn" onclick="chatNav('index.html')">🏠 Home</button>
        <button class="chat-nav-btn" onclick="chatNav('about.html')">👤 About</button>
        <button class="chat-nav-btn" onclick="chatNav('projects.html')">🛠 Projects</button>
        <button class="chat-nav-btn" onclick="chatNav('contact.html')">📬 Contact</button>
      </div>
      <br>Or type a question below!`;
  }

  /* Navigation handler (exposed globally for onclick) */
  window.chatNav = function (page) {
    appendMsg(`Taking you to <strong>${page.replace('.html','').replace('index','Home')}</strong>…`, 'user');
    setTimeout(() => { window.location.href = page; }, 700);
  };

  /* ── Knowledge base ──────────────────────────────────── */
  const KB = [
    {
      keys: ['who','khent','about','yourself','introduce'],
      ans:  `<strong>Khent Benedict Balulot</strong> is a Computer Engineering student at Carlos Hilado Memorial State University, a DOST-SEI Scholar (top 6.56% nationwide), and a hands-on builder. He designs IoT systems, robotic arms, networking setups, and more — all self-driven.`
    },
    {
      keys: ['project','build','made','work','create'],
      ans:  `Khent's key projects include:<br>
             • 🤖 6-DoF Robotic Arm with Voice AI<br>
             • 🏠 Safety House IoT (ESP32 + Telegram)<br>
             • 🌱 Automated Farm System<br>
             • 🦯 Cane for the Blind (ESP-NOW + GPS)<br>
             • ⚡ Custom 5V/3A Power Supply<br>
             See them all on the <button class="chat-nav-btn" style="display:inline;padding:.2rem .5rem" onclick="chatNav('projects.html')">Projects</button> page!`
    },
    {
      keys: ['skill','know','good at','expertise','tech','language','programming'],
      ans:  `Khent's skills include C/C++, Python, JavaScript/HTML/CSS, ESP32/Arduino, Raspberry Pi, LattePanda, SolidWorks, Blender, KiCad, networking (TCP/IP, DNS, DHCP, IP routing), and computer repair & troubleshooting.`
    },
    {
      keys: ['certificate','cert','google','course'],
      ans:  `Khent holds:<br>
             🏅 Google IT Support Professional Certificate (Networking)<br>
             🏅 Google IT Automation with Python Professional Certificate<br>
             Coming soon: Google AI Essentials & Advanced Data Analytics.`
    },
    {
      keys: ['award','achievement','dost','scholar','place','competition','honor'],
      ans:  `Notable achievements:<br>
             ⭐ DOST-SEI Scholar 2025 (top 6.56%)<br>
             ⭐ CHED CTP Scholar<br>
             🥉 3rd Place — ICPEP C++ Coding Competition (NIR)<br>
             🏆 SolidWorks Competition 2025 Finalist<br>
             📜 Best Research Paper + Highest Honors (STEM)`
    },
    {
      keys: ['contact','email','reach','message','hire','commission'],
      ans:  `You can reach Khent via the <button class="chat-nav-btn" style="display:inline;padding:.2rem .5rem" onclick="chatNav('contact.html')">Contact</button> page.<br>
             He's open to OJT opportunities, commissions, and collaborations!`
    },
    {
      keys: ['ojt','internship','job','hiring','apply','opportunity'],
      ans:  `Khent is actively seeking an OJT in <strong>networking, cloud infrastructure, or DevOps</strong>. He brings real hands-on project experience, Google certifications, and a strong drive to learn on the job. Reach out via the Contact page!`
    },
    {
      keys: ['github','code','repo','repository'],
      ans:  `Khent's GitHub: <a href="https://github.com/ikheent" target="_blank" style="color:var(--accent)">github.com/ikheent</a> — check out his repos and projects there!`
    },
    {
      keys: ['thesis','commission','help','educ'],
      ans:  `Khent has completed 6 thesis commissions for other universities, including an automated rice fodder machine, sulfur detector with SMS alerts, a cane for the blind with GPS, a solar water-quality monitor, and 3D models for two other teams.`
    },
    {
      keys: ['education','school','university','degree','course','chmsu','carlos'],
      ans:  `Khent studies <strong>Computer Engineering</strong> at <strong>Carlos Hilado Memorial State University (CHMSU)</strong>. He is also a working student — serving as a Student Assistant in the Culture & Arts Office and working at a family computer shop.`
    },
  ];

  function getBotResponse(text) {
    const lower = text.toLowerCase();
    for (const entry of KB) {
      if (entry.keys.some(k => lower.includes(k))) {
        return entry.ans;
      }
    }
    return null;
  }

  /* ── OPENAI SECTION ──────────────────────────────────────
     To enable real AI responses:
     1. Sign up at https://platform.openai.com and get an API key
     2. Replace YOUR_OPENAI_API_KEY below with your actual key
     3. WARNING: Never expose real API keys in a public GitHub repo.
        Use a backend proxy or environment variable for production.
     ──────────────────────────────────────────────────────── */
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // ← REPLACE THIS
  const OPENAI_ENABLED = false;                  // ← Set true after adding key

  async function fetchOpenAIResponse(userText) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are KB Assistant, a helpful chatbot on Khent Benedict Balulot's portfolio website.
            Khent is a Computer Engineering student at CHMSU, DOST-SEI Scholar, ESP32/Arduino builder,
            and is seeking a networking/cloud OJT. Be friendly, concise, and professional. 
            Redirect unknown questions politely.`
          },
          { role: 'user', content: userText }
        ],
        max_tokens: 180,
        temperature: 0.7
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "I'm not sure about that — try the Contact page!";
  }

  /* ── Handle send ─────────────────────────────────────── */
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    appendMsg(text, 'user');
    input.value = '';
    showTyping();

    // Check for navigation intent
    if (/home|index/.test(text.toLowerCase())) { removeTyping(); return chatNav('index.html'); }
    if (/about/.test(text.toLowerCase()))        { removeTyping(); return chatNav('about.html'); }
    if (/project/.test(text.toLowerCase()))      { removeTyping(); return chatNav('projects.html'); }
    if (/contact/.test(text.toLowerCase()))      { removeTyping(); return chatNav('contact.html'); }

    // Try local knowledge base first
    const localAns = getBotResponse(text);

    if (OPENAI_ENABLED && !localAns) {
      try {
        const aiAns = await fetchOpenAIResponse(text);
        removeTyping();
        setTimeout(() => appendMsg(aiAns), 200);
      } catch {
        removeTyping();
        appendMsg("Sorry, the AI is taking a break. " + (localAns || "Try asking about projects, skills, or contact info!"));
      }
    } else {
      setTimeout(() => {
        removeTyping();
        appendMsg(localAns || "I'm not sure about that! Try asking about Khent's projects, skills, certifications, or contact info. Or use the buttons to navigate 👇<br>" + buildNavMenu());
      }, 900);
    }
  }

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
})();
