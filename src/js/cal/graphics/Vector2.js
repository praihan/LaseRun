this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function() {
	"use strict"
	
	/**
	 * Represents a 2D vector with X and Y components.
	 * 
	 * @param x the X component
	 * @param y the Y component
	 * 
	 * @constructor
	 * @struct
	 */
	var Vector2 = function(x, y) {
		return {x: x, y: y};
	}
	
	var s = Vector2;
	
	/**
	 * Adds two vectors, and returns the resulting vector.
	 *
	 * @return the sum of two vectors
	 */
	s.add = function(v1, v2) {
		return new Vector2(v1.x + v2.x, v1.x + v2.x);
	}
	
	/**
	 * Subtracts a vector from this vector, and returns the resulting vector.
	 *
	 * @return the difference of two vectors
	 */
	s.subtract = function(v1, v2) {
		return new Vector2(v1.x - v2.x, v1.x - v2.x);
	}
	
	/**
	 * Finds the dot product of two vectors, and returns the resulting vector.
	 *
	 * @return the dot product of two vectors
	 */
	s.multiply = function(v1, v2) {
		return new Vector2(v1.x * v2.x, v1.y * v2.y);
	}
	
	/**
	 * Divides a vector from this vector, and returns the resulting vector.
	 *
	 * @return the division of two vectors
	 */
	s.divide = function(v1, v2) {
		return new Vector2(v1.x / v2.x, v1.y / v2.y); 
	}
	
	/**
	 * Divides x and y scalars from this vector, and returns the resulting vector.
	 *
	 * @return the division of this vector by x and y scalars
	 */
	s.scale = function(v, xTimes, yTimes) {
		return new Vector2(v.x * xTimes, v.y * yTimes); 
	}
	
	/**
	 * Adds x and y scalars to this vector, and returns the resulting vector.
	 *
	 * @return the sum of this vector and x and y scalars
	 */
	s.translate = function(v, xAmount, yAmount) {
		return new Vector2(v.x + xAmount, v.y + yAmount);
	}
	
	/**
	 * Negates both X and Y components of this vector, and returns the resulting vector.
	 *
	 * @return the negative of this vector
	 */
	s.negate = function(v) {
		return new Vector2(-v.x, -v.y);
	}
	
	/**
	 * Compares both X and Y components of the two vectors, and returns the predicate.
	 *
	 * @return if the vectors are equal
	 */
	s.equals = function(v1, v2) {
		return v1.x === v2.x && v1.y === v2.y;
	}
	
	/**
	 * Returns a canonical representation of this vector.
	 * 
	 * @return this vector as a string
	 */
	s.toString = function(v) {
		return CAL.Lang.format("[Vector2] X: %1, Y: %2", v.x, v.y);
	}
	
	CAL.Graphics.Vector2 = Vector2;
	
})();