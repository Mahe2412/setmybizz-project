document.addEventListener('DOMContentLoaded', () => {
    const heroForm = document.getElementById('hero-form');
    const leadForm = document.getElementById('lead-form');
    const toast = document.getElementById('toast');

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    const handleFormSubmit = (e, formType) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        console.log(`Lead captured from ${formType}:`, data);
        
        // Simulate API call
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        setTimeout(() => {
            showToast(formType === 'hero' ? 'Success! You are on the list.' : 'Thank you! Our team will contact you soon.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            e.target.reset();
        }, 1500);
    };

    if (heroForm) {
        heroForm.addEventListener('submit', (e) => handleFormSubmit(e, 'hero'));
    }

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
    }

    // Scroll reveal logic
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .section-header, .contact-container').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 0';
            nav.style.background = 'rgba(7, 11, 20, 0.9)';
        } else {
            nav.style.padding = '1.5rem 0';
            nav.style.background = 'rgba(7, 11, 20, 0.7)';
        }
    });
});
