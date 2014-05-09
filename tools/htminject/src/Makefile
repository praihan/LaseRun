include Makefile.inc

SOURCE_FOLDER :=src
BUILD_DIR :=build
MANIFEST_FILENAME :=MANIFEST.MF
JAR_FILENAME :=htminject.jar
COMPILETASK_FILENAME :=COMPILE.mktask

all: build

build:
	$(MKDIR) -p $(BUILD_DIR)
	$(CP) -f -r $(SOURCE_FOLDER)/* $(BUILD_DIR)/
	$(CP) -f $(COMPILETASK_FILENAME) $(BUILD_DIR)/
	$(MAKE) --no-print-directory -C $(BUILD_DIR) -f $(COMPILETASK_FILENAME)
	$(RM) -f $(BUILD_DIR)/$(COMPILETASK_FILENAME)
	$(JAR) cmf $(MANIFEST_FILENAME) $(JAR_FILENAME) -C $(BUILD_DIR) .
	$(RM) -rf $(BUILD_DIR)
	$(MV) -f -t ../ $(JAR_FILENAME)
	
clean:
	$(RM) -f -r $(BUILD_DIR)

.PHONY: all build clean