export function setupCheckboxToggle() {
    const checkboxesContainers = document.querySelectorAll('.checkboxContainer');

    checkboxesContainers.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        const label = container.querySelector('label');

        checkbox.addEventListener('click', (e) => e.stopPropagation());
        label.addEventListener('click', (e) => e.stopPropagation());

        container.addEventListener('click', () => checkbox.checked = !checkbox.checked);
    });
}