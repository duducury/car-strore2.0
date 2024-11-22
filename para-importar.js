let lastScrollPosition = 0;
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




let allCars = []; // Armazena todos os carros carregados do CSV

// Carrega o CSV
async function loadCSV(file) {
    const response = await fetch(file);
    const data = await response.text();
    return data;
}

function parseCSV(data) {
    const rows = data.split('\n');
    const headers = rows[0].split(',').map(header => header.trim());
    const columnIndex = {};

    // Mapeia os índices das colunas pelos nomes
    headers.forEach((header, index) => {
        columnIndex[header] = index;
    });

    return rows.slice(1).map(row => {
        const columns = row.split(',');

        // Verifica e retorna o objeto carro
        if (columns[columnIndex['ID']] && columns[columnIndex['Nome']]) {
            return {
                ID: columns[columnIndex['ID']].trim(),
                Nome: columns[columnIndex['Nome']].trim(),
                Link: columns[columnIndex['Link']]?.trim(),
                Imagem1: columns[columnIndex['Imagem1']]?.trim(),
                Marca: columns[columnIndex['Marca']]?.trim(),
                Modelo: columns[columnIndex['Modelo']]?.trim(),
                Ano: columns[columnIndex['Ano']]?.trim(),
                Motor: columns[columnIndex['Motor']]?.trim(),
                Cambio: columns[columnIndex['Cambio']]?.trim(), 
                Combustivel: columns[columnIndex['Combustivel']]?.trim(), 
                Preco: columns[columnIndex['Preco']]?.trim(),
            };
        }

        return null; // Ignora linhas inválidas
    }).filter(car => car !== null);
}




// Popula o filtro de Marca e inicializa os outros filtros
function populateFilters(cars) {
    const marcaFilter = document.getElementById('filter-marca');
    const uniqueMarcas = [...new Set(cars.map(car => car.Marca))].sort();

    // Preenche o filtro de Marca com todas as opções
    marcaFilter.innerHTML = '<option value="">Todas as Marcas</option>';
    uniqueMarcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        marcaFilter.appendChild(option);
    });

    // Inicializa os filtros de Modelo e Ano
    updateModelFilter(cars);
    updateYearFilter(cars);
}

// Atualiza o filtro de Modelos com base na seleção de Marca
function updateModelFilter(filteredCars) {
    const modeloFilter = document.getElementById('filter-modelo');
    const marcaFilterValue = document.getElementById('filter-marca').value;

    // Limpar o filtro de Modelos
    modeloFilter.innerHTML = '<option value="">Todos os Modelos</option>';

    // Filtra as opções de modelo com base na marca selecionada
    const filteredModels = marcaFilterValue
        ? [...new Set(filteredCars.filter(car => car.Marca === marcaFilterValue).map(car => car.Modelo))]
        : [...new Set(filteredCars.map(car => car.Modelo))];

    // Popula o filtro de Modelo com as opções válidas
    filteredModels.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo;
        option.textContent = modelo;
        modeloFilter.appendChild(option);
    });
}

// Atualiza o filtro de Anos com base na seleção de Modelo
function updateYearFilter(filteredCars) {
    const yearFilter = document.getElementById('filter-year');
    const modeloFilterValue = document.getElementById('filter-modelo').value;

    // Limpar o filtro de Ano
    yearFilter.innerHTML = '<option value="">Todos os Anos</option>';

    // Filtra as opções de ano com base no modelo selecionado
    const filteredYears = modeloFilterValue
        ? [...new Set(filteredCars.filter(car => car.Modelo === modeloFilterValue).map(car => car.Ano))]
        : [...new Set(filteredCars.map(car => car.Ano))];

    // Popula o filtro de Ano com as opções válidas
    filteredYears.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        yearFilter.appendChild(option);
    });
}

// Aplica os filtros dependentes e atualiza as opções
function applyFilters(filterType) {
    const marcaFilterValue = document.getElementById('filter-marca').value;
    const modeloFilterValue = document.getElementById('filter-modelo').value;
    const yearFilterValue = document.getElementById('filter-year').value;

    let filteredCars = allCars;

    // Filtra por marca, se selecionada
    if (marcaFilterValue) {
        filteredCars = filteredCars.filter(car => car.Marca === marcaFilterValue);
    }

    // Atualiza o filtro de Modelos e Anos conforme o tipo de filtro aplicado
    if (filterType === 'marca') {
        updateModelFilter(filteredCars); // Atualiza o dropdown de modelos ao selecionar marca
    }
    
    // Filtra por modelo, se selecionado
    if (modeloFilterValue) {
        filteredCars = filteredCars.filter(car => car.Modelo === modeloFilterValue);
    }
    
    if (filterType !== 'ano') {
        updateYearFilter(filteredCars); // Atualiza o dropdown de anos
    }

    // Filtra por ano, se selecionado
    if (yearFilterValue) {
        filteredCars = filteredCars.filter(car => car.Ano === yearFilterValue);
    }

    // Renderiza os carros filtrados
    renderInventory(filteredCars);
}
function renderInventory(cars) {
    const inventoryGrid = document.getElementById('inventory-grid');
    inventoryGrid.innerHTML = '';

    cars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.classList.add('car-card');
        const imagePath = `imgs/cars/carro${car.ID}/${car.Imagem1}`;

        carElement.innerHTML = `
            <div class="car-image">
                <a href="car-detail.html?id=${car.ID}">
                    <img src="${imagePath}" alt="${car.Nome}" />
                </a>
            </div>
            <div class="car-details">
                <h3 class="car-name">${car.Nome}</h3>
                <p class="car-price">${car.Preco}</p>
                <div class="car-specs">
                    <span class="car-spec">${car.Ano}</span>
                    <span class="car-spec">${car.Motor}</span>
                    <span class="car-spec">${car.Cambio}</span>
                    <span class="car-spec">${car.Combustivel}</span>
                </div>
                
                <button class="view-details-btn" onclick="goToDetails('${car.ID}')">Ver Detalhes</button>
            
            </div>
        `;
        inventoryGrid.appendChild(carElement);
    });
}



// Inicializa a página carregando os dados e configurando os filtros
async function displayInventory() {
    const csvData = await loadCSV('imgs/Carros_Completo.csv');
    const cars = parseCSV(csvData);
    allCars = cars;
    populateFilters(allCars); // Popula os filtros dinamicamente
    renderInventory(allCars); // Exibe todos os carros inicialmente
}

// Event listeners para mudanças nos filtros
document.getElementById('filter-marca').addEventListener('change', () => applyFilters('marca'));
document.getElementById('filter-modelo').addEventListener('change', () => applyFilters('modelo'));
document.getElementById('filter-year').addEventListener('change', () => applyFilters('ano'));

// Inicializa o inventário ao carregar a página
document.addEventListener('DOMContentLoaded', displayInventory);


function goToDetails(carId) {
    window.location.href = `car-detail.html?id=${carId}`;
}


window.addEventListener('scroll', () => {
    const filterBackground = document.querySelector('.filter-background');
    const scrollPosition = window.scrollY;
  
    if (filterBackground) {
      const move = scrollPosition * 0.3; // Movimento mais controlado no mesmo sentido do scroll
      filterBackground.style.transform = `translateY(${move}px)`;
    }
  });
  
  