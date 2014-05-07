include Makefile.inc

SOURCE_FOLDER :=src
INPUT_FILES :=$(call fetch,$(SOURCE_FOLDER)/,*.js)
BUILD_DIR :=.
OUTPUT_FILE_NAME :=build.js
JSC_BASE_DIR :=../compiler

JSC =$(_JAVA) -jar $(JSC_BASE_DIR)/$(JSC_FILE_NAME)

JSC_FLAGS :=--language_in ECMASCRIPT5

all: build

build: 
	$(JSC) $(JSC_FLAGS) $(JSC_FLAG_INPUT) $(INPUT_FILES) $(JSC_FLAG_OUTPUT) $(BUILD_DIR)/$(OUTPUT_FILE_NAME)

.PHONY : $(INPUT_FILES) build all