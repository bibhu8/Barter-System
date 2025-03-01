document.addEventListener('DOMContentLoaded', function() {
  console.log('Swap & Trade platform initialized');
  
  // Load items from localStorage
  loadItems();
  
  // Add event listeners to swap buttons
  const swapButtons = document.querySelectorAll('.swap-btn');
  swapButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productName = this.closest('.product-card').querySelector('h3').textContent;
      
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('swapTradeLoggedIn');
      
      if (isLoggedIn) {
        // User is logged in, show swap offer dialog
        const productOwner = this.closest('.product-card').querySelector('.product-owner span').textContent.replace('Posted by: ', '');
        alert(`You're making a swap offer for: ${productName} from ${productOwner}. This feature will be fully implemented soon!`);
      } else {
        // User is not logged in, prompt to login
        alert(`You're interested in swapping for: ${productName}. Login or sign up to continue!`);
        // Optional: Redirect to login page
        // window.location.href = 'login.html';
      }
    });
  });
  
  // Add event listeners to auth buttons
  const loginBtn = document.querySelector('.login-btn');
  const signupBtn = document.querySelector('.signup-btn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      if (e.target.getAttribute('href') === '#') {
        e.preventDefault();
        window.location.href = 'login.html';
      }
    });
  }
  
  if (signupBtn) {
    signupBtn.addEventListener('click', function(e) {
      if (e.target.getAttribute('href') === '#') {
        e.preventDefault();
        window.location.href = 'signup.html';
      }
    });
  }
  
  // Simple animation for the hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    setTimeout(() => {
      heroSection.style.transition = 'all 0.5s ease';
      heroSection.style.transform = 'translateY(0)';
      heroSection.style.opacity = '1';
    }, 100);
  }
});

// Function to load items from localStorage
function loadItems() {
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) return;
  
  // Get items from localStorage
  const items = JSON.parse(localStorage.getItem('swapTradeItems')) || [];
  
  // If there are user-posted items, add them to the grid
  if (items.length > 0) {
    // Clear any existing demo items if we have real ones
    productGrid.innerHTML = '';
    
    // Add each item to the grid
    items.forEach(item => {
      const itemCard = createItemCard(item);
      productGrid.appendChild(itemCard);
    });
    
    // Re-add event listeners to the new swap buttons
    const swapButtons = document.querySelectorAll('.swap-btn');
    swapButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productName = this.closest('.product-card').querySelector('h3').textContent;
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('swapTradeLoggedIn');
        
        if (isLoggedIn) {
          // User is logged in, show swap offer dialog
          const productOwner = this.closest('.product-card').querySelector('.product-owner span').textContent.replace('Posted by: ', '');
          alert(`You're making a swap offer for: ${productName} from ${productOwner}. This feature will be fully implemented soon!`);
        } else {
          // User is not logged in, prompt to login
          alert(`You're interested in swapping for: ${productName}. Login or sign up to continue!`);
        }
      });
    });
  }
}

// Function to create an item card
function createItemCard(item) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.itemId = item.id;
  
  card.innerHTML = `
    <div class="product-image">
      <img src="${item.imageUrls[0]}" alt="${item.title}">
    </div>
    <div class="product-details">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="product-meta">
        <span class="product-category"><i class="fas fa-tag"></i> ${item.category}</span>
        <span class="product-condition"><i class="fas fa-star"></i> ${item.condition}</span>
      </div>
      <div class="product-owner">
        <i class="fas fa-user-circle"></i>
        <span>Posted by: ${item.userName}</span>
      </div>
      <a href="#" class="btn swap-btn">Offer Swap</a>
    </div>
  `;
  
  return card;
}