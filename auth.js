document.addEventListener('DOMContentLoaded', function() {
  console.log('Authentication module loaded');
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('swapTradeLoggedIn');
  const currentUser = JSON.parse(localStorage.getItem('swapTradeCurrentUser'));
  
  // Update UI based on authentication status
  updateAuthUI(isLoggedIn, currentUser);
  
  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const loginMessage = document.getElementById('login-message');
      
      // Simple validation
      if (!email || !password) {
        loginMessage.textContent = 'Please enter both email and password';
        loginMessage.classList.add('error');
        return;
      }
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('swapTradeUsers')) || [];
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Login successful
        localStorage.setItem('swapTradeLoggedIn', 'true');
        localStorage.setItem('swapTradeCurrentUser', JSON.stringify({
          id: user.id,
          name: user.fullname,
          email: user.email
        }));
        
        loginMessage.textContent = 'Login successful! Redirecting...';
        loginMessage.classList.remove('error');
        loginMessage.classList.add('success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        // Login failed
        loginMessage.textContent = 'Invalid email or password';
        loginMessage.classList.add('error');
      }
    });
  }
  
  // Handle signup form submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fullname = document.getElementById('fullname').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const signupMessage = document.getElementById('signup-message');
      
      // Simple validation
      if (!fullname || !email || !password) {
        signupMessage.textContent = 'Please fill in all required fields';
        signupMessage.classList.add('error');
        return;
      }
      
      if (password.length < 8) {
        signupMessage.textContent = 'Password must be at least 8 characters long';
        signupMessage.classList.add('error');
        return;
      }
      
      if (password !== confirmPassword) {
        signupMessage.textContent = 'Passwords do not match';
        signupMessage.classList.add('error');
        return;
      }
      
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('swapTradeUsers')) || [];
      if (users.some(user => user.email === email)) {
        signupMessage.textContent = 'Email already in use';
        signupMessage.classList.add('error');
        return;
      }
      
      // Create new user
      const newUser = {
        id: generateUserId(),
        fullname,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem('swapTradeUsers', JSON.stringify(users));
      
      // Auto login after signup
      localStorage.setItem('swapTradeLoggedIn', 'true');
      localStorage.setItem('swapTradeCurrentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.fullname,
        email: newUser.email
      }));
      
      signupMessage.textContent = 'Account created successfully! Redirecting...';
      signupMessage.classList.remove('error');
      signupMessage.classList.add('success');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  }
  
  // Handle logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear authentication data
      localStorage.removeItem('swapTradeLoggedIn');
      localStorage.removeItem('swapTradeCurrentUser');
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
  }
  
  // Handle social login buttons (mock functionality)
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(button => {
    button.addEventListener('click', function() {
      alert('Social login will be implemented in a future update!');
    });
  });
});

// Helper function to generate a unique user ID
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Update UI based on authentication status
function updateAuthUI(isLoggedIn, currentUser) {
  const authButtonsContainer = document.querySelector('.auth-buttons');
  
  if (isLoggedIn && currentUser) {
    // User is logged in, update header
    if (authButtonsContainer) {
      authButtonsContainer.innerHTML = `
        <a href="post-item.html" class="btn post-item-btn">
          <i class="fas fa-plus-circle"></i> Post Item
        </a>
        <div class="user-menu">
          <div class="user-info">
            <i class="fas fa-user-circle"></i>
            <span>${currentUser.name}</span>
          </div>
          <div class="dropdown-menu">
            <a href="#"><i class="fas fa-user"></i> Profile</a>
            <a href="#"><i class="fas fa-box"></i> My Items</a>
            <a href="#"><i class="fas fa-exchange-alt"></i> My Trades</a>
            <a href="#"><i class="fas fa-cog"></i> Settings</a>
            <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        </div>
      `;
      
      // Add event listener for user menu dropdown
      const userInfo = document.querySelector('.user-info');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      
      if (userInfo && dropdownMenu) {
        userInfo.addEventListener('click', function() {
          dropdownMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
          if (!event.target.closest('.user-menu')) {
            dropdownMenu.classList.remove('active');
          }
        });
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear authentication data
            localStorage.removeItem('swapTradeLoggedIn');
            localStorage.removeItem('swapTradeCurrentUser');
            
            // Redirect to home page
            window.location.href = 'index.html';
          });
        }
      }
    }
    
    // Update swap buttons to actually allow swapping
    const swapButtons = document.querySelectorAll('.swap-btn');
    swapButtons.forEach(button => {
      button.removeEventListener('click', function(){});
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productName = this.closest('.product-card').querySelector('h3').textContent;
        const productOwner = this.closest('.product-card').querySelector('.product-owner span').textContent.replace('Posted by: ', '');
        
        // Show swap offer modal or redirect to swap page
        alert(`You're making a swap offer for: ${productName} from ${productOwner}. This feature will be fully implemented soon!`);
      });
    });
  }
}