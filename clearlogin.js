// Get the necessary DOM elements
const form = document.querySelector('#list-form');
const input = document.querySelector('#list-item');
const list = document.querySelector('#list-items');
const itemCount = document.querySelector('#item-count');
const pagination = document.querySelector('#pagination');
const clearBtn = document.querySelector('#clear-btn');
const charCount = document.querySelector('#char-count');

function updateCharCount() {
  const maxLength = input.maxLength;
  const currentLength = input.value.length;
  const remainingChars = maxLength - currentLength;
  charCount.textContent = `${remainingChars} characters remaining`;

  if (remainingChars <= 10) {
    charCount.style.color = 'red';
  } else if (remainingChars <= 20) {
    charCount.style.color = 'orange';
  } else if (remainingChars <= 49) {
    charCount.style.color = 'green';
  } else {
    charCount.style.color = 'gray';
  }
}

input.addEventListener('input', updateCharCount);

document.addEventListener('DOMContentLoaded', () => {
  updateCharCount();
});

input.maxLength = 50; // set maximum length to 50 characters

// Initialize the items array and the page number
let items = JSON.parse(localStorage.getItem('items')) || [];
let pageNumber = 1;

// Add an item to the list
function addItem(event) {
  event.preventDefault(); // Prevent form submission
  const text = input.value.trim(); // Get the input text and remove whitespace
  if (text.length === 0) return; // If text is empty, do nothing

  const now = new Date(); // Get the current date and time
  const timestamp = now.toLocaleString(); // Format the date and time as a string

  const image = document.querySelector('#image-input').files[0]; // Get the selected image file
  const imageUrlPromise = new Promise((resolve, reject) => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(image);
    } else {
      resolve('');
    }
  });

  imageUrlPromise.then((imageUrl) => {
    items.push({ text, timestamp, imageUrl }); // Add the text, timestamp, and image URL to the items array
    input.value = ''; // Clear the input field
    renderList(); // Render the updated list
    saveItems(); // Save the updated items array to local storage
    document.querySelector('#image-input').value = ''; // Reset the file input value to an empty string
  });
}



// Remove an item from the list
function removeItem(index) {
  const item = items[index];
  if (item.imageUrl) {
    URL.revokeObjectURL(item.imageUrl);
  }
  items.splice(index, 1); // Remove the item at the given index from the items array
  renderList(); // Render the updated list
  saveItems(); // Save the updated items array to local storage
}


// Clear all items from the list
function clearList() {
  items = []; // Reset the items array
  pageNumber = 1; // Reset the pageNumber to 1
  renderList(); // Render the updated list
  saveItems(); // Save the updated items array to local storage
}

// Save the items array to local storage
function saveItems() {
  localStorage.setItem('items', JSON.stringify(items));
}

// Render the list of items
function renderList() {
  // Calculate the start and end indices for the current page
  const itemsPerPage = 10;
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Clear the current list items
  list.innerHTML = '';

  // Add the items for the current page
  for (let i = startIndex; i < endIndex && i < items.length; i++) {
    const item = items[i];
    const li = document.createElement('li');
    const itemNumber = i + 1;

    // Create a span for the image if an image URL is available
    const imageSpan = item.imageUrl
      ? `<span class="item-image"><img src="${item.imageUrl}" alt="Item image" class="enlarge-image"></span>`
      : '';

    li.innerHTML = `
      <span class="item-number">${itemNumber}</span>
      ${imageSpan}
      <span class="item-text">${item.text}</span>
      <span class="item-timestamp">${item.timestamp}</span>
      <button class="remove-btn">X</button>
    `;
    const removeBtn = li.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => removeItem(i));
    list.appendChild(li);

    // Add click event listener to the image to enlarge it
    const image = li.querySelector('.enlarge-image');
    if (image) {
      image.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        const overlayImg = document.createElement('img');
        overlayImg.src = item.imageUrl;
        overlay.appendChild(overlayImg);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
          overlay.remove();
        });
      });
    }
  }

  // Update the item count and pagination
  itemCount.textContent = `${items.length} items`;
  const pageCount = Math.ceil(items.length / itemsPerPage);
  pagination.innerHTML = '';
  for (let i = 1; i <= pageCount; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      pageNumber = i;
      renderList();
    });
    if (i === pageNumber) {
      pageBtn.classList.add('active');
    }
    pagination.appendChild(pageBtn);
  }
}


  // Initialize the list when the page is loaded
  document.addEventListener('DOMContentLoaded', () => {
  renderList();
  });

  // Add event listeners for the form and clear button
  form.addEventListener('submit', addItem);
  clearBtn.addEventListener('click', clearList);
