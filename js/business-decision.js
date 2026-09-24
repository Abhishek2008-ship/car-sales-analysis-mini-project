// ==========================================
// CarTrend Analytics - Business Decision
// Business Intelligence Dashboard
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Wait for the global carData array to be populated by script.js
    const checkData = setInterval(() => {
        if (typeof carData !== 'undefined' && carData.length > 0) {
            clearInterval(checkData);
            initBusinessDecision(carData);
        }
    }, 100);
});

function initBusinessDecision(data) {
    if (!document.getElementById('boTotalSales')) return;

    // Aggregations
    const stats = aggregateData(data);

    renderKPIs(stats);
    renderPerformanceChart(data);
    generateDecisionEngine(stats);
    renderFuelTypeDecisions(stats);
    renderBodyTypeDecisions(stats);
    renderBrandDecisions(stats);
    generateRecommendations(stats);
    generateExecutiveSummary(stats);
}

function aggregateData(data) {
    const totalSales = data.length;
    const totalRevenue = data.reduce((sum, car) => sum + (car.Price || 0), 0);
    
    const brandMap = {};
    const modelMap = {};
    const fuelMap = {};
    const bodyMap = {};

    data.forEach(car => {
        const brand = car.Brand || 'Unknown';
        const model = car.Model || 'Unknown';
        const fuel = car.Fuel_Type || 'Unknown';
        const body = car.Body_Type || 'Unknown';
        const price = car.Price || 0;

        if (!brandMap[brand]) brandMap[brand] = { name: brand, sales: 0, revenue: 0 };
        brandMap[brand].sales += 1;
        brandMap[brand].revenue += price;

        if (!modelMap[model]) modelMap[model] = { name: model, sales: 0, revenue: 0, brand: brand };
        modelMap[model].sales += 1;
        modelMap[model].revenue += price;

        if (!fuelMap[fuel]) fuelMap[fuel] = { name: fuel, sales: 0, revenue: 0 };
        fuelMap[fuel].sales += 1;
        fuelMap[fuel].revenue += price;

        if (!bodyMap[body]) bodyMap[body] = { name: body, sales: 0, revenue: 0 };
        bodyMap[body].sales += 1;
        bodyMap[body].revenue += price;
    });

    return {
        totalSales,
        totalRevenue,
        brands: Object.values(brandMap).sort((a,b) => b.revenue - a.revenue),
        models: Object.values(modelMap).sort((a,b) => b.revenue - a.revenue),
        fuels: Object.values(fuelMap).sort((a,b) => b.revenue - a.revenue),
        bodies: Object.values(bodyMap).sort((a,b) => b.revenue - a.revenue)
    };
}

function formatCurrency(val) {
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + ' L';
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatPercent(val) {
    return (val * 100).toFixed(1) + '%';
}

function renderKPIs(stats) {
    document.getElementById('boTotalSales').innerText = stats.totalSales.toLocaleString('en-IN');
    document.getElementById('boTotalRevenue').innerText = formatCurrency(stats.totalRevenue);
    document.getElementById('boNumBrands').innerText = stats.brands.length;
    document.getElementById('boNumModels').innerText = stats.models.length;
    
    document.getElementById('boBestBrand').innerText = stats.brands[0]?.name || '-';
    document.getElementById('boBestModel').innerText = stats.models[0]?.name || '-';
}

function renderPerformanceChart(data) {
    const yearStats = {};
    data.forEach(car => {
        const y = car.Year;
        if (!y) return;
        if (!yearStats[y]) yearStats[y] = 0;
        yearStats[y] += car.Price;
    });

    const years = Object.keys(yearStats).sort();
    const revenues = years.map(y => yearStats[y]);

    const ctx = document.getElementById('bdPerformanceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Revenue (₹)',
                data: revenues,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => 'Revenue: ' + formatCurrency(ctx.raw)
                    }
                }
            }
        }
    });
}

function generateDecisionEngine(stats) {
    const container = document.getElementById('bdDecisionEngine');
    if (!container || stats.brands.length === 0) return;

    const top = stats.brands[0];
    const mid = stats.brands[Math.floor(stats.brands.length / 2)];
    const bot = stats.brands[stats.brands.length - 1];

    container.innerHTML = `
        <div class="col-md-4">
            <div class="decision-card h-100 border-success">
                <span class="grow-badge mb-3 d-inline-block"><i class="bi bi-graph-up-arrow"></i> INCREASE FOCUS</span>
                <h4 class="mt-2">${top.name}</h4>
                <p><strong>Sales:</strong> ${top.sales.toLocaleString('en-IN')}</p>
                <p><strong>Contribution:</strong> ${formatPercent(top.revenue / stats.totalRevenue)}</p>
                <hr>
                <p class="text-muted"><strong>DECISION:</strong> Increase inventory and marketing focus for this category because it contributes strongly to total sales.</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="decision-card h-100 border-warning">
                <span class="review-badge mb-3 d-inline-block"><i class="bi bi-tools"></i> OPTIMIZE</span>
                <h4 class="mt-2">${mid.name}</h4>
                <p><strong>Sales:</strong> ${mid.sales.toLocaleString('en-IN')}</p>
                <p><strong>Contribution:</strong> ${formatPercent(mid.revenue / stats.totalRevenue)}</p>
                <hr>
                <p class="text-muted"><strong>DECISION:</strong> Optimize pricing, promotions and inventory allocation to improve sales contribution.</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="decision-card h-100 border-danger">
                <span class="watch-badge mb-3 d-inline-block"><i class="bi bi-exclamation-triangle"></i> REDUCE / REVIEW</span>
                <h4 class="mt-2">${bot.name}</h4>
                <p><strong>Sales:</strong> ${bot.sales.toLocaleString('en-IN')}</p>
                <p><strong>Contribution:</strong> ${formatPercent(bot.revenue / stats.totalRevenue)}</p>
                <hr>
                <p class="text-muted"><strong>DECISION:</strong> Review inventory allocation and customer demand before increasing investment.</p>
            </div>
        </div>
    `;
}

function renderFuelTypeDecisions(stats) {
    const tbody = document.getElementById('bdFuelTypeTableBody');
    if (!tbody) return;

    tbody.innerHTML = stats.fuels.map((f, i) => {
        const contrib = f.revenue / stats.totalRevenue;
        let status, action, color;
        if (i === 0) {
            status = 'INCREASE FOCUS'; action = 'Expand allocation significantly.'; color = 'text-success';
        } else if (i === stats.fuels.length - 1) {
            status = 'REVIEW'; action = 'Monitor demand trends.'; color = 'text-danger';
        } else {
            status = 'MAINTAIN'; action = 'Optimize current offerings.'; color = 'text-warning';
        }

        return `
            <tr>
                <td class="fw-bold">${f.name}</td>
                <td>${f.sales.toLocaleString('en-IN')}</td>
                <td>${formatPercent(contrib)}</td>
                <td>${formatCurrency(f.revenue / f.sales)}</td>
                <td class="${color} fw-bold">${status}</td>
                <td>${action}</td>
            </tr>
        `;
    }).join('');
}

function renderBodyTypeDecisions(stats) {
    const topTable = document.getElementById('bdTopBodyTypeTable');
    const botTable = document.getElementById('bdBottomBodyTypeTable');
    if (!topTable || !botTable) return;

    const tops = stats.bodies.slice(0, 3);
    const bots = [...stats.bodies].reverse().slice(0, 3);

    topTable.innerHTML = tops.map(b => `
        <tr>
            <td class="fw-bold">${b.name}</td>
            <td>${b.sales}</td>
            <td>${formatPercent(b.revenue / stats.totalRevenue)}</td>
            <td class="text-success small">Prioritize inventory and replicate successful sales strategy.</td>
        </tr>
    `).join('');

    botTable.innerHTML = bots.map(b => `
        <tr>
            <td class="fw-bold">${b.name}</td>
            <td>${b.sales}</td>
            <td>${formatPercent(b.revenue / stats.totalRevenue)}</td>
            <td class="text-danger small">Investigate demand and product availability before increasing allocation.</td>
        </tr>
    `).join('');
}

function renderBrandDecisions(stats) {
    const topTable = document.getElementById('bdTopBrandsTable');
    const botTable = document.getElementById('bdBottomBrandsTable');
    if (!topTable || !botTable) return;

    const tops = stats.brands.slice(0, 5);
    const bots = [...stats.brands].reverse().slice(0, 5);

    topTable.innerHTML = tops.map(b => `
        <tr>
            <td class="fw-bold">${b.name}</td>
            <td>${b.sales}</td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="me-2">${formatPercent(b.revenue / stats.totalRevenue)}</span>
                    <div class="progress w-100" style="height:6px"><div class="progress-bar bg-primary" style="width: ${(b.revenue / stats.totalRevenue)*100}%"></div></div>
                </div>
            </td>
            <td class="text-success small">Accelerate marketing and stock.</td>
        </tr>
    `).join('');

    botTable.innerHTML = bots.map(b => `
        <tr>
            <td class="fw-bold">${b.name}</td>
            <td>${b.sales}</td>
            <td>${formatPercent(b.revenue / stats.totalRevenue)}</td>
            <td class="text-danger small">Analyze pricing or reduce stock.</td>
        </tr>
    `).join('');
}

function generateRecommendations(stats) {
    const list = document.getElementById('bdManagementRecommendations');
    if (!list) return;

    list.innerHTML = `
        <li class="list-group-item py-3"><i class="bi bi-1-circle text-primary me-2"></i> Increase focus on the highest-selling brand (<strong>${stats.brands[0]?.name}</strong>) to maximize existing market traction.</li>
        <li class="list-group-item py-3"><i class="bi bi-2-circle text-primary me-2"></i> Increase inventory allocation for the strongest-performing model (<strong>${stats.models[0]?.name}</strong>).</li>
        <li class="list-group-item py-3"><i class="bi bi-3-circle text-primary me-2"></i> Review the low-performing category (<strong>${stats.brands[stats.brands.length-1]?.name}</strong>) and assess long-term viability.</li>
        <li class="list-group-item py-3"><i class="bi bi-4-circle text-primary me-2"></i> Focus marketing campaigns on the highest-revenue fuel type segment (<strong>${stats.fuels[0]?.name}</strong>).</li>
        <li class="list-group-item py-3"><i class="bi bi-5-circle text-primary me-2"></i> Replicate successful sales strategies from the top body-type segment (<strong>${stats.bodies[0]?.name}</strong>) to underperforming segments.</li>
    `;
}

function generateExecutiveSummary(stats) {
    const container = document.getElementById('bdExecutiveSummary');
    if (!container) return;

    container.innerHTML = `
        <div class="row g-4">
            <div class="col-md-4">
                <div class="p-3 bg-light rounded text-center h-100 border">
                    <div class="fs-1">🏆</div>
                    <div class="small text-muted mt-2">BEST PERFORMING BRAND</div>
                    <div class="fs-4 fw-bold text-success">${stats.brands[0]?.name}</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 bg-light rounded text-center h-100 border">
                    <div class="fs-1">🚗</div>
                    <div class="small text-muted mt-2">BEST SELLING MODEL</div>
                    <div class="fs-4 fw-bold text-primary">${stats.models[0]?.name}</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 bg-light rounded text-center h-100 border">
                    <div class="fs-1">⚠️</div>
                    <div class="small text-muted mt-2">CATEGORY TO REVIEW</div>
                    <div class="fs-4 fw-bold text-danger">${stats.bodies[stats.bodies.length-1]?.name}</div>
                </div>
            </div>
        </div>
        <hr class="my-4">
        <p class="fs-5 text-center">
            "Based on current sales performance, management should prioritize high-performing categories like <strong>${stats.brands[0]?.name}</strong> and <strong>${stats.fuels[0]?.name} vehicles</strong>, optimize medium-performing segments, and review consistently low-performing categories."
        </p>
    `;
}
