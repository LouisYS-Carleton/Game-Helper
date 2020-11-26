document.addEventListener('DOMContentLoaded', (event) => {
    // Getting references to our form and input
    const signUpForm = document.getElementById('signup')
    const emailInput = document.getElementById('inputEmail')
    const passwordInput = document.getElementById('inputPassword')
  
    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.addEventListener('submit', function (event) {
      event.preventDefault()
      const userData = {
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
      }
  
      if (!userData.email || !userData.password) {
        return
      }
      // If we have an email and password, run the signUpUser function
      signUpUser(userData.email, userData.password)
      emailInput.value = ''
      passwordInput.value = ''
    })
  
    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser (email, password) {
      fetch('/api/signup', {
        method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
		    password: password
		})
	  })
        .then(function (data) {
          window.location.replace('/')
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(function(err) {
            console.log(err);
          });
    }
})
  