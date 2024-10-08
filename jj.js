function calculateEmissions() {
    const coalProduction = parseFloat(document.getElementById('coalProduction').value);
    const electricityUsage = parseFloat(document.getElementById('electricityUsage').value);
    const explosivesUsed = parseFloat(document.getElementById('explosivesUsed').value);
    const methaneEmissionFactor = parseFloat(document.getElementById('methaneEmissionFactor').value);

    const useEVs = document.getElementById('useEVs').checked;
    const useMethaneCapture = document.getElementById('useMethaneCapture').checked;

    let methaneEmissions = coalProduction * methaneEmissionFactor;
    let emittedMethane = methaneEmissions;
    let capturedMethane = 0;
    let co2eFromMethane = 0;
    let co2eFromElectricity = electricityUsage * 0.85 / 1000; // kg CO2/kWh to tons

    // Before any reductions
    let co2eFromElectricityBefore = co2eFromElectricity;
    let co2eFromMethaneBefore = methaneEmissions * 25;
    let co2eFromExplosives = explosivesUsed * 0.12 / 1000; // kg CO2/kg to tons

    // Apply reductions
    if (useMethaneCapture) {
        capturedMethane = methaneEmissions * 0.7;
        emittedMethane = methaneEmissions * 0.3;
        co2eFromMethane = capturedMethane + emittedMethane * 25;
    } else {
        co2eFromMethane = co2eFromMethaneBefore;
    }

    if (useEVs) {
        co2eFromElectricity += coalProduction * 10 / 1000; // additional electricity for EVs
    } else {
        co2eFromElectricity += coalProduction * 25 / 1000; // assuming diesel instead of EVs
    }

    const totalEmissionsBefore = co2eFromMethaneBefore + co2eFromElectricityBefore + co2eFromExplosives;
    const totalEmissionsAfter = co2eFromMethane + co2eFromElectricity + co2eFromExplosives;

    document.getElementById('result').innerText = `Total Emissions Before: ${totalEmissionsBefore.toFixed(2)} tons CO2e\nTotal Emissions After: ${totalEmissionsAfter.toFixed(2)} tons CO2e`;

    // Show the result section
    document.getElementById('resultSection').style.display = 'block';

    // Update the emissions comparison graph
    updateComparisonGraph(co2eFromMethaneBefore, co2eFromElectricityBefore, co2eFromExplosives, co2eFromMethane, co2eFromElectricity, co2eFromExplosives);
}

function updateComparisonGraph(methaneBefore, electricityBefore, explosives, methaneAfter, electricityAfter, explosivesAfter) {
    const ctx = document.getElementById('emissionsComparisonChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Methane', 'Electricity', 'Explosives'],
            datasets: [
                {
                    label: 'Before Reduction (tons)',
                    data: [methaneBefore, electricityBefore, explosives],
                    backgroundColor: '#e74c3c'
                },
                {
                    label: 'After Reduction (tons)',
                    data: [methaneAfter, electricityAfter, explosivesAfter],
                    backgroundColor: '#27ae60'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
window.addEventListener('scroll', () => {
    const environmentalSection = document.getElementById('environmentalSection');
    const sectionPosition = environmentalSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.5;

    if (sectionPosition < screenPosition) {
        environmentalSection.querySelector('.impact-text').style.animation = 'fadeInUp 1s forwards';
        document.getElementById('progressMethane').style.width = '80%';
        document.getElementById('progressElectricity').style.width = '60%';
    }
});



