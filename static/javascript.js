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
            
            if (linkPath === currentPath) {
                bestMatch = link;
                bestMatchLength = linkPath.length;
            }

            else if (currentPath.startsWith(linkPath) && linkPath.length > bestMatchLength && linkPath !== '/') {
                bestMatch = link;
                bestMatchLength = linkPath.length;
            }

            else if (linkPath === '/' && currentPath === '/' && bestMatchLength === 0) {
                bestMatch = link;
                bestMatchLength = 1;
            }
        });
        
        if (bestMatch) {
            bestMatch.classList.add("active");
        }
    }
    
    updateActiveNavLink();
    
    // Update after a small delay (handles redirect scenarios)
    setTimeout(updateActiveNavLink, 250);
});



document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("survey-form");
    const dobInput = document.getElementById("date_of_birth");
    const dobError = document.getElementById("dob-error");
    const phoneInput = document.querySelector('input[name="contact_number"]');
    const phoneError = document.getElementById("contact-error");

    // Real-time phone number validation
    phoneInput.addEventListener("input", function() {
        // Remove any non-numeric characters as user types
        let value = this.value.replace(/[^0-9]/g, '');
 
        if (value.length > 10) {
            value = value.substring(0, 10);
        }

        this.value = value;
        
        validatePhone();
    });

    // Prevent non-numeric characters from being typed
    phoneInput.addEventListener("keypress", function(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });


    // Real-time validation as user types/changes date
    dobInput.addEventListener("change", function() {
        validateAge();
    });

    // Real-time validation for checkboxes
    document.querySelectorAll('input[name="favorite_food"]').forEach(checkbox => {
        checkbox.addEventListener("change", function() {
            validateCheckboxes();
        });
    });
    
    // Real-time validation for radio buttons
    const ratingGroups = ['movies', 'radio', 'eating_out', 'tv'];
    ratingGroups.forEach(groupName => {
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
            radio.addEventListener("change", function() {
                validateRadioGroup(groupName);
            });
        });
    });

    function validateAge() {
        const dobValue = new Date(dobInput.value);
        const today = new Date();
        
        dobError.textContent = "";
        
        // Check if date is valid
        if (isNaN(dobValue.getTime())) {
            dobError.textContent = "Please enter a valid date.";
            return false;
        }
        
        if (dobValue > today) {
            dobError.textContent = "Date of birth cannot be in the future.";
            return false;
        }
        
        let age = today.getFullYear() - dobValue.getFullYear();
        const monthDiff = today.getMonth() - dobValue.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobValue.getDate())) {
            age--;
        }
        
        // Validate age range
        if (age < 5 || age > 120) {
            dobError.textContent = `Age must be between 5 and 120 years. Your calculated age: ${age}`;
            return false;
        }

        dobError.textContent = "";
        return true;
    }

    function validatePhone() {
        const phoneValue = phoneInput.value;
        
        // Clear previous error
        phoneError.textContent = "";
        phoneInput.classList.remove('error-highlight');
        
        
        if (phoneValue === '') {
            phoneError.textContent = "Phone number is required!";
            phoneInput.classList.add('error-highlight');
            return false;
        }
             
        if (phoneValue.length !== 10) {
            phoneError.textContent = `Phone number must be exactly 10 digits.`;
            phoneInput.classList.add('error-highlight');
            return false;
        }
        
        if (!phoneValue.startsWith('0')) {
            phoneError.textContent = "Phone number must start with 0.";
            phoneInput.classList.add('error-highlight');
            return false;
        }
        
        // All validations passed
        phoneError.textContent = "";
        phoneInput.classList.remove('error-highlight');
        return true;
    }

    // Real-time validation functions
    function validateCheckboxes() {
        const favoriteFood = document.querySelectorAll('input[name="favorite_food"]:checked');
        const checkboxGroup = document.querySelector('.checkbox-group');
        
        if (favoriteFood.length > 0) {
            
            if (checkboxGroup) {
                checkboxGroup.classList.remove('error-highlight');
            }
            return true;
        } else {

            return false;
        }
    }
    
    function validateRadioGroup(groupName) {
        const selected = document.querySelector(`input[name="${groupName}"]:checked`);
        const firstRadio = document.querySelector(`input[name="${groupName}"]`);
        
        if (selected && firstRadio) {
            const tableRow = firstRadio.closest('tr');
            if (tableRow) {
                tableRow.classList.remove('error-highlight');
            }
            return true;
        }
        return false;
    }

    //Validate form fields (checkboxes and radio buttons)
    function validateFormFields() {
        let isValid = true;
        let errors = [];
        
        document.querySelectorAll('.error-highlight').forEach(el => {
            el.classList.remove('error-highlight');
        });
        
        // Validate favorite food checkboxes
        const favoriteFood = document.querySelectorAll('input[name="favorite_food"]:checked');
        if (favoriteFood.length === 0) {
            isValid = false;
            errors.push('• Select at least one favorite food');
            const checkboxGroup = document.querySelector('.checkbox-group');
            if (checkboxGroup) checkboxGroup.classList.add('error-highlight');
        }
        
        // Validate all rating questions
        const ratingGroups = [
            {name: 'movies', label: 'Movies'},
            {name: 'radio', label: 'Radio'},
            {name: 'eating_out', label: 'Eating Out'},
            {name: 'tv', label: 'TV'}
        ];
        
        ratingGroups.forEach(group => {
            const selected = document.querySelector(`input[name="${group.name}"]:checked`);
            if (!selected) {
                isValid = false;
                errors.push(`• Rate "${group.label}"`);
                const row = document.querySelector(`input[name="${group.name}"]`);
                if (row) {
                    const tableRow = row.closest('tr');
                    if (tableRow) tableRow.classList.add('error-highlight');
                }
            }
        });
        
        
        if (!isValid) {
            alert('Please complete the following:\n\n' + errors.join('\n'));
        }
        
        return isValid;
    }

    
    // Form submission validation
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const isAgeValid = validateAge();
        const isPhoneValid = validatePhone();
        const isFormComplete = validateFormFields();

        if (isAgeValid  && isPhoneValid && isFormComplete) {       
            alert("✅ Survey submitted successfully! Thank you for your participation.");
            form.submit();
        }  

    });
    
    
});

// Mobile navbar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle mobile menu
    if (navbarToggle && navLinks) {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link 
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navbarToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navbarToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navbarToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Handle window resize - close mobile menu if window gets larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navbarToggle) navbarToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        }
    });
    
});


(function initNavbar() {
    window.addEventListener('load', function() {

        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('main-nav');
        
        if (!toggle || !menu) {
            console.warn('Using class selectors as fallback');
            toggle = document.querySelector('.navbar-toggle');
            menu = document.querySelector('.nav-links');
        }
        
        if (!toggle || !menu) {
            console.error('Nav elements not found');
            return;
        }
        
        const newToggle = toggle.cloneNode(true);
        const newMenu = menu.cloneNode(true);
        toggle.replaceWith(newToggle);
        menu.replaceWith(newMenu);
        
        const cleanToggle = document.getElementById('nav-toggle') || newToggle;
        const cleanMenu = document.getElementById('main-nav') || newMenu;
        
        cleanToggle.addEventListener('click', function navToggle() {
            cleanMenu.classList.toggle('active');
            this.classList.toggle('is-active');

            const isActive = cleanMenu.classList.contains('active');
            cleanMenu.style.display = isActive ? 'flex' : 'none';
            
            console.log('Nav state:', {
                visible: isActive,
                computed: window.getComputedStyle(cleanMenu).display
            });
        });
        
        cleanMenu.classList.remove('active');
        cleanMenu.style.display = 'none';
    });
})();
