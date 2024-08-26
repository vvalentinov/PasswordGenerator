import { fireErr } from "./alertUtil.js";
import {
    specialSymbols,
    noCheckboxesCheckedErr,
    passLengthErr,
} from "./constants.js";

export function setupGeneratePassword() {
    const form = document.querySelector('.formSection form');
    const generatedPasswordEl = document.getElementById('generatedPassword');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        var formData = new FormData(form);

        const includesNumbers = formData.has('numbers');
        const includesSpecial = formData.has('special');
        const includesLowercase = formData.has('lowercase');
        const includesUppercase = formData.has('uppercase');
        const passwordLength = Number(formData.get('passLengthRange'));

        if (passwordLength < 10 || passwordLength > 100) {
            fireErr(passLengthErr);
            return;
        }

        if (!includesNumbers &&
            !includesSpecial &&
            !includesLowercase &&
            !includesUppercase) {
            fireErr(noCheckboxesCheckedErr);
            return;
        }

        const randomFunc = {
            ...(includesLowercase && { lower: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97) }),
            ...(includesUppercase && { upper: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65) }),
            ...(includesNumbers && { number: () => Number(String.fromCharCode(Math.floor(Math.random() * 10) + 48)) }),
            ...(includesSpecial && { symbol: () => specialSymbols[Math.floor(Math.random() * specialSymbols.length)] }),
        };

        const keys = Object.keys(randomFunc);

        let password = '';

        for (let index = 0; index < passwordLength; index++) {
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const randomChar = randomFunc[randomKey]();
            password += randomChar;
        }

        generatedPasswordEl.textContent = password;

        generatedPasswordEl.classList.add(
            'animate__animated',
            'animate__zoomIn',
            'animate__faster');

        generatedPasswordEl.addEventListener(
            'animationend',
            (e) => e.currentTarget.classList.remove(
                'animate__animated',
                'animate__zoomIn',
                'animate__faster'),
            { once: true },
        );

    });
}