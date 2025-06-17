// VetSync VCMS JavaScript - Full Functionality Version

// Global state
let currentScreen = 'dashboard';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;

// Data Storage (temporary until page reload)
let appData = {
    patients: [
        {
            id: 'fluffy',
            name: 'Fluffy',
            species: 'Cat',
            breed: 'Persian',
            age: '3 years old',
            owner: 'Mrs. Johnson',
            ownerPhone: '(555) 987-6543',
            ownerEmail: 'sarah.johnson@email.com',
            lastVisit: 'Dec 15, 2024',
            status: 'healthy',
            weight: '4.2 kg',
            dateOfBirth: '2021-03-15',
            microchipId: '982000123456789',
            insurance: 'PetPlan Premium',
            address: '456 Owner Avenue, Pet Town, PC 12345'
        },
        {
            id: 'max',
            name: 'Max',
            species: 'Dog',
            breed: 'Golden Retriever',
            age: '5 years old',
            owner: 'Mr. Brown',
            ownerPhone: '(555) 123-4567',
            ownerEmail: 'brown@email.com',
            lastVisit: 'Dec 10, 2024',
            status: 'treatment',
            weight: '32.5 kg',
            dateOfBirth: '2019-08-20',
            microchipId: '982000987654321',
            insurance: 'VetCare Basic',
            address: '789 Dog Street, Pet Town, PC 12345'
        },
        {
            id: 'bella',
            name: 'Bella',
            species: 'Rabbit',
            breed: 'Holland Lop',
            age: '2 years old',
            owner: 'Ms. Davis',
            ownerPhone: '(555) 456-7890',
            ownerEmail: 'davis@email.com',
            lastVisit: 'Dec 8, 2024',
            status: 'healthy',
            weight: '1.8 kg',
            dateOfBirth: '2022-04-12',
            microchipId: '982000112233445',
            insurance: 'None',
            address: '321 Rabbit Road, Pet Town, PC 12345'
        }
    ],
    appointments: [
        {
            id: 'apt001',
            time: '9:00 AM',
            petName: 'Fluffy (Cat)',
            owner: 'Mrs. Johnson',
            vet: 'Dr. Smith',
            status: 'confirmed',
            date: new Date().toISOString().split('T')[0],
            notes: 'Annual checkup'
        },
        {
            id: 'apt002',
            time: '10:30 AM',
            petName: 'Max (Dog)',
            owner: 'Mr. Brown',
            vet: 'Dr. Williams',
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            notes: 'Follow-up treatment'
        },
        {
            id: 'apt003',
            time: '2:00 PM',
            petName: 'Bella (Rabbit)',
            owner: 'Ms. Davis',
            vet: 'Dr. Smith',
            status: 'confirmed',
            date: new Date().toISOString().split('T')[0],
            notes: 'Routine checkup'
        }
    ],
    inventory: [
        {
            id: 'MED001',
            name: 'Antibiotics - Amoxicillin',
            category: 'Medications',
            quantity: 5,
            reorderLevel: 20,
            status: 'low-stock'
        },
        {
            id: 'VAC002',
            name: 'Rabies Vaccine',
            category: 'Vaccines',
            quantity: 2,
            reorderLevel: 10,
            status: 'low-stock'
        },
        {
            id: 'SUP003',
            name: 'Surgical Gloves',
            category: 'Supplies',
            quantity: 150,
            reorderLevel: 50,
            status: 'in-stock'
        },
        {
            id: 'EQP004',
            name: 'Digital Thermometer',
            category: 'Equipment',
            quantity: 8,
            reorderLevel: 3,
            status: 'in-stock'
        }
    ],
    invoices: [],
    prescriptions: [],
    nextId: {
        patient: 4,
        appointment: 4,
        inventory: 5,
        invoice: 1,
        prescription: 1
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('main-app').classList.remove('active');
    
    initializeCalendar();
    initializeCharts();
    setupEventListeners();
    updateDashboardStats();
    renderPatients();
    renderAppointments();
    renderInventory();
    renderCalendarAppointments();
    initializeBilling();
});

// Authentication
function login(event) {
    event.preventDefault();
    
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    
    if (email && password) {
        showToast('Login successful!', 'success');
        
        setTimeout(() => {
            const loginScreen = document.getElementById('login-screen');
            const mainApp = document.getElementById('main-app');
            
            loginScreen.classList.remove('active');
            mainApp.classList.add('active');
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
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    event.target.closest('.nav-link').classList.add('active');
    
    document.querySelectorAll('.content-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(`${screenName}-content`).classList.add('active');
    
    currentScreen = screenName;
    
    if (screenName === 'reports') {
        setTimeout(initializeCharts, 100);
    } else if (screenName === 'patients') {
        renderPatients();
    } else if (screenName === 'appointments') {
        renderAppointments();
    } else if (screenName === 'inventory') {
        renderInventory();
    } else if (screenName === 'billing') {
        initializeBilling();
    } else if (screenName === 'dashboard') {
        updateDashboardStats();
    }
}

// Calendar functionality
function initializeCalendar() {
    generateCalendar();
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthElement = document.getElementById('calendar-month');
    if (monthElement) {
        monthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    calendarGrid.innerHTML = '';
    
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
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.className = 'calendar-day';
        dayElement.addEventListener('click', () => selectDate(day));
        
        // Check for appointments on this day
        const currentDate = new Date(currentYear, currentMonth, day);
        const dateString = currentDate.toISOString().split('T')[0];
        const dayAppointments = appData.appointments.filter(apt => apt.date === dateString);
        
        if (dayAppointments.length > 0) {
            dayElement.style.background = '#667eea';
            dayElement.style.color = 'white';
            dayElement.style.fontWeight = 'bold';
            dayElement.title = `${dayAppointments.length} appointment(s)`;
        }
        
        const today = new Date();
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayElement.style.background = 'var(--accent)';
            dayElement.style.color = 'white';
            dayElement.style.border = '2px solid #fff';
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function renderCalendarAppointments() {
    generateCalendar(); // Regenerate calendar to show appointments
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
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
    selectedDate = new Date(currentYear, currentMonth, day);
    
    showToast(`Selected ${selectedDate.toLocaleDateString()}`, 'success');
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    document.body.style.overflow = 'hidden';
        
        // Pre-populate forms
        if (modalId === 'new-appointment-modal') {
            const today = new Date().toISOString().split('T')[0];
            const dateInput = modal.querySelector('input[type="date"]');
            if (dateInput) dateInput.value = today;
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    document.body.style.overflow = 'auto';
        
        // Reset forms
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }
}

// Patient functionality
function openPatientDetail(patientId) {
    const patient = appData.patients.find(p => p.id === patientId);
    if (patient) {
        document.getElementById('patient-name').textContent = patient.name;
        
        // Populate patient form
        const form = document.querySelector('#profile-tab .patient-form');
        if (form) {
            form.querySelector('input[type="text"]').value = patient.name;
            form.querySelector('select').value = patient.species;
            form.querySelectorAll('input')[1].value = patient.breed;
            form.querySelector('input[type="date"]').value = patient.dateOfBirth;
            form.querySelectorAll('input')[3].value = `${patient.owner} - ${patient.ownerPhone}`;
        }
        
        // Initialize history if it doesn't exist
        if (!patient.history) {
            patient.history = [
                {
                    date: 'Dec 15, 2024',
                    title: 'Annual Vaccination',
                    description: 'Administered rabies vaccine. Pet is in excellent health.',
                    vet: 'Dr. Smith'
                },
                {
                    date: 'Jun 10, 2024',
                    title: 'Routine Checkup',
                    description: 'General health examination. Weight: 4.2kg. All vital signs normal.',
                    vet: 'Dr. Williams'
                }
            ];
        }
        
        // Initialize prescriptions if it doesn't exist
        if (!patient.prescriptions) {
            patient.prescriptions = [
                {
                    date: 'Dec 15, 2024',
                    medication: 'Amoxicillin',
                    dosage: '50mg',
                    quantity: '14 tablets',
                    instructions: 'Twice daily with food'
                }
            ];
        }
        
        renderPatientHistory(patient);
        renderPatientPrescriptions(patient);
    openModal('patient-detail-modal');
    }
}

function savePatientChanges() {
    const patientName = document.getElementById('patient-name').textContent;
    const patient = appData.patients.find(p => p.name === patientName);
    
    if (patient) {
        const form = document.querySelector('#profile-tab .patient-form');
        patient.name = form.querySelector('input[type="text"]').value;
        patient.species = form.querySelector('select').value;
        patient.breed = form.querySelectorAll('input')[1].value;
        patient.dateOfBirth = form.querySelector('input[type="date"]').value;
        
        // Calculate age from date of birth (allowing dates before 2021)
        const birthDate = new Date(patient.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        patient.age = `${Math.max(0, age)} years old`;
        
        renderPatients();
        showToast('Patient information updated successfully!', 'success');
        closeModal('patient-detail-modal');
    }
}

function addPatientHistory() {
    const patientName = document.getElementById('patient-name').textContent;
    const patient = appData.patients.find(p => p.name === patientName);
    
    if (patient) {
        if (!patient.history) patient.history = [];
        
        const newEntry = {
            date: new Date().toLocaleDateString(),
            title: 'New Medical Entry',
            description: 'Click to edit this entry',
            vet: 'Dr. Smith'
        };
        
        patient.history.unshift(newEntry);
        renderPatientHistory(patient);
        showToast('New history entry added!', 'success');
    }
}

function renderPatientHistory(patient) {
    const timeline = document.querySelector('#history-tab .history-timeline');
    if (!timeline || !patient.history) return;
    
    const historyHtml = patient.history.map((entry, index) => `
        <div class="timeline-item" onclick="editHistoryEntry(${index})">
            <div class="timeline-date">${entry.date}</div>
            <div class="timeline-content">
                <h4 contenteditable="true" onblur="updateHistoryEntry(${index}, 'title', this.textContent)">${entry.title}</h4>
                <p contenteditable="true" onblur="updateHistoryEntry(${index}, 'description', this.textContent)">${entry.description}</p>
                <p><strong>Veterinarian:</strong> <span contenteditable="true" onblur="updateHistoryEntry(${index}, 'vet', this.textContent)">${entry.vet}</span></p>
            </div>
        </div>
    `).join('');
    
    timeline.innerHTML = `
        <button class="btn btn-primary mb-3" onclick="addPatientHistory()">
            <i class="fas fa-plus"></i> Add History Entry
        </button>
    ` + historyHtml;
}

function updateHistoryEntry(index, field, value) {
    const patientName = document.getElementById('patient-name').textContent;
    const patient = appData.patients.find(p => p.name === patientName);
    
    if (patient && patient.history && patient.history[index]) {
        patient.history[index][field] = value;
        showToast('History updated!', 'success');
    }
}

function renderPatientPrescriptions(patient) {
    const prescriptionsTable = document.querySelector('#prescriptions-tab .prescriptions-table tbody');
    if (!prescriptionsTable) return;
    
    const prescriptionsHtml = patient.prescriptions.map((prescription, index) => `
        <tr>
            <td contenteditable="true" onblur="updatePrescription(${index}, 'date', this.textContent)">${prescription.date}</td>
            <td contenteditable="true" onblur="updatePrescription(${index}, 'medication', this.textContent)">${prescription.medication}</td>
            <td contenteditable="true" onblur="updatePrescription(${index}, 'dosage', this.textContent)">${prescription.dosage}</td>
            <td contenteditable="true" onblur="updatePrescription(${index}, 'quantity', this.textContent)">${prescription.quantity}</td>
            <td contenteditable="true" onblur="updatePrescription(${index}, 'instructions', this.textContent)">${prescription.instructions}</td>
        </tr>
    `).join('');
    
    prescriptionsTable.innerHTML = prescriptionsHtml;
}

function addNewPrescription() {
    const patientName = document.getElementById('patient-name').textContent;
    const patient = appData.patients.find(p => p.name === patientName);
    
    if (patient) {
        if (!patient.prescriptions) patient.prescriptions = [];
        
        const newPrescription = {
            date: new Date().toLocaleDateString(),
            medication: 'New Medication',
            dosage: '0mg',
            quantity: '0 tablets',
            instructions: 'Click to edit'
        };
        
        patient.prescriptions.unshift(newPrescription);
        renderPatientPrescriptions(patient);
        showToast('New prescription added!', 'success');
    }
}

function updatePrescription(index, field, value) {
    const patientName = document.getElementById('patient-name').textContent;
    const patient = appData.patients.find(p => p.name === patientName);
    
    if (patient && patient.prescriptions && patient.prescriptions[index]) {
        patient.prescriptions[index][field] = value;
        showToast('Prescription updated!', 'success');
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Appointment functionality
function saveNewAppointment() {
    const form = document.querySelector('.appointment-form');
    
    const pet = form.querySelector('select').value;
    const vet = form.querySelectorAll('select')[1].value;
    const date = form.querySelector('input[type="date"]').value;
    const time = form.querySelectorAll('select')[2].value;
    const notes = form.querySelector('textarea').value;
    
    console.log('Form values:', { pet, vet, date, time }); // Debug log
    
    if (pet && pet !== 'Select a pet...' && vet && vet !== 'Select veterinarian...' && date && time) {
        const newAppointment = {
            id: `apt${String(appData.nextId.appointment).padStart(3, '0')}`,
            time: time,
            petName: pet,
            owner: pet.includes('(') ? pet.split('(')[1]?.replace(')', '') : 'Unknown',
            vet: vet,
            status: 'confirmed',
            date: date,
            notes: notes
        };
        
        appData.appointments.push(newAppointment);
        appData.nextId.appointment++;
        
        renderAppointments();
        renderCalendarAppointments();
        updateDashboardStats();
        showToast('Appointment scheduled successfully!', 'success');
        closeModal('new-appointment-modal');
    } else {
        showToast('Please fill in all required fields', 'error');
    }
}

function renderAppointments() {
    const appointmentsList = document.querySelector('.appointments-list');
    if (!appointmentsList) return;
    
    const appointmentsHtml = appData.appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-time">${apt.time}</div>
            <div class="appointment-details">
                <div class="pet-name">${apt.petName}</div>
                <div class="owner-name">${apt.owner}</div>
                <div class="vet-name">${apt.vet}</div>
            </div>
            <div class="appointment-status">
                <span class="status-badge ${apt.status}" onclick="toggleAppointmentStatus('${apt.id}')" style="cursor: pointer;" title="Click to toggle status">
                    ${apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
            </div>
        </div>
    `).join('');
    
    const existingTitle = appointmentsList.querySelector('h3');
    appointmentsList.innerHTML = '<h3>Today\'s Appointments</h3>' + appointmentsHtml;
}

function toggleAppointmentStatus(appointmentId) {
    const appointment = appData.appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        // Toggle between confirmed, pending, and cancelled
        if (appointment.status === 'pending') {
            appointment.status = 'confirmed';
        } else if (appointment.status === 'confirmed') {
            appointment.status = 'cancelled';
        } else {
            appointment.status = 'pending';
        }
        
        renderAppointments();
        showToast(`Appointment status changed to ${appointment.status}`, 'success');
    }
}

// Patient management
function renderPatients() {
    const patientsGrid = document.getElementById('patients-grid');
    if (!patientsGrid) return;
    
    const patientsHtml = appData.patients.map(patient => {
        const icon = patient.species === 'Cat' ? 'fa-cat' : 
                    patient.species === 'Dog' ? 'fa-dog' : 'fa-rabbit-fast';
        
        return `
            <div class="patient-card" onclick="openPatientDetail('${patient.id}')">
                <div class="patient-avatar">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="patient-info">
                    <h3>${patient.name}</h3>
                    <p>${patient.breed} ${patient.species} • ${patient.age}</p>
                    <p class="owner">Owner: ${patient.owner}</p>
                    <div class="last-visit">Last visit: ${patient.lastVisit}</div>
                </div>
                <div class="patient-status">
                    <span class="status-badge ${patient.status}">${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    patientsGrid.innerHTML = patientsHtml;
}

function addNewPatient() {
    const newPatient = {
        id: `patient${appData.nextId.patient}`,
        name: 'New Pet',
        species: 'Cat',
        breed: 'Mixed',
        age: '1 year old',
        owner: 'New Owner',
        ownerPhone: '(555) 000-0000',
        ownerEmail: 'new@email.com',
        lastVisit: new Date().toLocaleDateString(),
        status: 'healthy',
        weight: '0 kg',
        dateOfBirth: new Date().toISOString().split('T')[0],
        microchipId: '000000000000000',
        insurance: 'None',
        address: 'Address not provided'
    };
    
    appData.patients.push(newPatient);
    appData.nextId.patient++;
    
    renderPatients();
    updateDashboardStats();
    showToast('New patient added! Click to edit details.', 'success');
    openPatientDetail(newPatient.id);
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
function renderInventory() {
    const tbody = document.querySelector('.inventory-table tbody');
    if (!tbody) return;
    
    const inventoryHtml = appData.inventory.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td class="editable-qty" onclick="editQty(this, '${item.id}')">${item.quantity}</td>
            <td class="editable-reorder" onclick="editReorder(this, '${item.id}')">${item.reorderLevel}</td>
            <td><span class="status-badge ${item.status}">${item.status === 'low-stock' ? 'Low Stock' : 'In Stock'}</span></td>
            <td>
                <button class="btn btn-small btn-ghost" onclick="editInventoryItem('${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteInventoryItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = inventoryHtml;
}

function editQty(element, itemId) {
    const currentValue = element.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.style.width = '60px';
    input.style.padding = '4px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    
    input.onblur = () => {
        const newValue = parseInt(input.value) || 0;
        const item = appData.inventory.find(i => i.id === itemId);
        if (item) {
            item.quantity = newValue;
            item.status = newValue <= item.reorderLevel ? 'low-stock' : 'in-stock';
            renderInventory();
            updateDashboardStats();
            showToast('Quantity updated successfully!', 'success');
        }
    };
    
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    };
    
    element.innerHTML = '';
    element.appendChild(input);
    input.focus();
}

function editReorder(element, itemId) {
    const currentValue = element.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.style.width = '60px';
    input.style.padding = '4px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    
    input.onblur = () => {
        const newValue = parseInt(input.value) || 0;
        const item = appData.inventory.find(i => i.id === itemId);
        if (item) {
            item.reorderLevel = newValue;
            item.status = item.quantity <= newValue ? 'low-stock' : 'in-stock';
            renderInventory();
            updateDashboardStats();
            showToast('Reorder level updated successfully!', 'success');
        }
    };
    
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    };
    
    element.innerHTML = '';
    element.appendChild(input);
    input.focus();
}

function deleteInventoryItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        appData.inventory = appData.inventory.filter(item => item.id !== itemId);
        renderInventory();
        updateDashboardStats();
        showToast('Item deleted successfully!', 'success');
    }
}

function addNewInventoryItem() {
    const newItem = {
        id: `ITM${String(appData.nextId.inventory).padStart(3, '0')}`,
        name: 'New Item',
        category: 'Supplies',
        quantity: 0,
        reorderLevel: 10,
        status: 'low-stock'
    };
    
    appData.inventory.push(newItem);
    appData.nextId.inventory++;
    
    renderInventory();
    updateDashboardStats();
    showToast('New inventory item added! Click edit to modify details.', 'success');
}

function editInventoryItem(itemId) {
    const item = appData.inventory.find(i => i.id === itemId);
    if (item) {
        const newName = prompt('Item Name:', item.name);
        const newCategory = prompt('Category (Medications/Vaccines/Supplies/Equipment):', item.category);
        
        if (newName && newCategory) {
            item.name = newName;
            item.category = newCategory;
            renderInventory();
            showToast('Item details updated!', 'success');
        }
    }
}

// Billing functionality - Enhanced
let currentInvoiceIndex = -1; // Track which invoice is currently displayed

function initializeBilling() {
    // Load default invoice if no invoices exist
    if (appData.invoices.length === 0) {
        const defaultInvoice = {
            id: 'INV-2024-001',
            date: 'December 20, 2024',
            dueDate: 'January 20, 2025',
            client: 'Mrs. Johnson',
            address: '456 Owner Avenue\nPet Town, PC 12345\nPhone: (555) 987-6543',
            items: [
                { service: 'Consultation', qty: 1, price: 50.00, total: 50.00 },
                { service: 'Vaccination - Rabies', qty: 1, price: 80.00, total: 80.00 },
                { service: 'Blood Test', qty: 1, price: 120.00, total: 120.00 }
            ],
            subtotal: 250.00,
            tax: 15.00,
            discount: 0,
            total: 265.00
        };
        appData.invoices.push(defaultInvoice);
        currentInvoiceIndex = 0;
    } else {
        currentInvoiceIndex = appData.invoices.length - 1; // Show most recent invoice
    }
    
    renderCurrentInvoice(appData.invoices[currentInvoiceIndex]);
}

function calculateTotal() {
    const currentInvoice = appData.invoices[currentInvoiceIndex];
    if (!currentInvoice) return;
    
    const discountInput = document.querySelector('.discount-input');
    const discount = parseFloat(discountInput.value) || 0;
    
    currentInvoice.discount = discount;
    currentInvoice.subtotal = currentInvoice.items.reduce((sum, item) => sum + item.total, 0);
    currentInvoice.tax = currentInvoice.subtotal * 0.06;
    currentInvoice.total = currentInvoice.subtotal + currentInvoice.tax - discount;
    
    // Update display
    document.querySelector('.total-line:nth-child(1) span:last-child').textContent = `RM ${currentInvoice.subtotal.toFixed(2)}`;
    document.querySelector('.total-line:nth-child(2) span:last-child').textContent = `RM ${currentInvoice.tax.toFixed(2)}`;
    document.querySelector('.total-line:nth-child(3) span:last-child').textContent = `RM ${discount.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `RM ${currentInvoice.total.toFixed(2)}`;
    
    showToast('Total updated!', 'success');
}

function createNewInvoice() {
    const newInvoice = {
        id: `INV-2024-${String(appData.nextId.invoice).padStart(3, '0')}`,
        date: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        client: 'New Client',
        address: 'Address not provided',
        items: [
            { service: 'Consultation', qty: 1, price: 50.00, total: 50.00 }
        ],
        subtotal: 50.00,
        tax: 3.00,
        discount: 0,
        total: 53.00
    };
    
    appData.invoices.push(newInvoice);
    appData.nextId.invoice++;
    currentInvoiceIndex = appData.invoices.length - 1;
    
    renderCurrentInvoice(newInvoice);
    showToast('New invoice created successfully!', 'success');
}

function renderCurrentInvoice(invoice) {
    // Update invoice header
    document.querySelector('.invoice-details h3').textContent = `Invoice #${invoice.id}`;
    document.querySelector('.invoice-details p:nth-child(2)').textContent = `Date: ${invoice.date}`;
    document.querySelector('.invoice-details p:nth-child(3)').textContent = `Due Date: ${invoice.dueDate}`;
    
    // Update client info
    const clientInfo = document.querySelector('.client-info');
    clientInfo.innerHTML = `
        <h3>Bill To:</h3>
        <p contenteditable="true" onblur="updateInvoiceClient('client', this.textContent)">${invoice.client}</p>
        <div contenteditable="true" onblur="updateInvoiceClient('address', this.innerHTML)">${invoice.address.replace(/\n/g, '<br>')}</div>
    `;
    
    // Update invoice table
    const tbody = document.querySelector('.invoice-table tbody');
    tbody.innerHTML = invoice.items.map((item, index) => `
        <tr>
            <td contenteditable="true" onblur="updateInvoiceItem(${index}, 'service', this.textContent)">${item.service}</td>
            <td contenteditable="true" onblur="updateInvoiceItem(${index}, 'qty', this.textContent)">${item.qty}</td>
            <td contenteditable="true" onblur="updateInvoiceItem(${index}, 'price', this.textContent)">RM ${item.price.toFixed(2)}</td>
            <td>RM ${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Add new row button
    tbody.innerHTML += `
        <tr>
            <td colspan="4">
                <button class="btn btn-ghost" onclick="addInvoiceItem()">
                    <i class="fas fa-plus"></i> Add Item
                </button>
            </td>
        </tr>
    `;
    
    // Update totals
    document.querySelector('.total-line:nth-child(1) span:last-child').textContent = `RM ${invoice.subtotal.toFixed(2)}`;
    document.querySelector('.total-line:nth-child(2) span:last-child').textContent = `RM ${invoice.tax.toFixed(2)}`;
    document.querySelector('.discount-input').value = invoice.discount || 0;
    document.querySelector('.total-line:nth-child(3) span:last-child').textContent = `RM ${(invoice.discount || 0).toFixed(2)}`;
    document.getElementById('grand-total').textContent = `RM ${invoice.total.toFixed(2)}`;
}

function updateInvoiceClient(field, value) {
    const currentInvoice = appData.invoices[currentInvoiceIndex];
    if (currentInvoice) {
        if (field === 'address') {
            value = value.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
        }
        currentInvoice[field] = value;
        showToast('Invoice updated!', 'success');
    }
}

function updateInvoiceItem(index, field, value) {
    const currentInvoice = appData.invoices[currentInvoiceIndex];
    if (currentInvoice && currentInvoice.items[index]) {
        if (field === 'price') {
            value = parseFloat(value.replace('RM ', '')) || 0;
        } else if (field === 'qty') {
            value = parseInt(value) || 1;
        }
        
        currentInvoice.items[index][field] = value;
        currentInvoice.items[index].total = currentInvoice.items[index].qty * currentInvoice.items[index].price;
        
        // Recalculate totals
        currentInvoice.subtotal = currentInvoice.items.reduce((sum, item) => sum + item.total, 0);
        currentInvoice.tax = currentInvoice.subtotal * 0.06;
        currentInvoice.total = currentInvoice.subtotal + currentInvoice.tax - (currentInvoice.discount || 0);
        
        renderCurrentInvoice(currentInvoice);
        showToast('Invoice updated!', 'success');
    }
}

function addInvoiceItem() {
    const currentInvoice = appData.invoices[currentInvoiceIndex];
    if (currentInvoice) {
        currentInvoice.items.push({
            service: 'New Service',
            qty: 1,
            price: 0.00,
            total: 0.00
        });
        renderCurrentInvoice(currentInvoice);
        showToast('New item added to invoice!', 'success');
    }
}

function generatePDF() {
    const currentInvoice = appData.invoices[currentInvoiceIndex];
    if (!currentInvoice) {
        showToast('No invoice to generate PDF for!', 'error');
        return;
    }
    
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        showToast('PDF library not loaded. Downloading as text file instead.', 'warning');
        generateTextInvoice(currentInvoice);
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Dr. Wah Veterinary Clinic', 20, 20);
    
    doc.setFontSize(12);
    doc.text('123 Pet Street, Animal City', 20, 30);
    doc.text('Phone: (555) 123-4567', 20, 35);
    
    // Invoice details
    doc.setFontSize(16);
    doc.text(`Invoice #${currentInvoice.id}`, 20, 50);
    
    doc.setFontSize(12);
    doc.text(`Date: ${currentInvoice.date}`, 20, 60);
    doc.text(`Due Date: ${currentInvoice.dueDate}`, 20, 65);
    
    // Bill To
    doc.setFontSize(14);
    doc.text('Bill To:', 20, 80);
    doc.setFontSize(12);
    doc.text(currentInvoice.client, 20, 90);
    
    const addressLines = currentInvoice.address.split('\n');
    addressLines.forEach((line, index) => {
        doc.text(line, 20, 95 + (index * 5));
    });
    
    // Items table
    let yPosition = 115 + (addressLines.length * 5);
    
    // Table headers
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Service', 20, yPosition);
    doc.text('Qty', 100, yPosition);
    doc.text('Price', 130, yPosition);
    doc.text('Total', 160, yPosition);
    
    // Table line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition + 2, 190, yPosition + 2);
    
    yPosition += 10;
    
    // Table items
    doc.setTextColor(40, 40, 40);
    currentInvoice.items.forEach((item, index) => {
        doc.text(item.service.substring(0, 25), 20, yPosition);
        doc.text(item.qty.toString(), 100, yPosition);
        doc.text(`RM ${item.price.toFixed(2)}`, 130, yPosition);
        doc.text(`RM ${item.total.toFixed(2)}`, 160, yPosition);
        yPosition += 8;
    });
    
    // Totals
    yPosition += 10;
    doc.line(130, yPosition - 5, 190, yPosition - 5);
    
    doc.text(`Subtotal: RM ${currentInvoice.subtotal.toFixed(2)}`, 130, yPosition);
    doc.text(`Tax (6%): RM ${currentInvoice.tax.toFixed(2)}`, 130, yPosition + 8);
    doc.text(`Discount: RM ${(currentInvoice.discount || 0).toFixed(2)}`, 130, yPosition + 16);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Grand Total: RM ${currentInvoice.total.toFixed(2)}`, 130, yPosition + 28);
    
    // Save the PDF
    doc.save(`invoice-${currentInvoice.id}.pdf`);
    showToast('Invoice PDF downloaded successfully!', 'success');
}

function generateTextInvoice(invoice) {
    // Fallback text generation
    const pdfContent = `
Dr. Wah Veterinary Clinic
123 Pet Street, Animal City
Phone: (555) 123-4567

Invoice #${invoice.id}
Date: ${invoice.date}
Due Date: ${invoice.dueDate}

Bill To:
${invoice.client}
${invoice.address.replace(/\n/g, '\n')}

Services:
${invoice.items.map(item => 
    `${item.service} - Qty: ${item.qty} - Price: RM ${item.price.toFixed(2)} - Total: RM ${item.total.toFixed(2)}`
).join('\n')}

Subtotal: RM ${invoice.subtotal.toFixed(2)}
Tax (6%): RM ${invoice.tax.toFixed(2)}
Discount: RM ${(invoice.discount || 0).toFixed(2)}
Grand Total: RM ${invoice.total.toFixed(2)}
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function sendEmail() {
    const currentInvoice = appData.invoices[currentInvoiceIndex];
    if (!currentInvoice) {
        showToast('No invoice to send!', 'error');
        return;
    }
    
    showToast(`Email would be sent to client: ${currentInvoice.client}. Feature simulated!`, 'info');
}

// Dashboard updates
function updateDashboardStats() {
    const todayAppointments = appData.appointments.length;
    const activePatients = appData.patients.length;
    const lowStockItems = appData.inventory.filter(item => item.status === 'low-stock').length;
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = todayAppointments;
        statCards[1].textContent = activePatients;
        statCards[3].textContent = lowStockItems;
    }
    
    // Update alerts
    updateAlerts();
}

function updateAlerts() {
    const alertsPanel = document.querySelector('.alerts-panel');
    if (!alertsPanel) return;
    
    const lowStockItems = appData.inventory.filter(item => item.status === 'low-stock');
    const alertsHtml = lowStockItems.map(item => `
        <div class="alert-item">
            <i class="fas fa-exclamation-triangle text-warning"></i>
            <span>Low stock: ${item.name} (${item.quantity} units remaining)</span>
            <button class="btn btn-small" onclick="reorderItem('${item.id}')">Reorder</button>
        </div>
    `).join('');
    
    const title = alertsPanel.querySelector('h2');
    alertsPanel.innerHTML = '<h2>Alerts & Notifications</h2>' + alertsHtml;
}

function reorderItem(itemId) {
    const item = appData.inventory.find(i => i.id === itemId);
    if (item) {
        item.quantity += 50; // Simulate reorder
        item.status = 'in-stock';
        renderInventory();
        updateDashboardStats();
        showToast(`Reordered ${item.name} successfully!`, 'success');
    }
}

// Charts functionality
function initializeCharts() {
    // Wait for DOM and Chart.js to be available
    setTimeout(() => {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, using fallback charts');
            createFallbackCharts();
            return;
        }
        
        createChartJSCharts();
    }, 500);
}

function createChartJSCharts() {
    // Destroy existing charts to prevent errors
    Chart.getChart('appointments-chart')?.destroy();
    Chart.getChart('revenue-chart')?.destroy();
    Chart.getChart('medications-chart')?.destroy();
    
    // Set container heights to prevent scrolling issues
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.style.height = '400px';
        container.style.maxHeight = '400px';
        container.style.overflow = 'hidden';
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.maxHeight = '350px';
        }
    });
    
    // Appointments Chart
    const appointmentsCtx = document.getElementById('appointments-chart');
    if (appointmentsCtx) {
        appointmentsCtx.height = 350;
        new Chart(appointmentsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Appointments',
                    data: [65, 59, 80, 81, 56, 85, 70, 92, 88, 76, 69, 95],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenue-chart');
    if (revenueCtx) {
        revenueCtx.height = 350;
        new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue (RM)',
                    data: [12000, 15000, 18000, 16000, 19000, 22000, 17000, 24000, 21000, 18500, 16800, 25000],
                    backgroundColor: '#4facfe',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 30000
                    }
                }
            }
        });
    }
    
    // Medications Chart
    const medicationsCtx = document.getElementById('medications-chart');
    if (medicationsCtx) {
        medicationsCtx.height = 350;
        new Chart(medicationsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Antibiotics', 'Vaccines', 'Pain Relief', 'Vitamins', 'Others'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: [
                        '#667eea',
                        '#4facfe',
                        '#f093fb',
                        '#27AE60',
                        '#F2C94C'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            boxWidth: 12
                        }
                    }
                }
            }
        });
    }
}

function createFallbackCharts() {
    // Create simple fallback charts using CSS and HTML
    const charts = ['appointments-chart', 'revenue-chart', 'medications-chart'];
    
    charts.forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const container = canvas.parentElement;
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 300px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white; text-align: center;">
                    <div>
                        <i class="fas fa-chart-line" style="font-size: 3em; margin-bottom: 1rem;"></i>
                        <p style="font-size: 1.2em; margin: 0;">Chart Loading...</p>
                        <p style="font-size: 0.9em; margin: 0.5rem 0 0 0; opacity: 0.8;">Simulated data visualization</p>
                    </div>
                </div>
            `;
        }
    });
}

// Toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
}

// Event listeners
function setupEventListeners() {
    // Add event listeners for form submissions
    document.addEventListener('click', function(e) {
        // Handle save buttons in modals
        if (e.target.textContent === 'Save Appointment') {
            e.preventDefault();
            saveNewAppointment();
        } else if (e.target.textContent === 'Save Changes') {
            e.preventDefault();
            savePatientChanges();
        } else if (e.target.textContent === 'Add Patient' && e.target.classList.contains('btn-primary')) {
            e.preventDefault();
            addNewPatient();
        } else if (e.target.textContent === 'Add Item' && e.target.classList.contains('btn-primary')) {
            e.preventDefault();
            addNewInventoryItem();
        }
    });
    
    // Handle Enter key in forms
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.target.blur();
        }
    });
}

// Mobile functionality
function showMobileTab(tabName) {
    document.querySelectorAll('.footer-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.mobile-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`mobile-${tabName}-tab`).classList.add('active');
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatCurrency(amount) {
    return `RM ${amount.toFixed(2)}`;
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Reports Download Functions
function downloadReportsCSV() {
    // Generate comprehensive reports data
    const reportsData = {
        summary: {
            totalAppointments: appData.appointments.length,
            totalPatients: appData.patients.length,
            totalRevenue: 185420,
            lowStockItems: appData.inventory.filter(item => item.status === 'low-stock').length
        },
        appointments: appData.appointments,
        patients: appData.patients,
        inventory: appData.inventory,
        monthlyData: [
            { month: 'January', appointments: 65, revenue: 12000 },
            { month: 'February', appointments: 59, revenue: 15000 },
            { month: 'March', appointments: 80, revenue: 18000 },
            { month: 'April', appointments: 81, revenue: 16000 },
            { month: 'May', appointments: 56, revenue: 19000 },
            { month: 'June', appointments: 85, revenue: 22000 },
            { month: 'July', appointments: 70, revenue: 17000 },
            { month: 'August', appointments: 92, revenue: 24000 },
            { month: 'September', appointments: 88, revenue: 21000 },
            { month: 'October', appointments: 76, revenue: 18500 },
            { month: 'November', appointments: 69, revenue: 16800 },
            { month: 'December', appointments: 95, revenue: 25000 }
        ]
    };
    
    // Check if Papa Parse is available for better CSV generation
    if (typeof Papa !== 'undefined') {
        generateAdvancedCSV(reportsData);
    } else {
        generateBasicCSV(reportsData);
    }
}

function generateAdvancedCSV(data) {
    // Create multiple CSV sheets as separate files
    
    // 1. Summary Report
    const summaryData = [
        ['Metric', 'Value'],
        ['Total Appointments', data.summary.totalAppointments],
        ['Total Patients', data.summary.totalPatients],
        ['Total Revenue (RM)', data.summary.totalRevenue],
        ['Low Stock Items', data.summary.lowStockItems]
    ];
    
    const summaryCSV = Papa.unparse(summaryData);
    downloadCSVFile(summaryCSV, 'clinic-summary-report.csv');
    
    // 2. Monthly Performance
    const monthlyCSV = Papa.unparse(data.monthlyData);
    downloadCSVFile(monthlyCSV, 'monthly-performance-report.csv');
    
    // 3. Patients Report
    const patientsData = data.patients.map(patient => ({
        'Patient Name': patient.name,
        'Species': patient.species,
        'Breed': patient.breed,
        'Age': patient.age,
        'Owner': patient.owner,
        'Owner Phone': patient.ownerPhone,
        'Last Visit': patient.lastVisit,
        'Status': patient.status
    }));
    
    const patientsCSV = Papa.unparse(patientsData);
    downloadCSVFile(patientsCSV, 'patients-report.csv');
    
    // 4. Inventory Report
    const inventoryData = data.inventory.map(item => ({
        'Item ID': item.id,
        'Name': item.name,
        'Category': item.category,
        'Quantity': item.quantity,
        'Reorder Level': item.reorderLevel,
        'Status': item.status
    }));
    
    const inventoryCSV = Papa.unparse(inventoryData);
    downloadCSVFile(inventoryCSV, 'inventory-report.csv');
    
    showToast('All CSV reports downloaded successfully!', 'success');
}

function generateBasicCSV(data) {
    // Fallback basic CSV generation
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Summary section
    csvContent += "CLINIC SUMMARY REPORT\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Appointments,${data.summary.totalAppointments}\n`;
    csvContent += `Total Patients,${data.summary.totalPatients}\n`;
    csvContent += `Total Revenue (RM),${data.summary.totalRevenue}\n`;
    csvContent += `Low Stock Items,${data.summary.lowStockItems}\n\n`;
    
    // Monthly data
    csvContent += "MONTHLY PERFORMANCE\n";
    csvContent += "Month,Appointments,Revenue (RM)\n";
    data.monthlyData.forEach(month => {
        csvContent += `${month.month},${month.appointments},${month.revenue}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clinic-reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('CSV report downloaded successfully!', 'success');
}

function downloadCSVFile(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadReportsPDF() {
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        showToast('PDF library not loaded. Please refresh the page and try again.', 'error');
        return;
    }
    
    showToast('Generating PDF report with charts...', 'info');
    
    // Use html2canvas to capture the reports section
    const reportsSection = document.getElementById('reports-content');
    
    html2canvas(reportsSection, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('VetSync VCMS - Analytics Report', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text('Dr. Wah Veterinary Clinic', 20, 35);
        
        // Add summary statistics
        doc.setFontSize(14);
        doc.text('Summary Statistics:', 20, 50);
        
        doc.setFontSize(11);
        doc.text(`• Total Appointments: ${appData.appointments.length}`, 25, 60);
        doc.text(`• Active Patients: ${appData.patients.length}`, 25, 65);
        doc.text(`• Total Revenue: RM 185,420`, 25, 70);
        doc.text(`• Low Stock Items: ${appData.inventory.filter(item => item.status === 'low-stock').length}`, 25, 75);
        
        // Add charts image
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 170;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Charts and Analytics', 20, 20);
        
        doc.addImage(imgData, 'PNG', 20, 30, imgWidth, Math.min(imgHeight, 250));
        
        // Add detailed data on additional pages
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Detailed Reports', 20, 20);
        
        // Patients summary
        doc.setFontSize(14);
        doc.text('Recent Patients:', 20, 35);
        doc.setFontSize(10);
        
        let yPos = 45;
        appData.patients.slice(0, 10).forEach((patient, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${index + 1}. ${patient.name} (${patient.species}) - Owner: ${patient.owner}`, 25, yPos);
            yPos += 6;
        });
        
        // Inventory alerts
        yPos += 10;
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Inventory Alerts:', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        const lowStockItems = appData.inventory.filter(item => item.status === 'low-stock');
        
        if (lowStockItems.length > 0) {
            lowStockItems.forEach((item, index) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`${index + 1}. ${item.name} - Quantity: ${item.quantity} (Reorder at: ${item.reorderLevel})`, 25, yPos);
                yPos += 6;
            });
        } else {
            doc.text('No low stock items', 25, yPos);
        }
        
        // Save the PDF
        doc.save('vetsync-analytics-report.pdf');
        showToast('PDF report with charts downloaded successfully!', 'success');
        
    }).catch(error => {
        console.error('Error generating PDF:', error);
        showToast('Error generating PDF. Downloading basic report instead.', 'warning');
        generateBasicReportPDF();
    });
}

function generateBasicReportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('VetSync VCMS - Analytics Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text('Dr. Wah Veterinary Clinic', 20, 35);
    
    // Summary
    doc.setFontSize(16);
    doc.text('Summary Statistics', 20, 50);
    
    doc.setFontSize(12);
    doc.text(`Total Appointments: ${appData.appointments.length}`, 25, 65);
    doc.text(`Active Patients: ${appData.patients.length}`, 25, 75);
    doc.text(`Total Revenue: RM 185,420`, 25, 85);
    doc.text(`Low Stock Items: ${appData.inventory.filter(item => item.status === 'low-stock').length}`, 25, 95);
    
    // Monthly data
    doc.setFontSize(16);
    doc.text('Monthly Performance', 20, 115);
    
    doc.setFontSize(12);
    const monthlyData = [
        'January: 65 appointments, RM 12,000',
        'February: 59 appointments, RM 15,000',
        'March: 80 appointments, RM 18,000',
        'April: 81 appointments, RM 16,000',
        'May: 56 appointments, RM 19,000',
        'June: 85 appointments, RM 22,000'
    ];
    
    let yPos = 130;
    monthlyData.forEach(data => {
        doc.text(data, 25, yPos);
        yPos += 8;
    });
    
    doc.save('vetsync-basic-report.pdf');
    showToast('Basic PDF report downloaded successfully!', 'success');
} 