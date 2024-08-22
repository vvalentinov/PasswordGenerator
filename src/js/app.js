import { fireErr, fireSuccess } from "./alertUtil.js";

import * as constants from './constants.js';

const form = document.querySelector('.formSection form');
const slider = document.getElementById('passLengthRange');
const copyPassBtn = document.querySelector('.copyPasswordBtn');
const passLengthSpan = document.getElementById('passLengthValue');
const downloadPassBtn = document.querySelector('.downloadPasswordBtn');
const generatedPasswordEl = document.getElementById('generatedPassword');

downloadPassBtn.addEventListener('click', () => {
    const password = generatedPasswordEl.textContent;

    if (!password) {
        fireErr(constants.emptyPassWhenDownloadErr);
        return;
    }

    const blob = new Blob([password], { type: 'text/plain' });

    const link = document.createElement('a');

    link.download = 'password.txt';

    link.href = window.URL.createObjectURL(blob);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
});

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
        fireErr(constants.emptyPassWhenCopyErr);
        return;
    }

    navigator.clipboard.writeText(password)
        .then(() => fireSuccess(constants.copyPassSuccss))
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

    const includesNumbers = formData.has('numbers');
    const includesSpecial = formData.has('special');
    const includesLowercase = formData.has('lowercase');
    const includesUppercase = formData.has('uppercase');

    const noOptionsChecked =
        !includesNumbers &&
        !includesSpecial &&
        !includesLowercase &&
        !includesUppercase;

    if (noOptionsChecked) {
        fireErr(constants.noCheckboxesCheckedErr);
        return;
    }

    const generatedPassword = generatePassword(
        includesLowercase,
        includesUppercase,
        includesNumbers,
        includesSpecial,
        Number(formData.get('passLengthRange')));

    generatedPasswordEl.textContent = generatedPassword;

    generatedPasswordEl.classList.add('animate__animated', 'animate__zoomIn', 'animate__faster');
    generatedPasswordEl.addEventListener(
        'animationend',
        (e) => e.currentTarget.classList.remove('animate__animated', 'animate__zoomIn', 'animate__faster'),
        { once: true }
    );
});

const getRandomLower = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);
const getRandomUpper = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
const getRandomNumber = () => Number(String.fromCharCode(Math.floor(Math.random() * 10) + 48));
const getRandomSymbol = () => constants.specialSymbols[Math.floor(Math.random() * constants.specialSymbols.length)];

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
}

function generatePassword(lower, upper, number, symbol, length) {
    if (length < 10 || length > 100) {
        fireErr(constants.passLengthErr);
    }

    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [
        { lower },
        { upper },
        { number },
        { symbol }].filter(item => Object.values(item)[0]);

    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }

    const finalPassword = generatedPassword.slice(0, length);

    return finalPassword;
}