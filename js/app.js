const STORAGE_KEY = "libraryRegMembers";
const STAFF_SESSION_KEY = "libraryRegStaff";
const DEMO_STAFF_EMAIL = "petugas@libraryreg.local";
const DEMO_STAFF_PASSWORD = "petugas123";

const sampleMembers = [
  {
    id: "sample-1",
    name: "Andi Pratama",
    identityNumber: "230101001",
    studyProgram: "Informatika",
    membershipType: "Mahasiswa",
    phone: "081234567890",
    email: "andi@example.com",
    address: "Jl. Melati No. 10, Kota Contoh",
  },
  {
    id: "sample-2",
    name: "Siti Rahma",
    identityNumber: "230101002",
    studyProgram: "Sistem Informasi",
    membershipType: "Mahasiswa",
    phone: "081234567891",
    email: "siti@example.com",
    address: "Jl. Mawar No. 12, Kota Contoh",
  },
  {
    id: "sample-3",
    name: "Budi Santoso",
    identityNumber: "19881234",
    studyProgram: "Dosen",
    membershipType: "Dosen",
    phone: "081234567892",
    email: "budi@example.com",
    address: "Jl. Kenanga No. 3, Kota Contoh",
  },
  {
    id: "sample-4",
    name: "Maya Lestari",
    identityNumber: "230101003",
    studyProgram: "Manajemen",
    membershipType: "Mahasiswa",
    phone: "081234567893",
    email: "maya@example.com",
    address: "Jl. Anggrek No. 6, Kota Contoh",
  },
  {
    id: "sample-5",
    name: "Rizky Kurniawan",
    identityNumber: "230101004",
    studyProgram: "Akuntansi",
    membershipType: "Tenaga Kependidikan",
    phone: "081234567894",
    email: "rizky@example.com",
    address: "Jl. Merpati No. 8, Kota Contoh",
  },
];

function showAlert(message, type = "success") {
  const alertBox = document.getElementById("appAlert");
  if (!alertBox) return;

  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
  window.clearTimeout(showAlert.timeoutId);
  showAlert.timeoutId = window.setTimeout(() => alertBox.classList.add("d-none"), 5000);
}

function saveMembers(members) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    return true;
  } catch (error) {
    showAlert(`Data tidak dapat disimpan di browser: ${error.message}`, "danger");
    return false;
  }
}

function readMembers() {
  const storedMembers = localStorage.getItem(STORAGE_KEY);
  if (storedMembers === null) {
    if (!saveMembers(sampleMembers)) {
      throw new Error("Data contoh anggota tidak dapat disimpan.");
    }
    return [...sampleMembers];
  }

  const members = JSON.parse(storedMembers);
  if (!Array.isArray(members)) {
    throw new Error("Format data anggota di penyimpanan browser tidak valid.");
  }
  return members;
}

function identityIsTaken(identityNumber, exceptId, members) {
  const normalizedIdentity = identityNumber.trim().toLocaleLowerCase("id");
  return members.some(
    (member) =>
      member.id !== exceptId &&
      member.identityNumber.trim().toLocaleLowerCase("id") === normalizedIdentity,
  );
}

function initializeRegistration() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  let members;
  try {
    members = readMembers();
  } catch (error) {
    showAlert(`Data anggota tidak dapat dibaca: ${error.message}`, "danger");
    return;
  }

  const identityInput = document.getElementById("identityNumber");
  identityInput.addEventListener("input", () => identityInput.setCustomValidity(""));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    identityInput.setCustomValidity("");

    if (identityIsTaken(identityInput.value, null, members)) {
      identityInput.setCustomValidity("NIM/NIP sudah terdaftar.");
    }

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.reportValidity();
      if (identityInput.validationMessage === "NIM/NIP sudah terdaftar.") {
        showAlert("NIM/NIP tersebut sudah terdaftar. Periksa kembali data anggota.", "danger");
      }
      return;
    }

    const member = {
      id: `member-${Date.now()}`,
      name: document.getElementById("fullName").value.trim(),
      identityNumber: identityInput.value.trim(),
      studyProgram: document.getElementById("studyProgram").value.trim(),
      membershipType: document.getElementById("membershipType").value,
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
    };
    const updatedMembers = [...members, member];

    if (!saveMembers(updatedMembers)) return;

    members = updatedMembers;
    form.reset();
    form.classList.remove("was-validated");
    showAlert("Pendaftaran berhasil. Data anggota telah ditambahkan.", "success");
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

function initializeMemberTable() {
  const tableBody = document.getElementById("memberTableBody");
  if (!tableBody) return;
  if (!isStaffSignedIn()) {
    window.location.replace("login.html");
    return;
  }

  let members;
  try {
    members = readMembers();
  } catch (error) {
    showAlert(`Data anggota tidak dapat dibaca: ${error.message}`, "danger");
    tableBody.innerHTML = '<tr><td class="empty-row" colspan="8">Data gagal dimuat.</td></tr>';
    return;
  }

  const searchInput = document.getElementById("memberSearch");
  const countLabel = document.getElementById("memberCount");
  const detailModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("detailModal"));
  const editModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("editModal"));
  const deleteModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteModal"));
  let selectedMemberId = null;

  function renderMembers() {
    const query = searchInput.value.trim().toLocaleLowerCase("id");
    const filteredMembers = members.filter((member) =>
      `${member.name} ${member.identityNumber}`.toLocaleLowerCase("id").includes(query),
    );

    countLabel.textContent = `Menampilkan ${filteredMembers.length} dari ${members.length} data`;
    if (filteredMembers.length === 0) {
      tableBody.innerHTML = '<tr><td class="empty-row" colspan="8">Tidak ada anggota yang cocok.</td></tr>';
      return;
    }

    tableBody.innerHTML = filteredMembers
      .map(
        (member, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(member.name)}</td>
            <td>${escapeHtml(member.identityNumber)}</td>
            <td>${escapeHtml(member.studyProgram)}</td>
            <td>${escapeHtml(member.membershipType)}</td>
            <td>${escapeHtml(member.phone)}</td>
            <td>${escapeHtml(member.email)}</td>
            <td class="text-nowrap">
              <button class="btn btn-outline-primary" type="button" data-action="detail" data-id="${escapeHtml(member.id)}" aria-label="Lihat detail ${escapeHtml(member.name)}">Lihat</button>
              <button class="btn btn-outline-secondary" type="button" data-action="edit" data-id="${escapeHtml(member.id)}" aria-label="Edit ${escapeHtml(member.name)}">Edit</button>
              <button class="btn btn-outline-danger" type="button" data-action="delete" data-id="${escapeHtml(member.id)}" aria-label="Hapus ${escapeHtml(member.name)}">Hapus</button>
            </td>
          </tr>`,
      )
      .join("");
  }

  searchInput.addEventListener("input", renderMembers);

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const member = members.find((item) => item.id === button.dataset.id);
    if (!member) {
      showAlert("Data anggota yang dipilih tidak ditemukan.", "danger");
      return;
    }

    selectedMemberId = member.id;
    if (button.dataset.action === "detail") {
      const details = [
        ["Nama lengkap", member.name],
        ["NIM/NIP", member.identityNumber],
        ["Program studi", member.studyProgram],
        ["Jenis keanggotaan", member.membershipType],
        ["Nomor telepon", member.phone],
        ["Email", member.email],
        ["Alamat", member.address],
      ];
      document.getElementById("memberDetails").innerHTML = details
        .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`)
        .join("");
      detailModal.show();
    } else if (button.dataset.action === "edit") {
      document.getElementById("editName").value = member.name;
      document.getElementById("editIdentity").value = member.identityNumber;
      document.getElementById("editProgram").value = member.studyProgram;
      document.getElementById("editType").value = member.membershipType;
      document.getElementById("editPhone").value = member.phone;
      document.getElementById("editEmail").value = member.email;
      document.getElementById("editAddress").value = member.address;
      editModal.show();
    } else {
      document.getElementById("deleteMemberName").textContent = member.name;
      deleteModal.show();
    }
  });

  document.getElementById("editForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const identityInput = document.getElementById("editIdentity");
    const currentMember = members.find((member) => member.id === selectedMemberId);
    if (!currentMember) {
      showAlert("Data anggota yang akan diedit tidak ditemukan.", "danger");
      editModal.hide();
      return;
    }

    identityInput.setCustomValidity("");
    if (identityIsTaken(identityInput.value, currentMember.id, members)) {
      identityInput.setCustomValidity("NIM/NIP sudah digunakan anggota lain.");
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const updatedMember = {
      ...currentMember,
      name: document.getElementById("editName").value.trim(),
      identityNumber: identityInput.value.trim(),
      studyProgram: document.getElementById("editProgram").value.trim(),
      membershipType: document.getElementById("editType").value,
      phone: document.getElementById("editPhone").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      address: document.getElementById("editAddress").value.trim(),
    };
    const updatedMembers = members.map((member) =>
      member.id === currentMember.id ? updatedMember : member,
    );

    if (!saveMembers(updatedMembers)) return;
    members = updatedMembers;
    renderMembers();
    editModal.hide();
    showAlert("Data anggota berhasil diperbarui.", "success");
  });

  document.getElementById("editIdentity").addEventListener("input", (event) => {
    event.currentTarget.setCustomValidity("");
  });

  document.getElementById("confirmDelete").addEventListener("click", () => {
    const updatedMembers = members.filter((member) => member.id !== selectedMemberId);
    if (updatedMembers.length === members.length) {
      showAlert("Data anggota yang akan dihapus tidak ditemukan.", "danger");
      deleteModal.hide();
      return;
    }
    if (!saveMembers(updatedMembers)) return;

    members = updatedMembers;
    renderMembers();
    deleteModal.hide();
    showAlert("Data anggota berhasil dihapus.", "success");
  });

  renderMembers();
}

function initializeLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  if (isStaffSignedIn()) {
    window.location.replace("dashboard.html");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("staffEmail").value.trim().toLocaleLowerCase("id");
    const password = document.getElementById("staffPassword").value;

    if (email !== DEMO_STAFF_EMAIL || password !== DEMO_STAFF_PASSWORD) {
      showAlert("Email atau kata sandi demo tidak sesuai.", "danger");
      return;
    }

    try {
      sessionStorage.setItem(STAFF_SESSION_KEY, email);
    } catch (error) {
      showAlert(`Sesi petugas tidak dapat disimpan: ${error.message}`, "danger");
      return;
    }
    window.location.href = "dashboard.html";
  });
}

function isStaffSignedIn() {
  try {
    return sessionStorage.getItem(STAFF_SESSION_KEY) === DEMO_STAFF_EMAIL;
  } catch (error) {
    showAlert(`Status login tidak dapat diperiksa: ${error.message}`, "danger");
    return false;
  }
}

function initializePublicMemberTable() {
  const tableBody = document.getElementById("publicMemberTableBody");
  if (!tableBody) return;

  let members;
  try {
    members = readMembers();
  } catch (error) {
    showAlert(`Daftar anggota tidak dapat dimuat: ${error.message}`, "danger");
    tableBody.innerHTML = '<tr><td class="empty-row" colspan="4">Data gagal dimuat.</td></tr>';
    return;
  }

  const searchInput = document.getElementById("memberSearch");
  const countLabel = document.getElementById("publicMemberCount");

  function renderMembers() {
    const query = searchInput.value.trim().toLocaleLowerCase("id");
    const filteredMembers = members.filter((member) =>
      member.name.toLocaleLowerCase("id").includes(query),
    );

    countLabel.textContent = `Menampilkan ${filteredMembers.length} dari ${members.length} anggota`;
    if (filteredMembers.length === 0) {
      tableBody.innerHTML = '<tr><td class="empty-row" colspan="4">Tidak ada anggota yang cocok.</td></tr>';
      return;
    }

    tableBody.innerHTML = filteredMembers
      .map(
        (member, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(member.name)}</td>
            <td>${escapeHtml(member.studyProgram)}</td>
            <td>${escapeHtml(member.membershipType)}</td>
          </tr>`,
      )
      .join("");
  }

  searchInput.addEventListener("input", renderMembers);
  renderMembers();
}

function initializeDashboard() {
  if (!document.getElementById("memberTableBody") || !isStaffSignedIn()) return;

  const greeting = document.getElementById("staffGreeting");
  if (greeting) greeting.textContent = `Petugas: ${sessionStorage.getItem(STAFF_SESSION_KEY)}`;

  document.getElementById("logoutButton").addEventListener("click", () => {
    try {
      sessionStorage.removeItem(STAFF_SESSION_KEY);
    } catch (error) {
      showAlert(`Sesi tidak dapat diakhiri: ${error.message}`, "danger");
      return;
    }
    window.location.href = "login.html";
  });
}

function initializeActiveSectionNavigation() {
  const sectionLinks = [...document.querySelectorAll('.site-nav .nav-link[href^="#"]')];
  if (sectionLinks.length === 0) return;

  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const homeLink = document.querySelector('.site-nav .nav-link[href="index.html"]');

  function updateActiveLink() {
    const currentSection = sections.find(
      (section) => section.getBoundingClientRect().top <= 160 && section.getBoundingClientRect().bottom > 160,
    );
    sectionLinks.forEach((link) => link.classList.remove("active"));
    if (homeLink) homeLink.classList.remove("active");
    if (currentSection) {
      const activeLink = sectionLinks.find(
        (link) => link.getAttribute("href") === `#${currentSection.id}`,
      );
      if (activeLink) activeLink.classList.add("active");
    } else if (homeLink) {
      homeLink.classList.add("active");
    }
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeRegistration();
  initializePublicMemberTable();
  initializeMemberTable();
  initializeLogin();
  initializeDashboard();
  initializeActiveSectionNavigation();
});
