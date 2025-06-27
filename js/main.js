// main.js

document.addEventListener('DOMContentLoaded', function () {

    // Track the current tab (default to 'personnel')
    let currentTab = 'personnel';
    loadPersonnel();

    // Handle tab switching
    document.getElementById('personnelBtn').addEventListener('click', () => {
        currentTab = 'personnel';
        document.getElementById('multiplefiltersBtn').style.display = 'block';
        document.querySelectorAll('#filterForPerson select').forEach(select => {
            select.selectedIndex = 0;
        });
        loadPersonnel();
    });

    document.getElementById('departmentsBtn').addEventListener('click', () => {
        currentTab = 'departments';
        document.getElementById('multiplefiltersBtn').style.display = 'block';
        document.querySelectorAll('#filterForDepartment select').forEach(select => {
            select.selectedIndex = 0;
        });
        loadDepartments();
    });

    document.getElementById('locationsBtn').addEventListener('click', () => {
        currentTab = 'locations';
        document.getElementById('multiplefiltersBtn').style.display = 'none';
        loadLocations();
    });

    // Refresh current tab
    document.getElementById('refreshBtn').addEventListener('click', () => {
        if (currentTab === 'personnel') loadPersonnel();
        else if (currentTab === 'departments') loadDepartments();
        else if (currentTab === 'locations') loadLocations();
    });
    // Handle Add Button (opens the correct Add Modal based on active tab)
    document.getElementById('addBtn').addEventListener('click', function () {

        if (document.getElementById('personnelBtn').classList.contains('active')) {
            // Clear previous values
            document.getElementById('addPersonnelFirstName').value = '';
            document.getElementById('addPersonnelLastName').value = '';
            document.getElementById('addPersonnelEmail').value = '';
            // Fetch departments for dropdown
            fetch('php/getAllDepartments.php')
                .then(res => res.json())
                .then(data => {
                    const select = document.getElementById('addPersonnelDepartment');
                    select.innerHTML = ''; // Clear previous
                    data.data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.id;
                        option.text = dept.name;
                        select.appendChild(option);
                    });
                });
            // Open modal
            new bootstrap.Modal(document.getElementById('addPersonnelModal')).show();
        }

        else if (document.getElementById('departmentsBtn').classList.contains('active')) {
            document.getElementById('addDepartmentName').value = '';

            // Load locations for dropdown

            //Action is changed
            fetch('php/locations.php?action=get')
                .then(res => res.json())
                .then(data => {
                    const select = document.getElementById('addDepartmentLocation');
                    select.innerHTML = '';
                    console.log(data);
                    data.data.forEach(loc => {
                        const option = document.createElement('option');
                        option.value = loc.id;
                        option.text = loc.name;
                        select.appendChild(option);
                    });
                });

            new bootstrap.Modal(document.getElementById('addDepartmentModal')).show();
        }

        else if (document.getElementById('locationsBtn').classList.contains('active')) {
            // Clear previous value
            document.getElementById('addLocationName').value = '';
            // Open modal
            new bootstrap.Modal(document.getElementById('addLocationModal')).show();
        }

    });

    // -----------------------------------------------------
    document.getElementById('multiplefiltersBtn').addEventListener('click', function () {

        if (document.getElementById('personnelBtn')?.classList.contains('active')) {

            // Fetch departments for dropdown
            fetch('php/getAllDepartments.php')
                .then(res => res.json())
                .then(data => {
                    const select = document.getElementById('all-departments');
                    if (select && Array.isArray(data.data)) {
                        // select.innerHTML = ''; // Clear previous
                        const emptyOption = document.createElement('option');
                        emptyOption.value = '';
                        emptyOption.textContent = 'Select Department';
                        select.appendChild(emptyOption);
                        data.data.forEach(dept => {
                            const option = document.createElement('option');
                            option.value = dept.name;
                            option.textContent = dept.name;
                            select.appendChild(option);
                        });
                    }
                })
                .catch(err => console.error('Error fetching departments:', err));

            // Fetch locations for dropdown
            fetch('php/locations.php?action=get')
                .then(res => res.json())
                .then(data => {
                    const select = document.getElementById('all-locations');
                    if (select && Array.isArray(data.data)) {
                        const emptyOption = document.createElement('option');
                        emptyOption.value = '';
                        emptyOption.textContent = 'Select Location';
                        select.appendChild(emptyOption);
                        data.data.forEach(loc => {
                            const option = document.createElement('option');
                            option.value = loc.name;
                            option.textContent = loc.name;
                            select.appendChild(option);
                        });
                    }
                })
                .catch(err => console.error('Error fetching locations:', err));

            // Open modal
            const modalEl = document.getElementById('filterForPerson');
            if (modalEl) {
                new bootstrap.Modal(modalEl).show();
            }
        }


        else if (document.getElementById('departmentsBtn').classList.contains('active')) {


            //Action is changed
            fetch('php/locations.php?action=get')
                .then(res => res.json())
                .then(data => {
                    const select = document.getElementById('all-locations-department');
                    // select.innerHTML = '';
                    const emptyOption = document.createElement('option');
                    emptyOption.value = '';
                    emptyOption.textContent = 'Select Department';
                    select.appendChild(emptyOption);
                    console.log(data);
                    data.data.forEach(loc => {
                        const option = document.createElement('option');
                        option.value = loc.name;
                        option.text = loc.name;
                        select.appendChild(option);
                    });
                });

            new bootstrap.Modal(document.getElementById('filterForDepartment')).show();
        }

    });
    // -----------------------------------------------------


    // ============================
    // REFRESH button
    // ============================
    document.getElementById('refreshBtn').addEventListener('click', () => {
        if (currentTab === 'personnel') loadPersonnel();
        else if (currentTab === 'departments') loadDepartments();
        else if (currentTab === 'locations') loadLocations();
    });

    // ============================
    // FILTER button
    // ============================

    document.getElementById('searchInp').addEventListener('input', function () {

        const searchTerm = this.value.trim().toLowerCase();

        // Decide which table to filter
        let tableBody;
        if (currentTab === 'personnel') {
            tableBody = document.getElementById('personnelTableBody');
        } else if (currentTab === 'departments') {
            tableBody = document.getElementById('departmentTableBody');
        } else if (currentTab === 'locations') {
            tableBody = document.getElementById('locationTableBody');
        } else {
            return; // No valid tab
        }

        // Loop through all rows in the selected table
        Array.from(tableBody.getElementsByTagName('tr')).forEach(row => {
            // Combine all text in this row
            const rowText = row.innerText.toLowerCase();

            // Show or hide row based on match
            if (rowText.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

    });

    document.getElementById('apply_on_personal')?.addEventListener('click', () => {
        const departmentSelect = document.getElementById('all-departments');
        const locationSelect = document.getElementById('all-locations');
        const department = departmentSelect?.value.trim().toLowerCase() || '';
        const location = locationSelect?.value.trim().toLowerCase() || '';

        // Decide which table to filter
        let tableBody = null;
        if (currentTab === 'personnel') {
            tableBody = document.getElementById('personnelTableBody');
        } else if (currentTab === 'departments') {
            tableBody = document.getElementById('departmentTableBody');
        } else if (currentTab === 'locations') {
            tableBody = document.getElementById('locationTableBody');
        }

        if (!tableBody) return; // Exit if tableBody is invalid

        // Loop through all rows in the selected table
        Array.from(tableBody.getElementsByTagName('tr')).forEach(row => {
            const rowText = row.innerText.toLowerCase();

            const matchesDepartment = department && rowText.includes(department);
            const matchesLocation = location && rowText.includes(location);

            // Show row if either matches or if no filters are applied
            if ((department && location && matchesDepartment && matchesLocation) || // Both selected & both match
                (department && !location && matchesDepartment) ||                  // Only department selected
                (!department && location && matchesLocation)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        document.getElementById('cancel_personal')?.click();
    });

    document.getElementById('apply_on_department')?.addEventListener('click', () => {

        const locationSelect = document.getElementById('all-locations-department');
        const location = locationSelect?.value.trim().toLowerCase() || '';

        // Decide which table to filter
        let tableBody = null;
        if (currentTab === 'personnel') {
            tableBody = document.getElementById('personnelTableBody');
        } else if (currentTab === 'departments') {
            tableBody = document.getElementById('departmentTableBody');
        } else if (currentTab === 'locations') {
            tableBody = document.getElementById('locationTableBody');
        }

        if (!tableBody) return; // Exit if tableBody is invalid

        // Loop through all rows in the selected table
        Array.from(tableBody.getElementsByTagName('tr')).forEach(row => {
            const rowText = row.innerText.toLowerCase();
            const matchesLocation = location && rowText.includes(location);

            // Show row if either matches or if no filters are applied
            if (location && matchesLocation) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        document.getElementById('cancel_department')?.click();
    });

    // Load all personnel
    function loadPersonnel() {
        fetch(`php/getAll.php?nocache=${Date.now()}`)  // 👈 prevent browser from caching old data
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('personnelTableBody');
                tbody.innerHTML = '';
                // console.log("Cleared old rows and loading fresh data...");
                // console.log(data.data);
                data.data.forEach(person => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${person.firstName}, ${person.lastName}</td>
                    <td class="d-none d-md-table-cell">${person.department}</td>
                    <td class="d-none d-md-table-cell">${person.location}</td>
                    <td class="d-none d-md-table-cell">${person.email}</td>
                    <td class="text-end">
                        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${person.id}">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="btn btn-primary btn-sm deletePersonnelBtn" data-id="${person.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                    tbody.appendChild(row);
                    // console.log("Added person:", person.firstName, person.lastName);

                });
            })
            .catch(err => console.error('Error loading personnel:', err));
    }

    // Load all departments
    function loadDepartments() {
        fetch('php/getAllDepartments.php')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('departmentTableBody');
                tbody.innerHTML = '';
                data.data.forEach(dept => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${dept.name}</td>
                        <td class="d-none d-md-table-cell">${dept.location}</td>
                        <td class="text-end">
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${dept.id}">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-primary btn-sm deleteDepartmentBtn" data-id="${dept.id}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(err => console.error('Error loading departments:', err));
    }

    // Load all locations
    function loadLocations() {
        fetch('php/locations.php?action=get')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('locationTableBody');
                tbody.innerHTML = '';
                data.data.forEach(loc => {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    nameCell.textContent = loc.name;

                    const actionCell = document.createElement('td');
                    actionCell.className = 'text-end';

                    // Edit button
                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn btn-primary btn-sm me-2';
                    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
                    editBtn.addEventListener('click', () => {
                        const modal = new bootstrap.Modal(document.getElementById('editLocationModal'));
                        document.getElementById('editLocationId').value = loc.id;
                        document.getElementById('editLocationName').value = loc.name;
                        modal.show();
                    });

                    // Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn btn-primary btn-sm deleteLocationBtn';
                    deleteBtn.setAttribute('data-id', loc.id);
                    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

                    // Append buttons to actionCell
                    actionCell.appendChild(editBtn);
                    actionCell.appendChild(deleteBtn);

                    // Append cells to row
                    row.appendChild(nameCell);
                    row.appendChild(actionCell);

                    // Append row to tbody
                    tbody.appendChild(row);
                });
            })
            .catch(err => console.error('Error loading locations:', err));
    }

    // DELETE department
    document.addEventListener('click', event => {
        const btn = event.target.closest('.deleteDepartmentBtn');
        if (btn) {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this department?')) {
                fetch(`php/deleteDepartmentByID.php?id=${id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status.code === "200") {
                            alert('Department deleted');
                            loadDepartments();
                        } else {
                            alert(data.status.description || 'Unable to delete department');
                        }
                    });
            }
        }
    });


    // DELETE location
    document.addEventListener('click', event => {
        const btn = event.target.closest('.deleteLocationBtn');
        if (btn) {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this location?')) {
                fetch(`php/deleteLocation.php?id=${id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status.code === "200") {
                            alert('Location deleted');
                            loadLocations();
                        } else {
                            alert(data.status.description || 'Unable to delete location');
                        }
                    });
            }
        }
    });
    // Add department 
    document.getElementById('saveNewDepartmentBtn').addEventListener('click', function () {
        const name = document.getElementById('addDepartmentName').value;
        const locationID = document.getElementById('addDepartmentLocation').value;

        if (name.trim() === '') {
            alert('Please enter department name');
            return;
        }

        fetch(`php/insertDepartment.php?name=${encodeURIComponent(name)}&locationID=${locationID}`)
            .then(response => response.json())
            .then(data => {
                if (data.status.code === "200") {
                    alert('Department added successfully');
                    // Close modal
                    const addDepartmentModal = bootstrap.Modal.getInstance(document.getElementById('addDepartmentModal'));
                    addDepartmentModal.hide();
                    // Refresh table
                    loadDepartments();
                } else {
                    alert(data.status.description || 'Failed to add department');
                }
            })
            .catch(error => console.error('Error adding department:', error));
    });
    // ADD location
    document.getElementById('saveNewLocationBtn').addEventListener('click', () => {
        const name = document.getElementById('addLocationName').value.trim();

        if (name === '') {
            alert('Please enter location name');
            return;
        }
        // action is changed
        fetch(`php/locations.php?action=add&name=${encodeURIComponent(name)}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    alert('Location added');
                    loadLocations(); // Refresh location list
                    // Clear input
                    document.getElementById('addLocationName').value = '';
                    // Close modal
                    bootstrap.Modal.getInstance(document.getElementById('addLocationModal')).hide();
                } else {
                    alert(data.status.description || 'Unable to add location');
                }
            })
            .catch(error => {
                console.error('Error adding location:', error);
            });
    });
    // ADD personnel


    // DELETE personnel
    document.addEventListener('click', event => {
        const btn = event.target.closest('.deletePersonnelBtn');
        if (btn) {
            const id = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this employee?')) {
                fetch(`php/deletePersonnelByID.php?id=${id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status.code === "200") {
                            alert('Employee deleted');
                            loadPersonnel();
                        } else {
                            alert(data.status.description || 'Unable to delete employee');
                        }
                    });
            }
        }
    });


    // SAVE Personnel Changes
    document.getElementById('savePersonnelChangesBtn').addEventListener('click', function () {
        const id = document.getElementById('editPersonnelId').value;
        const firstName = document.getElementById('editPersonnelFirstName').value;
        const lastName = document.getElementById('editPersonnelLastName').value;
        const email = document.getElementById('editPersonnelEmail').value;
        const departmentId = document.getElementById('editPersonnelDepartment').value;

        fetch('php/updatePersonnel.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                departmentID: departmentId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status.code === "200") {
                    alert('Personnel updated successfully');
                    loadPersonnel();
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editPersonnelModal'));
                    modal.hide();
                } else {
                    alert(data.status.description || 'Unable to update personnel');
                }
            })
            .catch(error => {
                console.error('Error updating personnel:', error);
            });
    });
    // ADD PERSONNEL
    document.getElementById('saveNewPersonnelBtn').addEventListener('click', function () {
        const firstName = document.getElementById('addPersonnelFirstName').value.trim();
        const lastName = document.getElementById('addPersonnelLastName').value.trim();
        const email = document.getElementById('addPersonnelEmail').value.trim();
        const departmentID = document.getElementById('addPersonnelDepartment').value;

        // Basic validation
        if (firstName === '' || lastName === '' || email === '' || departmentID === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Prepare POST data
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('departmentID', departmentID);

        // Send POST request
        fetch('php/insertPersonnel.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status.code === "200") {
                    alert('Personnel added successfully!');
                    // Close modal
                    const addModal = bootstrap.Modal.getInstance(document.getElementById('addPersonnelModal'));
                    addModal.hide();
                    // Reset form
                    document.getElementById('addPersonnelFirstName').value = '';
                    document.getElementById('addPersonnelLastName').value = '';
                    document.getElementById('addPersonnelEmail').value = '';
                    document.getElementById('addPersonnelDepartment').value = '';
                    // Reload personnel list
                    loadPersonnel();
                } else {
                    alert(data.status.description || 'Unable to add personnel.');
                }
            })
            .catch(error => {
                console.error('Error adding personnel:', error);
            });
    });
    // SAVE Department Changes
    document.getElementById('saveDepartmentChangesBtn').addEventListener('click', function () {
        const id = document.getElementById('editDepartmentId').value;
        const name = document.getElementById('editDepartmentName').value;
        const locationId = document.getElementById('editDepartmentLocation').value;

        fetch('php/updateDepartment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                name: name,
                locationID: locationId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status.code === "200") {
                    alert('Department updated successfully');
                    loadDepartments();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editDepartmentModal'));
                    modal.hide();
                } else {
                    alert(data.status.description || 'Unable to update department');
                }
            })
            .catch(error => {
                console.error('Error updating department:', error);
            });
    });
    // SAVE Location Changes
    document.getElementById('saveLocationChangesBtn').addEventListener('click', function () {
        const id = document.getElementById('editLocationId').value;
        const name = document.getElementById('editLocationName').value;
        console.log(id);
        console.log(name);

        fetch('php/updateLocationByID.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                name: name
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status.code === "200") {
                    alert('Location updated successfully');
                    loadLocations();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editLocationModal'));
                    modal.hide();
                } else {
                    alert(data.status.description || 'Unable to update location');
                }
            })
            .catch(error => {
                console.error('Error updating location:', error);
            });
    });

});// DOM ends 
// ===============================
// Show Personnel Modal
// ===============================
document.getElementById('editPersonnelModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const personId = button.getAttribute('data-id');

    // First fetch personnel data

    //data was not being fetched
    fetch(`php/getPersonnelByID.php?id=${personId}`)
        .then(response => response.json())
        .then(data => {
            const person = data.data.personnel[0];


            console.log(person);
            // Populate input fields
            document.getElementById('editPersonnelId').value = person.id;
            document.getElementById('editPersonnelFirstName').value = person.firstName;
            document.getElementById('editPersonnelLastName').value = person.lastName;
            document.getElementById('editPersonnelEmail').value = person.email;

            // Now load departments and select the correct one
            return fetch('php/getAllDepartments.php')
                .then(res => res.json())
                .then(deptData => {
                    const select = document.getElementById('editPersonnelDepartment');
                    select.innerHTML = ''; // Clear previous

                    deptData.data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.id;
                        option.text = dept.name;

                        // Preselect the current department
                        if (dept.id == person.departmentID) {
                            option.selected = true;
                        }

                        select.appendChild(option);
                    });
                });
        })
        .catch(error => console.error('Error loading personnel or departments:', error));
});





// Show Department Modal


document.getElementById('editDepartmentModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const deptId = button.getAttribute('data-id');
    // Added additional code for selectbox
    fetch(`php/getDepartmentByID.php?id=${deptId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('editDepartmentId').value = data.data[0].id;
            document.getElementById('editDepartmentName').value = data.data[0].name;
            const select = document.getElementById('editDepartmentLocation');

            data.locationData.forEach(loc => {
                const option = document.createElement('option');
                option.value = loc.id;
                option.textContent = loc.name;
                if (data.data[0].locationID === loc.id) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading department data:', error));
});


// Load fresh data 
document.getElementById('editLocationModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const locId = button.getAttribute('data-id');

    // First CLEAR field to avoid "old value" problem
    document.getElementById('editLocationId').value = '';
    document.getElementById('editLocationName').value = '';

    // Now load data
    fetch(`php/getLocationByID.php?id=${locId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editLocationId').value = data.data.id;
            document.getElementById('editLocationName').value = data.data.name;
        })
        .catch(error => console.error('Error loading location data:', error));
});


