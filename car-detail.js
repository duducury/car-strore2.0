async function loadCSV(file) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Erro ao carregar o arquivo CSV: ${response.statusText}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Erro ao carregar o CSV:', error);
      return null;
    }
  }
  
  function parseCSV(data) {
    try {
      const rows = data.split('\n').filter(row => row.trim() !== '');
      const headers = rows[0].split(',').map(header => header.trim());
      return rows.slice(1).map(row => {
        const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(column =>
          column.replace(/^"|"$/g, '').trim()
        ) || [];
        return headers.reduce((obj, header, index) => {
          obj[header] = columns[index] || ''; // Garante valores preenchidos
          return obj;
        }, {});
      });
    } catch (error) {
      console.error('Erro ao processar o CSV:', error);
      return [];
    }
  }
  


async function displayCarDetails() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    if (!carId) {
      console.error('ID do carro não encontrado na URL');
      return;
    }

    const csvData = await loadCSV('imgs/Carros_Completo.csv');
    if (!csvData) {
      console.error('CSV não carregado');
      return;
    }

    const cars = parseCSV(csvData);
    console.log('Dados do CSV:', cars);

    const car = cars.find(c => c.ID === carId);
    console.log('Carro encontrado:', car);

    if (!car) {
      document.getElementById('car-detail-car-details').textContent = 'Carro não encontrado.';
      return;
    }

    // Atualize as informações
    document.getElementById('car-detail-name').textContent = car.Nome || 'Nome não disponível';
    document.getElementById('car-detail-price').textContent = ` ${car.Preco || 'Não disponível'}`;
    document.getElementById('car-detail-brand').textContent = car.Marca || 'Não disponível';
    document.getElementById('car-detail-description').textContent = car.Descrição || 'Descrição não disponível';
  } catch (error) {
    console.error('Erro ao exibir os detalhes do carro:', error);
  }
}
function cleanCSV(data) {
  return data.replace(/\r\n|\r/g, '\n').trim();
}




  let currentIndex = 0; // Índice inicial do carrossel

  async function displayCarDetails() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const carId = urlParams.get('id');
      if (!carId) {
        document.getElementById('car-detail-car-details').textContent = 'Carro não encontrado.';
        return;
      }
  
      const csvData = await loadCSV('imgs/Carros_Completo.csv');
      if (!csvData) {
        document.getElementById('car-detail-car-details').textContent = 'Erro ao carregar os detalhes do carro.';
        return;
      }
  
      const cars = parseCSV(csvData);
      const car = cars.find(c => c.ID === carId);
      if (!car) {
        document.getElementById('car-detail-car-details').textContent = 'Carro não encontrado.';
        return;
      }
  
      // Atualiza informações do carro
      document.getElementById('car-detail-name').textContent = car.Nome || 'Nome não disponível';
      document.getElementById('car-detail-price').textContent = ` ${car.Preco || 'Não disponível'}`;
      document.getElementById('car-detail-brand').textContent = car.Marca || 'Não disponível';
      document.getElementById('car-detail-model').textContent = car.Modelo || 'Não disponível';
      document.getElementById('car-detail-year').textContent = car.Ano || 'Não disponível';
      document.getElementById('car-detail-engine').textContent = car.Motor || 'Não disponível';
      document.getElementById('car-detail-power').textContent = car.Potência || 'Não disponível';
      document.getElementById('car-detail-torque').textContent = car.Torque || 'Não disponível';
      document.getElementById('car-detail-transmission').textContent = car.Cambio || 'Não disponível';
      document.getElementById('car-detail-fuel').textContent = car.Combustivel || 'Não disponível';
      document.getElementById('car-detail-drive').textContent = car.Tração || 'Não disponível';
      document.getElementById('car-detail-description').textContent = car.Descrição || 'Descrição não disponível';
  
      // Carregar imagens no carrossel e thumbnails
      const images = [car.Imagem1, car.Imagem2, car.Imagem3, car.Imagem4].filter(Boolean);
      const track = document.getElementById('car-detail-carousel-track');
      const thumbnails = document.getElementById('car-detail-thumbnails');
      track.innerHTML = '';
      thumbnails.innerHTML = '';
  
      images.forEach((image, index) => {
        // Adicionar imagens ao carrossel
        const slide = document.createElement('li');
        slide.classList.add('car-detail-carousel-slide');
        slide.innerHTML = `<img src="imgs/cars/carro${car.ID}/${image}" alt="${car.Nome}">`;
        track.appendChild(slide);
  
        // Adicionar thumbnails
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('car-detail-thumbnail');
        if (index === 0) thumbnail.classList.add('active'); // Primeiro thumbnail ativo
        thumbnail.innerHTML = `<img src="imgs/cars/carro${car.ID}/${image}" alt="${car.Nome}">`;
        thumbnail.addEventListener('click', () => {
          currentIndex = index; // Atualiza o índice ao clicar
          updateCarousel(track, thumbnails);
        });
        thumbnails.appendChild(thumbnail);
      });
  
      setupCarousel(track, thumbnails, images.length); // Configura o carrossel
    } catch (error) {
      console.error('Erro ao exibir os detalhes do carro:', error);
      document.getElementById('car-detail-car-details').textContent = 'Erro ao carregar os detalhes do carro.';
    }
  }
  
  function setupCarousel(track, thumbnails, totalSlides) {
    const prevButton = document.getElementById('car-detail-prev-btn');
    const nextButton = document.getElementById('car-detail-next-btn');
  
    const updateCarousel = () => {
      const slideWidth = track.children[0]?.offsetWidth || 0;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  
      // Atualiza os thumbnails
      thumbnails.querySelectorAll('.car-detail-thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentIndex);
      });
    };
  
    // Adiciona funcionalidade às setas
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });
  
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });
  
    // Atualiza o carrossel ao redimensionar a janela
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }
  
  // Atualiza o carrossel e sincroniza os thumbnails
  function updateCarousel(track, thumbnails) {
    const slideWidth = track.children[0]?.offsetWidth || 0;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  
    // Atualiza os thumbnails
    thumbnails.querySelectorAll('.car-detail-thumbnail').forEach((thumb, index) => {
      thumb.classList.toggle('active', index === currentIndex);
    });
  }
  
  document.addEventListener('DOMContentLoaded', displayCarDetails);
  
  
  












  
  const navbar = document.querySelector('.navbar');
let isScrolling;

// Função para esconder o menu
function hideNavbar() {
    if (window.scrollY > 0) {
        navbar.classList.add('hidden');
    }
}

// Evento de rolagem
window.addEventListener('scroll', () => {
    clearTimeout(isScrolling); // Limpa o timeout para detectar movimento contínuo
    navbar.classList.remove('hidden'); // Mostra o menu ao rolar

    // Esconde o menu quando a rolagem para
    isScrolling = setTimeout(hideNavbar, 1000);

    // Detecta direção da rolagem
    if (window.scrollY > lastScrollPosition) {
        navbar.classList.add('hidden'); // Esconde se rolar para baixo
    } else {
        navbar.classList.remove('hidden'); // Mostra se rolar para cima
    }
    lastScrollPosition = window.scrollY; // Atualiza posição
});

// Mostra o menu ao passar o mouse
navbar.addEventListener('mouseenter', () => {
    navbar.classList.remove('hidden');
});





async function displayHighlightedCars() {
  try {
      const csvData = await loadCSV('imgs/Carros_Completo.csv');
      if (!csvData) {
          console.error('Erro ao carregar o arquivo CSV para carros destacados.');
          return;
      }

      const cars = parseCSV(csvData);
      const highlightedCars = cars.slice(0, 8); // Seleciona os 8 primeiros carros para destaque
      const inventoryGrid = document.getElementById('inventory-grid');
      inventoryGrid.innerHTML = ''; // Limpa o grid antes de preencher

      highlightedCars.forEach(car => {
          const carElement = document.createElement('div');
          carElement.classList.add('car-card');

          const imagePath = `imgs/cars/carro${car.ID}/${car.Imagem1 || 'default.jpg'}`; // Caminho da imagem com fallback

          carElement.innerHTML = `
              <div class="car-image">
                  <a href="car-detail.html?id=${car.ID}">
                      <img src="${imagePath}" alt="${car.Nome || 'Carro'}" />
                  </a>
              </div>
              <div class="car-details">
                  <h3 class="car-name">${car.Nome || 'Nome não disponível'}</h3>
                  <p class="car-price">${car.Preco || 'Preço não disponível'}</p>
                  <div class="car-specs">
                      <span class="car-spec">${car.Ano || '-'}</span>
                      <span class="car-spec">${car.Km || '-'}</span>
                      <span class="car-spec">${car.Cambio || '-'}</span>
                      <span class="car-spec">${car.Combustivel || '-'}</span>
                  </div>
                  <button class="view-details-btn" onclick="goToDetails('${car.ID}')">Ver Detalhes</button>
              </div>
          `;
          inventoryGrid.appendChild(carElement);
      });

      setupCarouselNavigation(); // Configura navegação para destaques
  } catch (error) {
      console.error('Erro ao exibir carros destacados:', error);
  }
}

function setupCarouselNavigation() {
  const inventoryGrid = document.getElementById('inventory-grid');
  const prevInventory = document.getElementById('prevInventory');
  const nextInventory = document.getElementById('nextInventory');

  const productWidth = inventoryGrid.querySelector('.car-card').offsetWidth || 0;
  const scrollAmount = productWidth * 4; // Calcula a largura para rolar 4 produtos por vez

  prevInventory.addEventListener('click', () => {
      inventoryGrid.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
      });
  });

  nextInventory.addEventListener('click', () => {
      inventoryGrid.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
      });
  });
}

// Chamada para exibir os carros destacados
document.addEventListener('DOMContentLoaded', () => {
  displayHighlightedCars();
});

function goToDetails(carId) {
  if (carId) {
      // Redireciona para a página de detalhes com o ID do carro na URL
      window.location.href = `car-detail.html?id=${carId}`;
  } else {
      console.error('ID do carro não encontrado!');
  }
}
