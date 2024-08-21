import { fireErr, fireSuccess } from "./alertUtil.js";

import {
    passLengthErr,
    copyPassSuccss,
    emptyPassWhenCopyErr,
    noCheckboxesCheckedErr,
    specialSymbols
} from './constants.js';

const form = document.querySelector('.formSection form');
const slider = document.getElementById('passLengthRange');
const copyPassBtn = document.querySelector('.copyPasswordBtn');
const passLengthSpan = document.getElementById('passLengthValue');
const generatedPasswordEl = document.getElementById('generatedPassword');

const checkboxContainer = document.querySelectorAll('.checkboxContainer');

checkboxContainer.forEach(container => {
    const checkbox = container.querySelector('input[type="checkbox"]');
    const label = container.querySelector('label');

    checkbox.addEventListener('click', (e) => e.stopPropagation());
    label.addEventListener('click', (e) => e.stopPropagation());

    container.addEventListener('click', () => checkbox.checked = !checkbox.checked);
});

copyPassBtn.addEventListener('click', () => {
    const password = generatedPasswordEl.textContent;

    if (!password) {
        fireErr(emptyPassWhenCopyErr);
        return;
    }

    navigator.clipboard.writeText(password)
        .then(() => fireSuccess(copyPassSuccss))
        .catch((reason) => fireErr(reason));
});


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

form.addEventListener('submit', (e) => {
    e.preventDefault();

    var formData = new FormData(form);

    if (!formData.has('numbers') &&
        !formData.has('special') &&
        !formData.has('lowercase') &&
        !formData.has('uppercase')) {
            fireErr(noCheckboxesCheckedErr);
        return;
    }

    const generatedPassword = generatePassword(
        formData.has('lowercase'),
        formData.has('uppercase'),
        formData.has('numbers'),
        formData.has('special'),
        Number(formData.get('passLengthRange')));

    generatedPasswordEl.textContent = generatedPassword;

    generatedPasswordEl.classList.add('animate__animated', 'animate__backInLeft', 'animate__faster');
    generatedPasswordEl.addEventListener(
        'animationend',
        (e) => e.currentTarget.classList.remove('animate__animated', 'animate__backInLeft', 'animate__faster'),
        { once: true }
    );
});

const getRandomLower = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);
const getRandomUpper = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
const getRandomNumber = () => Number(String.fromCharCode(Math.floor(Math.random() * 10) + 48));
const getRandomSymbol = () => specialSymbols[Math.floor(Math.random() * specialSymbols.length)];

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
}

function generatePassword(lower, upper, number, symbol, length) {
    if (length < 10 || length > 100) {
        fireErr(passLengthErr);
    }

    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }

    const finalPassword = generatedPassword.slice(0, length);

    return finalPassword;
}