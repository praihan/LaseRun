this.CAL = this.CAL || {};

this.CAL.Graphics = this.CAL.Graphics || {};

(function() {
	
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
		this._x = x;
		this._y = y;
	}
	
	var p = Vector2.prototype;
	var s = Vector2;
	
	/**
	 * Returns the X-component of this vector.
	 *
	 * @return X component
	 */
	p.X = function() {
		return this._x;
	}
	
	/**
	 * Returns the Y-component of this vector.
	 *
	 * @return Y component
	 */
	p.Y = function() {
		return this._y;
	}
	
	/**
	 * Adds two vectors, and returns the resulting vector.
	 *
	 * @return the sum of two vectors
	 */
	p.add = function(other) {
		return new Vector2(this.X() + other.X(), this.Y() + other.Y());
	}
	
	/**
	 * Subtracts a vector from this vector, and returns the resulting vector.
	 *
	 * @return the difference of two vectors
	 */
	p.subtract = function(other) {
		return new Vector2(this.X() - other.X(), this.Y() - other.Y());
	}
	
	/**
	 * Finds the dot product of two vectors, and returns the resulting vector.
	 *
	 * @return the dot product of two vectors
	 */
	p.multiply = function(other) {
		return new Vector2(this.X() * other.X(), this.Y() * other.Y());
	}
	
	/**
	 * Divides a vector from this vector, and returns the resulting vector.
	 *
	 * @return the division of two vectors
	 */
	p.divide = function(other) {
		return new Vector2(this.X() / other.X(), this.Y() / other.Y()); 
	}
	
	/**
	 * Divides x and y scalars from this vector, and returns the resulting vector.
	 *
	 * @return the division of this vector by x and y scalars
	 */
	p.scale = function(xTimes, yTimes) {
		return new Vector2(this.X() * xTimes, this.Y() * yTimes); 
	}
	
	/**
	 * Adds x and y scalars to this vector, and returns the resulting vector.
	 *
	 * @return the sum of this vector and x and y scalars
	 */
	p.translate = function(xAmount, yAmount) {
		return new Vector2(this.X() + xAmount, this.Y() + yAmount);
	}
	
	/**
	 * Negates both X and Y components of this vector, and returns the resulting vector.
	 *
	 * @return the negative of this vector
	 */
	p.negate = function() {
		return new Vector2(-this.X(), -this.Y());
	}
	
	/**
	 * Compares both X and Y components of the two vectors, and returns the predicate.
	 *
	 * @return if the vectors are equal
	 */
	p.equals = function(other) {
		return this.X() === other.X() && this.Y() === other.Y();
	}
	
	/**
	 * Returns a canonical representation of this vector.
	 * 
	 * @return this vector as a string
	 */
	p.toString = function() {
		return CAL.Lang.format("[Vector2] X: %1, Y: %2", this.X(), this.Y());
	}
	
	this.CAL.Graphics.Vector2 = Vector2;
	
})();