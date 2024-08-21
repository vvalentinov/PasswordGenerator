export function fireErr(errorMessage) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
        customClass: {
            container: 'alertContainer'
        }
    });
}

export function fireSuccess(successMessage) {
    Swal.fire({
        timer: 5000,
        icon: "success",
        position: "top-end",
        title: successMessage,
        showConfirmButton: false,
    });
}