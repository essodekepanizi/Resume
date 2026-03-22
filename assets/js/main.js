/**
 * main.js — Vitrine Essodéké PANIZI
 * Lit content.fr.json ou content.en.json et rend toutes les sections dynamiquement
 * Calcule automatiquement les durées de poste depuis les dates
 */

const BASE_URL = '/Resume';
let currentLang = 'fr';
let data = {};

// ── INIT ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadContent('fr');
  initScrollReveal();
  initMobileMenu();
});

// ── LOAD CONTENT ──────────────────────────────────────────────────────────────

async function loadContent(lang) {
  try {
    const res = await fetch(`${BASE_URL}/data/content.${lang}.json`);
    data = await res.json();
    currentLang = lang;
    renderAll(data);
    updateLangButtons(lang);
  } catch (e) {
    console.error('Erreur chargement contenu:', e);
  }
}

function setLang(lang) {
  if (lang === currentLang) return;
  loadContent(lang);
}

function updateLangButtons(lang) {
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  document.documentElement.lang = lang;
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────

function renderAll(d) {
  renderMeta(d.profil);
  renderHero(d.profil, d.stats, d.pills);
  renderAbout(d.profil);
  renderSkills(d.competences);
  renderExperience(d.experience);
  renderProjects(d.projets);
  renderPublications(d.publications);
  renderFormation(d.formation);
  renderCertifications(d.certifications);
  renderDistinctions(d.distinctions);
  renderBlog(d.blog);
  renderContact(d.profil);
  renderFooter(d.profil);
}

// ── META ──────────────────────────────────────────────────────────────────────

function renderMeta(p) {
  document.title = `${p.prenom} ${p.nom} — ${p.titre}`;
  setMeta('description', `${p.prenom} ${p.nom} — ${p.sous_titre}`);
  setMeta('og:title', `${p.prenom} ${p.nom} — ${p.titre}`);
  setMeta('og:description', p.bio.split('\n')[0]);
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// ── HERO ──────────────────────────────────────────────────────────────────────

function renderHero(p, stats, pills) {
  set('hero-label', p.sous_titre);
  set('hero-name-first', p.prenom);
  set('hero-name-last', p.nom);
  set('hero-subtitle', p.titre);
  setHTML('hero-positioning', p.positioning);

  // Pills
  const pillsEl = document.getElementById('hero-pills');
  if (pillsEl) {
    pillsEl.innerHTML = pills.map(pill =>
      `<span class="pill">${pill}</span>`
    ).join('');
  }

  // Stats
  const statsEl = document.getElementById('hero-stats');
  if (statsEl) {
    statsEl.innerHTML = stats.map(s =>
      `<div class="stat-item">
        <div class="stat-num">${s.valeur}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
    ).join('');
  }

  // CTA links
  const ctaProjects = document.getElementById('cta-projects');
  const ctaContact = document.getElementById('cta-contact');
  if (ctaProjects) ctaProjects.textContent = currentLang === 'fr' ? 'Voir mon parcours' : 'View my background';
  if (ctaContact) ctaContact.textContent = currentLang === 'fr' ? 'Me contacter' : 'Get in touch';
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────

function renderAbout(p) {
  const secLabel = document.getElementById('about-label');
  const secTitle = document.getElementById('about-title');
  if (secLabel) secLabel.textContent = currentLang === 'fr' ? 'À propos' : 'About';
  if (secTitle) secTitle.innerHTML = currentLang === 'fr'
    ? 'Là où la data rencontre<br>les opérations terrain'
    : 'Where data meets<br>field operations';

  // Bio paragraphs
  const bioEl = document.getElementById('about-bio');
  if (bioEl) {
    bioEl.innerHTML = p.bio.split('\n\n').map(para =>
      `<p>${para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`
    ).join('');
  }

  // Details
  const details = [
    { key: currentLang === 'fr' ? 'Poste' : 'Role', val: p.sous_titre.split('·')[0].trim() },
    { key: 'Entreprise', val: `<a href="https://maad.io" target="_blank" class="detail-link">MAAD App · maad.io</a>` },
    { key: currentLang === 'fr' ? 'En cours' : 'In progress', val: 'DSIA + MS2D · fin 2027' },
    { key: currentLang === 'fr' ? 'Localisation' : 'Location', val: p.localisation },
    { key: currentLang === 'fr' ? 'Origine' : 'Origin', val: p.origine },
    { key: currentLang === 'fr' ? 'Langues' : 'Languages', val: p.langues.join(' · ') },
    { key: 'Email', val: `<a href="mailto:${p.email}" class="detail-link">${p.email}</a>` },
  ];

  const detailsEl = document.getElementById('about-details');
  if (detailsEl) {
    detailsEl.innerHTML = details.map(d =>
      `<div class="detail-row">
        <span class="dk">${d.key}</span>
        <span class="dv">${d.val}</span>
      </div>`
    ).join('');
  }
}

// ── SKILLS ────────────────────────────────────────────────────────────────────

function renderSkills(competences) {
  const el = document.getElementById('skills-grid');
  if (!el || !competences) return;
  el.innerHTML = competences.map(cat =>
    `<div class="skill-card">
      <div class="skill-cat">${cat.categorie}</div>
      <div class="skill-list">
        ${cat.items.map(item => `<span class="skill-item">${item}</span>`).join('')}
      </div>
    </div>`
  ).join('');
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────────

function renderExperience(experiences) {
  const el = document.getElementById('experience-list');
  if (!el || !experiences) return;

  el.innerHTML = experiences.map(exp => {
    const duree = calcDuree(exp.date_debut, exp.date_fin);
    const periode = formatPeriode(exp.date_debut, exp.date_fin, currentLang);
    const logoHTML = exp.logo
      ? `<img src="${exp.logo}" alt="${exp.entreprise}" class="exp-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
         <div class="exp-initiales" style="display:none">${exp.entreprise.charAt(0)}</div>`
      : `<div class="exp-initiales">${exp.entreprise.charAt(0)}</div>`;

    const siteLink = exp.site
      ? `<a href="${exp.site}" target="_blank" class="exp-link">${exp.site.replace('https://', '')} ↗</a>`
      : '';

    const comiteBadge = exp.comite_direction
      ? `<span class="exp-tag mgmt">${currentLang === 'fr' ? 'Comité de Direction' : 'Management Committee'}</span>`
      : '';

    return `<div class="exp-item">
      <div class="exp-left">
        <div class="exp-logo-wrap">${logoHTML}</div>
        <div class="exp-period">${periode}<br><span class="exp-duree">${duree}</span></div>
        ${siteLink}
      </div>
      <div class="exp-right">
        <div class="exp-co">${exp.entreprise}</div>
        <div class="exp-title">${exp.titre}</div>
        ${comiteBadge ? `<div class="exp-tags-top">${comiteBadge}</div>` : ''}
        <ul class="exp-desc">
          ${exp.description.map(d => `<li>${d}</li>`).join('')}
        </ul>
        <div class="exp-tags">
          ${exp.tags.map(t => {
            const isSpecial = t.includes('Mois') || t.includes('Month') || t.includes('Direction') || t.includes('Committee');
            return `<span class="exp-tag ${isSpecial ? 'gld' : ''}">${t}</span>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────

function renderProjects(projets) {
  const el = document.getElementById('projects-grid');
  if (!el || !projets) return;

  el.innerHTML = projets.map(p =>
    `<div class="proj-card ${p.featured ? 'full' : ''}">
      <div class="proj-tag ${p.tag_type}">${p.tag}</div>
      <h3 class="proj-title">${p.titre}</h3>
      <p class="proj-desc">${p.description}</p>
      <div class="proj-metrics">
        ${p.metriques.map(m => `<span class="metric">${m}</span>`).join('')}
      </div>
    </div>`
  ).join('');
}

// ── PUBLICATIONS ──────────────────────────────────────────────────────────────

function renderPublications(publications) {
  const el = document.getElementById('pub-list');
  if (!el || !publications) return;

  el.innerHTML = publications.map(p => {
    const badge = p.statut === 'en_cours'
      ? `<span class="pub-status wip">${currentLang === 'fr' ? 'En cours' : 'In progress'}</span>`
      : `<span class="pub-status coming">${currentLang === 'fr' ? 'Prévu' : 'Planned'}</span>`;

    return `<div class="pub-item">
      <div class="pub-year">${p.annee}</div>
      <div class="pub-content">
        <div class="pub-title">${p.titre}</div>
        <div class="pub-meta">${p.meta}</div>
        <div class="pub-tags">${p.tags.map(t => `<span class="pub-tag">${t}</span>`).join('')}</div>
      </div>
      ${badge}
    </div>`;
  }).join('');
}

// ── FORMATION (Timeline) ──────────────────────────────────────────────────────

function renderFormation(formation) {
  const el = document.getElementById('formation-timeline');
  if (!el || !formation) return;

  // Trier par date de fin décroissante
  const sorted = [...formation].sort((a, b) =>
    new Date(b.date_fin || '2099-01-01') - new Date(a.date_fin || '2099-01-01')
  );

  el.innerHTML = sorted.map(f => {
    const logoHTML = f.logo
      ? `<img src="${f.logo}" alt="${f.ecole_court}" class="edu-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
         <div class="edu-initiales" style="display:none">${f.initiales || f.ecole_court.charAt(0)}</div>`
      : `<div class="edu-initiales">${f.initiales || f.ecole_court.charAt(0)}</div>`;

    const annee = f.date_fin
      ? new Date(f.date_fin).getFullYear()
      : (currentLang === 'fr' ? 'En cours' : 'In progress');

    const statutBadge = f.statut === 'obtenu'
      ? `<span class="cert-badge obt">${currentLang === 'fr' ? 'Obtenu' : 'Obtained'}</span>`
      : `<span class="cert-badge prog">${currentLang === 'fr' ? 'En cours' : 'In progress'}</span>`;

    const noteHTML = f.note ? `<span class="edu-note">${f.note}</span>` : '';

    return `<div class="edu-item">
      <div class="edu-year">${annee}</div>
      <div class="edu-dot"></div>
      <div class="edu-card">
        <div class="edu-header">
          <div class="edu-logo-wrap">${logoHTML}</div>
          <div class="edu-info">
            <div class="edu-diplome">${f.diplome}</div>
            <div class="edu-ecole">${f.ecole} ${f.lieu ? '· ' + f.lieu : ''}</div>
          </div>
        </div>
        <div class="edu-footer">
          ${noteHTML}
          ${statutBadge}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── CERTIFICATIONS ────────────────────────────────────────────────────────────

function renderCertifications(certs) {
  const el = document.getElementById('certs-grid');
  if (!el || !certs) return;

  el.innerHTML = certs.map(c => {
    const badge = c.statut === 'obtenu'
      ? `<span class="cert-badge obt">${currentLang === 'fr' ? 'Obtenu' : 'Obtained'}</span>`
      : c.statut === 'prevu'
      ? `<span class="cert-badge plan">${currentLang === 'fr' ? 'Prévu' : 'Planned'} ${c.date_prevue ? new Date(c.date_prevue).getFullYear() : ''}</span>`
      : `<span class="cert-badge prog">${currentLang === 'fr' ? 'En cours' : 'In progress'}</span>`;

    const link = c.site
      ? `onclick="window.open('${c.site}','_blank')" style="cursor:pointer"`
      : '';

    return `<div class="cert-card ${c.statut === 'obtenu' ? 'active' : ''}" ${link}>
      <div class="cert-icon ${c.statut === 'obtenu' ? 'gold' : c.statut === 'prevu' ? 'gray' : 'teal'}">◈</div>
      <div class="cert-name">${c.nom}</div>
      ${c.organisme ? `<div class="cert-org">${c.organisme}${c.note ? ' · ' + c.note : ''}</div>` : ''}
      ${badge}
    </div>`;
  }).join('');
}

// ── DISTINCTIONS ──────────────────────────────────────────────────────────────

function renderDistinctions(distinctions) {
  const el = document.getElementById('awards-grid');
  if (!el || !distinctions) return;

  el.innerHTML = distinctions.map(d =>
    `<div class="award-card">
      <div class="award-year">${d.annee}</div>
      <div>
        <div class="award-title">${d.titre}</div>
        <div class="award-sub">${d.description}</div>
      </div>
    </div>`
  ).join('');
}

// ── BLOG ──────────────────────────────────────────────────────────────────────

function renderBlog(articles) {
  const el = document.getElementById('blog-grid');
  if (!el || !articles) return;

  el.innerHTML = articles.map(a => {
    const badge = a.statut === 'publie'
      ? `<span class="blog-date">${formatDate(a.date)}</span>`
      : `<span class="badge-coming">${currentLang === 'fr' ? 'À venir' : 'Coming soon'}</span>`;

    return `<div class="blog-card">
      ${badge}
      <h3 class="blog-title">${a.titre}</h3>
      <p class="blog-excerpt">${a.extrait}</p>
      <span class="blog-more">${a.statut === 'publie' ? (currentLang === 'fr' ? 'Lire →' : 'Read →') : '—'}</span>
    </div>`;
  }).join('');
}

// ── CONTACT ───────────────────────────────────────────────────────────────────

function renderContact(p) {
  const textEl = document.getElementById('contact-text');
  if (textEl) textEl.textContent = currentLang === 'fr'
    ? 'Disponible pour des échanges sur la transformation supply chain en Afrique de l\'Ouest, des opportunités dans les ONG et organisations internationales, ou pour discuter de SC data-driven.'
    : 'Available for discussions on supply chain transformation in West Africa, opportunities in NGOs and international organizations, or to talk about data-driven SC.';

  const linksEl = document.getElementById('contact-links');
  if (linksEl) {
    linksEl.innerHTML = `
      <a href="${p.linkedin}" target="_blank" class="contact-link">
        <div class="contact-icon">in</div>
        <div>
          <div class="contact-link-title">LinkedIn</div>
          <div class="contact-link-sub">linkedin.com/in/essodekepanizi</div>
        </div>
      </a>
      <a href="mailto:${p.email}" class="contact-link">
        <div class="contact-icon">@</div>
        <div>
          <div class="contact-link-title">Email</div>
          <div class="contact-link-sub">${p.email}</div>
        </div>
      </a>
      <a href="https://maad.io" target="_blank" class="contact-link">
        <div class="contact-icon">M</div>
        <div>
          <div class="contact-link-title">MAAD App</div>
          <div class="contact-link-sub">maad.io</div>
        </div>
      </a>`;
  }

  // Form labels
  const labelNom = document.getElementById('label-nom');
  const labelMsg = document.getElementById('label-msg');
  const btnSend = document.getElementById('btn-send');
  if (labelNom) labelNom.textContent = currentLang === 'fr' ? 'Nom' : 'Name';
  if (labelMsg) labelMsg.textContent = currentLang === 'fr' ? 'Message' : 'Message';
  if (btnSend) btnSend.textContent = currentLang === 'fr' ? 'Envoyer' : 'Send';
}

// ── FOOTER ────────────────────────────────────────────────────────────────────

function renderFooter(p) {
  const el = document.getElementById('footer-text');
  if (el) el.innerHTML = `© ${new Date().getFullYear()} ${p.prenom} ${p.nom} · ${p.localisation} · ${p.telephone}`;
  const el2 = document.getElementById('footer-right');
  if (el2) el2.innerHTML = `${p.titre} · <a href="https://maad.io" target="_blank" style="color:inherit;text-decoration:none;">maad.io</a>`;
}

// ── UTILS ─────────────────────────────────────────────────────────────────────

function calcDuree(dateDebut, dateFin = null) {
  const debut = new Date(dateDebut);
  const fin = dateFin ? new Date(dateFin) : new Date();
  const totalMois = (fin.getFullYear() - debut.getFullYear()) * 12
                  + (fin.getMonth() - debut.getMonth());
  const ans = Math.floor(totalMois / 12);
  const mois = totalMois % 12;
  if (currentLang === 'fr') {
    if (ans > 0 && mois > 0) return `${ans} an${ans > 1 ? 's' : ''} ${mois} mois`;
    if (ans > 0) return `${ans} an${ans > 1 ? 's' : ''}`;
    return `${mois} mois`;
  } else {
    if (ans > 0 && mois > 0) return `${ans} yr${ans > 1 ? 's' : ''} ${mois} mo`;
    if (ans > 0) return `${ans} yr${ans > 1 ? 's' : ''}`;
    return `${mois} mo`;
  }
}

function formatPeriode(dateDebut, dateFin, lang) {
  const opts = { month: 'short', year: 'numeric' };
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const debut = new Date(dateDebut).toLocaleDateString(locale, opts);
  const fin = dateFin
    ? new Date(dateFin).toLocaleDateString(locale, opts)
    : (lang === 'fr' ? 'Présent' : 'Present');
  return `${debut} — ${fin}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(
    currentLang === 'fr' ? 'fr-FR' : 'en-US',
    { month: 'long', year: 'numeric' }
  );
}

function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setHTML(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────

function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── MOBILE MENU ───────────────────────────────────────────────────────────────

function initMobileMenu() {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
    });
  });
}
