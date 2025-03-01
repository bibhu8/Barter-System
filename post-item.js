document.addEventListener('DOMContentLoaded', function() {
  console.log('Post item page loaded');
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('swapTradeLoggedIn');
  const currentUser = JSON.parse(localStorage.getItem('swapTradeCurrentUser'));
  
  // Redirect to login if not logged in
  if (!isLoggedIn || !currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  // Handle image upload preview
  const imageInput = document.getElementById('item-image');
  const imagePreview = document.getElementById('image-preview');
  const uploadArea = document.getElementById('image-upload-area');
  
  if (imageInput && imagePreview && uploadArea) {
    // Handle file selection
    imageInput.addEventListener('change', handleImageSelection);
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        imageInput.files = e.dataTransfer.files;
        handleImageSelection();
      }
    });
    
    uploadArea.addEventListener('click', function() {
      imageInput.click();
    });
  }
  
  // Handle form submission
  const postItemForm = document.getElementById('post-item-form');
  if (postItemForm) {
    postItemForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const title = document.getElementById('item-title').value;
      const category = document.getElementById('item-category').value;
      const description = document.getElementById('item-description').value;
      const condition = document.getElementById('item-condition').value;
      const swapPreferences = document.getElementById('swap-preferences').value;
      const postMessage = document.getElementById('post-message');
      
      // Simple validation
      if (!title || !category || !description || !condition) {
        postMessage.textContent = 'Please fill in all required fields';
        postMessage.classList.add('error');
        return;
      }
      
      // Get image data
      const imageFiles = imageInput.files;
      const imageUrls = [];
      
      // In a real app, we would upload these to a server
      // For this demo, we'll use local URLs or placeholders
      if (imageFiles.length > 0) {
        for (let i = 0; i < Math.min(imageFiles.length, 5); i++) {
          // In a real app, this would be a server URL
          // For demo, we'll use a placeholder
          imageUrls.push(`https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`);
        }
      } else {
        // Use a default placeholder if no images
        imageUrls.push(`https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`);
      }
      
      // Create new item object
      const newItem = {
        id: generateItemId(),
        title,
        category,
        description,
        condition,
        swapPreferences,
        imageUrls,
        userId: currentUser.id,
        userName: currentUser.name,
        createdAt: new Date().toISOString()
      };
      
      // Save item to localStorage
      const items = JSON.parse(localStorage.getItem('swapTradeItems')) || [];
      items.push(newItem);
      localStorage.setItem('swapTradeItems', JSON.stringify(items));
      
      // Show success message
      postMessage.textContent = 'Item posted successfully! Redirecting to home page...';
      postMessage.classList.remove('error');
      postMessage.classList.add('success');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    });
  }
});

// Helper function to generate a unique item ID
function generateItemId() {
  return 'item_' + Math.random().toString(36).substr(2, 9);
}

// Handle image selection and preview
function handleImageSelection() {
  const imageInput = document.getElementById('item-image');
  const imagePreview = document.getElementById('image-preview');
  
  // Clear previous previews
  imagePreview.innerHTML = '';
  
  // Check if files were selected
  if (imageInput.files && imageInput.files.length > 0) {
    // Limit to 5 images
    const filesToPreview = Math.min(imageInput.files.length, 5);
    
    for (let i = 0; i < filesToPreview; i++) {
      const file = imageInput.files[i];
      
      // Only process image files
      if (!file.type.match('image.*')) {
        continue;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const previewContainer = document.createElement('div');
        previewContainer.className = 'preview-item';
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Item preview';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function() {
          previewContainer.remove();
          // Note: In a real implementation, you would need to update the file input
          // which is complex as FileList is read-only
        });
        
        previewContainer.appendChild(img);
        previewContainer.appendChild(removeBtn);
        imagePreview.appendChild(previewContainer);
      };
      
      // Read the image file as a data URL
      reader.readAsDataURL(file);
    }
  }
}