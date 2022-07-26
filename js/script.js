"use strict";

// Constant numeric variables that never change
// Used for calculating positions in the update function
const pipe_gap_height = 140;
const bird_right_x = 114;
const bird_left_x = 82;
const bird_height = 24;
const pipe_width = 52;
const pipe_height = 320;

// Dynamic variables used to calculate the bird momentum,
// game scores, and pipe timer
let bird_dy = 0;
let bird_y = 228;
let last_bird_y = 228;
let high_score = 0;
let score = 0;
let should_update_score = false;
let has_score_incremented = false;

/**
 * This function is called after the game loop initialization but before
 * the main loop starts
 */
function begin() {
	// If the game has died, revive (reset) the game loop
	if (has_died) revive();
}

/**
 * This update function is called every tick of the game loop. This function
 * should not draw or modify DOM elements, only update JS-only values
 * @param {number} delta the delta value used to calculate the new positions
 */
function update(delta) {
	// Update the last position
	last_bird_y = bird_y;

	// Apply gravity force to the bird velocity
	bird_dy += 0.05;

	// Update the current position of the bird
	bird_y = last_bird_y + bird_dy * delta;

	// Get all the current pipe elements
	const pipes = document.querySelectorAll(".pipe");
	pipes.forEach((p) => {
		// Update each pipe's position
		p.last_x = p.x;
		p.x = +p.last_x - 0.1333 * delta;
	});

	// If at least one pipe exists
	// We only need to check if the bird hit the first pipe since it can
	// only fly through one at a time
	if (pipes && pipes[0]) {
		// Is the bird within the boundaries of a pipe?
		if (
			// If the left side of the pipe is less than or equal to
			// (touching or overlapping) the bird's right (front) side
			pipes[0].x - pipe_width / 2 <= bird_left_x &&
			// If the right side of the pipe is less than or equal to
			// the bird's left (back) side
			pipes[0].x + pipe_width + pipe_width / 2 >= bird_right_x
		) {
			// Is the bird inside the clearing of the pipes?
			if (
				// Is the bird below the bottom of the top pipe?
				bird_y > pipes[0].y_top &&
				// Is the bottom of the bird above the top of the bottom pipe?
				bird_y + bird_height < pipes[0].y_top + pipe_gap_height + 10
			) {
				// Has the score not updated? If so, update it
				if (!has_score_incremented) {
					score++;
					has_score_incremented = true;
				}
			}
		}
	}
}

/**
 * This draw function is called when drawing or updating anything visual
 * @param {number} interp The interpolation value provided by the game loop
 */
function draw(interp) {
	apply_element_force(last_bird_y + (bird_y - last_bird_y) * interp, bird);

	const pipes = document.querySelectorAll(".pipe");
	pipes.forEach((p) =>
		apply_element_force(+p.last_x + (p.x - +p.last_x) * interp, p, "left"),
	);

	if (should_update_score) {
		score_title.textContent = "Score: " + score;
	}
}

/**
 * This end function is called by the game loop when the loop exits
 */
function end() {}

/**
 * The flap function called when the flap button is clicked
 */
function flap() {}

/**
 *
 * @param {number} value the force to apply
 * @param {HTMLElement} element the element to apply the force to
 * @param {("top"|"bottom"|"left"|"right")} type the direction to apply the force to
 */
function apply_element_force(value, element, type = "top") {}
