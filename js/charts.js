// ==========================================
// CarTrend Analytics - Chart.js Integration
// All Chart Visualizations
// ==========================================

// Chart Colors - Premium Palette
const chartColors = {
    primary: '#FF6B35',     // Metallic Orange
    secondary: '#D4A373',   // Champagne Gold
    accent: '#E63946',      // Muted Red
    teal: '#2A9D8F',        // Subtle Teal
    graphite: '#2D3436',    // Graphite Gray
    dark: '#1A1A1A',        // Charcoal
    light: '#FAFAFA'        // Warm White
};

const colorPalette = [
    '#FF6B35', '#D4A373', '#E63946', '#2A9D8F', '#2D3436',
    '#6B7280', '#F4A261', '#E9C46A', '#264653', '#E76F51',
    '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653'
];

// Get Chart Colors based on theme
function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: isDark ? '#FAFAFA' : '#1A1A1A',
        grid: isDark ? '#2A2A2A' : '#E5E7EB',
        background: isDark ? '#1E1E1E' : '#FFFFFF'
    };
}

// Update All Charts
function updateAllCharts() {
    updateBrandChart();
    updatePriceBrandChart();
    updateFuelChart();
    updateTransmissionChart();
    updateYearChart();
    updatePriceYearChart();
    updateBodyTypeChart();
    updatePriceDistributionChart();
    updatePriceFuelChart();
    updatePriceBodyChart();
    updatePricePowerChart();
    updatePriceEngineChart();
    updateFuelYearChart();
    updateEnginePowerChart();
    updatePowerPriceChart();
    updateEnginePriceChart();
    updateMileageFuelChart();
    updateBodyPopularityChart();
    updateBodyPriceChart();
    updateBodyMileageChart();
    updateBodyPowerChart();
    updateFilteredYearChart();
    updateFilteredPriceYearChart();
    updateMileageYearChart();
    updateFuelTimeChart();
    updateEVGrowthChart();
    updateEVBrandChart();
}

// Update Brand Chart
function updateBrandChart() {
    const ctx = document.getElementById('brandChart');
    if (!ctx) return;
    
    const sortType = document.getElementById('brandSort').value;
    const brandCounts = {};
    
    filteredData.forEach(car => {
        brandCounts[car.Brand] = (brandCounts[car.Brand] || 0) + 1;
    });
    
    let sortedBrands = Object.entries(brandCounts);
    
    switch (sortType) {
        case 'highest':
            sortedBrands.sort((a, b) => b[1] - a[1]);
            break;
        case 'lowest':
            sortedBrands.sort((a, b) => a[1] - b[1]);
            break;
        case 'alphabetical':
            sortedBrands.sort((a, b) => a[0].localeCompare(b[0]));
            break;
    }
    
    const labels = sortedBrands.map(item => item[0]);
    const data = sortedBrands.map(item => item[1]);
    const colors = sortedBrands.map((_, i) => colorPalette[i % colorPalette.length]);
    
    const chartColors = getChartColors();
    
    if (charts.brand) {
        charts.brand.destroy();
    }
    
    charts.brand = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Cars',
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x} cars`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Price Brand Chart
function updatePriceBrandChart() {
    const ctx = document.getElementById('priceBrandChart');
    if (!ctx) return;
    
    const selectValue = document.getElementById('priceBrandSelect').value;
    const brandPrices = {};
    const brandCounts = {};
    
    filteredData.forEach(car => {
        if (!brandPrices[car.Brand]) {
            brandPrices[car.Brand] = 0;
            brandCounts[car.Brand] = 0;
        }
        brandPrices[car.Brand] += car.Price;
        brandCounts[car.Brand]++;
    });
    
    const brandAvgPrices = Object.keys(brandPrices).map(brand => ({
        brand: brand,
        avgPrice: brandPrices[brand] / brandCounts[brand]
    }));
    
    brandAvgPrices.sort((a, b) => b.avgPrice - a.avgPrice);
    
    let selectedBrands = brandAvgPrices;
    if (selectValue !== 'all') {
        const count = parseInt(selectValue);
        selectedBrands = brandAvgPrices.slice(0, count);
    }
    
    const labels = selectedBrands.map(item => item.brand);
    const data = selectedBrands.map(item => item.avgPrice);
    
    const chartColors = getChartColors();
    
    if (charts.priceBrand) {
        charts.priceBrand.destroy();
    }
    
    charts.priceBrand = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Price (₹)',
                data: data,
                backgroundColor: chartColors.primary,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { 
                        color: chartColors.text,
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Fuel Chart
function updateFuelChart() {
    const ctx = document.getElementById('fuelChart');
    if (!ctx) return;
    
    const fuelCounts = {};
    filteredData.forEach(car => {
        fuelCounts[car.Fuel_Type] = (fuelCounts[car.Fuel_Type] || 0) + 1;
    });
    
    const labels = Object.keys(fuelCounts);
    const data = Object.values(fuelCounts);
    const total = data.reduce((a, b) => a + b, 0);
    const percentages = data.map(value => ((value / total) * 100).toFixed(1));
    
    // Premium fuel-specific colors
    const fuelColors = {
        'Petrol': '#FF6B35',    // Metallic Orange
        'Diesel': '#2D3436',    // Graphite Gray
        'Electric': '#2A9D8F',  // Subtle Teal
        'Hybrid': '#D4A373',    // Champagne Gold
        'CNG': '#264653'        // Dark Teal
    };
    
    const backgroundColors = labels.map(label => fuelColors[label] || colorPalette[labels.indexOf(label) % colorPalette.length]);
    
    const chartColors = getChartColors();
    
    if (charts.fuel) {
        charts.fuel.destroy();
    }
    
    charts.fuel = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartColors.text,
                        font: { family: 'Inter', size: 12 },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]} cars, ${percentages[i]}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = percentages[context.dataIndex];
                            return `${value} cars (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update Transmission Chart
function updateTransmissionChart() {
    const ctx = document.getElementById('transmissionChart');
    if (!ctx) return;
    
    const transmissionCounts = {};
    filteredData.forEach(car => {
        transmissionCounts[car.Transmission] = (transmissionCounts[car.Transmission] || 0) + 1;
    });
    
    const labels = Object.keys(transmissionCounts);
    const data = Object.values(transmissionCounts);
    
    // Premium transmission-specific colors
    const transColors = {
        'Manual': '#FF6B35',      // Metallic Orange
        'Automatic': '#2A9D8F',   // Subtle Teal
        'AMT': '#D4A373',         // Champagne Gold
        'CVT': '#E63946',         // Muted Red
        'DCT': '#2D3436'          // Graphite Gray
    };
    
    const backgroundColors = labels.map(label => transColors[label] || colorPalette[labels.indexOf(label) % colorPalette.length]);
    
    const chartColors = getChartColors();
    
    if (charts.transmission) {
        charts.transmission.destroy();
    }
    
    charts.transmission = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartColors.text,
                        font: { family: 'Inter', size: 12 },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed} cars`;
                        }
                    }
                }
            }
        }
    });
}

// Update Year Chart
function updateYearChart() {
    const ctx = document.getElementById('yearChart');
    if (!ctx) return;
    
    const yearCounts = {};
    filteredData.forEach(car => {
        yearCounts[car.Year] = (yearCounts[car.Year] || 0) + 1;
    });
    
    const sortedYears = Object.keys(yearCounts).sort();
    const data = sortedYears.map(year => yearCounts[year]);
    
    const chartColors = getChartColors();
    
    if (charts.year) {
        charts.year.destroy();
    }
    
    charts.year = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Number of Cars',
                data: data,
                borderColor: chartColors.primary,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(255, 107, 53, 0.3)');
                    gradient.addColorStop(1, 'rgba(255, 107, 53, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Price Year Chart
function updatePriceYearChart() {
    const ctx = document.getElementById('priceYearChart');
    if (!ctx) return;
    
    const yearPrices = {};
    const yearCounts = {};
    
    filteredData.forEach(car => {
        if (!yearPrices[car.Year]) {
            yearPrices[car.Year] = 0;
            yearCounts[car.Year] = 0;
        }
        yearPrices[car.Year] += car.Price;
        yearCounts[car.Year]++;
    });
    
    const sortedYears = Object.keys(yearPrices).sort();
    const data = sortedYears.map(year => yearPrices[year] / yearCounts[year]);
    
    const chartColors = getChartColors();
    
    if (charts.priceYear) {
        charts.priceYear.destroy();
    }
    
    charts.priceYear = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Average Price (₹)',
                data: data,
                borderColor: chartColors.secondary,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(212, 163, 115, 0.3)');
                    gradient.addColorStop(1, 'rgba(212, 163, 115, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: chartColors.secondary,
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#D4A373',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { 
                        color: chartColors.text,
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Body Type Chart
function updateBodyTypeChart() {
    const ctx = document.getElementById('bodyTypeChart');
    if (!ctx) return;
    
    const bodyCounts = {};
    filteredData.forEach(car => {
        bodyCounts[car.Body_Type] = (bodyCounts[car.Body_Type] || 0) + 1;
    });
    
    const labels = Object.keys(bodyCounts);
    const data = Object.values(bodyCounts);
    
    const chartColors = getChartColors();
    
    if (charts.bodyType) {
        charts.bodyType.destroy();
    }
    
    charts.bodyType = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Cars',
                data: data,
                backgroundColor: colorPalette.slice(0, labels.length),
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Price Distribution Chart
function updatePriceDistributionChart() {
    const ctx = document.getElementById('priceDistributionChart');
    if (!ctx) return;
    
    // Create price ranges
    const prices = filteredData.map(car => car.Price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const rangeSize = (maxPrice - minPrice) / 10;
    
    const ranges = [];
    for (let i = 0; i < 10; i++) {
        const lower = minPrice + i * rangeSize;
        const upper = minPrice + (i + 1) * rangeSize;
        ranges.push({
            label: `₹${formatNumber(Math.round(lower))} - ₹${formatNumber(Math.round(upper))}`,
            count: prices.filter(p => p >= lower && p < upper).length
        });
    }
    
    const labels = ranges.map(r => r.label);
    const data = ranges.map(r => r.count);
    
    const chartColors = getChartColors();
    
    if (charts.priceDistribution) {
        charts.priceDistribution.destroy();
    }
    
    charts.priceDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Cars',
                data: data,
                backgroundColor: chartColors.primary,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: chartColors.text,
                        font: { family: 'Inter' },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Price Fuel Chart
function updatePriceFuelChart() {
    const ctx = document.getElementById('priceFuelChart');
    if (!ctx) return;
    
    const fuelPrices = {};
    const fuelCounts = {};
    
    filteredData.forEach(car => {
        if (!fuelPrices[car.Fuel_Type]) {
            fuelPrices[car.Fuel_Type] = 0;
            fuelCounts[car.Fuel_Type] = 0;
        }
        fuelPrices[car.Fuel_Type] += car.Price;
        fuelCounts[car.Fuel_Type]++;
    });
    
    const labels = Object.keys(fuelPrices);
    const data = labels.map(fuel => fuelPrices[fuel] / fuelCounts[fuel]);
    
    // Premium fuel-specific colors
    const fuelColors = {
        'Petrol': '#FF6B35',    // Metallic Orange
        'Diesel': '#2D3436',    // Graphite Gray
        'Electric': '#2A9D8F',  // Subtle Teal
        'Hybrid': '#D4A373',    // Champagne Gold
        'CNG': '#264653'        // Dark Teal
    };
    
    const backgroundColors = labels.map(label => fuelColors[label] || colorPalette[labels.indexOf(label) % colorPalette.length]);
    
    const chartColors = getChartColors();
    
    if (charts.priceFuel) {
        charts.priceFuel.destroy();
    }
    
    charts.priceFuel = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Price (₹)',
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { 
                        color: chartColors.text,
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Price Body Chart
function updatePriceBodyChart() {
    const ctx = document.getElementById('priceBodyChart');
    if (!ctx) return;
    
    const bodyPrices = {};
    const bodyCounts = {};
    
    filteredData.forEach(car => {
        if (!bodyPrices[car.Body_Type]) {
            bodyPrices[car.Body_Type] = 0;
            bodyCounts[car.Body_Type] = 0;
        }
        bodyPrices[car.Body_Type] += car.Price;
        bodyCounts[car.Body_Type]++;
    });
    
    const labels = Object.keys(bodyPrices);
    const data = labels.map(body => bodyPrices[body] / bodyCounts[body]);
    
    const chartColors = getChartColors();
    
    if (charts.priceBody) {
        charts.priceBody.destroy();
    }
    
    charts.priceBody = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Price (₹)',
                data: data,
                backgroundColor: colorPalette.slice(0, labels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { 
                        color: chartColors.text,
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Price Power Chart (Scatter)
function updatePricePowerChart() {
    const ctx = document.getElementById('pricePowerChart');
    if (!ctx) return;
    
    const data = filteredData.map(car => ({
        x: car.Power_BHP,
        y: car.Price
    }));
    
    const chartColors = getChartColors();
    
    if (charts.pricePower) {
        charts.pricePower.destroy();
    }
    
    charts.pricePower = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Price vs Power',
                data: data,
                backgroundColor: 'rgba(255, 107, 53, 0.6)',
                borderColor: '#FF6B35',
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBorderWidth: 2,
                pointBorderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Power: ${context.parsed.x} BHP, Price: ₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Power (BHP)',
                        color: chartColors.text,
                        font: { family: 'Inter', weight: '600' }
                    },
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (₹)',
                        color: chartColors.text,
                        font: { family: 'Inter', weight: '600' }
                    },
                    ticks: { 
                        color: chartColors.text,
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Price Engine Chart (Scatter)
function updatePriceEngineChart() {
    const ctx = document.getElementById('priceEngineChart');
    if (!ctx) return;
    
    const data = filteredData.map(car => ({
        x: car.Engine_CC,
        y: car.Price
    }));
    
    const chartColors = getChartColors();
    
    if (charts.priceEngine) {
        charts.priceEngine.destroy();
    }
    
    charts.priceEngine = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Price vs Engine',
                data: data,
                backgroundColor: chartColors.success + '80',
                borderColor: chartColors.success,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Engine: ${context.parsed.x} CC, Price: ₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Engine (CC)',
                        color: chartColors.text
                    },
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (₹)',
                        color: chartColors.text
                    },
                    ticks: { 
                        color: chartColors.text,
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Fuel Year Chart
function updateFuelYearChart() {
    const ctx = document.getElementById('fuelYearChart');
    if (!ctx) return;
    
    const yearFuel = {};
    
    filteredData.forEach(car => {
        if (!yearFuel[car.Year]) {
            yearFuel[car.Year] = {};
        }
        if (!yearFuel[car.Year][car.Fuel_Type]) {
            yearFuel[car.Year][car.Fuel_Type] = 0;
        }
        yearFuel[car.Year][car.Fuel_Type]++;
    });
    
    const sortedYears = Object.keys(yearFuel).sort();
    const fuelTypes = [...new Set(filteredData.map(car => car.Fuel_Type))];
    
    const datasets = fuelTypes.map((fuel, index) => ({
        label: fuel,
        data: sortedYears.map(year => yearFuel[year][fuel] || 0),
        borderColor: colorPalette[index % colorPalette.length],
        backgroundColor: colorPalette[index % colorPalette.length] + '20',
        fill: false,
        tension: 0.4
    }));
    
    const chartColors = getChartColors();
    
    if (charts.fuelYear) {
        charts.fuelYear.destroy();
    }
    
    charts.fuelYear = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartColors.text
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Engine Power Chart (Scatter)
function updateEnginePowerChart() {
    const ctx = document.getElementById('enginePowerChart');
    if (!ctx) return;
    
    const data = filteredData.map(car => ({
        x: car.Engine_CC,
        y: car.Power_BHP
    }));
    
    const chartColors = getChartColors();
    
    if (charts.enginePower) {
        charts.enginePower.destroy();
    }
    
    charts.enginePower = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Engine vs Power',
                data: data,
                backgroundColor: chartColors.warning + '80',
                borderColor: chartColors.warning,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Engine: ${context.parsed.x} CC, Power: ${context.parsed.y} BHP`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Engine (CC)',
                        color: chartColors.text
                    },
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (BHP)',
                        color: chartColors.text
                    },
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Power Price Chart (Scatter)
function updatePowerPriceChart() {
    const ctx = document.getElementById('powerPriceChart');
    if (!ctx) return;
    
    const data = filteredData.map(car => ({
        x: car.Power_BHP,
        y: car.Price
    }));
    
    const chartColors = getChartColors();
    
    if (charts.powerPrice) {
        charts.powerPrice.destroy();
    }
    
    charts.powerPrice = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Power vs Price',
                data: data,
                backgroundColor: chartColors.danger + '80',
                borderColor: chartColors.danger,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Power: ${context.parsed.x} BHP, Price: ₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Power (BHP)',
                        color: chartColors.text
                    },
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (₹)',
                        color: chartColors.text
                    },
                    ticks: { 
                        color: chartColors.text,
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Engine Price Chart (Scatter)
function updateEnginePriceChart() {
    const ctx = document.getElementById('enginePriceChart');
    if (!ctx) return;
    
    const data = filteredData.map(car => ({
        x: car.Engine_CC,
        y: car.Price
    }));
    
    const chartColors = getChartColors();
    
    if (charts.enginePrice) {
        charts.enginePrice.destroy();
    }
    
    charts.enginePrice = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Engine vs Price',
                data: data,
                backgroundColor: chartColors.info + '80',
                borderColor: chartColors.info,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Engine: ${context.parsed.x} CC, Price: ₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Engine (CC)',
                        color: chartColors.text
                    },
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (₹)',
                        color: chartColors.text
                    },
                    ticks: { 
                        color: chartColors.text,
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Mileage Fuel Chart
function updateMileageFuelChart() {
    const ctx = document.getElementById('mileageFuelChart');
    if (!ctx) return;
    
    const fuelMileage = {};
    const fuelCounts = {};
    
    filteredData.forEach(car => {
        if (car.Mileage > 0) { // Exclude electric vehicles
            if (!fuelMileage[car.Fuel_Type]) {
                fuelMileage[car.Fuel_Type] = 0;
                fuelCounts[car.Fuel_Type] = 0;
            }
            fuelMileage[car.Fuel_Type] += car.Mileage;
            fuelCounts[car.Fuel_Type]++;
        }
    });
    
    const labels = Object.keys(fuelMileage);
    const data = labels.map(fuel => fuelMileage[fuel] / fuelCounts[fuel]);
    
    const chartColors = getChartColors();
    
    if (charts.mileageFuel) {
        charts.mileageFuel.destroy();
    }
    
    charts.mileageFuel = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Mileage (km/l)',
                data: data,
                backgroundColor: colorPalette.slice(0, labels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Body Popularity Chart
function updateBodyPopularityChart() {
    const ctx = document.getElementById('bodyPopularityChart');
    if (!ctx) return;
    
    const bodyCounts = {};
    filteredData.forEach(car => {
        bodyCounts[car.Body_Type] = (bodyCounts[car.Body_Type] || 0) + 1;
    });
    
    const labels = Object.keys(bodyCounts);
    const data = Object.values(bodyCounts);
    
    const chartColors = getChartColors();
    
    if (charts.bodyPopularity) {
        charts.bodyPopularity.destroy();
    }
    
    charts.bodyPopularity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Cars',
                data: data,
                backgroundColor: chartColors.primary,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#FF6B35',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Body Price Chart
function updateBodyPriceChart() {
    const ctx = document.getElementById('bodyPriceChart');
    if (!ctx) return;
    
    const bodyPrices = {};
    const bodyCounts = {};
    
    filteredData.forEach(car => {
        if (!bodyPrices[car.Body_Type]) {
            bodyPrices[car.Body_Type] = 0;
            bodyCounts[car.Body_Type] = 0;
        }
        bodyPrices[car.Body_Type] += car.Price;
        bodyCounts[car.Body_Type]++;
    });
    
    const labels = Object.keys(bodyPrices);
    const data = labels.map(body => bodyPrices[body] / bodyCounts[body]);
    
    const chartColors = getChartColors();
    
    if (charts.bodyPrice) {
        charts.bodyPrice.destroy();
    }
    
    charts.bodyPrice = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Price (₹)',
                data: data,
                backgroundColor: chartColors.secondary,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#FAFAFA',
                    bodyColor: '#FAFAFA',
                    borderColor: '#D4A373',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text, font: { family: 'Inter' } },
                    grid: { color: chartColors.grid, drawBorder: false }
                },
                y: {
                    ticks: { 
                        color: chartColors.text,
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid, drawBorder: false }
                }
            }
        }
    });
}

// Update Body Mileage Chart
function updateBodyMileageChart() {
    const ctx = document.getElementById('bodyMileageChart');
    if (!ctx) return;
    
    const bodyMileage = {};
    const bodyCounts = {};
    
    filteredData.forEach(car => {
        if (car.Mileage > 0) {
            if (!bodyMileage[car.Body_Type]) {
                bodyMileage[car.Body_Type] = 0;
                bodyCounts[car.Body_Type] = 0;
            }
            bodyMileage[car.Body_Type] += car.Mileage;
            bodyCounts[car.Body_Type]++;
        }
    });
    
    const labels = Object.keys(bodyMileage);
    const data = labels.map(body => bodyMileage[body] / bodyCounts[body]);
    
    const chartColors = getChartColors();
    
    if (charts.bodyMileage) {
        charts.bodyMileage.destroy();
    }
    
    charts.bodyMileage = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Mileage (km/l)',
                data: data,
                backgroundColor: chartColors.warning,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Body Power Chart
function updateBodyPowerChart() {
    const ctx = document.getElementById('bodyPowerChart');
    if (!ctx) return;
    
    const bodyPower = {};
    const bodyCounts = {};
    
    filteredData.forEach(car => {
        if (!bodyPower[car.Body_Type]) {
            bodyPower[car.Body_Type] = 0;
            bodyCounts[car.Body_Type] = 0;
        }
        bodyPower[car.Body_Type] += car.Power_BHP;
        bodyCounts[car.Body_Type]++;
    });
    
    const labels = Object.keys(bodyPower);
    const data = labels.map(body => bodyPower[body] / bodyCounts[body]);
    
    const chartColors = getChartColors();
    
    if (charts.bodyPower) {
        charts.bodyPower.destroy();
    }
    
    charts.bodyPower = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Power (BHP)',
                data: data,
                backgroundColor: chartColors.danger,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Filtered Year Chart
function updateFilteredYearChart() {
    const ctx = document.getElementById('filteredYearChart');
    if (!ctx) return;
    
    const yearCounts = {};
    filteredData.forEach(car => {
        yearCounts[car.Year] = (yearCounts[car.Year] || 0) + 1;
    });
    
    const sortedYears = Object.keys(yearCounts).sort();
    const data = sortedYears.map(year => yearCounts[year]);
    
    const chartColors = getChartColors();
    
    if (charts.filteredYear) {
        charts.filteredYear.destroy();
    }
    
    charts.filteredYear = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Number of Cars',
                data: data,
                backgroundColor: chartColors.primary,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Filtered Price Year Chart
function updateFilteredPriceYearChart() {
    const ctx = document.getElementById('filteredPriceYearChart');
    if (!ctx) return;
    
    const yearPrices = {};
    const yearCounts = {};
    
    filteredData.forEach(car => {
        if (!yearPrices[car.Year]) {
            yearPrices[car.Year] = 0;
            yearCounts[car.Year] = 0;
        }
        yearPrices[car.Year] += car.Price;
        yearCounts[car.Year]++;
    });
    
    const sortedYears = Object.keys(yearPrices).sort();
    const data = sortedYears.map(year => yearPrices[year] / yearCounts[year]);
    
    const chartColors = getChartColors();
    
    if (charts.filteredPriceYear) {
        charts.filteredPriceYear.destroy();
    }
    
    charts.filteredPriceYear = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Average Price (₹)',
                data: data,
                borderColor: chartColors.success,
                backgroundColor: chartColors.success + '20',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `₹${formatNumber(Math.round(context.parsed.y))}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { 
                        color: chartColors.text,
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Mileage Year Chart
function updateMileageYearChart() {
    const ctx = document.getElementById('mileageYearChart');
    if (!ctx) return;
    
    const yearMileage = {};
    const yearCounts = {};
    
    filteredData.forEach(car => {
        if (car.Mileage > 0) {
            if (!yearMileage[car.Year]) {
                yearMileage[car.Year] = 0;
                yearCounts[car.Year] = 0;
            }
            yearMileage[car.Year] += car.Mileage;
            yearCounts[car.Year]++;
        }
    });
    
    const sortedYears = Object.keys(yearMileage).sort();
    const data = sortedYears.map(year => yearMileage[year] / yearCounts[year]);
    
    const chartColors = getChartColors();
    
    if (charts.mileageYear) {
        charts.mileageYear.destroy();
    }
    
    charts.mileageYear = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Average Mileage (km/l)',
                data: data,
                borderColor: chartColors.warning,
                backgroundColor: chartColors.warning + '20',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update Fuel Time Chart
function updateFuelTimeChart() {
    const ctx = document.getElementById('fuelTimeChart');
    if (!ctx) return;
    
    const yearFuel = {};
    
    filteredData.forEach(car => {
        if (!yearFuel[car.Year]) {
            yearFuel[car.Year] = {};
        }
        if (!yearFuel[car.Year][car.Fuel_Type]) {
            yearFuel[car.Year][car.Fuel_Type] = 0;
        }
        yearFuel[car.Year][car.Fuel_Type]++;
    });
    
    const sortedYears = Object.keys(yearFuel).sort();
    const fuelTypes = [...new Set(filteredData.map(car => car.Fuel_Type))];
    
    const datasets = fuelTypes.map((fuel, index) => ({
        label: fuel,
        data: sortedYears.map(year => yearFuel[year][fuel] || 0),
        borderColor: colorPalette[index % colorPalette.length],
        backgroundColor: colorPalette[index % colorPalette.length] + '20',
        fill: false,
        tension: 0.4
    }));
    
    const chartColors = getChartColors();
    
    if (charts.fuelTime) {
        charts.fuelTime.destroy();
    }
    
    charts.fuelTime = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartColors.text
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update EV Growth Chart
function updateEVGrowthChart() {
    const ctx = document.getElementById('evGrowthChart');
    if (!ctx) return;
    
    const evCars = filteredData.filter(car => car.Fuel_Type === 'Electric');
    const yearCounts = {};
    
    evCars.forEach(car => {
        yearCounts[car.Year] = (yearCounts[car.Year] || 0) + 1;
    });
    
    const sortedYears = Object.keys(yearCounts).sort();
    const data = sortedYears.map(year => yearCounts[year]);
    
    const chartColors = getChartColors();
    
    if (charts.evGrowth) {
        charts.evGrowth.destroy();
    }
    
    charts.evGrowth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: [{
                label: 'Number of EVs',
                data: data,
                borderColor: chartColors.success,
                backgroundColor: chartColors.success + '20',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                },
                y: {
                    ticks: { color: chartColors.text },
                    grid: { color: chartColors.grid }
                }
            }
        }
    });
}

// Update EV Brand Chart
function updateEVBrandChart() {
    const ctx = document.getElementById('evBrandChart');
    if (!ctx) return;
    
    const evCars = filteredData.filter(car => car.Fuel_Type === 'Electric');
    const brandCounts = {};
    
    evCars.forEach(car => {
        brandCounts[car.Brand] = (brandCounts[car.Brand] || 0) + 1;
    });
    
    const labels = Object.keys(brandCounts);
    const data = Object.values(brandCounts);
    
    const chartColors = getChartColors();
    
    if (charts.evBrand) {
        charts.evBrand.destroy();
    }
    
    charts.evBrand = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colorPalette.slice(0, labels.length),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartColors.text
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed} cars`;
                        }
                    }
                }
            }
        }
    });
}

// Update Brand Specific Charts
function updateBrandSpecificCharts(brandCars) {
    // Update brand fuel chart
    const fuelCtx = document.getElementById('brandFuelChart');
    if (fuelCtx) {
        const fuelCounts = {};
        brandCars.forEach(car => {
            fuelCounts[car.Fuel_Type] = (fuelCounts[car.Fuel_Type] || 0) + 1;
        });
        
        const labels = Object.keys(fuelCounts);
        const data = Object.values(fuelCounts);
        const chartColors = getChartColors();
        
        if (charts.brandFuel) {
            charts.brandFuel.destroy();
        }
        
        charts.brandFuel = new Chart(fuelCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colorPalette.slice(0, labels.length),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: chartColors.text
                        }
                    }
                }
            }
        });
    }
    
    // Update brand body chart
    const bodyCtx = document.getElementById('brandBodyChart');
    if (bodyCtx) {
        const bodyCounts = {};
        brandCars.forEach(car => {
            bodyCounts[car.Body_Type] = (bodyCounts[car.Body_Type] || 0) + 1;
        });
        
        const labels = Object.keys(bodyCounts);
        const data = Object.values(bodyCounts);
        const chartColors = getChartColors();
        
        if (charts.brandBody) {
            charts.brandBody.destroy();
        }
        
        charts.brandBody = new Chart(bodyCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Cars',
                    data: data,
                    backgroundColor: colorPalette.slice(0, labels.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: { color: chartColors.text },
                        grid: { color: chartColors.grid }
                    },
                    y: {
                        ticks: { color: chartColors.text },
                        grid: { color: chartColors.grid }
                    }
                }
            }
        });
    }
    
    // Update brand transmission chart
    const transCtx = document.getElementById('brandTransmissionChart');
    if (transCtx) {
        const transCounts = {};
        brandCars.forEach(car => {
            transCounts[car.Transmission] = (transCounts[car.Transmission] || 0) + 1;
        });
        
        const labels = Object.keys(transCounts);
        const data = Object.values(transCounts);
        const chartColors = getChartColors();
        
        if (charts.brandTransmission) {
            charts.brandTransmission.destroy();
        }
        
        charts.brandTransmission = new Chart(transCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colorPalette.slice(0, labels.length),
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: chartColors.text
                        }
                    }
                }
            }
        });
    }
}

// Update Comparison Specific Charts
function updateComparisonSpecificCharts(brands) {
    // Update comparison price chart
    const priceCtx = document.getElementById('comparisonPriceChart');
    if (priceCtx) {
        const brandData = brands.map(brand => {
            const brandCars = filteredData.filter(car => car.Brand === brand);
            return {
                brand: brand,
                avgPrice: brandCars.length > 0 ? brandCars.reduce((sum, car) => sum + car.Price, 0) / brandCars.length : 0
            };
        });
        
        const labels = brandData.map(d => d.brand);
        const data = brandData.map(d => d.avgPrice);
        const chartColors = getChartColors();
        
        if (charts.comparisonPrice) {
            charts.comparisonPrice.destroy();
        }
        
        charts.comparisonPrice = new Chart(priceCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Price (₹)',
                    data: data,
                    backgroundColor: colorPalette.slice(0, labels.length),
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleColor: '#FAFAFA',
                        bodyColor: '#FAFAFA',
                        borderColor: '#FF6B35',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `₹${formatNumber(Math.round(context.parsed.y))}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: chartColors.text, font: { family: 'Inter' } },
                        grid: { color: chartColors.grid, drawBorder: false }
                    },
                    y: {
                        ticks: { 
                            color: chartColors.text,
                            font: { family: 'Inter' },
                            callback: function(value) {
                                return '₹' + formatNumber(value);
                            }
                        },
                        grid: { color: chartColors.grid, drawBorder: false }
                    }
                }
            }
        });
    }
    
    // Update comparison power chart
    const powerCtx = document.getElementById('comparisonPowerChart');
    if (powerCtx) {
        const brandData = brands.map(brand => {
            const brandCars = filteredData.filter(car => car.Brand === brand);
            return {
                brand: brand,
                avgPower: brandCars.length > 0 ? brandCars.reduce((sum, car) => sum + car.Power_BHP, 0) / brandCars.length : 0
            };
        });
        
        const labels = brandData.map(d => d.brand);
        const data = brandData.map(d => d.avgPower);
        const chartColors = getChartColors();
        
        if (charts.comparisonPower) {
            charts.comparisonPower.destroy();
        }
        
        charts.comparisonPower = new Chart(powerCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Power (BHP)',
                    data: data,
                    backgroundColor: colorPalette.slice(0, labels.length),
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleColor: '#FAFAFA',
                        bodyColor: '#FAFAFA',
                        borderColor: '#FF6B35',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        ticks: { color: chartColors.text, font: { family: 'Inter' } },
                        grid: { color: chartColors.grid, drawBorder: false }
                    },
                    y: {
                        ticks: { color: chartColors.text, font: { family: 'Inter' } },
                        grid: { color: chartColors.grid, drawBorder: false }
                    }
                }
            }
        });
    }
}

// Update Year Range Specific Charts
function updateYearRangeSpecificCharts(minYear, maxYear) {
    // Filter data by year range
    const yearFilteredData = filteredData.filter(car => 
        car.Year >= minYear && car.Year <= maxYear
    );
    
    // Update filtered year chart
    const yearCtx = document.getElementById('filteredYearChart');
    if (yearCtx) {
        const yearCounts = {};
        yearFilteredData.forEach(car => {
            yearCounts[car.Year] = (yearCounts[car.Year] || 0) + 1;
        });
        
        const sortedYears = Object.keys(yearCounts).sort();
        const data = sortedYears.map(year => yearCounts[year]);
        const chartColors = getChartColors();
        
        if (charts.filteredYear) {
            charts.filteredYear.destroy();
        }
        
        charts.filteredYear = new Chart(yearCtx, {
            type: 'bar',
            data: {
                labels: sortedYears,
                datasets: [{
                    label: 'Number of Cars',
                    data: data,
                    backgroundColor: chartColors.primary,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: { color: chartColors.text },
                        grid: { color: chartColors.grid }
                    },
                    y: {
                        ticks: { color: chartColors.text },
                        grid: { color: chartColors.grid }
                    }
                }
            }
        });
    }
    
    // Update filtered price year chart
    const priceYearCtx = document.getElementById('filteredPriceYearChart');
    if (priceYearCtx) {
        const yearPrices = {};
        const yearCounts = {};
        
        yearFilteredData.forEach(car => {
            if (!yearPrices[car.Year]) {
                yearPrices[car.Year] = 0;
                yearCounts[car.Year] = 0;
            }
            yearPrices[car.Year] += car.Price;
            yearCounts[car.Year]++;
        });
        
        const sortedYears = Object.keys(yearPrices).sort();
        const data = sortedYears.map(year => yearPrices[year] / yearCounts[year]);
        const chartColors = getChartColors();
        
        if (charts.filteredPriceYear) {
            charts.filteredPriceYear.destroy();
        }
        
        charts.filteredPriceYear = new Chart(priceYearCtx, {
            type: 'line',
            data: {
                labels: sortedYears,
                datasets: [{
                    label: 'Average Price (₹)',
                    data: data,
                    borderColor: chartColors.success,
                    backgroundColor: chartColors.success + '20',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹${formatNumber(Math.round(context.parsed.y))}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: chartColors.text },
                        grid: { color: chartColors.grid }
                    },
                    y: {
                        ticks: { 
                            color: chartColors.text,
                            callback: function(value) {
                                return '₹' + formatNumber(value);
                            }
                        },
                        grid: { color: chartColors.grid }
                    }
                }
            }
        });
    }
}

// Update All Chart Colors (for theme toggle)
function updateAllChartColors() {
    updateAllCharts();
}

// Helper function to format numbers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}