// Get DOM elements
const listForm = document.getElementById('list-form');
const listInput = document.getElementById('list-item');
const addBtn = document.getElementById('add-btn');
const clearBtn = document.getElementById('clear-btn');
const listItems = document.getElementById('list-items');
const itemCount = document.getElementById('item-count');
const pagination = document.getElementById('pagination');
const reverseBtn = document.getElementById('reverse-btn');


// Initialize variables
let items = [];
let currentPage = 1;
const itemsPerPage = 10;
let password = '';


// Load items from local storage
if (localStorage.getItem('items')) {
  items = JSON.parse(localStorage.getItem('items'));
  renderItems();
}


// Event listeners
listForm.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
reverseBtn.addEventListener('click', () => {
  items.reverse();
  currentPage = 1; // Reset pagination to first page
  renderItems();
});


// Functions
function addItem(e) {
  e.preventDefault();
  const newItem = listInput.value.trim();
  if (newItem !== '') {
    items.push({
      number: items.length + 1,
      text: newItem,
      timestamp: new Date().toLocaleString(),
    });
    renderItems();
    listInput.value = '';
  }
}


function clearItems() {
  const prompt = window.prompt('Please enter the password to clear the list:');
  if (prompt === password) {
    items = [];
    renderItems();
  } else {
    window.alert('Incorrect password.');
  }
}


function deleteItem(index) {
  items.splice(index, 1);
  for (let i = index; i < items.length; i++) {
    items[i].number--;
  }
  renderItems();
}


function renderItems(reverse = false) {
  // Save items to local storage
  localStorage.setItem('items', JSON.stringify(items));


  // Calculate pagination values
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = reverse ? items.slice().reverse().slice(startIndex, endIndex) : items.slice(startIndex, endIndex);


  // Render list items
  listItems.innerHTML = currentItems.map(item => `
    <li onclick="toggleTimestamp(this)">
      ${item.number}. ${item.text}
      <div class="timestamp">${item.timestamp}</div>
      <button class="delete-btn" onclick="deleteItem(${item.number - 1})">Delete</button>
    </li>
  `).join('');


  // Render pagination controls
  pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
    <button class="${i + 1 === currentPage ? 'active' : ''}" onclick="currentPage = ${i + 1}; renderItems(${reverse});">
      ${i + 1}
    </button>
  `).join('');


  // Render item count
  itemCount.textContent = `Total items: ${items.length}`;


  // Hide reverse button if there are less than 2 items
  if (items.length < 2) {
    reverseBtn.style.display = 'none';
  } else {
    reverseBtn.style.display = 'inline-block';
  }


  // Hide clear button if there are less than 0 items
  if (items.length === 0) {
    clearBtn.style.display = 'none';
  } else {
    clearBtn.style.display = 'inline-block';
  }
}









