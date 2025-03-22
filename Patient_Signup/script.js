document.getElementById("SignupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    const Name = document.getElementById("Name").value;
    const age = document.getElementById("age").value;
    const sex = document.getElementById("sex").value;
    const bldgrp = document.getElementById("bldgrp").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    if ( Name === "" || age === "" || sex === "" || bldgrp === "" ||email === "" || password === "" ) {
        alert("Please fill in all fields.");
    } else {
        alert("Login successful!");
        // Here you can add authentication logic
    }
});
