document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle');

  function mudarTema(theme) {
    document.body.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    document.querySelector('#theme-toggle .fa-sun').style.display = isDark ? 'none' : 'inline-block';
    document.querySelector('#theme-toggle .fa-moon').style.display = isDark ? 'inline-block' : 'none';
  }

  let temaActual = localStorage.getItem('theme');
  if (!temaActual) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    temaActual = prefersDark ? 'dark' : 'light';
  }
  mudarTema(temaActual);

  toggleButton.addEventListener('click', () => {
    let newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    mudarTema(newTheme);
    localStorage.setItem('theme', newTheme);
  });


  const repositorioContainer = document.getElementById('projects-container');
  const paginacaoContainer = document.getElementById('pagination-controls');
  const itemsPorPagina = 4;
  let paginaActual = 1;
  let repositorios = [];

  async function buscarProjetos() {
    try {
      const response = await fetch('./service/data.json');

      if (!response.ok) {
        throw new Error(`Erro ao carregar os dados: ${response.status}`);
      }

      repositorios = await response.json();
      renderizarProjetos(paginaActual);
      paginacao();

    } catch (error) {
      console.error('Falha ao carregar projetos:', error);
      repositorioContainer.innerHTML = `<p class="error-message">Não foi possível carregar os projetos. Verifique o arquivo data.json.</p>`;
    }
  }

  function renderizarProjetos(paginaActual) {
    repositorioContainer.innerHTML = '';

    const start = (paginaActual - 1) * itemsPorPagina;
    const end = start + itemsPorPagina;
    const paginatedProjects = repositorios.slice(start, end);

    if (paginatedProjects.length === 0) {
      repositorioContainer.innerHTML = '<p>Nenhum projeto encontrado para exibir.</p>';
      return;
    }

    paginatedProjects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.classList.add('project-card');
      projectCard.innerHTML = `
                <h3><a href="${project.link}" target="_blank">${project.nome}</a></h3>
                <p>${project.descricao}</p>
                <div class="project-meta">
                    <span class="language">${project.linguagem}</span>
                    <span class="stars"><i class="fas fa-star"></i> ${project.estrela}</span>
                </div>
            `;
      repositorioContainer.appendChild(projectCard);
    });
  }

  function paginacao() {
    paginacaoContainer.innerHTML = '';
    const pageCount = Math.ceil(repositorios.length / itemsPorPagina);

    if (pageCount <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Anterior';
    prevButton.classList.add('pagination-btn');
    prevButton.disabled = paginaActual === 1;
    prevButton.addEventListener('click', () => {
      if (paginaActual > 1) {
        paginaActual--;
        renderizarProjetos(paginaActual);
        paginacao();
      }
    });

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Próximo';
    nextButton.classList.add('pagination-btn');
    nextButton.disabled = paginaActual === pageCount;
    nextButton.addEventListener('click', () => {
      if (paginaActual < pageCount) {
        paginaActual++;
        renderizarProjetos(paginaActual);
        paginacao();
      }
    });

    const pageInfo = document.createElement('span');
    pageInfo.classList.add('page-info');
    pageInfo.innerText = `Página ${paginaActual} de ${pageCount}`;

    paginacaoContainer.appendChild(prevButton);
    paginacaoContainer.appendChild(pageInfo);
    paginacaoContainer.appendChild(nextButton);
  }

  function setAno() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Inicia a aplicação
  buscarProjetos();
  setAno();
});