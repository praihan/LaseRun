_MAKE :=make
_CD :=cd
_RM :=rm
_ECHO :=echo
_MKDIR :=mkdir
_CP :=cp
_MV :=mv
_JAVA :=java

MAKE :=@$(_MAKE)
CD=@$(_CD)
RM :=@$(_RM)
ECHO :=@$(_ECHO)
MKDIR :=@$(_MKDIR)
CP :=@$(_CP)
MV :=@$(_MV)
JAVA := @$(_JAVA)

fetch =$(wildcard $(addsuffix $2, $1)) $(foreach d,$(wildcard $(addsuffix *, $1)),$(call fetch,$d/,$2))

JSC_FILE_NAME :=compiler.jar

JSC_FLAG_INPUT :=--js
JSC_FLAG_OUTPUT :=--js_output_file

VERSION :=0.1