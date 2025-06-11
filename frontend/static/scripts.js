document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  const doctorNameEl = document.getElementById("doctor-name");
  const dayEl = document.getElementById("current-day");
  const dateEl = document.getElementById("current-date");
  const patientListEl = document.getElementById("patient-list");
  const greetingView = document.getElementById("greeting-view");
  const patientView = document.getElementById("patient-view");
  const resultBox = document.getElementById("result-box");
  const predictionResult = document.getElementById("prediction-result");
  const selectedPatientNameEl = document.getElementById("selected-patient-name");

  let selectedPatientId = null;

  // Set current date
  const date = new Date();
  dayEl.innerText = date.toLocaleDateString('en-US', { weekday: 'long' });
  dateEl.innerText = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  // Fetch doctor name
  fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.name) doctorNameEl.innerText = `DR. ${data.name.toUpperCase()}`;
    });

  // Load Patients
  function loadPatients() {
    fetch("/api/patients", {
      headers: { Authorization: token }
    })
      .then(res => {
        if (!res.ok) throw new Error("Patient fetch failed");
        return res.json();
      })
      .then(patients => {
        patientListEl.innerHTML = "";
        patients.forEach(patient => {
          const btn = document.createElement("button");
          btn.textContent = patient.name;
          btn.onclick = () => selectPatient(patient);
          patientListEl.appendChild(btn);
        });
      })
      .catch(err => console.error("Error loading patients:", err));
  }

  loadPatients();

  // Modal handlers
  const modal = document.getElementById("add-patient-modal");
  document.getElementById("add-patient-btn").onclick = () => modal.classList.remove("hidden");
  document.getElementById("cancel-patient").onclick = () => modal.classList.add("hidden");

  document.getElementById("save-patient").onclick = () => {
    const name = document.getElementById("new-patient-name").value;
    const age = document.getElementById("new-patient-age").value;
    const gender = document.getElementById("new-patient-gender").value;

    fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ name, age, gender })
    })
      .then(res => {
        if (!res.ok) throw new Error("Add patient failed");
        return res.json();
      })
      .then(data => {
        modal.classList.add("hidden");
        loadPatients();
      })
      .catch(err => console.error("Error adding patient:", err));
  };

  // Select patient
  function selectPatient(patient) {
    selectedPatientId = patient.id;
    selectedPatientNameEl.innerText = patient.name;
    greetingView.classList.add("hidden");
    patientView.classList.remove("hidden");
    predictionResult.innerText = "No scan uploaded yet.";
  }

  // Upload and predict
  document.getElementById("upload-btn").onclick = () => {
    const fileInput = document.getElementById("scan-file");
    const file = fileInput.files[0];
    if (!file || !selectedPatientId) {
      alert("Please select a patient and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("patient_id", selectedPatientId);

    fetch("/api/lung-scans", {
      method: "POST",
      headers: { Authorization: token },
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error("Scan upload failed");
        return res.json();
      })
      .then(scan => {
        if (!scan.id) throw new Error("Scan ID missing");
        return fetch("/api/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({ scan_id: scan.id })
        });
      })
      .then(res => {
        if (!res.ok) throw new Error("Prediction failed");
        return res.json();
      })
      .then(result => {
        if (!result.prediction) throw new Error("No prediction returned");
        predictionResult.innerText =
          `Result: ${result.prediction.predicted_class}\nConfidence: ${result.prediction.confidence}`;
      })
      .catch(err => {
        console.error("Prediction error:", err);
        predictionResult.innerText = "Prediction failed. Try again.";
      });
  };
});
