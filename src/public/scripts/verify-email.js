function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor = [
            "#007bff",
            "#28a745",
            "#dc3545",
            "#ffc107",
            "#17a2b8",
        ][Math.floor(Math.random() * 5)];
        confetti.style.animation = `confetti ${
            Math.random() * 2 + 1
        }s ease-out forwards ${Math.random() * 2}s`;
        document.body.appendChild(confetti);
    }
}

function showResult(success, message) {
    const statusIcon = document.getElementById("status-icon");
    const statusTitle = document.getElementById("status-title");
    const statusMessage = document.getElementById("status-message");
    const actionButton = document.getElementById("action-button");

    if (success) {
        statusIcon.className = "success-icon";
        statusIcon.innerHTML = "✓";
        statusTitle.textContent = "Email Verified Successfully!";
        statusMessage.textContent =
            message ||
            "Your email has been successfully verified. You can now log in to your account.";
        actionButton.textContent = "Go to Login";
        // actionButton.href = "/login";
        createConfetti();
    } else {
        statusIcon.className = "error-icon";
        statusIcon.innerHTML = "✕";
        statusTitle.textContent = "Verification Failed";
        statusMessage.textContent =
            message ||
            "We encountered an error while verifying your email. Please try again.";
        actionButton.textContent = "Try Again";
        // actionButton.href = "/resend-verification";
    }
}

// Initialize verification result
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success") === "true";
    const message = urlParams.get("message");
    
    showResult(success, decodeURIComponent(message));
});
