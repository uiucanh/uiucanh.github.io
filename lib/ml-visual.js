
var data = [];
var labels = [];
var numPoints = 1000;
var numWhite = 0;
var cutOffX = 200;
var cutOffY = 200;
var cutOffProbability = 0.2;
var canvas_width = 640;
var canvas_height = 640;

var pred, accuracy, theta, cost;

var START_DRAWING = false;
var NUM_ITERATIONS = 100;
var ALPHA = 100;
var LINEAR_DIVISION = 3;


function setup() {
    var canvas = createCanvas(canvas_width, canvas_height);
    canvas.parent('sketch-holder');
    frameRate(1);
    background(0);
}

function resetVariables(){
    data = [];
    labels = [];
    [pred, accuracy, theta, cost, numWhite] = [0,0,0,0,0];
}

function generateData() {
    START_DRAWING = false;
    resetVariables();
    for (var i = 0; i < numPoints; i++) {
        x1 = floor(random(0, canvas_width));
        x2 = floor(random(0, canvas_height));
        data[i] = ([x1, x2])
        labels[i] = [0];

        if (x1 < math.floor(canvas_width / LINEAR_DIVISION)) {
            if (random(0, 1) >= cutOffProbability) {
                labels[i] = [1];
                numWhite++;
            }
        }

        // TODO: polynomial
        // if ((canvas_width / 2 - cutOffX < x1) && (canvas_height / 2 - cutOffY < x2)
        //     && (canvas_width / 2 + cutOffX > x1) && (canvas_height / 2 + cutOffY > x2)) {
        //     if (random(0, 1) > cutOffProbability) {
        //         labels[i] = [1];
        //         numWhite++;
        //     }
        // }
    }
    console.log("done Generating");
}

function train() {
    [pred, accuracy, theta] = logreg(data, labels, theta);
    START_DRAWING = true;
    update_html_values();
}

function logreg(data, labels) {
    // Add polynomial terms
    X = JSON.parse(JSON.stringify(data));
    // X = data.slice(0);
    y = labels.slice(0);
    // m = number of samples, n = number of features
    // X = math.concat(X, math.square(X));
    let m = y.length;
    let n = X[0].length;

    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            X[i][j] = map(X[i][j], 0, 640, 0, 1);
        }
    }

    // Add bias term
    X = math.concat(math.ones([numPoints, 1]).valueOf(), X);

    // Populate array of theta with 0
    let theta = Array(n + 1).fill().map(() => [0]);

    theta = grad_descent(X, y, theta, ALPHA, NUM_ITERATIONS);
    cost = costFunction(theta, X, y);

    console.log('theta: ', theta);
    console.log('\n');
    console.log('cost: ', cost[0]);
    console.log('\n');

    let pred = predict(theta, X);
    let correct = 0
    for (var i = 0; i < m; i++) {
        if (pred[i] == y[i][0]) {
            correct++;
        }
    }
    return [pred, correct, theta];
}

// Sigmoid activation function
function sigmoid(z) {
    let g = math.eval(`1 ./ (1 + e.^-z)`, {
        z,
    });
    return g;
}

function costFunction(theta, X, y) {
    const m = numPoints;

    // hypothesis of Logistic Regression
    let h = sigmoid(math.multiply(X, theta));

    // Calculating cost
    const cost = math.eval(`(1 / m) * (-y' * log(h) - (1 - y)' * log(1 - h))`, {
        h,
        y,
        m,
    });

    return cost;
}

function grad_descent(X, y, theta, ALPHA, NUM_ITERATIONS) {
    const m = y.length;

    for (let i = 0; i < NUM_ITERATIONS; i++) {
        let h = sigmoid(math.multiply(X, theta));

        theta = math.eval(`theta - ALPHA / m * ((h - y)' * X)'`, {
            theta,
            ALPHA,
            m,
            X,
            y,
            h,
        });

        // cost = costFunction(theta, X, y);
        // console.log(JSON.stringify(theta));
    }

    return theta;
}

function predict(theta, X) {
    let p = sigmoid(math.eval(`X * theta`, {
        X,
        theta,
    }));

    probability = 1 - numWhite / numPoints;
    predictions = [];
    for (var i = 0; i < numPoints; i++) {
        if (p[i] >= probability) {
            predictions.push(1);
        } else {
            predictions.push(0);
        }
    }

    return predictions
}

function drawLinearDecisionBoundary(theta) {
    boundary = math.log(probability / (1 - probability));
    // when x1 = 0
    point1_x1 = (boundary - theta[0]) / theta[1];
    point1_x2 = 0;
    // when x2 = 1
    point2_x1 = (boundary - theta[0] - theta[2]) / theta[1];
    point2_x2 = 1;

    // Denormalise
    point1_x1 = map(point1_x1, 0, 1, 0, 640)
    point1_x2 = map(point1_x2, 0, 1, 0, 640)
    point2_x1 = map(point2_x1, 0, 1, 0, 640)
    point2_x2 = map(point2_x2, 0, 1, 0, 640)

    // console.log(point1_x1, point1_x2)
    // console.log(point2_x1, point2_x2)

    stroke(400);
    fill(255);
    line(point1_x1, point1_x2, point2_x1, point2_x2);
}

function update_html_values(){
    select('#cost').html(math.round(cost[0], 4));
    select('#train_acc').html(math.round(accuracy / numPoints, 4));
}

function draw() {
    clear();
    background(0);
    if (START_DRAWING) {
        if (frameCount % 2 == 1) {
            for (var i = 0; i < numPoints; i++) {
                if (labels[i] == 1) {
                    fill('white');
                    stroke(255);
                } else {
                    fill('red');
                    stroke('red');
                }
                ellipse(data[i][0], data[i][1], 4, 4);
            }
            noStroke();
            textSize(32);
            fill('white');
            text('Actual', canvas_width / 2 - 20, canvas_height - 40);
        } else {
            for (var i = 0; i < numPoints; i++) {
                if (pred[i] == 1) {
                    fill('white');
                    stroke(255);
                } else {
                    fill('red');
                    stroke('red');
                }
                ellipse(data[i][0], data[i][1], 4, 4);
            }
            noStroke();
            textSize(32);
            fill('white');
            text('Predicted', canvas_width / 2 - 40, canvas_height - 40);
        }
        drawLinearDecisionBoundary(theta, X);
    }
}