// Task Manager - Switch between tasks
function switchTask(taskNumber) {
  // Hide all tasks
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => task.classList.remove("active"));

  // Show selected task
  document.getElementById(`task-${taskNumber}`).classList.add("active");

  // Update menu buttons
  const buttons = document.querySelectorAll(".menu-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
}

// Add click listeners to menu buttons
document.addEventListener("DOMContentLoaded", function () {
  const menuButtons = document.querySelectorAll(".menu-btn");
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const taskNumber = this.getAttribute("data-task");

      // Hide all tasks
      const tasks = document.querySelectorAll(".task");
      tasks.forEach((task) => task.classList.remove("active"));

      // Show selected task
      document.getElementById(`task-${taskNumber}`).classList.add("active");

      // Update button states
      menuButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

// ===== TASK 1: Age to Days Converter =====
function convertAgeToDays() {
  const dateInput = document.getElementById("age-input").value;
  const resultDiv = document.getElementById("age-result");
  const resultValue = document.getElementById("age-result-value");

  if (!dateInput) {
    alert("Please select a date");
    return;
  }

  // Calculate days from birthdate to today
  const birthDate = new Date(dateInput);
  const today = new Date();

  const timeDifference = today - birthDate;
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  resultValue.textContent = `${days} days`;
  resultDiv.style.display = "block";
}

// ===== TASK 2: Hours to Seconds Converter =====
function convertHoursToSeconds() {
  const hoursInput = document.getElementById("hours-input").value;
  const resultDiv = document.getElementById("hours-result");
  const resultValue = document.getElementById("hours-result-value");

  if (hoursInput === "" || hoursInput < 0) {
    alert("Please enter a valid number of hours");
    return;
  }

  const hours = parseFloat(hoursInput);
  const seconds = hours * 60 * 60;

  resultValue.textContent = `${seconds} seconds`;
  resultDiv.style.display = "block";
}

// ===== TASK 3: Find Next Number =====
// Switch between scenarios
function switchScenario(scenarioNumber, button) {
  // Hide all scenarios
  document.getElementById("scenario-1").style.display = "none";
  document.getElementById("scenario-2").style.display = "none";

  // Show selected scenario
  document.getElementById(`scenario-${scenarioNumber}`).style.display = "block";

  // Update button states
  const scenarioButtons = document.querySelectorAll(".scenario-btn");
  scenarioButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  // Clear results
  document.getElementById("array-result").style.display = "none";
  document.getElementById("single-result").style.display = "none";
}

// Scenario 1: Find next number in array
function findNextInArray() {
  const arrayInput = document.getElementById("array-input").value;
  const targetInput = document.getElementById("target-number").value;
  const resultDiv = document.getElementById("array-result");
  const resultValue = document.getElementById("array-result-value");

  if (!arrayInput || targetInput === "") {
    alert("Please enter both array and target number");
    return;
  }

  // Convert comma-separated values to array of numbers
  const numbers = arrayInput.split(",").map((num) => parseFloat(num.trim()));
  const target = parseFloat(targetInput);

  // Find the next number after target
  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const nextNumber = sortedNumbers.find((num) => num > target);

  if (nextNumber !== undefined) {
    resultValue.textContent = nextNumber;
    resultDiv.style.display = "block";
  } else {
    alert("No number found greater than the target number");
  }
}

// Scenario 2: Find next number for a single input
function findNextSingle() {
  const numberInput = document.getElementById("single-number").value;
  const resultDiv = document.getElementById("single-result");
  const resultValue = document.getElementById("single-result-value");

  if (numberInput === "") {
    alert("Please enter a number");
    return;
  }

  const number = parseFloat(numberInput);
  const nextNumber = number + 1;

  resultValue.textContent = nextNumber;
  resultDiv.style.display = "block";
}

// ===== TASK 4: Capitalize Name =====
function capitalizeName() {
  const nameInput = document.getElementById("name-input").value;
  const resultDiv = document.getElementById("name-result");
  const resultValue = document.getElementById("name-result-value");

  if (!nameInput) {
    alert("Please enter a name");
    return;
  }

  // Capitalize first letter
  const capitalizedName =
    nameInput.charAt(0).toUpperCase() + nameInput.slice(1);

  resultValue.textContent = capitalizedName;
  resultDiv.style.display = "block";
}

// ===== TASK 5: BMI Calculator =====
function calculateBMI() {
  const weightInput = document.getElementById("weight-input").value;
  const heightInput = document.getElementById("height-input").value;
  const resultDiv = document.getElementById("bmi-result");
  const resultValue = document.getElementById("bmi-result-value");
  const categoryDiv = document.getElementById("bmi-category");

  if (!weightInput || !heightInput || weightInput <= 0 || heightInput <= 0) {
    alert("Please enter valid weight and height");
    return;
  }

  const weight = parseFloat(weightInput);
  const heightInMeters = parseFloat(heightInput) / 100; // Convert cm to meters

  const bmi = weight / (heightInMeters * heightInMeters);

  resultValue.textContent = bmi.toFixed(2);

  // Determine BMI category
  let category = "";
  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Normal weight";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  categoryDiv.textContent = `Category: ${category}`;
  resultDiv.style.display = "block";
}

// ===== TASK 6: Random Array Elements =====
function generateArray() {
  const sizeInput = document.getElementById("array-size").value;
  const displayDiv = document.getElementById("array-display");
  const displayValue = document.getElementById("array-display-value");
  const resultDiv = document.getElementById("array-elements-result");
  const firstElement = document.getElementById("first-element");
  const lastElement = document.getElementById("last-element");

  if (!sizeInput || sizeInput < 2) {
    alert("Please enter a valid array size (minimum 2)");
    return;
  }

  const size = parseInt(sizeInput);
  const array = [];

  // Generate random numbers between 1 and 100
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 100) + 1);
  }

  // Display the array
  displayValue.textContent = `[ ${array.join(", ")} ]`;
  displayDiv.style.display = "block";

  // Display first and last elements
  firstElement.textContent = array[0];
  lastElement.textContent = array[array.length - 1];
  resultDiv.style.display = "block";
}

// ===== TASK 7: Real-Time Addition =====
function calculateSum() {
  const num1Input = document.getElementById("num1").value;
  const num2Input = document.getElementById("num2").value;
  const resultValue = document.getElementById("sum-result-value");

  // If both inputs are empty or one is empty, show NaN
  if (num1Input === "" || num2Input === "") {
    resultValue.textContent = "NaN";
    return;
  }

  const num1 = parseFloat(num1Input);
  const num2 = parseFloat(num2Input);

  const sum = num1 + num2;
  resultValue.textContent = sum;
}
