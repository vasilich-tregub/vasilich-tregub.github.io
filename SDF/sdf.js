// https://gist.github.com/zz85/2550210
/* 
 * signed distance fields generation in javascript
 * 29 April 2012
 */
/*
 * Vladimir Vasilich Tregub [2026]
 * removed dependence on THREE.js as only two methods of THREE.Vector2 class are required
*/
class Vector2 {
	static {
		Vector2.prototype.isVector2 = true;
	}
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	copy(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}
}
function signed_distance_fields(grid, width, height) {

	"use strict";

	var x, y;
	var grid1 = [];
	var grid2 = [];
	var cell, index;

	var outside = 1 << 31;
	var outofrange = new Vector2(outside, outside);
	var other = new Vector2();

	// some functions

	function grid_get(grid, x, y) {
		if (x < 0 || y < 0 || x > (width - 1) || y > (height - 1)) {
			return outofrange;
		}
		return grid[y * width + x];
	}

	function grid_put(grid, x, y, p) {
		grid[y * width + x] = p;
	}

	function grid_compare(g, cell, x, y, offsetX, offsetY) {
		other.copy(grid_get(g, x + offsetX, y + offsetY));

		other.x += offsetX;
		other.y += offsetY;

		if (other.lengthSq() < cell.lengthSq()) {
			cell.copy(other);
		}

		return cell;
	}


	function propagate(grid) {

		var p;

		// pass 0
		for (y = 0; y < height; y++) {

			for (x = 0; x < width; x++) {
				p = grid_get(grid, x, y);
				p = grid_compare(grid, p, x, y, -1, 0);
				p = grid_compare(grid, p, x, y, 0, -1);
				p = grid_compare(grid, p, x, y, -1, -1);
				p = grid_compare(grid, p, x, y, 1, -1);
				grid_put(grid, x, y, p);
			}

			for (x = width - 1; x >= 0; x--) {
				p = grid_get(grid, x, y);
				p = grid_compare(grid, p, x, y, 1, 0);
				grid_put(grid, x, y, p);
			}

		}

		// pass 1
		for (y = height - 1; y >= 0; y--) {
			for (x = width - 1; x >= 0; x--) {
				p = grid_get(grid, x, y);
				p = grid_compare(grid, p, x, y, 1, 0);
				p = grid_compare(grid, p, x, y, 0, 1);
				p = grid_compare(grid, p, x, y, -1, 1);
				p = grid_compare(grid, p, x, y, 1, 1);

				grid_put(grid, x, y, p);
			}

			for (x = 0; x < width; x++) {
				p = grid_get(grid, x, y);
				p = grid_compare(grid, p, x, y, -1, 0);
				grid_put(grid, x, y, p);
			}

		}

	}

	// Start the work

	// step 1 generate grids.
	for (y = 0; y < height; y++) {

		for (x = 0; x < width; x++) {

			index = y * width + x;

			if (grid[index]) {

				grid_put(grid1, x, y, new Vector2(0, 0));
				grid_put(grid2, x, y, new Vector2(outside, outside));

			} else {
				grid_put(grid1, x, y, new Vector2(outside, outside));
				grid_put(grid2, x, y, new Vector2(0, 0));
			}

		}

	}

	// step 2 propagate distances
	propagate(grid1);
	propagate(grid2);

	// console.log('grid1', JSON.stringify(grid1), 'grid2', JSON.stringify(grid2));

	var distanceFields = [];
	var dist1, dist2, dist;

	for (y = 0; y < height; y++) {
		for (x = 0; x < width; x++) {

			dist1 = Math.sqrt(grid_get(grid1, x, y).lengthSq());
			dist2 = Math.sqrt(grid_get(grid2, x, y).lengthSq());
			dist = dist1 - dist2;

			index = y * width + x;

			distanceFields[index] = dist;// ((dist >= 0) ? dist - 0.5 : dist + 0.5) - 0.5;

		}
	}

	// console.log('distanceFields', distanceFields);

	return distanceFields;

};