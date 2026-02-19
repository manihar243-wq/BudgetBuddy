const form = document.getElementById('budget-form');
const result = document.getElementById('result');

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const income = Number(document.getElementById('income').value);
  const fixed = Number(document.getElementById('fixed').value);
  const variable = Number(document.getElementById('variable').value);
  const savings = Number(document.getElementById('savings').value);
  const emergencyMonths = Number(document.getElementById('emergencyMonths').value);

  const expenses = fixed + variable;
  const leftover = income - expenses;
  const emergencyTarget = expenses * emergencyMonths;
  const emergencyGap = Math.max(emergencyTarget - savings, 0);

  const emergencyContribution = leftover > 0 ? leftover * 0.5 : 0;
  const futureContribution = leftover > 0 ? leftover * 0.3 : 0;
  const lifestyleBuffer = leftover > 0 ? leftover * 0.2 : 0;

  document.getElementById('leftover').textContent = money.format(leftover);
  document.getElementById('split').textContent = `Emergency: ${money.format(
    emergencyContribution,
  )}, Future goals: ${money.format(futureContribution)}, Buffer: ${money.format(lifestyleBuffer)}`;
  document.getElementById('target').textContent = `${money.format(emergencyTarget)} (Need ${money.format(
    emergencyGap,
  )} more)`;

  let monthsToGoal = 'Already reached';
  if (emergencyGap > 0 && emergencyContribution > 0) {
    monthsToGoal = `${Math.ceil(emergencyGap / emergencyContribution)} month(s)`;
  } else if (emergencyGap > 0) {
    monthsToGoal = 'Not possible with current budget';
  }
  document.getElementById('timeline').textContent = monthsToGoal;

  const status = document.getElementById('status');
  if (leftover <= 0) {
    status.className = 'status warn';
    status.textContent =
      'Warning: your expenses are higher than your income. Lower variable costs or increase income to build a safer future.';
  } else if (leftover < income * 0.2) {
    status.className = 'status warn';
    status.textContent =
      'Caution: your remaining cash is under 20% of income. Try reducing expenses to improve financial safety.';
  } else {
    status.className = 'status good';
    status.textContent =
      'Great! Your plan has a healthy safety margin. Keep investing and maintaining your emergency fund.';
  }

  result.classList.remove('hidden');
});
