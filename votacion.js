const votos = {
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0
};

let totalVotantes = 0;
const maxVotantes = 10;

const formulario = document.getElementById('formulario-voto');
const botonTerminar = document.getElementById('terminarVotacion');
const resultadoDiv = document.getElementById('resultado');
const graficoDiv = document.getElementById('grafico');
const ganadorDiv = document.getElementById('ganadorFinal');
const detalleDiv = document.getElementById('detalleCandidato');
const contadorVotantes = document.getElementById('contadorVotantes');
const tipoGraficoSelect = document.getElementById('tipoGrafico');

const biografias = {
    c1: "Luis Arce es el presidente actual de Bolivia y exministro de Economía.",
    c2: "Evo Morales es expresidente de Bolivia y líder del MAS.",
    c3: "Samuel Doria Medina es empresario y político de centro derecha.",
    c4: "Tuto Quiroga fue presidente interino y político conservador."
};

formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    if (totalVotantes < maxVotantes) {
        const candidatoRadio = formulario.querySelector('input[name="candidato"]:checked');
        if (!candidatoRadio) {
            alert("Por favor, selecciona un candidato.");
            return;
        }
        const candidato = candidatoRadio.value;
        votos[candidato]++;
        totalVotantes++;

        contadorVotantes.textContent = `Votantes registrados: ${totalVotantes} / ${maxVotantes}`;

        const nombre = document.getElementById('nombre').value;
        resultadoDiv.innerHTML = `<p>Gracias por votar, <strong>${nombre}</strong>. Has votado por <strong>${formatearNombreCandidato(candidato)}</strong>.</p>`;

        if (totalVotantes === maxVotantes) {
            botonTerminar.disabled = false;
            formulario.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
        }

        formulario.reset();
    } else {
        alert('Ya se alcanzó el número máximo de votantes.');
    }
});

botonTerminar.addEventListener('click', function () {
    const ganador = Object.keys(votos).reduce((a, b) => votos[a] > votos[b] ? a : b);
    ganadorDiv.innerHTML = `<p>🎉 El ganador es: <strong>${formatearNombreCandidato(ganador)}</strong> con ${votos[ganador]} voto(s).</p>`;
    mostrarGrafico();
});

tipoGraficoSelect.addEventListener('change', () => {
    if(totalVotantes > 0){
        mostrarGrafico();
    }
});

function formatearNombreCandidato(cod) {
    return {
        c1: "Luis Arce",
        c2: "Evo Morales",
        c3: "Samuel Doria Medina",
        c4: "Tuto Quiroga"
    }[cod] || cod;
}

let grafico; // variable global para el chart

function mostrarGrafico() {
    graficoDiv.innerHTML = "";
    const canvas = document.createElement("canvas");
    graficoDiv.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const nombres = Object.keys(votos).map(formatearNombreCandidato);
    const cantidades = Object.values(votos);

    const tipo = tipoGraficoSelect.value;

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: tipo,
        data: {
            labels: nombres,
            datasets: [{
                label: 'Votos por Candidato',
                data: cantidades,
                backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    onClick: (e, legendItem, legend) => {
                        const index = legendItem.index;
                        const nombre = nombres[index];
                        const cantidad = cantidades[index];
                        detalleDiv.textContent = `${nombre} tiene ${cantidad} voto(s). ${biografias[`c${index+1}`]}`;
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value} voto(s)`;
                        }
                    }
                }
            },
            scales: tipo === 'bar' ? {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
            } : {}
        }
    });
}
