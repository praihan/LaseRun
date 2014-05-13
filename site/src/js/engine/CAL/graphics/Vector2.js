this.CAL = this.CAL || {};

this.CAL.graphics = this.CAL.graphics || {};

(function(undefined) {
	"use strict"
	
	/**
	 * Represents a 2D vector with X and Y components.
	 * 
	 * @param {number} x the X component
	 * @param {number} y the Y component
	 * 
	 * @final
	 */
	var Vector2 = function(x, y) {
		return {x: x, y: y};
	}
	
	var s = Vector2;
	
	/**
	 * Adds two vectors, and returns the resulting vector.
	 * 
	 * @param {Vector2} v1 a vector
	 * @param {Vector2} v2 a vector
	 * 
	 * @return the sum of two vectors
	 */
	s.add = function(v1, v2) {
		return Vector2(v1.x + v2.x, v1.y + v2.y);
	}
	
	/**
	 * Subtracts a vector from this vector, and returns the resulting vector.
	 * 
	 * @param {Vector2} v1 a vector to subtract from
	 * @param {Vector2} v2 a vector to subtract by
	 * 
	 * @return the difference of two vectors
	 */
	s.subtract = function(v1, v2) {
		return Vector2(v1.x - v2.x, v1.y - v2.y);
	}
	
	/**
	 * Finds the dot product of two vectors, and returns the resulting vector.
	 * 
	 * @param {Vector2} v1 a vector
	 * @param {Vector2|number} v2 a vector or scalar
	 * 
	 * @return the dot product of two vectors
	 */
	s.multiply = function(v1, v2) {
		if (typeof v2 === "number") {
			return s.scale(v1, v2);
		}
		return Vector2(v1.x * v2.x, v1.y * v2.y);
	}
	
	/**
	 * Divides a vector from this vector, and returns the resulting vector.
	 * 
	 * @param {Vector2} v1 a vector to divide from
	 * @param {Vector2\number} v2 a vector or scalar to divide by
	 * 
	 * @return the division of two vectors
	 */
	s.divide = function(v1, v2) {
		if (typeof v2 === "number") {
			return s.scale(v1, 1 / v2);
		}
		return Vector2(v1.x / v2.x, v1.y / v2.y); 
	}
	
	/**
	 * Divides x and y scalars from this vector, and returns the resulting vector.
	 * 
	 * @param {Vector2} v a vector to scale
	 * @param {number} scalar a number to scale by
	 * 
	 * @return the division of this vector by x and y scalars
	 */
	s.scale = function(v, scalar) {
		return Vector2(v.x * scalar, v.y * scalar); 
	}
	
	/**
	 * Negates both X and Y components of this vector, and returns the resulting vector.
	 * 
	 * @param {Vector2} the vector to negate
	 * 
	 * @return the negative of this vector
	 */
	s.negate = function(v) {
		return Vector2(-v.x, -v.y);
	}
	
	/**
	 * Compares both X and Y components of the two vectors, and returns the predicate.
	 * 
	 * @param {Vector2} v1 a vector
	 * @param {Vector2} v2 a vector
	 * 
	 * @return if the vectors are equal
	 */
	s.equals = function(v1, v2) {
		return v1.x === v2.x && v1.y === v2.y;
	}
	
	/**
	 * Returns a canonical representation of this vector.
	 * 
	 * @param {Vector2} v a vector
	 * 
	 * @return this vector as a string
	 */
	s.toString = function(v) {
		return CAL.lang.format("[Vector2] X: %1, Y: %2", v.x, v.y);
	}
	
	CAL.graphics.Vector2 = Vector2;
	
})();
