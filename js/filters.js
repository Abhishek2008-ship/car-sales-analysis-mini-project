// ==========================================
// CarTrend Analytics - Filters and Table
// Car Explorer, Search, Sort, Pagination
// ==========================================

// Update Car Table
function updateCarTable() {
    const tableBody = document.getElementById('carsTableBody');
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    
    if (!tableBody) return;
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const currentData = filteredData.slice(startIndex, endIndex);
    
    // Update counts
    showingCount.textContent = currentData.length;
    totalCount.textContent = filteredData.length;
    
    // Clear table
    tableBody.innerHTML = '';
    
    if (currentData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10" class="text-center">No cars found matching your criteria</td></tr>';
        updatePagination(0);
        return;
    }
    
    // Populate table
    currentData.forEach(car => {
        const row = document.createElement('tr');
        
        // Determine badge class based on fuel type
        let fuelBadgeClass = 'bg-primary';
        if (car.Fuel_Type === 'Petrol') fuelBadgeClass = 'fuel-petrol';
        else if (car.Fuel_Type === 'Diesel') fuelBadgeClass = 'fuel-diesel';
        else if (car.Fuel_Type === 'Electric') fuelBadgeClass = 'fuel-electric';
        else if (car.Fuel_Type === 'Hybrid') fuelBadgeClass = 'fuel-hybrid';
        
        row.innerHTML = `
            <td><strong>${car.Brand}</strong></td>
            <td>${car.Model}</td>
            <td>${car.Year}</td>
            <td>₹${formatNumber(car.Price)}</td>
            <td><span class="badge ${fuelBadgeClass}">${car.Fuel_Type}</span></td>
            <td>${car.Transmission}</td>
            <td>${car.Mileage > 0 ? car.Mileage + ' km/l' : 'N/A'}</td>
            <td>${car.Engine_CC > 0 ? car.Engine_CC + ' CC' : 'N/A'}</td>
            <td>${car.Power_BHP > 0 ? car.Power_BHP + ' BHP' : 'N/A'}</td>
            <td><span class="badge bg-secondary">${car.Body_Type}</span></td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update pagination
    updatePagination(totalPages);
}

// Update Pagination
function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>`;
    pagination.appendChild(prevLi);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
        pagination.appendChild(firstLi);
        
        if (startPage > 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = `<a class="page-link" href="#">...</a>`;
            pagination.appendChild(ellipsisLi);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageLi);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = `<a class="page-link" href="#">...</a>`;
            pagination.appendChild(ellipsisLi);
        }
        
        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>`;
        pagination.appendChild(lastLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>`;
    pagination.appendChild(nextLi);
    
    // Add click event listeners
    pagination.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                currentPage = page;
                updateCarTable();
                // Scroll to top of table
                document.getElementById('car-explorer').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Helper function to format numbers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Export functions for use in other modules
window.updateCarTable = updateCarTable;