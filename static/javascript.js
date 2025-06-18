document.addEventListener("DOMContentLoaded", function () {
    function updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll(".nav-links a");
        
        // Remove all active classes
        links.forEach(link => link.classList.remove("active"));
        
        // Find the best matching link
        let bestMatch = null;
        let bestMatchLength = 0;
        
        links.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            // Exact match gets priority
            if (linkPath === currentPath) {
                bestMatch = link;
                bestMatchLength = linkPath.length;
            }
            // Partial match (for nested routes)
            else if (currentPath.startsWith(linkPath) && linkPath.length > bestMatchLength && linkPath !== '/') {
                bestMatch = link;
                bestMatchLength = linkPath.length;
            }
            // Handle root path specially
            else if (linkPath === '/' && currentPath === '/' && bestMatchLength === 0) {
                bestMatch = link;
                bestMatchLength = 1;
            }
        });
        
        if (bestMatch) {
            bestMatch.classList.add("active");
        }
    }
    
    // Update on load
    updateActiveNavLink();
    
    // Update after a small delay (handles redirect scenarios)
    setTimeout(updateActiveNavLink, 250);
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("survey-form");
    const dobInput = document.getElementById("date_of_birth");
    const dobError = document.getElementById("dob-error");
    
    // Real-time validation as user types/changes date
    dobInput.addEventListener("change", function() {
        validateAge();
    });
    
    // Form submission validation
    form.addEventListener("submit", function (e) {
        if (!validateAge()) {
            e.preventDefault(); // Only prevent submission if validation fails
            return;
        }
        
        e.preventDefault();
        // If validation passes, show success message
        alert("✅ Survey submitted successfully! Thank you for your participation.");
        form.submit();
        // Let the form submit normally to the database
        // The form will reload/redirect after submission, so no need to reset manually
    });
    
    function validateAge() {
        const dobValue = new Date(dobInput.value);
        const today = new Date();
        
        // Clear previous error
        dobError.textContent = "";
        
        // Check if date is valid
        if (isNaN(dobValue.getTime())) {
            dobError.textContent = "Please enter a valid date.";
            return false;
        }
        
        // Check if date is not in the future
        if (dobValue > today) {
            dobError.textContent = "Date of birth cannot be in the future.";
            return false;
        }
        
        // Calculate age
        let age = today.getFullYear() - dobValue.getFullYear();
        const monthDiff = today.getMonth() - dobValue.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobValue.getDate())) {
            age--;
        }
        
        // Validate age range
        if (age < 5 || age > 120) {
            dobError.textContent = `🚫 Age must be between 5 and 120 years. Your calculated age: ${age}`;
            return false;
        }

        dobError.textContent = "";
        return true;
    }
});




  
  

  
