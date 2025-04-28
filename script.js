document
  .getElementById("loginBtn")
  .addEventListener("click", async function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store the token in localStorage
      document.getElementById("auth").style.display = "none"; // Hide the auth section
      document.getElementById("canvasContainer").style.display = "block"; // Show the canvas section
    } catch (error) {
      document.getElementById("error").innerText = error.message; // Display error message
    }
  });

document
  .getElementById("registerBtn")
  .addEventListener("click", async function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      alert(data.message); // Show success message
    } catch (error) {
      document.getElementById("error").innerText = error.message; // Display error message
    }
  });
