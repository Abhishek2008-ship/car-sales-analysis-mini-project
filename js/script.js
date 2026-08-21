// ==========================================
// CarTrend Analytics - Main JavaScript
// Data Loading, Statistics, Core Functionality
// ==========================================

// Global Variables
let carData = [];
let filteredData = [];
let charts = {};
let currentPage = 1;
let itemsPerPage = 10;

// DOM Elements
const elements = {
    totalCars: document.getElementById('totalCars'),
    totalBrands: document.getElementById('totalBrands'),
    avgPrice: document.getElementById('avgPrice'),
    avgMileage: document.getElementById('avgMileage'),
    avgEngine: document.getElementById('avgEngine'),
    avgPower: document.getElementById('avgPower'),
    themeToggle: document.getElementById('themeToggle'),
    searchCars: document.getElementById('searchCars'),
    sortCars: document.getElementById('sortCars'),
    itemsPerPage: document.getElementById('itemsPerPage'),
    showingCount: document.getElementById('showingCount'),
    totalCount: document.getElementById('totalCount'),
    carsTableBody: document.getElementById('carsTableBody'),
    pagination: document.getElementById('pagination'),
    filterBrand: document.getElementById('filterBrand'),
    filterFuel: document.getElementById('filterFuel'),
    filterTransmission: document.getElementById('filterTransmission'),
    filterBodyType: document.getElementById('filterBodyType'),
    filterMinPrice: document.getElementById('filterMinPrice'),
    filterMaxPrice: document.getElementById('filterMaxPrice'),
    filterMinYear: document.getElementById('filterMinYear'),
    filterMaxYear: document.getElementById('filterMaxYear'),
    filterMinMileage: document.getElementById('filterMinMileage'),
    filterMaxMileage: document.getElementById('filterMaxMileage'),
    resetFilters: document.getElementById('resetFilters'),
    brandAnalysisSelect: document.getElementById('brandAnalysisSelect'),
    brandAnalysisContent: document.getElementById('brandAnalysisContent'),
    comparisonBrands: document.getElementById('comparisonBrands'),
    compareBrandsBtn: document.getElementById('compareBrandsBtn'),
    comparisonContent: document.getElementById('comparisonContent'),
    downloadCSV: document.getElementById('downloadCSV'),
    yearRangeMin: document.getElementById('yearRangeMin'),
    yearRangeMax: document.getElementById('yearRangeMax'),
    applyYearRange: document.getElementById('applyYearRange')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadCSVData();
    setupEventListeners();
});

// Load Theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Toggle Theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateChartColors();
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'bi bi-moon';
    } else {
        icon.className = 'bi bi-sun';
    }
}

// Load CSV Data
async function loadCSVData() {
    try {
        const response = await fetch('data/cars.csv');
        const csvText = await response.text();
        carData = parseCSV(csvText);
        filteredData = [...carData];
        
        console.log('Data loaded successfully:', carData.length, 'records');
        
        initializeApplication();
    } catch (error) {
        console.error('Error loading CSV data:', error);
        showError('Failed to load data. Please ensure the data file exists.');
    }
}

// Parse CSV Data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const car = {};
            headers.forEach((header, index) => {
                let value = values[index].trim();
                
                // Convert numeric fields
                if (['Year', 'Price', 'Mileage', 'Engine_CC', 'Power_BHP', 'Torque_Nm', 'Seats'].includes(header)) {
                    value = parseFloat(value) || 0;
                }
                
                car[header] = value;
            });
            data.push(car);
        }
    }
    
    return data;
}

// Initialize Application
function initializeApplication() {
    updateKPIs();
    populateFilters();
    initializeBrandAnalysis();
    initializeComparison();
    updateCharts();
    updateTable();
    generateInsights();
    updateTopPerformers();
    updateEVAnalysis();
    updatePerformanceInsights();
    // updateFuelStats is called from within generateInsights
    
    // Add fade-in animation to sections
    addScrollAnimations();
}

// Add Scroll Animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe chart cards
    document.querySelectorAll('.chart-card, .kpi-card, .insight-card').forEach(card => {
        observer.observe(card);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme Toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Search
    elements.searchCars.addEventListener('input', debounce(applyFilters, 300));
    
    // Sort
    elements.sortCars.addEventListener('change', applyFilters);
    
    // Items Per Page
    elements.itemsPerPage.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        updateTable();
    });
    
    // Filters
    elements.filterBrand.addEventListener('change', applyFilters);
    elements.filterFuel.addEventListener('change', applyFilters);
    elements.filterTransmission.addEventListener('change', applyFilters);
    elements.filterBodyType.addEventListener('change', applyFilters);
    elements.filterMinPrice.addEventListener('input', debounce(applyFilters, 300));
    elements.filterMaxPrice.addEventListener('input', debounce(applyFilters, 300));
    elements.filterMinYear.addEventListener('input', debounce(applyFilters, 300));
    elements.filterMaxYear.addEventListener('input', debounce(applyFilters, 300));
    elements.filterMinMileage.addEventListener('input', debounce(applyFilters, 300));
    elements.filterMaxMileage.addEventListener('input', debounce(applyFilters, 300));
    
    // Reset Filters
    elements.resetFilters.addEventListener('click', resetAllFilters);
    
    // Brand Analysis
    elements.brandAnalysisSelect.addEventListener('change', updateBrandAnalysis);
    
    // Brand Comparison
    elements.compareBrandsBtn.addEventListener('click', performBrandComparison);
    
    // Download CSV
    elements.downloadCSV.addEventListener('click', downloadFilteredData);
    
    // Year Range
    elements.applyYearRange.addEventListener('click', applyYearRangeFilter);
    
    // Chart Controls
    document.getElementById('brandSort').addEventListener('change', updateBrandChart);
    document.getElementById('priceBrandSelect').addEventListener('change', updatePriceBrandChart);
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update KPI Cards
function updateKPIs() {
    const data = filteredData;
    
    if (data.length === 0) {
        elements.totalCars.textContent = '0';
        elements.totalBrands.textContent = '0';
        elements.avgPrice.textContent = '₹0';
        elements.avgMileage.textContent = '0';
        elements.avgEngine.textContent = '0';
        elements.avgPower.textContent = '0';
        return;
    }
    
    // Calculate statistics
    const totalCars = data.length;
    const uniqueBrands = [...new Set(data.map(car => car.Brand))].length;
    const avgPrice = data.reduce((sum, car) => sum + car.Price, 0) / totalCars;
    const avgMileage = data.reduce((sum, car) => sum + car.Mileage, 0) / totalCars;
    const avgEngine = data.reduce((sum, car) => sum + car.Engine_CC, 0) / totalCars;
    const avgPower = data.reduce((sum, car) => sum + car.Power_BHP, 0) / totalCars;
    
    // Animate KPIs
    animateValue(elements.totalCars, 0, totalCars, 1000);
    animateValue(elements.totalBrands, 0, uniqueBrands, 1000);
    animateValue(elements.avgPrice, 0, avgPrice, 1000, '₹');
    animateValue(elements.avgMileage, 0, avgMileage, 1000);
    animateValue(elements.avgEngine, 0, avgEngine, 1000);
    animateValue(elements.avgPower, 0, avgPower, 1000);
}

// Animate Value Function
function animateValue(element, start, end, duration, prefix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        if (prefix === '₹') {
            element.textContent = prefix + formatNumber(Math.round(current));
        } else {
            element.textContent = formatNumber(Math.round(current));
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Format Number with Commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Populate Filters
function populateFilters() {
    // Populate Brand Filter
    const brands = [...new Set(carData.map(car => car.Brand))].sort();
    elements.filterBrand.innerHTML = brands.map(brand => 
        `<option value="${brand}">${brand}</option>`
    ).join('');
    
    // Populate Comparison Brands
    elements.comparisonBrands.innerHTML = brands.map(brand => 
        `<option value="${brand}">${brand}</option>`
    ).join('');
    
    // Populate Brand Analysis Select
    elements.brandAnalysisSelect.innerHTML = '<option value="">Choose a brand...</option>' + 
        brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');
}

// Initialize Brand Analysis
function initializeBrandAnalysis() {
    // Placeholder - brand analysis will be updated when user selects a brand
}

// Initialize Comparison
function initializeComparison() {
    // Placeholder - comparison will be performed when user clicks compare button
}

// Apply Filters
function applyFilters() {
    const searchTerm = elements.searchCars.value.toLowerCase();
    const sortBy = elements.sortCars.value;
    
    // Get selected filter values
    const selectedBrands = Array.from(elements.filterBrand.selectedOptions).map(opt => opt.value);
    const selectedFuels = Array.from(elements.filterFuel.selectedOptions).map(opt => opt.value);
    const selectedTransmissions = Array.from(elements.filterTransmission.selectedOptions).map(opt => opt.value);
    const selectedBodyTypes = Array.from(elements.filterBodyType.selectedOptions).map(opt => opt.value);
    
    const minPrice = parseFloat(elements.filterMinPrice.value) || 0;
    const maxPrice = parseFloat(elements.filterMaxPrice.value) || Infinity;
    const minYear = parseInt(elements.filterMinYear.value) || 0;
    const maxYear = parseInt(elements.filterMaxYear.value) || Infinity;
    const minMileage = parseFloat(elements.filterMinMileage.value) || 0;
    const maxMileage = parseFloat(elements.filterMaxMileage.value) || Infinity;
    
    // Filter data
    filteredData = carData.filter(car => {
        // Search filter
        const matchesSearch = !searchTerm || 
            car.Brand.toLowerCase().includes(searchTerm) ||
            car.Model.toLowerCase().includes(searchTerm) ||
            car.Fuel_Type.toLowerCase().includes(searchTerm) ||
            car.Body_Type.toLowerCase().includes(searchTerm);
        
        // Brand filter
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.Brand);
        
        // Fuel filter
        const matchesFuel = selectedFuels.length === 0 || selectedFuels.includes(car.Fuel_Type);
        
        // Transmission filter
        const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.includes(car.Transmission);
        
        // Body type filter
        const matchesBodyType = selectedBodyTypes.length === 0 || selectedBodyTypes.includes(car.Body_Type);
        
        // Price filter
        const matchesPrice = car.Price >= minPrice && car.Price <= maxPrice;
        
        // Year filter
        const matchesYear = car.Year >= minYear && car.Year <= maxYear;
        
        // Mileage filter
        const matchesMileage = car.Mileage >= minMileage && car.Mileage <= maxMileage;
        
        return matchesSearch && matchesBrand && matchesFuel && matchesTransmission && 
               matchesBodyType && matchesPrice && matchesYear && matchesMileage;
    });
    
    // Sort data
    if (sortBy) {
        filteredData.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.Price - b.Price;
                case 'price-desc':
                    return b.Price - a.Price;
                case 'year-asc':
                    return a.Year - b.Year;
                case 'year-desc':
                    return b.Year - a.Year;
                case 'mileage-desc':
                    return b.Mileage - a.Mileage;
                case 'power-desc':
                    return b.Power_BHP - a.Power_BHP;
                default:
                    return 0;
            }
        });
    }
    
    // Reset to first page
    currentPage = 1;
    
    // Update UI
    updateKPIs();
    updateCharts();
    updateTable();
    generateInsights();
    updateTopPerformers();
    updateEVAnalysis();
    updatePerformanceInsights();
    // updateFuelStats is called from within generateInsights
}

// Reset All Filters
function resetAllFilters() {
    elements.searchCars.value = '';
    elements.sortCars.value = '';
    elements.filterBrand.selectedIndex = -1;
    elements.filterFuel.selectedIndex = -1;
    elements.filterTransmission.selectedIndex = -1;
    elements.filterBodyType.selectedIndex = -1;
    elements.filterMinPrice.value = '';
    elements.filterMaxPrice.value = '';
    elements.filterMinYear.value = '';
    elements.filterMaxYear.value = '';
    elements.filterMinMileage.value = '';
    elements.filterMaxMileage.value = '';
    
    filteredData = [...carData];
    currentPage = 1;
    
    updateKPIs();
    updateCharts();
    updateTable();
    generateInsights();
    updateTopPerformers();
    updateEVAnalysis();
    updatePerformanceInsights();
    // updateFuelStats is called from within generateInsights
}

// Update Brand Analysis
function updateBrandAnalysis() {
    const selectedBrand = elements.brandAnalysisSelect.value;
    
    if (!selectedBrand) {
        elements.brandAnalysisContent.style.display = 'none';
        return;
    }
    
    elements.brandAnalysisContent.style.display = 'block';
    
    const brandCars = filteredData.filter(car => car.Brand === selectedBrand);
    
    if (brandCars.length === 0) {
        return;
    }
    
    // Update brand statistics
    document.getElementById('selectedBrandName').textContent = selectedBrand + ' Statistics';
    document.getElementById('brandCarCount').textContent = brandCars.length;
    
    const avgPrice = brandCars.reduce((sum, car) => sum + car.Price, 0) / brandCars.length;
    const minPrice = Math.min(...brandCars.map(car => car.Price));
    const maxPrice = Math.max(...brandCars.map(car => car.Price));
    const avgMileage = brandCars.reduce((sum, car) => sum + car.Mileage, 0) / brandCars.length;
    const avgEngine = brandCars.reduce((sum, car) => sum + car.Engine_CC, 0) / brandCars.length;
    const avgPower = brandCars.reduce((sum, car) => sum + car.Power_BHP, 0) / brandCars.length;
    
    // Find most common values
    const fuelTypes = brandCars.map(car => car.Fuel_Type);
    const bodyTypes = brandCars.map(car => car.Body_Type);
    const transmissions = brandCars.map(car => car.Transmission);
    
    const mostCommonFuel = getMostCommon(fuelTypes);
    const mostCommonBody = getMostCommon(bodyTypes);
    const mostCommonTransmission = getMostCommon(transmissions);
    
    document.getElementById('brandAvgPrice').textContent = '₹' + formatNumber(Math.round(avgPrice));
    document.getElementById('brandMinPrice').textContent = '₹' + formatNumber(minPrice);
    document.getElementById('brandMaxPrice').textContent = '₹' + formatNumber(maxPrice);
    document.getElementById('brandAvgMileage').textContent = avgMileage.toFixed(1);
    document.getElementById('brandAvgEngine').textContent = Math.round(avgEngine) + ' CC';
    document.getElementById('brandAvgPower').textContent = Math.round(avgPower) + ' BHP';
    document.getElementById('brandCommonFuel').textContent = mostCommonFuel;
    document.getElementById('brandCommonBody').textContent = mostCommonBody;
    document.getElementById('brandCommonTransmission').textContent = mostCommonTransmission;
    
    // Update brand charts
    updateBrandCharts(brandCars);
}

// Get Most Common Value
function getMostCommon(array) {
    const frequency = {};
    let maxCount = 0;
    let mostCommon = array[0];
    
    array.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxCount) {
            maxCount = frequency[item];
            mostCommon = item;
        }
    });
    
    return mostCommon;
}

// Perform Brand Comparison
function performBrandComparison() {
    const selectedBrands = Array.from(elements.comparisonBrands.selectedOptions).map(opt => opt.value);
    
    if (selectedBrands.length < 2 || selectedBrands.length > 4) {
        alert('Please select 2-4 brands to compare');
        return;
    }
    
    elements.comparisonContent.style.display = 'block';
    
    // Update comparison table headers
    document.getElementById('compBrand1').textContent = selectedBrands[0] || '-';
    document.getElementById('compBrand2').textContent = selectedBrands[1] || '-';
    document.getElementById('compBrand3').textContent = selectedBrands[2] || '-';
    document.getElementById('compBrand4').textContent = selectedBrands[3] || '-';
    
    // Calculate statistics for each brand
    selectedBrands.forEach((brand, index) => {
        const brandCars = filteredData.filter(car => car.Brand === brand);
        
        if (brandCars.length > 0) {
            const avgPrice = brandCars.reduce((sum, car) => sum + car.Price, 0) / brandCars.length;
            const avgMileage = brandCars.reduce((sum, car) => sum + car.Mileage, 0) / brandCars.length;
            const avgPower = brandCars.reduce((sum, car) => sum + car.Power_BHP, 0) / brandCars.length;
            const avgEngine = brandCars.reduce((sum, car) => sum + car.Engine_CC, 0) / brandCars.length;
            
            const fuelTypes = brandCars.map(car => car.Fuel_Type);
            const transmissions = brandCars.map(car => car.Transmission);
            
            document.getElementById(`compPrice${index + 1}`).textContent = '₹' + formatNumber(Math.round(avgPrice));
            document.getElementById(`compMileage${index + 1}`).textContent = avgMileage.toFixed(1);
            document.getElementById(`compPower${index + 1}`).textContent = Math.round(avgPower) + ' BHP';
            document.getElementById(`compEngine${index + 1}`).textContent = Math.round(avgEngine) + ' CC';
            document.getElementById(`compModels${index + 1}`).textContent = brandCars.length;
            document.getElementById(`compFuel${index + 1}`).textContent = getMostCommon(fuelTypes);
            document.getElementById(`compTrans${index + 1}`).textContent = getMostCommon(transmissions);
        } else {
            // Clear if no data
            for (let i = 1; i <= 4; i++) {
                document.getElementById(`compPrice${i}`).textContent = '-';
                document.getElementById(`compMileage${i}`).textContent = '-';
                document.getElementById(`compPower${i}`).textContent = '-';
                document.getElementById(`compEngine${i}`).textContent = '-';
                document.getElementById(`compModels${i}`).textContent = '-';
                document.getElementById(`compFuel${i}`).textContent = '-';
                document.getElementById(`compTrans${i}`).textContent = '-';
            }
        }
    });
    
    // Hide empty columns
    for (let i = selectedBrands.length; i < 4; i++) {
        document.getElementById(`compBrand${i + 1}`).textContent = '-';
        document.getElementById(`compPrice${i + 1}`).textContent = '-';
        document.getElementById(`compMileage${i + 1}`).textContent = '-';
        document.getElementById(`compPower${i + 1}`).textContent = '-';
        document.getElementById(`compEngine${i + 1}`).textContent = '-';
        document.getElementById(`compModels${i + 1}`).textContent = '-';
        document.getElementById(`compFuel${i + 1}`).textContent = '-';
        document.getElementById(`compTrans${i + 1}`).textContent = '-';
    }
    
    // Update comparison charts
    updateComparisonCharts(selectedBrands);
}

// Apply Year Range Filter
function applyYearRangeFilter() {
    const minYear = parseInt(elements.yearRangeMin.value) || 0;
    const maxYear = parseInt(elements.yearRangeMax.value) || Infinity;
    
    elements.filterMinYear.value = minYear || '';
    elements.filterMaxYear.value = maxYear || '';
    
    applyFilters();
    updateYearRangeCharts(minYear, maxYear);
}

// Download Filtered Data as CSV
function downloadFilteredData() {
    if (filteredData.length === 0) {
        alert('No data to download');
        return;
    }
    
    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map(car => Object.values(car).join(','));
    const csvContent = headers + '\n' + rows.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_car_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Update EV Analysis
function updateEVAnalysis() {
    const evCars = filteredData.filter(car => car.Fuel_Type === 'Electric');
    
    const evCountEl = document.getElementById('evCount');
    const evAvgPriceEl = document.getElementById('evAvgPrice');
    const evAvgPowerEl = document.getElementById('evAvgPower');
    const evBrandsEl = document.getElementById('evBrands');
    
    if (evCountEl) evCountEl.textContent = evCars.length;
    
    if (evCars.length > 0) {
        const avgPrice = evCars.reduce((sum, car) => sum + car.Price, 0) / evCars.length;
        const avgPower = evCars.reduce((sum, car) => sum + car.Power_BHP, 0) / evCars.length;
        const evBrands = [...new Set(evCars.map(car => car.Brand))];
        
        if (evAvgPriceEl) evAvgPriceEl.textContent = '₹' + formatNumber(Math.round(avgPrice));
        if (evAvgPowerEl) evAvgPowerEl.textContent = Math.round(avgPower);
        if (evBrandsEl) evBrandsEl.textContent = evBrands.length;
    } else {
        if (evAvgPriceEl) evAvgPriceEl.textContent = '₹0';
        if (evAvgPowerEl) evAvgPowerEl.textContent = '0';
        if (evBrandsEl) evBrandsEl.textContent = '0';
    }
}



// Update Performance Insights
function updatePerformanceInsights() {
    const insights = [];
    
    if (filteredData.length === 0) {
        const content = document.getElementById('performanceInsightsContent');
        if (content) {
            content.innerHTML = '<p>No data available for analysis</p>';
        }
        return;
    }
    
    // Analyze mileage by fuel type
    const fuelMileage = {};
    filteredData.forEach(car => {
        if (!fuelMileage[car.Fuel_Type]) {
            fuelMileage[car.Fuel_Type] = { total: 0, count: 0 };
        }
        fuelMileage[car.Fuel_Type].total += car.Mileage;
        fuelMileage[car.Fuel_Type].count++;
    });
    
    const fuelAvgMileage = {};
    Object.keys(fuelMileage).forEach(fuel => {
        fuelAvgMileage[fuel] = fuelMileage[fuel].total / fuelMileage[fuel].count;
    });
    
    const bestMileageFuel = Object.keys(fuelAvgMileage).reduce((a, b) => 
        fuelAvgMileage[a] > fuelAvgMileage[b] ? a : b
    );
    
    insights.push(`Vehicles using ${bestMileageFuel} fuel show the highest average mileage at ${fuelAvgMileage[bestMileageFuel].toFixed(1)} km/l.`);
    
    // Analyze power vs price correlation
    const powerPriceCorrelation = calculateCorrelation(
        filteredData.map(car => car.Power_BHP),
        filteredData.map(car => car.Price)
    );
    
    if (powerPriceCorrelation > 0.7) {
        insights.push('There is a strong positive correlation between horsepower and price - higher power vehicles generally cost more.');
    } else if (powerPriceCorrelation > 0.4) {
        insights.push('There is a moderate positive correlation between horsepower and price.');
    } else {
        insights.push('The relationship between horsepower and price is not strongly correlated in this dataset.');
    }
    
    // Analyze engine vs power
    const enginePowerCorrelation = calculateCorrelation(
        filteredData.map(car => car.Engine_CC),
        filteredData.map(car => car.Power_BHP)
    );
    
    if (enginePowerCorrelation > 0.7) {
        insights.push('Larger engine capacities generally correspond to higher power outputs.');
    }
    
    // Display insights
    const content = document.getElementById('performanceInsightsContent');
    if (content) {
        content.innerHTML = insights.map(insight => 
            `<div class="insight-item"><p>${insight}</p></div>`
        ).join('');
    }
}

// Calculate Correlation Coefficient
function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Show Error Message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Placeholder functions for other modules
function updateCharts() {
    // This will be implemented in charts.js
    if (typeof updateAllCharts === 'function') {
        updateAllCharts();
    }
}

function updateTable() {
    // This will be implemented in filters.js
    if (typeof updateCarTable === 'function') {
        updateCarTable();
    }
}

function generateInsights() {
    // This will be implemented in insights.js
    if (typeof generateAllInsights === 'function') {
        generateAllInsights();
    }
}

function updateTopPerformers() {
    // This will be implemented in insights.js
    if (typeof updateTopLists === 'function') {
        updateTopLists();
    }
}

function updateBrandCharts(brandCars) {
    // This will be implemented in charts.js
    if (typeof updateBrandSpecificCharts === 'function') {
        updateBrandSpecificCharts(brandCars);
    }
}

function updateComparisonCharts(brands) {
    // This will be implemented in charts.js
    if (typeof updateComparisonSpecificCharts === 'function') {
        updateComparisonSpecificCharts(brands);
    }
}

function updateYearRangeCharts(minYear, maxYear) {
    // This will be implemented in charts.js
    if (typeof updateYearRangeSpecificCharts === 'function') {
        updateYearRangeSpecificCharts(minYear, maxYear);
    }
}

function updateChartColors() {
    // This will be implemented in charts.js
    if (typeof updateAllChartColors === 'function') {
        updateAllChartColors();
    }
}

function updateBrandChart() {
    // This will be implemented in charts.js
    if (typeof updateBrandSpecificChart === 'function') {
        updateBrandSpecificChart();
    }
}

function updatePriceBrandChart() {
    // This will be implemented in charts.js
    if (typeof updatePriceBrandSpecificChart === 'function') {
        updatePriceBrandSpecificChart();
    }
}