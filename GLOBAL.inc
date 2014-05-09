VERSION :=0.1

_MAKE :=make
_CD :=cd
_RM :=rm
_ECHO :=echo
_MKDIR :=mkdir
_CP :=cp
_MV :=mv
_JAVA :=java
_JAVAC :=javac
_JAVA_JAR := $(_JAVA) -jar
_JAR :=jar

MAKE :=@$(_MAKE)
CD=@$(_CD)
RM :=@$(_RM)
ECHO :=@$(_ECHO)
MKDIR :=@$(_MKDIR)
CP :=@$(_CP)
MV :=@$(_MV)
JAVA := @$(_JAVA)
JAVAC := @$(_JAVAC)
JAVA_JAR := $(JAVA) -jar
JAR :=@$(_JAR)



fetch =$(wildcard $(addsuffix $2, $1)) $(foreach d,$(wildcard $(addsuffix *, $1)),$(call fetch,$d/,$2))



TOOLS_DIR :=tools

TOOLS_JSCOMPILER :=$(TOOLS_DIR)/jscompiler
TOOLS_JSCOMPILER_FILENAME :=compiler.jar
TOOLS_JSCOMPILER_FLAG_INPUT :=--js
TOOLS_JSCOMPILER_FLAG_OUTPUT :=--js_output_file

TOOLS_HTMINJECT :=$(TOOLS_DIR)/htminject
TOOLS_HTMINJECT_FILENAME :=htminject.jar