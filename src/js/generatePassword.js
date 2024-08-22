import { fireErr } from "./alertUtil.js";
import { specialSymbols, noCheckboxesCheckedErr, passLengthErr } from "./constants.js";

export function generatePassword() {
    const form = document.querySelector('.formSection form');
    const generatedPasswordEl = document.getElementById('generatedPassword');

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
            fireErr(noCheckboxesCheckedErr);
            return;
        }

        const generatedPassword = generatePasswordFunc(
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
}

function generatePasswordFunc(lower, upper, number, symbol, length) {
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

    if (length < 10 || length > 100) {
        fireErr(passLengthErr);
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