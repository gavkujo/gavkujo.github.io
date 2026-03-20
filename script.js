const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

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

async function loadJson(paths) {
  let lastError = null;

  for (const path of paths) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Request failed for ${path} with status ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error(`Invalid JSON shape in ${path}`);
      }

      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Could not load JSON from any candidate path.');
}

async function initPortfolio() {
  try {
    const [projects, skills] = await Promise.all([
      loadJson([
        './projects.json',
        'projects.json',
        '/projects.json',
        './website/projects.json',
        '/website/projects.json'
      ]),
      loadJson([
        './skills.json',
        'skills.json',
        '/skills.json',
        './website/skills.json',
        '/website/skills.json'
      ])
    ]);
    renderProjects(projects);
    renderSkills(skills);
  } catch (error) {
    console.error('Failed to load portfolio JSON:', error);
    renderProjects([]);
    renderSkills([]);

    const projectsContainer = document.getElementById('projects-list');
    const skillsContainer = document.getElementById('skills-list');
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p class="project-desc">Could not load projects.json. Confirm the file is in the same folder as index.html.</p>';
    }
    if (skillsContainer) {
      skillsContainer.innerHTML = '<p class="project-desc">Could not load skills.json. Confirm the file is in the same folder as index.html.</p>';
    }
  }
}

initPortfolio();
