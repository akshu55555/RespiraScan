document.getElementById("SignupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    
    const NMCid = document.getElementById("NMCid").value;
    const Name = document.getElementById("Name").value;
    const number = document.getElementById("number").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (NMCid === "" || Name === "" || number === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
    } else {
        alert("Login successful!");
        // Here you can add authentication logic
    }
});

// Function to toggle password visibility
function myFunction() {
    var x = document.getElementById("password"); // Ensure ID matches your password field
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
