// main.js
let currentDeleteId = null;
let currentDeleteType = null;
document.addEventListener("DOMContentLoaded", function () {
  // Track the current tab (default to 'personnel')
  let currentTab = "personnel";
  // const modalElement = document.getElementById("confirmDeleteModal");
  // const modalMessage = document.getElementById("confirmDeleteMessage");
  // const confirmBtn = document.getElementById("confirmDeleteActionBtn");
  // const confirmModal = new bootstrap.Modal(modalElement);
  const modalEl = document.getElementById("confirmDeleteModal");
  const deleteForm = document.getElementById("deleteConfirmForm");
  const deleteMessage = document.getElementById("deleteConfirmMessage");
  const deleteIdInput = document.getElementById("deleteEntryId");
  const deleteTypeInput = document.getElementById("deleteEntryType");

  const confirmModal = new bootstrap.Modal(modalEl);
  loadPersonnel();

  // Handle tab switching
  document.getElementById("personnelBtn").addEventListener("click", () => {
    currentTab = "personnel";
    document.getElementById("multiplefiltersBtn").style.display = "block";
    document.querySelectorAll("#filterForPerson select").forEach((select) => {
      select.selectedIndex = 0;
    });
    loadPersonnel();
  });

  document.getElementById("departmentsBtn").addEventListener("click", () => {
    currentTab = "departments";
    document.getElementById("multiplefiltersBtn").style.display = "block";
    document
      .querySelectorAll("#filterForDepartment select")
      .forEach((select) => {
        select.selectedIndex = 0;
      });
    loadDepartments();
  });

  document.getElementById("locationsBtn").addEventListener("click", () => {
    currentTab = "locations";
    document.getElementById("multiplefiltersBtn").style.display = "none";
    loadLocations();
  });

  // Refresh current tab
  document.getElementById("refreshBtn").addEventListener("click", () => {
    // Clear Search Field
    document.getElementById("searchInp").value = "";
    if (currentTab === "personnel") loadPersonnel();
    else if (currentTab === "departments") loadDepartments();
    else if (currentTab === "locations") loadLocations();
  });
  // Handle Add Button (opens the correct Add Modal based on active tab)
  document.getElementById("addBtn").addEventListener("click", function () {
    if (document.getElementById("personnelBtn").classList.contains("active")) {
      // Clear previous values
      document.getElementById("addPersonnelFirstName").value = "";
      document.getElementById("addPersonnelLastName").value = "";
      document.getElementById("addPersonnelEmail").value = "";
      // Fetch departments for dropdown
      fetch("php/getAllDepartments.php")
        .then((res) => res.json())
        .then((data) => {
          const select = document.getElementById("addPersonnelDepartment");
          select.innerHTML = ""; // Clear previous
          data.data.forEach((dept) => {
            const option = document.createElement("option");
            option.value = dept.id;
            option.text = dept.name;
            select.appendChild(option);
          });
        });
      // Open modal
      new bootstrap.Modal(document.getElementById("addPersonnelModal")).show();
    } else if (
      document.getElementById("departmentsBtn").classList.contains("active")
    ) {
      document.getElementById("addDepartmentName").value = "";

      // Load locations for dropdown

      //Action is changed
      fetch("php/locations.php?action=get")
        .then((res) => res.json())
        .then((data) => {
          const select = document.getElementById("addDepartmentLocation");
          select.innerHTML = "";

          data.data.forEach((loc) => {
            const option = document.createElement("option");
            option.value = loc.id;
            option.text = loc.name;
            select.appendChild(option);
          });
        });

      new bootstrap.Modal(document.getElementById("addDepartmentModal")).show();
    } else if (
      document.getElementById("locationsBtn").classList.contains("active")
    ) {
      // Clear previous value
      document.getElementById("addLocationName").value = "";
      // Open modal
      new bootstrap.Modal(document.getElementById("addLocationModal")).show();
    }
  });

  // -----------------------------------------------------
  document
    .getElementById("multiplefiltersBtn")
    .addEventListener("click", function () {
      const isPersonnelActive = document
        .getElementById("personnelBtn")
        ?.classList.contains("active");
      const isDepartmentsActive = document
        .getElementById("departmentsBtn")
        ?.classList.contains("active");

      if (isPersonnelActive) {
        // === Populate Departments ===
        fetch("php/getAllDepartments.php")
          .then((res) => res.json())
          .then((data) => {
            const deptSelect = document.getElementById("all-departments");
            if (deptSelect && Array.isArray(data.data)) {
              deptSelect.innerHTML = ""; // Clear existing options
              const emptyOption = document.createElement("option");
              emptyOption.value = "";
              emptyOption.textContent = "Select Department";
              deptSelect.appendChild(emptyOption);

              data.data.forEach((dept) => {
                const option = document.createElement("option");
                option.value = dept.name;
                option.textContent = dept.name;
                deptSelect.appendChild(option);
              });
            }
          })
          .catch((err) => console.error("Error fetching departments:", err));

        // === Populate Locations ===
        fetch("php/locations.php?action=get")
          .then((res) => res.json())
          .then((data) => {
            const locSelect = document.getElementById("all-locations");
            if (locSelect && Array.isArray(data.data)) {
              locSelect.innerHTML = ""; // Clear existing options
              const emptyOption = document.createElement("option");
              emptyOption.value = "";
              emptyOption.textContent = "Select Location";
              locSelect.appendChild(emptyOption);

              data.data.forEach((loc) => {
                const option = document.createElement("option");
                option.value = loc.name;
                option.textContent = loc.name;
                locSelect.appendChild(option);
              });

              // Either/Or filter enforcement
              document
                .getElementById("all-departments")
                .addEventListener("change", function () {
                  if (this.value) {
                    locSelect.value = "";
                  }
                });

              locSelect.addEventListener("change", function () {
                if (this.value) {
                  document.getElementById("all-departments").value = "";
                }
              });
            }
          })
          .catch((err) => console.error("Error fetching locations:", err));

        // Show the personnel filter modal
        const modalEl = document.getElementById("filterForPerson");
        if (modalEl) {
          new bootstrap.Modal(modalEl).show();
        }
      } else if (isDepartmentsActive) {
        // === Populate Locations for Department filter modal ===
        fetch("php/locations.php?action=get")
          .then((res) => res.json())
          .then((data) => {
            const select = document.getElementById("all-locations-department");
            if (select && Array.isArray(data.data)) {
              select.innerHTML = ""; // Clear previous options
              const emptyOption = document.createElement("option");
              emptyOption.value = "";
              emptyOption.textContent = "Select Location";
              select.appendChild(emptyOption);

              data.data.forEach((loc) => {
                const option = document.createElement("option");
                option.value = loc.name;
                option.text = loc.name;
                select.appendChild(option);
              });
            }
          })
          .catch((err) => console.error("Error fetching locations:", err));

        // Show department filter modal
        new bootstrap.Modal(
          document.getElementById("filterForDepartment")
        ).show();
      }
    });

  // -----------------------------------------------------

  // ============================
  // REFRESH button
  // ============================
  document.getElementById("refreshBtn").addEventListener("click", () => {
    if (currentTab === "personnel") loadPersonnel();
    else if (currentTab === "departments") loadDepartments();
    else if (currentTab === "locations") loadLocations();
  });

  // ============================
  // FILTER button
  // ============================

  document.getElementById("searchInp").addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();

    // Decide which table to filter
    let tableBody;
    if (currentTab === "personnel") {
      tableBody = document.getElementById("personnelTableBody");
    } else if (currentTab === "departments") {
      tableBody = document.getElementById("departmentTableBody");
    } else if (currentTab === "locations") {
      tableBody = document.getElementById("locationTableBody");
    } else {
      return; // No valid tab
    }

    // Loop through all rows in the selected table
    Array.from(tableBody.getElementsByTagName("tr")).forEach((row) => {
      // Combine all text in this row
      const rowText = row.innerText.toLowerCase();

      // Show or hide row based on match
      if (rowText.includes(searchTerm)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  document
    .getElementById("apply_on_personal")
    ?.addEventListener("click", () => {
      const departmentSelect = document.getElementById("all-departments");
      const locationSelect = document.getElementById("all-locations");
      const department = departmentSelect?.value.trim().toLowerCase() || "";
      const location = locationSelect?.value.trim().toLowerCase() || "";
      if (!department && !location) {
        window.location.reload();
      }
      // Decide which table to filter
      let tableBody = null;
      if (currentTab === "personnel") {
        tableBody = document.getElementById("personnelTableBody");
      } else if (currentTab === "departments") {
        tableBody = document.getElementById("departmentTableBody");
      } else if (currentTab === "locations") {
        tableBody = document.getElementById("locationTableBody");
      }

      if (!tableBody) return; // Exit if tableBody is invalid

      // Loop through all rows in the selected table
      Array.from(tableBody.getElementsByTagName("tr")).forEach((row) => {
        const rowText = row.innerText.toLowerCase();

        const matchesDepartment = department && rowText.includes(department);
        const matchesLocation = location && rowText.includes(location);

        // Show row if either matches or if no filters are applied
        if (
          (department && location && matchesDepartment && matchesLocation) || // Both selected & both match
          (department && !location && matchesDepartment) || // Only department selected
          (!department && location && matchesLocation)
        ) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
      document.getElementById("cancel_personal")?.click();
    });

  document
    .getElementById("apply_on_department")
    ?.addEventListener("click", () => {
      const locationSelect = document.getElementById(
        "all-locations-department"
      );
      const location = locationSelect?.value.trim().toLowerCase() || "";

      // Decide which table to filter
      let tableBody = null;
      if (currentTab === "personnel") {
        tableBody = document.getElementById("personnelTableBody");
      } else if (currentTab === "departments") {
        tableBody = document.getElementById("departmentTableBody");
      } else if (currentTab === "locations") {
        tableBody = document.getElementById("locationTableBody");
      }

      if (!tableBody) return; // Exit if tableBody is invalid

      // Loop through all rows in the selected table
      Array.from(tableBody.getElementsByTagName("tr")).forEach((row) => {
        const rowText = row.innerText.toLowerCase();
        const matchesLocation = location && rowText.includes(location);

        // Show row if either matches or if no filters are applied
        if (location && matchesLocation) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
      document.getElementById("cancel_department")?.click();
    });

  // Load all personnel
  function loadPersonnel() {
    fetch(`php/getAll.php?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const tbody = document.getElementById("personnelTableBody");
        tbody.innerHTML = "";

        data.data.forEach((person) => {
          const row = document.createElement("tr");

          const nameCell = document.createElement("td");
          nameCell.textContent = `${person.lastName}, ${person.firstName}`;
          row.appendChild(nameCell);

          const deptCell = document.createElement("td");
          deptCell.textContent = person.department;
          deptCell.className = "d-none d-md-table-cell";
          row.appendChild(deptCell);

          const locCell = document.createElement("td");
          locCell.textContent = person.location;
          locCell.className = "d-none d-md-table-cell";
          row.appendChild(locCell);

          const emailCell = document.createElement("td");
          emailCell.textContent = person.email;
          emailCell.className = "d-none d-md-table-cell";
          row.appendChild(emailCell);

          const actionCell = document.createElement("td");
          actionCell.className = "text-end";

          const editBtn = document.createElement("button");
          editBtn.className = "btn btn-primary btn-sm me-2";
          editBtn.setAttribute("data-bs-toggle", "modal");
          editBtn.setAttribute("data-bs-target", "#editPersonnelModal");
          editBtn.setAttribute("data-id", person.id);
          editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';

          const deleteBtn = document.createElement("button");
          deleteBtn.className =
            "btn btn-primary btn-sm deletePersonnelBtn deleteBtn";
          deleteBtn.setAttribute("data-type", "personnel");
          deleteBtn.setAttribute("data-id", person.id);
          deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

          actionCell.appendChild(editBtn);
          actionCell.appendChild(deleteBtn);

          row.appendChild(actionCell);
          tbody.appendChild(row);
        });
      })
      .catch((err) => console.error("Error loading personnel:", err));
  }

  // Load all departments
  function loadDepartments() {
    fetch("php/getAllDepartments.php")
      .then((res) => res.json())
      .then((data) => {
        const tbody = document.getElementById("departmentTableBody");
        tbody.innerHTML = "";

        data.data.forEach((dept) => {
          const row = document.createElement("tr");

          const nameCell = document.createElement("td");
          nameCell.textContent = dept.name;
          row.appendChild(nameCell);

          const locCell = document.createElement("td");
          locCell.textContent = dept.location;
          locCell.className = "d-none d-md-table-cell";
          row.appendChild(locCell);

          const actionCell = document.createElement("td");
          actionCell.className = "text-end";

          const editBtn = document.createElement("button");
          editBtn.className = "btn btn-primary btn-sm me-2";
          editBtn.setAttribute("data-bs-toggle", "modal");
          editBtn.setAttribute("data-bs-target", "#editDepartmentModal");
          editBtn.setAttribute("data-id", dept.id);
          editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';

          const deleteBtn = document.createElement("button");
          deleteBtn.className =
            "btn btn-primary btn-sm deleteDepartmentBtn deleteBtn";
          deleteBtn.setAttribute("data-type", "department");
          deleteBtn.setAttribute("data-id", dept.id);
          deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

          actionCell.appendChild(editBtn);
          actionCell.appendChild(deleteBtn);

          row.appendChild(actionCell);
          tbody.appendChild(row);
        });
      })
      .catch((err) => console.error("Error loading departments:", err));
  }

  // Load all locations
  function loadLocations() {
    fetch("php/locations.php?action=get")
      .then((res) => res.json())
      .then((data) => {
        const tbody = document.getElementById("locationTableBody");
        tbody.innerHTML = "";
        data.data.forEach((loc) => {
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          nameCell.textContent = loc.name;

          const actionCell = document.createElement("td");
          actionCell.className = "text-end";

          // Edit button
          const editBtn = document.createElement("button");
          editBtn.className = "btn btn-primary btn-sm me-2";
          editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
          editBtn.addEventListener("click", () => {
            const modal = new bootstrap.Modal(
              document.getElementById("editLocationModal")
            );
            document.getElementById("editLocationId").value = loc.id;
            document.getElementById("editLocationName").value = loc.name;
            modal.show();
          });

          // Delete button
          const deleteBtn = document.createElement("button");
          deleteBtn.className =
            "btn btn-primary btn-sm deleteLocationBtn deleteBtn";
          deleteBtn.setAttribute("data-id", loc.id);
          deleteBtn.setAttribute("data-type", "location");
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
      .catch((err) => console.error("Error loading locations:", err));
  }

  // Add department
  document
    .getElementById("addDepartmentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("addDepartmentName").value;
      const locationID = document.getElementById("addDepartmentLocation").value;

      if (name.trim() === "") {
        showAlert("Please enter department name", "Missing Field");
        return;
      }

      fetch(
        `php/insertDepartment.php?name=${encodeURIComponent(
          name
        )}&locationID=${locationID}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status.code === "200") {
            showAlert("Department added successfully!", "Success");

            bootstrap.Modal.getInstance(
              document.getElementById("addDepartmentModal")
            ).hide();
            loadDepartments();
          } else {
            showAlert(
              data.status.description || "Failed to add department",
              "Add Failed",
              "error"
            );
          }
        })
        .catch((error) => console.error("Error adding department:", error));
    });

  document
    .getElementById("addLocationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("addLocationName").value.trim();

      if (name === "") {
        showAlert("Please enter location name", "Missing Field", "warning");
        return;
      }

      fetch(`php/locations.php?action=add&name=${encodeURIComponent(name)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            showAlert("Location added successfully!", "Success");
            loadLocations();
            document.getElementById("addLocationName").value = "";
            bootstrap.Modal.getInstance(
              document.getElementById("addLocationModal")
            ).hide();
          } else {
            showAlert(
              data.status.description || "Unable to add location",
              "Add Failed",
              "error"
            );
          }
        })
        .catch((error) => console.error("Error adding location:", error));
    });

  // SAVE Personnel Changes
  document
    .getElementById("editPersonnelModal")
    .addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      const personId = button.getAttribute("data-id");

      // Fetch personnel details
      fetch(`php/getPersonnelByID.php?id=${personId}`)
        .then((response) => response.json())
        .then((data) => {
          const person = data.data.personnel[0];

          document.getElementById("editPersonnelId").value = person.id;
          document.getElementById("editPersonnelFirstName").value =
            person.firstName;
          document.getElementById("editPersonnelLastName").value =
            person.lastName;
          document.getElementById("editPersonnelEmail").value = person.email;

          // Load and populate departments
          return fetch("php/getAllDepartments.php")
            .then((res) => res.json())
            .then((deptData) => {
              const select = document.getElementById("editPersonnelDepartment");
              select.innerHTML = ""; // Clear previous options

              deptData.data.forEach((dept) => {
                const option = document.createElement("option");
                option.value = dept.id;
                option.text = dept.name;
                if (dept.id == person.departmentID) {
                  option.selected = true;
                }
                select.appendChild(option);
              });
            });
        })
        .catch((error) =>
          console.error("Error loading personnel or departments:", error)
        );
    });

  // SAVE button click
  document
    .getElementById("editPersonnelForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent default form submission behavior

      const id = document.getElementById("editPersonnelId").value;
      const firstName = document.getElementById("editPersonnelFirstName").value;
      const lastName = document.getElementById("editPersonnelLastName").value;
      const email = document.getElementById("editPersonnelEmail").value;
      const departmentId = document.getElementById(
        "editPersonnelDepartment"
      ).value;

      fetch("php/updatePersonnel.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          firstName,
          lastName,
          email,
          departmentID: departmentId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status.code === "200") {
            showAlert("Personnel updated successfully!", "Success");
            document.getElementById("searchInp").value = "";

            loadPersonnel();
            const modal = bootstrap.Modal.getInstance(
              document.getElementById("editPersonnelModal")
            );
            modal.hide();
          } else {
            showAlert(
              data.status.description || "Unable to update personnel",
              "Update Failed",
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error updating personnel:", error);
        });
    });

  // RESET form and clear select on close
  document
    .getElementById("editPersonnelModal")
    .addEventListener("hidden.bs.modal", function () {
      document.getElementById("editPersonnelForm").reset();
      document.getElementById("editPersonnelDepartment").innerHTML = "";
    });

  // ADD PERSONNEL
  document
    .getElementById("addPersonnelForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const firstName = document
        .getElementById("addPersonnelFirstName")
        .value.trim();
      const lastName = document
        .getElementById("addPersonnelLastName")
        .value.trim();
      const email = document.getElementById("addPersonnelEmail").value.trim();
      const departmentID = document.getElementById(
        "addPersonnelDepartment"
      ).value;

      if (!firstName || !lastName || !email || !departmentID) {
        showAlert(
          "Please fill in all fields.",
          "Missing Information",
          "warning"
        );
        return;
      }

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("departmentID", departmentID);

      fetch("php/insertPersonnel.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status.code === "200") {
            showAlert("Personnel added successfully!", "Success");
            loadPersonnel();
            bootstrap.Modal.getInstance(
              document.getElementById("addPersonnelModal")
            ).hide();
          } else {
            showAlert(
              data.status.description || "Unable to add personnel.",
              "Add Failed",
              "error"
            );
          }
        })
        .catch((error) => console.error("Error adding personnel:", error));
    });

  // RESET Add Personnel form on modal close
  document
    .getElementById("addPersonnelModal")
    .addEventListener("hidden.bs.modal", function () {
      document.getElementById("addPersonnelForm").reset();

      // Optional: clear dynamically loaded department dropdown if needed
      document.getElementById("addPersonnelDepartment").innerHTML = "";
    });

  // SAVE Department Changes
  document
    .getElementById("editDepartmentForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const id = document.getElementById("editDepartmentId").value;
      const name = document.getElementById("editDepartmentName").value;
      const locationId = document.getElementById(
        "editDepartmentLocation"
      ).value;

      fetch("php/updateDepartment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, locationID: locationId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status.code === "200") {
            document.getElementById("searchInp").value = "";

            showAlert("Department updated successfully!", "Success");
            loadDepartments();
            bootstrap.Modal.getInstance(
              document.getElementById("editDepartmentModal")
            ).hide();
          } else {
            showAlert(
              data.status.description || "Unable to update department",
              "Update Failed",
              "error"
            );
          }
        })
        .catch((error) => console.error("Error updating department:", error));
    });

  // RESET form and select on modal close
  document
    .getElementById("editDepartmentModal")
    .addEventListener("hidden.bs.modal", function () {
      const form = document.getElementById("editDepartmentForm");
      form.reset();

      // Clear select options so next open gets fresh data
      const select = document.getElementById("editDepartmentLocation");
      select.innerHTML = "";
    });

  // SAVE Location Changes
  document
    .getElementById("editLocationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const id = document.getElementById("editLocationId").value;
      const name = document.getElementById("editLocationName").value;

      fetch("php/updateLocationByID.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status.code === "200") {
            document.getElementById("searchInp").value = "";

            showAlert("Location updated successfully!", "Success");

            loadLocations();
            bootstrap.Modal.getInstance(
              document.getElementById("editLocationModal")
            ).hide();
          } else {
            showAlert(
              data.status.description || "Unable to update location",
              "Update Failed",
              "error"
            );
          }
        })
        .catch((error) => console.error("Error updating location:", error));
    });

  // RESET Location form on modal close
  document
    .getElementById("editLocationModal")
    .addEventListener("hidden.bs.modal", function () {
      const form = document.getElementById("editLocationForm");
      if (form) {
        form.reset();
      } else {
        // If no <form>, manually clear inputs
        document.getElementById("editLocationId").value = "";
        document.getElementById("editLocationName").value = "";
      }
    });

  // DELETE Action
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".deleteBtn");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    const type = btn.getAttribute("data-type");

    // Set hidden inputs
    deleteIdInput.value = id;
    deleteTypeInput.value = type;
    // Dependency check only for department or location
    if (type === "department" || type === "location") {
      fetch(`php/checkDependencies.php?id=${id}&type=${type}`)
        .then((res) => res.json())
        .then((depData) => {
          if (depData.hasDependencies) {
            // Fetch the entry name to use in the dependency warning
            fetch(`php/getEntryName.php?id=${id}&type=${type}`)
              .then((res) => res.json())
              .then((data) => {
                const entryName = data.name || "this entry";
                let relatedLabel = "";

                if (type === "department")
                  relatedLabel = `${depData.count} employee(s)`;
                else if (type === "location")
                  relatedLabel = `${depData.count} department(s)`;

                const dependncyMessage = document.getElementById(
                  "DependencyCheckMessage"
                );
                dependncyMessage.innerText = `You cannot remove the entry for "${entryName}" because it has ${relatedLabel} assigned to it.`;

                const DependencyCheckModal = document.getElementById(
                  "DependencyCheckModal"
                );
                new bootstrap.Modal(DependencyCheckModal).show();
              })
              .catch(() => {
                showAlert(
                  "This entry has dependencies and cannot be deleted.",
                  "Delete Failed",
                  "warning"
                );
              });

            return;
          }

          // No dependencies — continue to fetch name and show modal
          fetch(`php/getEntryName.php?id=${id}&type=${type}`)
            .then((res) => res.json())
            .then((data) => {
              let label = type;
              if (type === "personnel") label = "employee";
              if (type === "department") label = "department";
              if (type === "location") label = "location";

              const name = data.name || "this entry";
              deleteMessage.innerText = `Are you sure you want to delete "${name}" ${label}?`;
              confirmModal.show();
            })
            .catch(() => {
              deleteMessage.innerText =
                "Are you sure you want to delete this entry?";
              confirmModal.show();
            });
        })
        .catch((err) => {
          console.error("Error checking dependencies:", err);
          showAlert("An error occurred. Please try again.", "Error", "error");
        });
    } else {
      // For personnel (no dependency check needed)
      fetch(`php/getEntryName.php?id=${id}&type=${type}`)
        .then((res) => res.json())
        .then((data) => {
          let label = type;
          if (type === "personnel") label = "employee";

          const name = data.name || "this entry";
          deleteMessage.innerText = `Are you sure you want to delete "${name}" ${label}?`;
          confirmModal.show();
        })
        .catch(() => {
          deleteMessage.innerText =
            "Are you sure you want to delete this entry?";
          confirmModal.show();
        });
    }
  });

  // Submit handler for form
  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = deleteIdInput.value;
    const type = deleteTypeInput.value;
    confirmModal.hide();
    // Type-to-URL map
    const deleteRoutes = {
      personnel: {
        url: (id) => `php/deletePersonnelByID.php?id=${id}`,
        reload: typeof loadPersonnel === "function" ? loadPersonnel : null,
      },
      department: {
        url: (id) => `php/deleteDepartmentByID.php?id=${id}`,
        reload: typeof loadDepartments === "function" ? loadDepartments : null,
      },
      location: {
        url: (id) => `php/deleteLocation.php?id=${id}`,
        reload: typeof loadLocations === "function" ? loadLocations : null,
      },
    };

    const config = deleteRoutes[type];
    if (!config) return showAlert("Unknown delete type", "Error");

    fetch(config.url(id))
      .then((res) => res.json())
      .then((data) => {
        if (data.status.code === "200") {
          document.getElementById("searchInp").value = "";

          showAlert(
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } deleted successfully!`,
            "Deleted"
          );
          config.reload?.();
        } else {
          showAlert(
            data.status.description || "Unable to delete entry",
            "Error"
          );
        }
      });
  });
  //end DElete Action
}); // DOM ends

// ===============================
// Show Personnel Modal
// ===============================
document
  .getElementById("editPersonnelModal")
  .addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const personId = button.getAttribute("data-id");
    // First fetch personnel data
    //data was not being fetched
    fetch(`php/getPersonnelByID.php?id=${personId}`)
      .then((response) => response.json())
      .then((data) => {
        const person = data.data.personnel[0];

        // Populate input fields
        document.getElementById("editPersonnelId").value = person.id;
        document.getElementById("editPersonnelFirstName").value =
          person.firstName;
        document.getElementById("editPersonnelLastName").value =
          person.lastName;
        document.getElementById("editPersonnelEmail").value = person.email;

        // Now load departments and select the correct one
        return fetch("php/getAllDepartments.php")
          .then((res) => res.json())
          .then((deptData) => {
            const select = document.getElementById("editPersonnelDepartment");
            select.innerHTML = ""; // Clear previous

            deptData.data.forEach((dept) => {
              const option = document.createElement("option");
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
      .catch((error) =>
        console.error("Error loading personnel or departments:", error)
      );
  });

// Show Department Modal
document
  .getElementById("editDepartmentModal")
  .addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const deptId = button.getAttribute("data-id");
    // Added additional code for selectbox
    fetch(`php/getDepartmentByID.php?id=${deptId}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("editDepartmentId").value = data.data[0].id;
        document.getElementById("editDepartmentName").value = data.data[0].name;
        const select = document.getElementById("editDepartmentLocation");

        data.locationData.forEach((loc) => {
          const option = document.createElement("option");
          option.value = loc.id;
          option.textContent = loc.name;
          if (data.data[0].locationID === loc.id) {
            option.selected = true;
          }
          select.appendChild(option);
        });
      })
      .catch((error) => console.error("Error loading department data:", error));
  });

// Load fresh data
document
  .getElementById("editLocationModal")
  .addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const locId = button.getAttribute("data-id");

    // First CLEAR field to avoid "old value" problem
    document.getElementById("editLocationId").value = "";
    document.getElementById("editLocationName").value = "";

    // Now load data
    fetch(`php/getLocationByID.php?id=${locId}`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("editLocationId").value = data.data.id;
        document.getElementById("editLocationName").value = data.data.name;
      })
      .catch((error) => console.error("Error loading location data:", error));
  });

// Reset Add Department form
document
  .getElementById("addDepartmentModal")
  ?.addEventListener("hidden.bs.modal", function () {
    document.getElementById("addDepartmentForm").reset();
    document.getElementById("addDepartmentLocation").innerHTML = "";
  });

// Reset Add Location form
document
  .getElementById("addLocationModal")
  ?.addEventListener("hidden.bs.modal", function () {
    document.getElementById("addLocationForm").reset();
  });
function showAlert(message, title = "Alert") {
  document.getElementById("customAlertTitle").textContent = title;
  document.getElementById("customAlertMessage").textContent = message;
  const modal = new bootstrap.Modal(
    document.getElementById("customAlertModal")
  );
  modal.show();
}
