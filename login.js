document.getElementById("login_section_form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      
      localStorage.setItem("token", data.token);

      
      window.location.href = "index.html" ;
    } else {
     
      errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
    }
  } catch (error) {
    console.error(error);
    }
});

