
const form = document.getElementById("dailyLeaveForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const leave = {
      name: document.getElementById("name").value,
      roll: document.getElementById("roll").value,
      date: document.getElementById("leaveDate").value,
      reason: document.getElementById("reason").value,
      status: "Pending"
    };

    let leaves = JSON.parse(localStorage.getItem("dailyLeaves")) || [];
    leaves.push(leave);
    localStorage.setItem("dailyLeaves", JSON.stringify(leaves));

    document.getElementById("successMsg").textContent = "Leave Applied Successfully!";
    form.reset();
  });
}

// Admin View (Approve/Reject)
const table = document.getElementById("leaveTable");
if (table) {
  const tbody = table.querySelector("tbody");
  let leaves = JSON.parse(localStorage.getItem("dailyLeaves")) || [];

  leaves.forEach((leave, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${leave.name}</td>
      <td>${leave.roll}</td>
      <td>${leave.date}</td>
      <td>${leave.reason}</td>
      <td>${leave.status}</td>
      <td>
        <button onclick="updateLeaveStatus(${index}, 'Approved')">✅</button>
        <button onclick="updateLeaveStatus(${index}, 'Rejected')">❌</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Update Status
function updateLeaveStatus(index, newStatus) {
  let leaves = JSON.parse(localStorage.getItem("dailyLeaves")) || [];
  leaves[index].status = newStatus;
  localStorage.setItem("dailyLeaves", JSON.stringify(leaves));
  location.reload(); // Refresh table
}

// Time-based access control
const currentHour = new Date().getHours();
const currentMinute = new Date().getMinutes();

// Allowed time range: 8:00 AM to 10:00 AM
const allowStart = 8 * 60;   // 8:00 AM in minutes
const allowEnd = 10 * 60;    // 10:00 AM in minutes
const now = currentHour * 60 + currentMinute;

if (now < allowStart || now > allowEnd) {
  document.body.innerHTML = `
    <div style="text-align:center; margin-top:100px;">
      <h2>🚫 Access Restricted</h2>
      <p>Leave applications are only allowed between <strong>8:00 AM and 10:00 AM</strong>.</p>
    </div>
  `;
} else {
  // The existing form submission logic goes here
  const form = document.getElementById("leaveForm");
  const msg = document.getElementById("msg");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const leaveData = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        date: document.getElementById("date").value,
        reason: document.getElementById("reason").value,
        status: "Pending"
      };

      let leaveList = JSON.parse(localStorage.getItem("dailyLeaves")) || [];
      leaveList.push(leaveData);
      localStorage.setItem("dailyLeaves", JSON.stringify(leaveList));

      msg.textContent = "✅ Leave Applied Successfully!";
      form.reset();
    });
  }
}
