/** Params **/
const colibriSize = 50; //(in px) size of the colibri
const marginMouse = 10; //(in px) margin x between mouse and colibri
const deltaY = colibriSize / 2.5; //head position relative to the colibri top
const precisionGoalAchieved = 10; //(in px) distance between colibri and mouse needed to considered goal achieved

//dodge params
const dodgeZone = 20; //(in px) distance between mouse and colibri needed to dodge

//scared params
const waitBack = 25; //frame before come back
const scaredJumpMax = 50; //(in px) distance max of a scared jump
const scaredJumpMin = 50; //(in px) distance min of a scared jump
/** ****** **/

/** Init **/
const flowers = document.getElementsByClassName("flower");
const colibri = document.getElementById("colibri");
colibri.style.width = `${colibriSize}px`;
colibri.style.height = `${colibriSize}px`;
colibri.style.position = "fixed";
colibri.style.zIndex = "999";
const colibriPosition = {
  x: 0,
  y: 0,
  angle: 0,
};
const action = {
  flip: false,
  dodge: false,
  scaredGoal: { x: null, y: null },
  counterBack: 0,
};
const mousePosition = {
  x: 0,
  y: 0,
  lastMove: null,
};
/** **** **/

/** EventListener **/
document.addEventListener("mousemove", (e) => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
  mousePosition.lastMove = Date.now();
});
document.addEventListener("mousedown", () => {
  action.scaredGoal = getRandomGoalScared();
  action.counterBack = 0;
  mousePosition.lastMove = Date.now();
});
/** ************* **/

/** Functions **/
//dodge functions
function handleDodge() {
  if (getDistanceGoalMouse() < dodgeZone) {
    action.dodge = true;
    action.scaredGoal = { x: null, y: null };
  } else action.dodge = false;
}

//scared functions
function getRandomGoalScared() {
  const randomY = Math.floor(Math.random() * (scaredJumpMax + 1));
  const randomX =
    randomY < colibriSize
      ? Math.floor(Math.random() * (scaredJumpMax - colibriSize + 1)) + colibriSize
      : Math.floor(Math.random() * (scaredJumpMax + 1));
  return {
    x: colibriPosition.x + colibriSize / 2 - randomX * (action.flip ? -1 : 1),
    y: colibriPosition.y + colibriSize / 2 - randomY,
  };
}
function getDistanceGoalScared() {
  const xColibri = colibriPosition.x + colibriSize / 2;
  const yColibri = colibriPosition.y + colibriSize / 2;
  const xGoal = action.scaredGoal.x;
  const yGoal = action.scaredGoal.y;
  return Math.sqrt(Math.pow(xGoal - xColibri, 2) + Math.pow(yGoal - yColibri, 2));
}
function isGoalScaredAchieved() {
  return action.scaredGoal.x && action.scaredGoal.y && getDistanceGoalScared() < precisionGoalAchieved;
}
function isGoalMouseAchieved() {
  return getDistanceGoalMouse() < colibriSize / 2 + precisionGoalAchieved;
}
function handleBack() {
  if (isGoalScaredAchieved()) {
    action.counterBack += 1;
    if (action.counterBack >= waitBack) action.scaredGoal = { x: null, y: null };
  }
  if (isGoalMouseAchieved()) action.counterBack = 0;
}
//shared functions
function interpolation(a, b, t, type) {
  switch (type) {
    case "exponential":
      return a + (b - a) * Math.pow(t, 2);
    case "sinusoidal":
      return a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * t));
    case "linear":
    default:
      return (1 - t) * a + t * b;
  }
}
let velocity = { x: 0, y: 0 };
let oscillationAngle = 0;
function bouncing(goal) {
  const smoothing = 0.1;
  const friction = 0.9;

  velocity.x += (goal.x - colibriPosition.x) * smoothing;
  velocity.y += (goal.y - colibriPosition.y) * smoothing;

  velocity.x *= friction;
  velocity.y *= friction;

  const oscillationAmplitude = 1;
  const oscillationFrequency = 0.1;

  oscillationAngle += oscillationFrequency;
  const oscillationOffset = Math.sin(oscillationAngle) * oscillationAmplitude;

  colibriPosition.x += velocity.x;
  colibriPosition.y += velocity.y + oscillationOffset;
}
function getDistanceGoalMouse() {
  const xColibri = colibriPosition.x + colibriSize / 2;
  const yColibri = colibriPosition.y + colibriSize / 2;
  const xMouse = mousePosition.x - marginMouse * (action.flip ? -1 : 1);
  const yMouse = mousePosition.y;
  return Math.sqrt(Math.pow(xMouse - xColibri, 2) + Math.pow(yMouse - yColibri, 2));
}
function getGoal() {
  const goalFollow = {
    x: mousePosition.x - (colibriSize * (action.flip ? 0 : 1) + marginMouse * (action.flip ? -1 : 1)),
    y: mousePosition.y - deltaY,
    t: 0.1,
    type: "sinusoidal",
  };
  const goalDodge = {
    ...goalFollow,
    x: mousePosition.x - (colibriSize * (action.flip ? 0 : 1) + marginMouse * (action.flip ? -2 : 2)),
    t: 0.25,
  };
  const goalScared = {
    x: action.scaredGoal.x - colibriSize / 2,
    y: action.scaredGoal.y - colibriSize / 2,
    t: 0.25,
    type: "sinusoidal",
  };
  const goalBack = {
    ...goalFollow,
    type: "exponential",
  };

  if (action.dodge) return goalDodge;
  else if (action.scaredGoal.x) return goalScared;
  else if (action.counterBack != 0) return goalBack;
  return goalFollow;
}
function defineColibriAction() {
  const flipRelative = action.goAway ? action.flowerGoal.x ?? 0 : mousePosition.x;
  action.flip = colibriPosition.x + colibriSize / 2 > flipRelative;

  handleDodge();
  handleBack();
}

function defineColibriPosition() {
  const goal = getGoal();

  colibriPosition.x = interpolation(colibriPosition.x, goal.x, goal.t, goal.type);
  colibriPosition.y = interpolation(colibriPosition.y, goal.y, goal.t, goal.type);
}
function defineColibriAngle() {
  const focusX = action.goAway ? action.flowerGoal.x : mousePosition.x;
  const focusY = action.goAway ? action.flowerGoal.y : mousePosition.y;
  const perpendicular = focusY + (colibriSize / 2 - deltaY) - (colibriPosition.y + colibriSize / 2);
  const base = focusX - (colibriPosition.x + colibriSize / 2);
  colibriPosition.angle = Math.atan2(perpendicular, base);
}
/** ********* **/

/** RequestAnimationFrame **/
const ref = () => {
  defineColibriAction();
  defineColibriPosition();
  defineColibriAngle();

  colibri.style.top = `${colibriPosition.y}px`;
  colibri.style.left = `${colibriPosition.x}px`;
  colibri.style.transform = `rotate(${colibriPosition.angle}rad) scaleY(${action.flip ? "-1" : "1"})`;

  requestAnimationFrame(ref);
};

ref();
/** ********************* **/
