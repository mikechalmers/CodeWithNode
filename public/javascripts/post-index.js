/*jshint esversion: 8 */

const clear = document.getElementById('clear-distance');

// e stands for event
clear.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('location').value = '';
  document.querySelector('input[type=radio]:checked').checked = false;
});
