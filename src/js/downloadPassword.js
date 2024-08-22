import { fireErr } from "./alertUtil.js";
import { emptyPassWhenDownloadErr } from "./constants.js";

export function downloadPassword() {
    const downloadPassBtn = document.querySelector('.downloadPasswordBtn');

    downloadPassBtn.addEventListener('click', () => {
        const password = document.getElementById('generatedPassword').textContent;

        if (!password) {
            fireErr(emptyPassWhenDownloadErr);
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
};