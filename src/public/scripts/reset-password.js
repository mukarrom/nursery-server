document.getElementById('resetForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const newPasswordError = document.getElementById('newPasswordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  
  // Reset errors
  newPasswordError.textContent = '';
  confirmPasswordError.textContent = '';
  
  let isValid = true;
  
  // Validate password length
  if (newPassword.length < 6) {
    newPasswordError.textContent = 'Password must be at least 6 characters';
    isValid = false;
  }
  
  // Validate password match
  if (newPassword !== confirmPassword) {
    confirmPasswordError.textContent = 'Passwords do not match';
    isValid = false;
  }
  
  if (isValid) {
    // Get token and email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    console.log('Submitting:', { token, email, newPassword }); // Debug log
    
    if (!token || !email) {
      alert('Invalid reset link - missing token or email');
      return;
    }
    
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          email: email,
          newPassword: newPassword
        })
      });
      
      const result = await response.json();
      
      console.log('Response:', result); // Debug log
      
      if (response.ok) {
        window.location.href = '/new-password-reset-success.html';
      } else {
        alert(result.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  }
});
