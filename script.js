 // DOM Elements
 const calendarBtn = document.getElementById('calendarBtn');
 const yesterdayBtn = document.getElementById('yesterdayBtn');
 const todayBtn = document.getElementById('todayBtn');
 const calorieGoal = document.getElementById('calorieGoal');
 const mealsList = document.getElementById('mealsList');
 const frequentItemsList = document.getElementById('frequentItemsList');
 const totalCalories = document.getElementById('totalCalories');
 const totalProtein = document.getElementById('totalProtein');
 const progressFill = document.getElementById('progressFill');
 const proteinProgressFill = document.getElementById('proteinProgressFill');
 const addMealBtn = document.getElementById('addMealBtn');
 const addMealModal = document.getElementById('addMealModal');
 const frequentItemModal = document.getElementById('frequentItemModal');
 const mealName = document.getElementById('mealName');
 const mealQuantity = document.getElementById('mealQuantity');
 const mealCalories = document.getElementById('mealCalories');
 const mealProtein = document.getElementById('mealProtein');
 const frequentItemName = document.getElementById('frequentItemName');
 const frequentItemQuantity = document.getElementById('frequentItemQuantity');
 const cancelBtn = document.getElementById('cancelBtn');
 const saveMealBtn = document.getElementById('saveMealBtn');
 const cancelFrequentBtn = document.getElementById('cancelFrequentBtn');
 const saveFrequentBtn = document.getElementById('saveFrequentBtn');

 // State variables
 let currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
 let currentGoal = 2400; // Default calorie goal
 let proteinGoal = 150; // Default protein goal (in grams)
 let meals = [];
 let frequentItems = [];
 let selectedFrequentItem = null;

 // Default frequent items (in a real app, this would be dynamic)
 const defaultFrequentItems = [
     { name: 'Roti', caloriesPerUnit: 70, proteinPerUnit: 2 },
     { name: 'Rajma', caloriesPerUnit: 130, proteinPerUnit: 8 },
     { name: 'Rice', caloriesPerUnit: 130, proteinPerUnit: 3 },
     { name: 'Dal', caloriesPerUnit: 100, proteinPerUnit: 7 },
     { name: 'Chicken Curry', caloriesPerUnit: 200, proteinPerUnit: 25 }
 ];

 // Load data from localStorage
 function loadData() {
     // Load goals
     const savedCalorieGoal = localStorage.getItem('calorieGoal');
     if (savedCalorieGoal) {
         currentGoal = parseInt(savedCalorieGoal);
         calorieGoal.textContent = `${currentGoal} CAL`;
     }

     const savedProteinGoal = localStorage.getItem('proteinGoal');
     if (savedProteinGoal) {
         proteinGoal = parseInt(savedProteinGoal);
     }

     // Load meals for current date
     const savedMeals = localStorage.getItem(`meals_${currentDate}`);
     if (savedMeals) {
         meals = JSON.parse(savedMeals);
         renderMeals();
         updateTotalStats();
     } else {
         meals = [];
         renderMeals();
         updateTotalStats();
     }

     // Load frequent items
     const savedFrequentItems = localStorage.getItem('frequentItems');
     if (savedFrequentItems) {
         frequentItems = JSON.parse(savedFrequentItems);
     } else {
         // Use default items if no saved items
         frequentItems = defaultFrequentItems;
         localStorage.setItem('frequentItems', JSON.stringify(frequentItems));
     }
     renderFrequentItems();
 }

 // Save data to localStorage
 function saveData() {
     localStorage.setItem('calorieGoal', currentGoal);
     localStorage.setItem('proteinGoal', proteinGoal);
     localStorage.setItem(`meals_${currentDate}`, JSON.stringify(meals));
 }

 // Update frequent items based on usage
 function updateFrequentItems(meal) {
     // Check if meal already exists in frequent items
     const existingIndex = frequentItems.findIndex(item => 
         item.name.toLowerCase() === meal.name.toLowerCase());

     if (existingIndex !== -1) {
         // Item exists, update protein info if needed
         if (frequentItems[existingIndex].proteinPerUnit !== meal.proteinPerUnit) {
             frequentItems[existingIndex].proteinPerUnit = meal.proteinPerUnit;
             localStorage.setItem('frequentItems', JSON.stringify(frequentItems));
         }
     } else {
         // Add new item to frequent items
         frequentItems.push({
             name: meal.name,
             caloriesPerUnit: meal.caloriesPerUnit,
             proteinPerUnit: meal.proteinPerUnit || 0
         });

         // Limit to top 10 frequent items
         if (frequentItems.length > 10) {
             frequentItems.pop();
         }

         // Save to localStorage
         localStorage.setItem('frequentItems', JSON.stringify(frequentItems));
         renderFrequentItems();
     }
 }

 // Render meals in the list
 function renderMeals() {
     mealsList.innerHTML = '';
     meals.forEach((meal, index) => {
         const mealItem = document.createElement('div');
         mealItem.className = 'meal-item';
         mealItem.innerHTML = `
             <div>${meal.name}(${meal.quantity}) -- total calory</div>
             <div>${meal.quantity * meal.caloriesPerUnit}</div>
         `;
         mealsList.appendChild(mealItem);
     });
 }

 // Render frequent items
 function renderFrequentItems() {
     frequentItemsList.innerHTML = '';
     frequentItems.forEach(item => {
         const itemElement = document.createElement('div');
         itemElement.className = 'frequent-item';
         itemElement.innerHTML = `
             <div class="frequent-item-name">${item.name}</div>
             <div class="frequent-item-cals">${item.caloriesPerUnit} cal, ${item.proteinPerUnit || 0}g protein</div>
         `;
         itemElement.addEventListener('click', () => {
             openFrequentItemModal(item);
         });
         frequentItemsList.appendChild(itemElement);
     });
 }

 // Open frequent item modal
 function openFrequentItemModal(item) {
     selectedFrequentItem = item;
     frequentItemName.textContent = item.name;
     frequentItemQuantity.value = '1';
     frequentItemModal.style.display = 'block';
     frequentItemQuantity.focus();
 }

 // Update total stats display
 function updateTotalStats() {
     // Update calories
     const totalCals = meals.reduce((sum, meal) => sum + (meal.quantity * meal.caloriesPerUnit), 0);
     totalCalories.textContent = totalCals;
     
     // Update calories progress bar
     const caloriePercentage = Math.min((totalCals / currentGoal) * 100, 100);
     progressFill.style.width = `${caloriePercentage}%`;
     
     // Change color if over calorie goal
     if (totalCals > currentGoal) {
         progressFill.style.backgroundColor = '#f44336'; // Red
     } else {
         progressFill.style.backgroundColor = '#4caf50'; // Green
     }
     
     // Update protein
     const totalProts = meals.reduce((sum, meal) => sum + (meal.quantity * (meal.proteinPerUnit || 0)), 0);
     totalProtein.textContent = `${totalProts}g`;
     
     // Update protein progress bar
     const proteinPercentage = Math.min((totalProts / proteinGoal) * 100, 100);
     proteinProgressFill.style.width = `${proteinPercentage}%`;
 }

 // Change date
 function changeDate(daysToAdd) {
     const date = new Date(currentDate);
     date.setDate(date.getDate() + daysToAdd);
     currentDate = date.toISOString().split('T')[0];
     loadData();
 }

 // Event Listeners
 calendarBtn.addEventListener('click', () => {
     // In a real app, we'd show a date picker
     const newDate = prompt("Enter date (YYYY-MM-DD):", currentDate);
     if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
         currentDate = newDate;
         loadData();
     }
 });

 yesterdayBtn.addEventListener('click', () => {
     changeDate(-1);
 });

 todayBtn.addEventListener('click', () => {
     currentDate = new Date().toISOString().split('T')[0];
     loadData();
 });

 addMealBtn.addEventListener('click', () => {
     addMealModal.style.display = 'block';
     mealName.focus();
 });

 cancelBtn.addEventListener('click', () => {
     addMealModal.style.display = 'none';
     mealName.value = '';
     mealQuantity.value = '';
     mealCalories.value = '';
     mealProtein.value = '';
 });

 saveMealBtn.addEventListener('click', () => {
     const name = mealName.value.trim();
     const quantity = parseInt(mealQuantity.value);
     const caloriesPerUnit = parseInt(mealCalories.value);
     const proteinPerUnit = parseInt(mealProtein.value) || 0;

     if (name && !isNaN(quantity) && !isNaN(caloriesPerUnit)) {
         const newMeal = {
             name,
             quantity,
             caloriesPerUnit,
             proteinPerUnit
         };

         meals.push(newMeal);

         // Update frequent items
         updateFrequentItems(newMeal);

         // Clear form
         mealName.value = '';
         mealQuantity.value = '';
         mealCalories.value = '';
         mealProtein.value = '';
         
         // Close modal
         addMealModal.style.display = 'none';
         
         // Update UI
         renderMeals();
         updateTotalStats();
         
         // Save to localStorage
         saveData();
     } else {
         alert("Please fill all required fields with valid values");
     }
 });

 cancelFrequentBtn.addEventListener('click', () => {
     frequentItemModal.style.display = 'none';
     selectedFrequentItem = null;
 });

 saveFrequentBtn.addEventListener('click', () => {
     if (selectedFrequentItem) {
         const quantity = parseInt(frequentItemQuantity.value);
         
         if (!isNaN(quantity) && quantity > 0) {
             meals.push({
                 name: selectedFrequentItem.name,
                 quantity,
                 caloriesPerUnit: selectedFrequentItem.caloriesPerUnit,
                 proteinPerUnit: selectedFrequentItem.proteinPerUnit || 0
             });
             
             // Close modal
             frequentItemModal.style.display = 'none';
             selectedFrequentItem = null;
             
             // Update UI
             renderMeals();
             updateTotalStats();
             
             // Save to localStorage
             saveData();
         } else {
             alert("Please enter a valid quantity");
         }
     }
 });

 // Close modals when clicking outside
 window.addEventListener('click', (event) => {
     if (event.target === addMealModal) {
         addMealModal.style.display = 'none';
     }
     if (event.target === frequentItemModal) {
         frequentItemModal.style.display = 'none';
         selectedFrequentItem = null;
     }
 });

 // Initialize
 loadData();