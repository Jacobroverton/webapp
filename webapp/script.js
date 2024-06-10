// BACKGROUND SCROLL & HEADER OPACITY //
const setParallax = () => {
    document.querySelector('.parallax').style.transform = `translateY(${window.pageYOffset * -0.15}px)`;
};

const toggleHeaderOpacity = () => {
    const header = document.querySelector('header');
    if (window.pageYOffset > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', () => {
    setParallax();
    toggleHeaderOpacity();
});
window.addEventListener('DOMContentLoaded', () => {
    setParallax();
    toggleHeaderOpacity();
});

// TIP CALCULATION //
function calculateTip() {
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const tipPercent = parseFloat(document.getElementById('tipPercent').value);

    if (!isNaN(billAmount) && !isNaN(tipPercent)) {
        const tipAmount = billAmount * (tipPercent / 100);
        const totalAmount = billAmount + tipAmount;
        document.getElementById('totalBill').innerText = totalAmount.toFixed(2);
    } else {
        document.getElementById('totalBill').innerText = '0.00';
    }
}

// GROCERY LIST //
const addItem = () => {
    const input = document.getElementById('groceryInput');
    const itemText = input.value.trim();
    if (!itemText) return;

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span class="grocery-item">${itemText}</span>
        <div class="grocery-actions">
            <button class="check">Check</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;

    const [checkButton, editButton, deleteButton] = listItem.querySelectorAll('button');
    
    checkButton.addEventListener('click', () => {
        if (listItem.classList.toggle('checked')) {
            checkButton.textContent = 'Uncheck';
        } else {
            checkButton.textContent = 'Check';
        }
    });

    editButton.addEventListener('click', () => {
        const itemSpan = listItem.querySelector('.grocery-item');
        const currentText = itemSpan.textContent;

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.className = 'edit-input';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'save';

        const saveChanges = () => {
            if (editInput.value.trim()) {
                itemSpan.textContent = editInput.value.trim();
                itemSpan.style.display = 'inline';
                editInput.remove();
                saveButton.remove();
            }
        };

        saveButton.addEventListener('click', saveChanges);
        editInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });

        itemSpan.style.display = 'none';
        listItem.insertBefore(editInput, itemSpan.nextSibling);
        listItem.insertBefore(saveButton, editInput.nextSibling);
    });

    deleteButton.addEventListener('click', () => listItem.remove());

    document.getElementById('groceryList').appendChild(listItem);
    input.value = '';
    input.focus();
};

document.getElementById('addButton').addEventListener('click', addItem);
document.getElementById('groceryInput').addEventListener('keypress', e => e.key === 'Enter' && addItem());
