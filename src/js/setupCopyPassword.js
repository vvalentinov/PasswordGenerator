import { fireErr, fireSuccess } from "./alertUtil.js";
import { emptyPassWhenCopyErr, copyPassSuccss } from "./constants.js";

export function setupCopyPassword() {
    const copyPassBtn = document.querySelector('.copyPasswordBtn');

    copyPassBtn.addEventListener('click', () => {
        const password = document.getElementById('generatedPassword').textContent;

        if (!password) {
            fireErr(emptyPassWhenCopyErr);
            return;
        }

        navigator.clipboard.writeText(password)
            .then(() => fireSuccess(copyPassSuccss))
            .catch((reason) => fireErr(reason));
    });
}