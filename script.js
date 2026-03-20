const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const fallbackProjects = [
  {
    title: 'Research Showcase Dashboard',
    description: 'A responsive dashboard to present undergraduate research outcomes and conference highlights with clean, filterable views.',
    tech: ['HTML', 'CSS Grid', 'JavaScript'],
    link: 'https://github.com/yourusername/research-showcase'
  },
  {
    title: 'Campus Event Planner',
    description: 'A lightweight planner for student teams to manage milestones, event timelines, and ownership.',
    tech: ['React', 'TypeScript', 'Firebase'],
    link: 'https://github.com/yourusername/campus-event-planner'
  },
  {
    title: 'CV Analyzer Tool',
    description: 'Parses resume text and compares it against role keywords with actionable scoring feedback.',
    tech: ['Python', 'FastAPI', 'NLP'],
    link: 'https://github.com/yourusername/cv-analyzer'
  }
];

const fallbackSkills = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'Git',
  'Figma',
  'Data Visualization',
  'Research Presentation'
];

if (themeToggle) {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  });
}

function renderProjects(projects) {
  const container = document.getElementById('projects-list');
  if (!container) return;

  container.innerHTML = '';
  const list = Array.isArray(projects) ? projects : [];

  if (!list.length) {
    container.innerHTML = '<p class="project-desc">Projects will appear here after data loads.</p>';
    return;
  }

  list.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    const techHtml = (project.tech || [])
      .map((item) => `<span class="tech-tag">${item}</span>`)
      .join('');

    card.innerHTML = `
      <h3 class="project-title">${project.title}</h3>
      <p class="project-desc">${project.description}</p>
      <div class="project-tech">${techHtml}</div>
      <a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">Open Project</a>
    `;
    container.appendChild(card);
  });
}

function renderSkills(skills) {
  const container = document.getElementById('skills-list');
  if (!container) return;

  container.innerHTML = '';
  const list = Array.isArray(skills) ? skills : [];

  if (!list.length) {
    container.innerHTML = '<p class="project-desc">Skills will appear here after data loads.</p>';
    return;
  }

  list.forEach((skill) => {
    const badge = document.createElement('div');
    badge.className = 'skill-item';
    badge.textContent = skill;
    container.appendChild(badge);
  });
}

async function loadJson(path, fallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Request failed for ${path}`);
    const data = await res.json();
    return Array.isArray(data) ? data : fallback;
  } catch (error) {
    console.warn(`Using fallback for ${path}.`, error);
    return fallback;
  }
}

async function initPortfolio() {
  const [projects, skills] = await Promise.all([
    loadJson('projects.json', fallbackProjects),
    loadJson('skills.json', fallbackSkills)
  ]);
  renderProjects(projects);
  renderSkills(skills);
}

initPortfolio();
