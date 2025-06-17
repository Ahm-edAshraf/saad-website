// VetSync VCMS JavaScript

// Global state
let currentScreen = 'dashboard';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Ensure login screen is shown initially
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('main-app').classList.remove('active');
    
    initializeCalendar();
    initializeCharts();
    setupEventListeners();
});

// Authentication
function login(event) {
    event.preventDefault();
    
    // Simple validation (in real app, this would be actual authentication)
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    
    if (email && password) {
        showToast('Login successful!', 'success');
        
        // Transition to main app
        setTimeout(() => {
            console.log('Transitioning to main app...');
            const loginScreen = document.getElementById('login-screen');
            const mainApp = document.getElementById('main-app');
            
            loginScreen.classList.remove('active');
            mainApp.classList.add('active');
            
            console.log('Login screen active:', loginScreen.classList.contains('active'));
            console.log('Main app active:', mainApp.classList.contains('active'));
        }, 1500);
    } else {
        showToast('Please enter both email and password', 'error');
    }
}

function forgotPassword() {
    showToast('Password reset link sent to your email!', 'success');
}

function signUp() {
    showToast('Sign up feature coming soon!', 'info');
}

function logout() {
    showToast('Logged out successfully', 'success');
    
    setTimeout(() => {
        document.getElementById('main-app').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
        
        // Reset form
        document.querySelector('.login-form').reset();
    }, 1000);
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Navigation
function showScreen(screenName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    event.target.closest('.nav-link').classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(`${screenName}-content`).classList.add('active');
    
    currentScreen = screenName;
    
    // Initialize screen-specific functionality
    if (screenName === 'reports') {
        setTimeout(initializeCharts, 100);
    }
}

// Calendar functionality
function initializeCalendar() {
    generateCalendar();
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    document.getElementById('calendar-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.className = 'calendar-day-header';
        dayHeader.style.fontWeight = '600';
        dayHeader.style.color = 'var(--neutral-medium)';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.padding = 'var(--spacing-sm)';
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.className = 'calendar-day';
        dayElement.addEventListener('click', () => selectDate(day));
        
        // Highlight today
        const today = new Date();
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayElement.style.background = 'var(--accent)';
            dayElement.style.color = 'white';
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

function selectDate(day) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked day
    event.target.classList.add('selected');
    selectedDate = new Date(currentYear, currentMonth, day);
    
    showToast(`Selected ${selectedDate.toLocaleDateString()}`, 'success');
}

// Modal functionality
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Patient functionality
function openPatientDetail(patientId) {
    // In a real app, this would fetch patient data
    const patientNames = {
        'fluffy': 'Fluffy',
        'max': 'Max',
        'bella': 'Bella'
    };
    
    document.getElementById('patient-name').textContent = patientNames[patientId] || 'Unknown';
    openModal('patient-detail-modal');
}

function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Search functionality
function searchPatients(query) {
    const patientCards = document.querySelectorAll('.patient-card');
    
    patientCards.forEach(card => {
        const patientName = card.querySelector('h3').textContent.toLowerCase();
        const ownerName = card.querySelector('.owner').textContent.toLowerCase();
        
        if (patientName.includes(query.toLowerCase()) || 
            ownerName.includes(query.toLowerCase())) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchInventory(query) {
    const rows = document.querySelectorAll('.inventory-table tbody tr');
    
    rows.forEach(row => {
        const itemName = row.cells[1].textContent.toLowerCase();
        const category = row.cells[2].textContent.toLowerCase();
        
        if (itemName.includes(query.toLowerCase()) || 
            category.includes(query.toLowerCase())) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Inventory management
function editQty(element) {
    const currentValue = element.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.className = 'form-control';
    input.style.width = '80px';
    input.style.padding = '4px 8px';
    
    input.addEventListener('blur', function() {
        element.textContent = this.value;
        element.style.display = 'table-cell';
        this.remove();
        showToast('Quantity updated', 'success');
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });
    
    element.style.display = 'none';
    element.parentNode.appendChild(input);
    input.focus();
}

function editReorder(element) {
    const currentValue = element.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.className = 'form-control';
    input.style.width = '80px';
    input.style.padding = '4px 8px';
    
    input.addEventListener('blur', function() {
        element.textContent = this.value;
        element.style.display = 'table-cell';
        this.remove();
        showToast('Reorder level updated', 'success');
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
        }
    });
    
    element.style.display = 'none';
    element.parentNode.appendChild(input);
    input.focus();
}

// Billing functionality
function calculateTotal() {
    const subtotal = 250.00;
    const tax = 15.00;
    const discountInput = document.querySelector('.discount-input');
    const discount = parseFloat(discountInput.value) || 0;
    
    const total = subtotal + tax - discount;
    document.getElementById('grand-total').textContent = `RM ${total.toFixed(2)}`;
}

function createNewInvoice() {
    showToast('New invoice created', 'success');
    // In a real app, this would open a form or modal
}

// Charts initialization
function initializeCharts() {
    // Appointments Chart
    const appointmentsCtx = document.getElementById('appointments-chart');
    if (appointmentsCtx) {
        new Chart(appointmentsCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Appointments',
                    data: [85, 92, 78, 95, 110, 88, 102, 96, 108, 115, 89, 98],
                    backgroundColor: '#2D9CDB',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#E0E0E0',
                            borderDash: [2, 2]
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenue-chart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue (RM)',
                    data: [12800, 14200, 11900, 15600, 17800, 13400, 16200, 15100, 17500, 18900, 14700, 16800],
                    borderColor: '#27AE60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#E0E0E0',
                            borderDash: [2, 2]
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Medications Chart
    const medicationsCtx = document.getElementById('medications-chart');
    if (medicationsCtx) {
        new Chart(medicationsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Antibiotics', 'Vaccines', 'Pain Relief', 'Vitamins', 'Others'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: [
                        '#2D9CDB',
                        '#27AE60',
                        '#F2C94C',
                        '#EB5757',
                        '#828282'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        case 'error': return 'fas fa-times-circle';
        default: return 'fas fa-info-circle';
    }
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Event listeners setup
function setupEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const modalId = event.target.id;
            closeModal(modalId);
        }
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Form submissions
    document.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (event.target.classList.contains('appointment-form')) {
            showToast('Appointment saved successfully!', 'success');
            closeModal('new-appointment-modal');
        }
        
        if (event.target.classList.contains('patient-form')) {
            showToast('Patient information updated!', 'success');
        }
    });
    
    // Add some demo interactions
    setTimeout(() => {
        if (document.getElementById('login-screen').classList.contains('active')) {
            showToast('Welcome to VetSync VCMS! Use any email/password to login.', 'info');
        }
    }, 1000);
}

// Demo data and interactions
function addDemoInteractions() {
    // Simulate real-time updates
    setInterval(() => {
        if (currentScreen === 'dashboard') {
            // Randomly update some stats
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                if (Math.random() > 0.95) { // 5% chance each second
                    const currentValue = parseInt(stat.textContent.replace(/[^\d]/g, ''));
                    const change = Math.random() > 0.5 ? 1 : -1;
                    const newValue = Math.max(0, currentValue + change);
                    
                    if (stat.textContent.includes('RM')) {
                        stat.textContent = `RM ${newValue.toLocaleString()}`;
                    } else {
                        stat.textContent = newValue.toString();
                    }
                    
                    // Add pulse animation
                    stat.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        stat.style.animation = '';
                    }, 500);
                }
            });
        }
    }, 1000);
}

// Add pulse animation
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyle);

// Initialize demo interactions
addDemoInteractions();

// Additional utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatCurrency(amount) {
    return `RM ${amount.toFixed(2)}`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Mobile Tab Switching for Pet Portal
function showMobileTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.footer-nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.footer-nav-item').classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.mobile-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`mobile-${tabName}-tab`).classList.add('active');
    
    // Update header title
    const titles = {
        'home': 'My Pets',
        'appointments': 'My Appointments',
        'records': 'Medical Records',
        'profile': 'Pet Profile'
    };
    
    const headerTitle = document.querySelector('.mobile-header h2');
    if (headerTitle) {
        headerTitle.textContent = titles[tabName] || 'My Pets';
    }
    
    // Add smooth transition effect
    const activeTab = document.getElementById(`mobile-${tabName}-tab`);
    if (activeTab) {
        activeTab.style.animation = 'slideInUp 0.3s ease-out';
        setTimeout(() => {
            activeTab.style.animation = '';
        }, 300);
    }
}

// Add slide in animation
const slideInStyle = document.createElement('style');
slideInStyle.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(slideInStyle);

// Export functions for global access
window.VetSync = {
    login,
    logout,
    togglePassword,
    showScreen,
    openModal,
    closeModal,
    openPatientDetail,
    showTab,
    searchPatients,
    searchInventory,
    editQty,
    editReorder,
    calculateTotal,
    createNewInvoice,
    previousMonth,
    nextMonth,
    showToast,
    showMobileTab
};

// Make functions globally available
Object.assign(window, window.VetSync); 