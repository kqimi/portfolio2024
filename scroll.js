const myobserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.setAttribute('data-sectionstate', 'active');
        } else {
            entry.target.setAttribute('data-sectionstate', 'inactive');
        }
    });
});


document.querySelectorAll('.scroll-triggered').forEach((section) => {
    myobserver.observe(section);
});