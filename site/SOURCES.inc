SRC :=src
ENGINE :=$(SRC)/js/engine/CAL
IMPL :=$(SRC)/js/impl/CAL

INPUT_FILES := \
	$(SRC)/js/engine/createjs/Ticker.js \
	\
	$(ENGINE)/lang/Lang.js \
	$(ENGINE)/lang/IUpdateableObject.js \
	$(ENGINE)/lang/CachingObject.js \
	$(ENGINE)/lang/Keyboard.js \
	$(ENGINE)/lang/Mouse.js \
	\
	$(ENGINE)/util/DeltaTimer.js \
	\
	$(ENGINE)/graphics/Vector2.js \
	$(ENGINE)/graphics/Colors.js \
	$(ENGINE)/graphics/Fonts.js \
	$(ENGINE)/graphics/IDrawableObject.js \
	$(ENGINE)/graphics/DisplayObject.js \
	$(ENGINE)/graphics/Sprite.js \
	$(ENGINE)/graphics/ParallaxSprite.js \
	$(ENGINE)/graphics/SpriteSheet.js \
	$(ENGINE)/graphics/DrawableManager.js \
	\
	$(ENGINE)/objects/GameObject.js \
	$(ENGINE)/objects/TexturedObject.js \
	\
	$(IMPL)/gamex/GameConstants.js \
	$(IMPL)/gamex/screens/Screen.js \
	$(IMPL)/gamex/screens/LevelScreen.js \
	$(IMPL)/gamex/screens/SkyLandScreen.js \
	$(IMPL)/gamex/Game.js \
	$(IMPL)/gamex/Bootstrap.js
