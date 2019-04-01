function calcFitness() {
    var currentRecord = Infinity;
    for (var i = 0; i < population.length; i++) {
        var d = calcDistance(cities, population[i]);
        fitness[i] = 1 / (d + 1);
        if (d < recordDistance) {
            recordDistance = d;
            bestEver = population[i];
            bestFitness = fitness[i];
        }
        if (d < currentRecord) {
            currentRecord = d;
            currentBest = population[i];
        }
    }
}

function normaliseFitness() {
    var sum = 0;
    for (var i = 0; i < fitness.length; i++) {
        sum += fitness[i];
    }

    for (var i = 0; i < fitness.length; i++) {
        fitness[i] = fitness[i] / sum;
    }
}

function nextGeneration() {
    var newPopulation = [];
    for (var i = 0; i < population.length; i++) {
        var orderA = pickOne(population, fitness);
        var orderB = pickOne(population, fitness);
        var order = crossover(orderA, orderB);
        mutate(order, 0.01);
        newPopulation[i] = order;
    }
    population = newPopulation;
}

function pickOne(list, prob) {
    var index = 0;
    var r = random(1);

    while (r > 0) {
        r = r - prob[index];
        index++;
    }
    index--;
    return list[index].slice();
}

function mutate(order, mutationRate) {
    for (var i = 0; i < totalCities; i++) {
        if (random(1) < mutationRate) {
            var indexA = floor(random(order.length));
            var indexB = (indexA + 1) % totalCities;
            swap(order, indexA, indexB);
        }
    }
}

function crossover(orderA, orderB) {
    var start = floor(random(orderA.length));
    var end = floor(random(start + 1, orderB.length));
    var newOrder = orderA.slice(start, end);

    // var left = totalCities - newOrder.length;
    for (var i = 0; i < orderB.length; i++){
        var city = orderB[i];
        if (!newOrder.includes(city)){
            newOrder.push(city);
        }
    }
    return newOrder;
}