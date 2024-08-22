export function sliderChange() {
    const slider = document.getElementById('passLengthRange');
    const passLengthSpan = document.getElementById('passLengthValue');

    slider.addEventListener('input', (e) => passLengthSpan.textContent = e.currentTarget.value);

    slider.addEventListener('wheel', (e) => {
        e.preventDefault();

        const step = 1;
        const currentValue = Number(slider.value);

        slider.value = e.deltaY < 0 ?
            Math.min(currentValue + step, slider.max) :
            Math.max(currentValue - step, slider.min);

        passLengthSpan.textContent = slider.value;
    });
}