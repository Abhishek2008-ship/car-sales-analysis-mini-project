// ==========================================
// CarTrend Analytics - Insights Generator
// Data-Driven Insights and Top Performers
// ==========================================

// Generate All Insights
function generateAllInsights() {
    const insightsContainer = document.getElementById('insightsContent');
    if (!insightsContainer) return;
    
    if (filteredData.length === 0) {
        insightsContainer.innerHTML = '<div class="col-12"><p class="text-center">No data available for insights</p></div>';
        return;
    }
    
    const insights = generateInsightCards();
    
    insightsContainer.innerHTML = insights.map(insight => `
        <div class="col-lg-4 col-md-6">
            <div class="insight-card">
                <h5>${insight.icon} ${insight.title}</h5>
                <div class="insight-value">${insight.value}</div>
                <p class="insight-description">${insight.description}</p>
            </div>
        </div>
    `).join('');
    
    // Also update fuel stats
    updateFuelStats();
}

// Generate Insight Cards
function generateInsightCards() {
    const insights = [];
    
    // Most Common Brand
    const brandCounts = {};
    filteredData.forEach(car => {
        brandCounts[car.Brand] = (brandCounts[car.Brand] || 0) + 1;
    });
    const mostCommonBrand = Object.keys(brandCounts).reduce((a, b) => brandCounts[a] > brandCounts[b] ? a : b);
    insights.push({
        icon: '<i class="bi bi-buildings"></i>',
        title: 'Most Common Brand',
        value: mostCommonBrand,
        description: `${mostCommonBrand} appears ${brandCounts[mostCommonBrand]} times in the dataset, making it the most represented brand.`
    });
    
    // Most Expensive Brand (by average price)
    const brandPrices = {};
    const brandCarCounts = {};
    filteredData.forEach(car => {
        if (!brandPrices[car.Brand]) {
            brandPrices[car.Brand] = 0;
            brandCarCounts[car.Brand] = 0;
        }
        brandPrices[car.Brand] += car.Price;
        brandCarCounts[car.Brand]++;
    });
    const brandAvgPrices = Object.keys(brandPrices).map(brand => ({
        brand: brand,
        avgPrice: brandPrices[brand] / brandCarCounts[brand]
    }));
    const mostExpensiveBrand = brandAvgPrices.reduce((a, b) => a.avgPrice > b.avgPrice ? a : b);
    insights.push({
        icon: '<i class="bi bi-currency-dollar"></i>',
        title: 'Most Expensive Brand',
        value: mostExpensiveBrand.brand,
        description: `On average, ${mostExpensiveBrand.brand} vehicles cost ₹${formatNumber(Math.round(mostExpensiveBrand.avgPrice))}, making it the premium brand in this dataset.`
    });
    
    // Most Affordable Brand
    const mostAffordableBrand = brandAvgPrices.reduce((a, b) => a.avgPrice < b.avgPrice ? a : b);
    insights.push({
        icon: '<i class="bi bi-piggy-bank"></i>',
        title: 'Most Affordable Brand',
        value: mostAffordableBrand.brand,
        description: `${mostAffordableBrand.brand} offers the most affordable vehicles with an average price of ₹${formatNumber(Math.round(mostAffordableBrand.avgPrice))}.`
    });
    
    // Most Popular Fuel Type
    const fuelCounts = {};
    filteredData.forEach(car => {
        fuelCounts[car.Fuel_Type] = (fuelCounts[car.Fuel_Type] || 0) + 1;
    });
    const mostPopularFuel = Object.keys(fuelCounts).reduce((a, b) => fuelCounts[a] > fuelCounts[b] ? a : b);
    insights.push({
        icon: '<i class="bi bi-fuel-pump"></i>',
        title: 'Most Popular Fuel Type',
        value: mostPopularFuel,
        description: `${mostPopularFuel} is the most common fuel type with ${fuelCounts[mostPopularFuel]} vehicles, representing ${((fuelCounts[mostPopularFuel] / filteredData.length) * 100).toFixed(1)}% of the dataset.`
    });
    
    // Most Popular Transmission
    const transCounts = {};
    filteredData.forEach(car => {
        transCounts[car.Transmission] = (transCounts[car.Transmission] || 0) + 1;
    });
    const mostPopularTrans = Object.keys(transCounts).reduce((a, b) => transCounts[a] > transCounts[b] ? a : b);
    insights.push({
        icon: '<i class="bi bi-gear"></i>',
        title: 'Most Popular Transmission',
        value: mostPopularTrans,
        description: `${mostPopularTrans} transmission is the most preferred choice, found in ${transCounts[mostPopularTrans]} vehicles.`
    });
    
    // Most Common Body Type
    const bodyCounts = {};
    filteredData.forEach(car => {
        bodyCounts[car.Body_Type] = (bodyCounts[car.Body_Type] || 0) + 1;
    });
    const mostCommonBody = Object.keys(bodyCounts).reduce((a, b) => bodyCounts[a] > bodyCounts[b] ? a : b);
    insights.push({
        icon: '<i class="bi bi-car-front"></i>',
        title: 'Most Common Body Type',
        value: mostCommonBody,
        description: `${mostCommonBody} is the most popular body style with ${bodyCounts[mostCommonBody]} vehicles, indicating consumer preference for this category.`
    });
    
    // Highest Average Mileage Fuel Type
    const fuelMileage = {};
    const fuelMileageCounts = {};
    filteredData.forEach(car => {
        if (car.Mileage > 0) {
            if (!fuelMileage[car.Fuel_Type]) {
                fuelMileage[car.Fuel_Type] = 0;
                fuelMileageCounts[car.Fuel_Type] = 0;
            }
            fuelMileage[car.Fuel_Type] += car.Mileage;
            fuelMileageCounts[car.Fuel_Type]++;
        }
    });
    const fuelAvgMileage = Object.keys(fuelMileage).map(fuel => ({
        fuel: fuel,
        avgMileage: fuelMileage[fuel] / fuelMileageCounts[fuel]
    }));
    if (fuelAvgMileage.length > 0) {
        const bestMileageFuel = fuelAvgMileage.reduce((a, b) => a.avgMileage > b.avgMileage ? a : b);
        insights.push({
            icon: '<i class="bi bi-speedometer2"></i>',
            title: 'Best Mileage Fuel Type',
            value: bestMileageFuel.fuel,
            description: `${bestMileageFuel.fuel} vehicles deliver the highest average mileage at ${bestMileageFuel.avgMileage.toFixed(1)} km/l, making them the most fuel-efficient.`
        });
    }
    
    // Highest Average Power Brand
    const brandPower = {};
    const brandPowerCounts = {};
    filteredData.forEach(car => {
        if (!brandPower[car.Brand]) {
            brandPower[car.Brand] = 0;
            brandPowerCounts[car.Brand] = 0;
        }
        brandPower[car.Brand] += car.Power_BHP;
        brandPowerCounts[car.Brand]++;
    });
    const brandAvgPower = Object.keys(brandPower).map(brand => ({
        brand: brand,
        avgPower: brandPower[brand] / brandPowerCounts[brand]
    }));
    const highestPowerBrand = brandAvgPower.reduce((a, b) => a.avgPower > b.avgPower ? a : b);
    insights.push({
        icon: '<i class="bi bi-lightning-charge"></i>',
        title: 'Highest Average Power Brand',
        value: highestPowerBrand.brand,
        description: `${highestPowerBrand.brand} vehicles produce the highest average power at ${Math.round(highestPowerBrand.avgPower)} BHP, indicating performance orientation.`
    });
    
    // Most Recent Cars
    const years = filteredData.map(car => car.Year);
    const mostRecentYear = Math.max(...years);
    const recentCarCount = filteredData.filter(car => car.Year === mostRecentYear).length;
    insights.push({
        icon: '<i class="bi bi-calendar-check"></i>',
        title: 'Most Recent Cars',
        value: mostRecentYear.toString(),
        description: `The dataset contains ${recentCarCount} vehicles from ${mostRecentYear}, representing the latest models available.`
    });
    
    // Oldest Cars
    const oldestYear = Math.min(...years);
    const oldCarCount = filteredData.filter(car => car.Year === oldestYear).length;
    insights.push({
        icon: '<i class="bi bi-clock-history"></i>',
        title: 'Oldest Cars',
        value: oldestYear.toString(),
        description: `The earliest vehicles in the dataset are from ${oldestYear}, with ${oldCarCount} cars representing that era.`
    });
    
    return insights;
}

// Update Top Performers Lists
function updateTopLists() {
    updateTopExpensive();
    updateTopPowerful();
    updateTopEfficient();
    updateTopBrands();
    updateTopRecent();
}

// Update Top 10 Most Expensive Cars
function updateTopExpensive() {
    const container = document.getElementById('topExpensive');
    if (!container) return;
    
    const sortedCars = [...filteredData].sort((a, b) => b.Price - a.Price).slice(0, 10);
    
    container.innerHTML = sortedCars.map((car, index) => `
        <div class="top-item">
            <span class="rank">#${index + 1}</span>
            <span class="name">${car.Brand} ${car.Model}</span>
            <span class="value">₹${formatNumber(car.Price)}</span>
        </div>
    `).join('');
}

// Update Top 10 Most Powerful Cars
function updateTopPowerful() {
    const container = document.getElementById('topPowerful');
    if (!container) return;
    
    const sortedCars = [...filteredData].sort((a, b) => b.Power_BHP - a.Power_BHP).slice(0, 10);
    
    container.innerHTML = sortedCars.map((car, index) => `
        <div class="top-item">
            <span class="rank">#${index + 1}</span>
            <span class="name">${car.Brand} ${car.Model}</span>
            <span class="value">${car.Power_BHP} BHP</span>
        </div>
    `).join('');
}

// Update Top 10 Most Fuel-Efficient Cars
function updateTopEfficient() {
    const container = document.getElementById('topEfficient');
    if (!container) return;
    
    const efficientCars = filteredData.filter(car => car.Mileage > 0);
    const sortedCars = [...efficientCars].sort((a, b) => b.Mileage - a.Mileage).slice(0, 10);
    
    container.innerHTML = sortedCars.map((car, index) => `
        <div class="top-item">
            <span class="rank">#${index + 1}</span>
            <span class="name">${car.Brand} ${car.Model}</span>
            <span class="value">${car.Mileage} km/l</span>
        </div>
    `).join('');
}

// Update Top 10 Popular Brands
function updateTopBrands() {
    const container = document.getElementById('topBrands');
    if (!container) return;
    
    const brandCounts = {};
    filteredData.forEach(car => {
        brandCounts[car.Brand] = (brandCounts[car.Brand] || 0) + 1;
    });
    
    const sortedBrands = Object.entries(brandCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    container.innerHTML = sortedBrands.map((item, index) => `
        <div class="top-item">
            <span class="rank">#${index + 1}</span>
            <span class="name">${item[0]}</span>
            <span class="value">${item[1]} cars</span>
        </div>
    `).join('');
}

// Update Top 10 Most Recent Cars
function updateTopRecent() {
    const container = document.getElementById('topRecent');
    if (!container) return;
    
    const sortedCars = [...filteredData].sort((a, b) => b.Year - a.Year || b.Price - a.Price).slice(0, 10);
    
    container.innerHTML = sortedCars.map((car, index) => `
        <div class="top-item">
            <span class="rank">#${index + 1}</span>
            <span class="name">${car.Brand} ${car.Model}</span>
            <span class="value">${car.Year}</span>
        </div>
    `).join('');
}

// Update Fuel Statistics Section
function updateFuelStats() {
    const container = document.getElementById('fuelStats');
    if (!container) return;
    
    const fuelStats = {};
    filteredData.forEach(car => {
        if (!fuelStats[car.Fuel_Type]) {
            fuelStats[car.Fuel_Type] = {
                count: 0,
                totalPrice: 0,
                totalMileage: 0,
                totalPower: 0,
                mileageCount: 0
            };
        }
        fuelStats[car.Fuel_Type].count++;
        fuelStats[car.Fuel_Type].totalPrice += car.Price;
        fuelStats[car.Fuel_Type].totalPower += car.Power_BHP;
        
        if (car.Mileage > 0) {
            fuelStats[car.Fuel_Type].totalMileage += car.Mileage;
            fuelStats[car.Fuel_Type].mileageCount++;
        }
    });
    
    container.innerHTML = Object.keys(fuelStats).map(fuel => {
        const stats = fuelStats[fuel];
        const avgPrice = stats.totalPrice / stats.count;
        const avgPower = stats.totalPower / stats.count;
        const avgMileage = stats.mileageCount > 0 ? stats.totalMileage / stats.mileageCount : 0;
        
        return `
            <div class="fuel-stat-item">
                <h6>${fuel}</h6>
                <div class="value">${stats.count}</div>
                <div class="sub-value">₹${formatNumber(Math.round(avgPrice))} avg</div>
                <div class="sub-value">${avgMileage > 0 ? avgMileage.toFixed(1) + ' km/l' : 'N/A'} mileage</div>
                <div class="sub-value">${Math.round(avgPower)} BHP avg</div>
            </div>
        `;
    }).join('');
}

// Helper function to format numbers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Export functions for use in other modules
window.generateAllInsights = generateAllInsights;
window.updateTopLists = updateTopLists;