/* ============================================
   LEARNOVA - Charts JavaScript
   charts.js → assets/js/charts.js
   ============================================ */

$(document).ready(function () {

  var canvas = document.getElementById('skillChart');
  if (!canvas) return; // Only run on match-demo.html

  var ctx = canvas.getContext('2d');

  var labels = ['JavaScript','Bootstrap','HTML/CSS','Python','C#','MySQL','PHP','Figma'];
  var offerData = [5, 4, 6, 3, 3, 4, 3, 3]; // How many students offer each skill
  var wantData  = [4, 5, 3, 4, 3, 5, 2, 4]; // How many students want each skill

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Students Offering',
          data: offerData,
          backgroundColor: 'rgba(59, 139, 212, 0.7)',
          borderColor: 'rgba(59, 139, 212, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Students Wanting',
          data: wantData,
          backgroundColor: 'rgba(123, 92, 240, 0.7)',
          borderColor: 'rgba(123, 92, 240, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#9DA3C4',
            font: { family: "'Exo 2', sans-serif", size: 12 },
            boxWidth: 14,
          },
        },
        tooltip: {
          backgroundColor: '#0F1640',
          borderColor: 'rgba(59,139,212,0.3)',
          borderWidth: 1,
          titleColor: '#FFFFFF',
          bodyColor: '#9DA3C4',
        },
      },
      scales: {
        x: {
          ticks: { color: '#9DA3C4', font: { family: "'Exo 2', sans-serif", size: 11 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          ticks: {
            color: '#9DA3C4',
            font: { family: "'Exo 2', sans-serif", size: 11 },
            stepSize: 1,
          },
          grid: { color: 'rgba(255,255,255,0.06)' },
          beginAtZero: true,
        },
      },
    },
  });

});