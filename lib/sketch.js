var cities = [];
var totalCities = 12;

var populationSize = 300;
var population = [];
var fitness = [];

var recordDistance = Infinity;
var currentBest;
var bestEver;

var numGen = 0;
var genLimit = 100;
var bestFitness = 0;

function resetVariables(nCities = 12, nPop = 300) {
  totalCities = nCities;
  populationSize = nPop;
  population = [];
  cities = [];
  fitness = [];
  recordDistance = Infinity;
  currentBest = undefined;
  bestEver = undefined;
  bestFitness = 0;
  numGen = 0;
  runAlgorithm();
}

function runAlgorithm() {
  var order = [];
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(width), random((height - 20) / 2));
    cities[i] = v;
    order[i] = i;
  }

  for (var i = 0; i < populationSize; i++) {
    population[i] = shuffle(order.slice());
  }
}

function setup() {
  var canvas = createCanvas(400, 640);
  canvas.parent('sketch-holder');
  frameRate(30);

  runAlgorithm();
}

function draw() {
  background(0);
  
  stroke(255);
  strokeWeight(1);
  line(0, 320, 400, 320);

  if (numGen < genLimit){
    numGen++;
    calcFitness();
    normaliseFitness();
    nextGeneration();
  }
  
  // Draw the best path
  fill(255);
  stroke('red');
  strokeWeight(4);
  noFill();
  beginShape();
  for (var i = 0; i < bestEver.length; i++) {
    var n = bestEver[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();

  translate(0, height / 2);
  stroke(255);
  strokeWeight(4);
  noFill();
  beginShape();
  for (var i = 0; i < currentBest.length; i++) {
    var n = currentBest[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();

  select('.num-gen').html(numGen);
  select('.best-fitness').html(nf(bestFitness, 0, 5));
}

// Swap index i with j
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

// A function that returns the sum of the all the distances
function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];
    var cityBIndex = order[i + 1];
    var cityB = points[cityBIndex];

    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}